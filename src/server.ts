import type { Client } from 'discord.js'
import type { MCPServerOptions, ValidateResult, DatabaseHandlers } from './types'
import { tools } from './tools'
import { handleToolCall, extractGuildId } from './handlers'

export class DiscordMCPServer {
  private client: Client
  private validateAccess: MCPServerOptions['validateAccess']
  private getAllowedGuilds?: MCPServerOptions['getAllowedGuilds']
  private onToolCall?: MCPServerOptions['onToolCall']
  private database?: DatabaseHandlers
  private sessions: Map<string, { apiKey: string }> = new Map()

  // Customizable server info
  public serverName: string
  public serverVersion: string
  public serverDescription: string

  constructor(options: MCPServerOptions) {
    this.client = options.client
    this.validateAccess = options.validateAccess
    this.getAllowedGuilds = options.getAllowedGuilds
    this.onToolCall = options.onToolCall
    this.database = options.database
    this.serverName = options.serverName || 'Discord MCP Server'
    this.serverVersion = options.serverVersion || '1.0.0'
    this.serverDescription = options.serverDescription || 'Discord bot with MCP support - 100+ tools'
  }

  // Session management for SSE
  createSession(sessionId: string, apiKey: string) {
    this.sessions.set(sessionId, { apiKey })
  }

  deleteSession(sessionId: string) {
    this.sessions.delete(sessionId)
  }

  getSessionApiKey(sessionId: string): string | null {
    return this.sessions.get(sessionId)?.apiKey || null
  }

  // Validate API key (for SSE initial connection)
  async validateApiKey(apiKey: string): Promise<ValidateResult> {
    return this.validateAccess(apiKey, null)
  }

  getTools() {
    return tools
  }

  getClient() {
    return this.client
  }

  async handleRequest(body: any, apiKey: string): Promise<any> {
    let { method, params, id } = body

    // Support GPT Actions / direct tool call format
    if (!method && (body.name || body.tool || body.action)) {
      method = 'tools/call'
      params = {
        name: body.name || body.tool || body.action,
        arguments: body.arguments || body.args || body.parameters || {}
      }
      id = id || 'gpt-action'
    }

    if (method === 'initialize') {
      return {
        jsonrpc: '2.0',
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: { name: this.serverName, version: this.serverVersion },
          capabilities: { tools: {} }
        },
        id
      }
    }

    if (method === 'tools/list') {
      return { jsonrpc: '2.0', result: { tools }, id }
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params || {}

      if (!name) {
        return { jsonrpc: '2.0', error: { code: -32602, message: 'Invalid params: name is required' }, id }
      }

      // Handle get_allowed_guilds and discord_list_guilds - only return guilds user has access to
      if (name === 'get_allowed_guilds' || name === 'discord_list_guilds') {
        // Just validate the API key is valid
        const validation = await this.validateAccess(apiKey, null)
        if (!validation.valid) {
          return {
            jsonrpc: '2.0',
            error: { code: -32001, message: validation.error || 'Unauthorized' },
            id
          }
        }

        let result: any
        if (this.getAllowedGuilds) {
          const allowedGuilds = await this.getAllowedGuilds(apiKey)
          result = { success: true, data: { guilds: allowedGuilds, count: allowedGuilds.length } }
        } else {
          result = { success: false, error: { code: 'NOT_CONFIGURED', message: 'getAllowedGuilds not configured' } }
        }

        if (this.onToolCall) {
          this.onToolCall(name, args, result, apiKey)
        }

        return {
          jsonrpc: '2.0',
          result: {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            isError: !result.success
          },
          id
        }
      }

      // Extract guildId from the request
      const guildId = extractGuildId(name, args || {}, this.client)

      // Validate access via middleware
      const validation = await this.validateAccess(apiKey, guildId)
      if (!validation.valid) {
        return {
          jsonrpc: '2.0',
          error: { code: -32001, message: validation.error || 'Unauthorized' },
          id
        }
      }

      // Execute tool (pass database handlers)
      const result = await handleToolCall(this.client, name, args || {}, this.database)

      // Callback for logging
      if (this.onToolCall) {
        this.onToolCall(name, args, result, apiKey)
      }

      return {
        jsonrpc: '2.0',
        result: {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
          isError: !result.success
        },
        id
      }
    }

    if (method === 'ping') {
      return { jsonrpc: '2.0', result: {}, id }
    }

    return { jsonrpc: '2.0', error: { code: -32601, message: `Unknown method: ${method}` }, id }
  }

  getServerInfo(baseUrl: string) {
    return {
      name: this.serverName,
      version: this.serverVersion,
      description: this.serverDescription,
      protocol: '2024-11-05',
      endpoints: {
        http: baseUrl,
        sse: `${baseUrl}/sse`,
        openapi: `${baseUrl}?format=openapi`
      },
      gptActionSchemaUrl: `${baseUrl}?format=openapi`
    }
  }

  generateOpenAPISchema(baseUrl: string) {
    return {
      openapi: '3.1.0',
      info: {
        title: this.serverName,
        description: this.serverDescription,
        version: this.serverVersion
      },
      servers: [{ url: baseUrl }],
      paths: {
        '/': {
          post: {
            operationId: 'executeDiscordTool',
            summary: 'Execute Discord Tool',
            description: 'Execute any Discord management tool by passing tool name and arguments',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the Discord tool to run (e.g. discord_send_message, discord_list_guilds)'
                      },
                      arguments: {
                        type: 'object',
                        description: 'Key-value object of tool arguments'
                      }
                    },
                    required: ['name']
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Tool execution result',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean' },
                        data: { type: 'object' },
                        error: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer' },
          apiKeyQuery: { type: 'apiKey', in: 'query', name: 'apiKey' }
        }
      },
      security: [{ bearerAuth: [] }, { apiKeyQuery: [] }]
    }
  }
}
