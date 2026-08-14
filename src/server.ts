import type { Client } from 'discord.js'
import type {
  MCPServerOptions,
  ValidateResult,
  DatabaseHandlers,
  CustomTool,
  CustomToolHandler,
  ToolDefinition,
  ExternalMCPServerConfig,
  MCPPlugin
} from './types'
import { tools as builtInTools } from './tools'
import { handleToolCall, extractGuildId } from './handlers'
import { defineTool, proxyExternalMCPServer } from './external'

export class DiscordMCPServer {
  private client: Client
  private validateAccess: MCPServerOptions['validateAccess']
  private getAllowedGuilds?: MCPServerOptions['getAllowedGuilds']
  private onToolCall?: MCPServerOptions['onToolCall']
  private database?: DatabaseHandlers
  private sessions: Map<string, { apiKey: string }> = new Map()
  private customTools: Map<string, CustomTool> = new Map()

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

    // Register initial custom tools if provided
    if (options.customTools && Array.isArray(options.customTools)) {
      this.registerTools(options.customTools)
    }

    // Register initial plugins if provided
    if (options.plugins && Array.isArray(options.plugins)) {
      for (const plugin of options.plugins) {
        this.use(plugin)
      }
    }

    // Register initial external servers if provided
    if (options.externalServers && Array.isArray(options.externalServers)) {
      for (const serverConfig of options.externalServers) {
        this.registerExternalMCP(serverConfig).catch((err) => {
          console.error(`Failed to register external MCP server ${serverConfig.url}:`, err)
        })
      }
    }
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

  /**
   * Register a single custom tool or tool definition with handler
   */
  registerTool(
    toolOrDef: CustomTool | ToolDefinition,
    handler?: CustomToolHandler,
    options?: Partial<CustomTool>
  ): this {
    const customTool = defineTool(toolOrDef, handler, options)
    this.customTools.set(customTool.name, customTool)
    return this
  }

  /**
   * Register multiple custom tools at once
   */
  registerTools(toolsList: (CustomTool | (ToolDefinition & { handler: CustomToolHandler }))[]): this {
    for (const tool of toolsList) {
      if ('handler' in tool && typeof tool.handler === 'function') {
        const customTool = defineTool(tool as any)
        this.customTools.set(customTool.name, customTool)
      }
    }
    return this
  }

  /**
   * Remove a custom tool by name
   */
  unregisterTool(name: string): boolean {
    return this.customTools.delete(name)
  }

  /**
   * Check if a tool exists (either built-in or custom)
   */
  hasTool(name: string): boolean {
    return this.customTools.has(name) || builtInTools.some(t => t.name === name)
  }

  /**
   * Get tool definition by name
   */
  getTool(name: string): ToolDefinition | undefined {
    const custom = this.customTools.get(name)
    if (custom) {
      return {
        name: custom.name,
        description: custom.description,
        inputSchema: (custom.inputSchema as any) || { type: 'object', properties: {}, required: [] }
      }
    }
    return builtInTools.find(t => t.name === name)
  }

  /**
   * Get registered custom tool object
   */
  getCustomTool(name: string): CustomTool | undefined {
    return this.customTools.get(name)
  }

  /**
   * Connect and proxy an external MCP server into this server's tool catalog
   */
  async registerExternalMCP(config: ExternalMCPServerConfig): Promise<CustomTool[]> {
    const tools = await proxyExternalMCPServer(config)
    this.registerTools(tools)
    return tools
  }

  /**
   * Apply a plugin function to extend this MCP server
   */
  use(plugin: MCPPlugin): this {
    try {
      const res = plugin(this)
      if (res && typeof (res as any).catch === 'function') {
        (res as Promise<void>).catch((err) => {
          console.error('Error executing MCP plugin:', err)
        })
      }
    } catch (err) {
      console.error('Error executing MCP plugin:', err)
    }
    return this
  }

  /**
   * Get all tools (built-in Discord tools + registered custom/external tools)
   */
  getTools(): ToolDefinition[] {
    const customDefs: ToolDefinition[] = Array.from(this.customTools.values()).map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: (t.inputSchema as any) || { type: 'object', properties: {}, required: [] }
    }))
    return [...builtInTools, ...customDefs]
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
      return { jsonrpc: '2.0', result: { tools: this.getTools() }, id }
    }

    if (method === 'tools/call') {
      const { name, arguments: args } = params || {}

      if (!name) {
        return { jsonrpc: '2.0', error: { code: -32602, message: 'Invalid params: name is required' }, id }
      }

      // 1. Check if tool is a registered custom/external tool
      const customTool = this.customTools.get(name)
      if (customTool) {
        let guildId: string | null = null
        if (customTool.extractGuildId) {
          guildId = customTool.extractGuildId(args || {}, this.client)
        } else {
          guildId = extractGuildId(name, args || {}, this.client)
        }

        // Validate access if auth is required
        if (customTool.requiresAuth !== false) {
          const validation = await this.validateAccess(apiKey, guildId)
          if (!validation.valid) {
            return {
              jsonrpc: '2.0',
              error: { code: -32001, message: validation.error || 'Unauthorized' },
              id
            }
          }
        }

        let rawResult: any
        try {
          rawResult = await customTool.handler(args || {}, {
            client: this.client,
            apiKey,
            database: this.database,
            server: this,
            rawArgs: args
          })
        } catch (handlerErr: any) {
          console.error(`Custom tool "${name}" error:`, handlerErr)
          rawResult = {
            success: false,
            error: {
              code: 'CUSTOM_TOOL_ERROR',
              message: handlerErr.message || 'Custom tool execution failed'
            }
          }
        }

        // Normalize result
        let finalResult: any
        if (rawResult && typeof rawResult === 'object' && typeof rawResult.success === 'boolean') {
          finalResult = rawResult
        } else {
          finalResult = { success: true, data: rawResult }
        }

        if (this.onToolCall) {
          this.onToolCall(name, args, finalResult, apiKey)
        }

        return {
          jsonrpc: '2.0',
          result: {
            content: [{ type: 'text', text: JSON.stringify(finalResult, null, 2) }],
            isError: !finalResult.success
          },
          id
        }
      }

      // 2. Handle get_allowed_guilds and discord_list_guilds - only return guilds user has access to
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

      // 3. Extract guildId from standard Discord tools
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

      // Execute built-in Discord tool (pass database handlers)
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
      toolCount: this.getTools().length,
      endpoints: {
        http: baseUrl,
        sse: `${baseUrl}/sse`,
        openapi: `${baseUrl}?format=openapi`
      },
      gptActionSchemaUrl: `${baseUrl}?format=openapi`
    }
  }

  generateOpenAPISchema(baseUrl: string) {
    // Extract base without /api/mcp for GPT Actions
    const serverUrl = baseUrl.replace(/\/api\/mcp$/, '')

    return {
      openapi: '3.0.3',
      info: {
        title: this.serverName,
        description: this.serverDescription,
        version: this.serverVersion
      },
      servers: [{ url: serverUrl }],
      paths: {
        '/api/mcp': {
          post: {
            operationId: 'executeDiscordTool',
            summary: 'Execute Discord or Custom Tool',
            description: `Execute any Discord management tool or registered custom tool by passing tool name and arguments. Available tools: ${this.getTools().length}`,
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'Name of the Discord tool or registered custom tool to run'
                      },
                      arguments: {
                        type: 'object',
                        description: 'Key-value object of tool arguments',
                        additionalProperties: true
                      }
                    },
                    required: ['name'],
                    additionalProperties: false
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
                        jsonrpc: { type: 'string' },
                        result: { type: 'object' },
                        error: { type: 'object' },
                        id: { type: 'string' }
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
          bearerAuth: { type: 'http', scheme: 'bearer' }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  }
}

