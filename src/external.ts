import type { Client } from 'discord.js'
import type {
  CustomTool,
  CustomToolHandler,
  CustomToolContext,
  HttpToolConfig,
  ExternalMCPServerConfig,
  ToolDefinition
} from './types'

/**
 * Type-safe helper to define a custom tool for Limitless Reign MCP
 */
export function defineTool(
  toolOrDef: CustomTool | ToolDefinition,
  handler?: CustomToolHandler,
  options?: Partial<CustomTool>
): CustomTool {
  if ('handler' in toolOrDef && typeof (toolOrDef as any).handler === 'function') {
    const custom = toolOrDef as CustomTool
    return {
      name: custom.name,
      description: custom.description,
      inputSchema: custom.inputSchema || { type: 'object', properties: {}, required: [] },
      handler: custom.handler,
      extractGuildId: custom.extractGuildId,
      requiresAuth: custom.requiresAuth !== undefined ? custom.requiresAuth : true,
      category: custom.category
    }
  }

  if (!handler) {
    throw new Error(`Handler function is required when defining tool "${toolOrDef.name}"`)
  }

  const def = toolOrDef as ToolDefinition
  return {
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema || { type: 'object', properties: {}, required: [] },
    handler,
    extractGuildId: options?.extractGuildId,
    requiresAuth: options?.requiresAuth !== undefined ? options?.requiresAuth : true,
    category: options?.category
  }
}

/**
 * Create an MCP tool that calls an external HTTP/REST API or Webhook
 *
 * Example:
 * ```ts
 * const weatherTool = createHttpTool({
 *   name: 'get_weather',
 *   description: 'Get real-time weather for a city',
 *   url: (args) => `https://api.weatherapi.com/v1/current.json?q=${encodeURIComponent(args.city)}&key=YOUR_KEY`,
 *   inputSchema: {
 *     type: 'object',
 *     properties: { city: { type: 'string', description: 'City name' } },
 *     required: ['city']
 *   }
 * })
 * ```
 */
export function createHttpTool(config: HttpToolConfig): CustomTool {
  return {
    name: config.name,
    description: config.description,
    inputSchema: config.inputSchema || { type: 'object', properties: {}, required: [] },
    extractGuildId: config.extractGuildId,
    requiresAuth: config.requiresAuth !== undefined ? config.requiresAuth : true,
    category: config.category || 'External API',
    handler: async (args: any, context: CustomToolContext) => {
      try {
        const method = config.method || 'GET'
        const resolvedUrl = typeof config.url === 'function' ? config.url(args) : config.url

        let resolvedHeaders: Record<string, string> = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }

        if (typeof config.headers === 'function') {
          const dynamicHeaders = await config.headers(args, context)
          resolvedHeaders = { ...resolvedHeaders, ...dynamicHeaders }
        } else if (config.headers) {
          resolvedHeaders = { ...resolvedHeaders, ...config.headers }
        }

        const fetchOptions: RequestInit = {
          method,
          headers: resolvedHeaders
        }

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          if (config.body) {
            const bodyData = config.body(args)
            fetchOptions.body = typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData)
          } else if (Object.keys(args || {}).length > 0 && method !== 'GET') {
            fetchOptions.body = JSON.stringify(args)
          }
        }

        const response = await fetch(resolvedUrl, fetchOptions)

        let parsedData: any
        const contentType = response.headers.get('content-type') || ''

        if (contentType.includes('application/json')) {
          parsedData = await response.json()
        } else {
          parsedData = await response.text()
          try {
            parsedData = JSON.parse(parsedData)
          } catch {
            // Keep string
          }
        }

        if (!response.ok) {
          return {
            success: false,
            error: {
              code: `HTTP_${response.status}`,
              message: typeof parsedData === 'object' && parsedData?.message
                ? parsedData.message
                : `HTTP request failed with status ${response.status}: ${response.statusText}`
            },
            data: parsedData
          }
        }

        if (config.transformResponse) {
          const transformed = await config.transformResponse(parsedData, response)
          return { success: true, data: transformed }
        }

        return { success: true, data: parsedData }
      } catch (err: any) {
        return {
          success: false,
          error: {
            code: 'HTTP_REQUEST_ERROR',
            message: err.message || 'Failed to execute HTTP tool request'
          }
        }
      }
    }
  }
}

/**
 * Connect to an external MCP server and convert its tools into CustomTools
 */
export async function proxyExternalMCPServer(config: ExternalMCPServerConfig): Promise<CustomTool[]> {
  const { url, prefix = '', headers = {}, filterTools, timeoutMs = 30000, requiresAuth = true } = config

  async function getHeaders() {
    return typeof headers === 'function' ? await headers() : headers
  }

  // Fetch tools from external server using JSON-RPC
  const reqHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(await getHeaders())
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  let remoteTools: ToolDefinition[] = []

  try {
    const listRes = await fetch(url, {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        params: {},
        id: 'discover-tools'
      }),
      signal: controller.signal
    })

    if (!listRes.ok) {
      throw new Error(`Failed to list tools from external MCP at ${url}: status ${listRes.status}`)
    }

    const data: any = await listRes.json()
    if (data.result?.tools && Array.isArray(data.result.tools)) {
      remoteTools = data.result.tools
    }
  } finally {
    clearTimeout(timeoutId)
  }

  const customTools: CustomTool[] = []

  for (const remoteTool of remoteTools) {
    if (filterTools && !filterTools(remoteTool.name)) {
      continue
    }

    const localToolName = prefix ? `${prefix}${remoteTool.name}` : remoteTool.name
    const originalName = remoteTool.name

    customTools.push({
      name: localToolName,
      description: remoteTool.description || `Proxy tool from ${url}`,
      inputSchema: remoteTool.inputSchema || { type: 'object', properties: {}, required: [] },
      requiresAuth,
      category: 'External MCP',
      handler: async (args: any, context: CustomToolContext) => {
        const callController = new AbortController()
        const callTimeoutId = setTimeout(() => callController.abort(), timeoutMs)

        try {
          const callHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(await getHeaders())
          }

          const callRes = await fetch(url, {
            method: 'POST',
            headers: callHeaders,
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'tools/call',
              params: {
                name: originalName,
                arguments: args || {}
              },
              id: `proxy_${Date.now()}`
            }),
            signal: callController.signal
          })

          if (!callRes.ok) {
            return {
              success: false,
              error: {
                code: `PROXY_HTTP_${callRes.status}`,
                message: `External MCP tool call failed: HTTP ${callRes.status}`
              }
            }
          }

          const callData: any = await callRes.json()

          if (callData.error) {
            return {
              success: false,
              error: {
                code: `REMOTE_${callData.error.code || 'ERROR'}`,
                message: callData.error.message || 'Remote MCP error'
              }
            }
          }

          // Handle MCP standard tool result format
          if (callData.result?.content) {
            try {
              const textContent = callData.result.content
                .filter((c: any) => c.type === 'text')
                .map((c: any) => c.text)
                .join('\n')
              const parsed = JSON.parse(textContent)
              return parsed
            } catch {
              return { success: !callData.result.isError, data: callData.result.content }
            }
          }

          return { success: true, data: callData.result }
        } catch (err: any) {
          return {
            success: false,
            error: {
              code: 'PROXY_ERROR',
              message: err.message || 'Failed to call remote MCP server'
            }
          }
        } finally {
          clearTimeout(callTimeoutId)
        }
      }
    })
  }

  return customTools
}
