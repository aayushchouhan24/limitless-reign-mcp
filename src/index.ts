import { DiscordMCPServer } from './server'
import type {
  MCPServerOptions,
  ValidateResult,
  ToolDefinition,
  ToolResult,
  DatabaseHandlers,
  AllowedGuild,
  CustomTool,
  CustomToolHandler,
  CustomToolContext,
  HttpToolConfig,
  ExternalMCPServerConfig,
  MCPPlugin
} from './types'
import { tools } from './tools'
import { handleToolCall, extractGuildId } from './handlers'
import { defineTool, createHttpTool, proxyExternalMCPServer } from './external'

export { DiscordMCPServer } from './server'
export { tools } from './tools'
export { handleToolCall, extractGuildId } from './handlers'
export { defineTool, createHttpTool, proxyExternalMCPServer } from './external'
export type {
  MCPServerOptions,
  ValidateResult,
  ToolDefinition,
  ToolResult,
  DatabaseHandlers,
  AllowedGuild,
  CustomTool,
  CustomToolHandler,
  CustomToolContext,
  HttpToolConfig,
  ExternalMCPServerConfig,
  MCPPlugin
} from './types'

/**
 * Create a Discord MCP Server
 */
export function createMCPServer(options: MCPServerOptions): DiscordMCPServer {
  return new DiscordMCPServer(options)
}

/**
 * Express/Connect middleware
 *
 * Mount at ANY path - the middleware handles routing internally:
 * - app.use('/api/mcp', expressMiddleware(mcp))
 * - app.use('/my/custom/path', expressMiddleware(mcp))
 * - app.use('/v1/discord', expressMiddleware(mcp))
 *
 * Creates these routes relative to mount point:
 * - POST /        → JSON-RPC / GPT Actions
 * - GET /         → Server info
 * - GET /?format=openapi → OpenAPI schema
 * - GET /sse      → SSE connection
 * - POST /sse     → SSE message handler
 */
export function expressMiddleware(mcp: DiscordMCPServer) {
  return async (req: any, res: any, next: any) => {
    // Get the path relative to where middleware is mounted
    const path = req.path || ''

    try {
      // Handle CORS preflight
      if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
        return res.status(204).end()
      }

      // Extract API key from header or query
      const authHeader = req.headers.authorization || ''
      const apiKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : req.query.apiKey || ''

      // SSE endpoint (/sse)
      if (path === '/sse' || path === '/sse/') {
        if (req.method === 'GET') {
          // Validate first
          const validation = await mcp.validateApiKey(apiKey)
          if (!validation.valid) {
            return res.status(401).json({ error: validation.error || 'Unauthorized' })
          }

          // Set SSE headers
          res.setHeader('Content-Type', 'text/event-stream')
          res.setHeader('Cache-Control', 'no-cache, no-transform')
          res.setHeader('Connection', 'keep-alive')
          res.setHeader('X-Accel-Buffering', 'no')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')

          const sessionId = `mcp_${Date.now()}_${Math.random().toString(36).substring(7)}`
          const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http'
          const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost'
          const baseUrl = `${protocol}://${host}${req.baseUrl || ''}`

          mcp.createSession(sessionId, apiKey)

          // Send endpoint event
          res.write(`event: endpoint\ndata: ${baseUrl}/sse?sessionId=${sessionId}\n\n`)
          res.write(`event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n\n`)

          // Keep alive
          const keepAlive = setInterval(() => {
            try { res.write(': keepalive\n\n') } catch { clearInterval(keepAlive) }
          }, 30000)

          req.on('close', () => {
            clearInterval(keepAlive)
            mcp.deleteSession(sessionId)
          })

          return
        }

        if (req.method === 'POST') {
          const sessionId = req.query.sessionId
          const sessionApiKey = sessionId ? mcp.getSessionApiKey(sessionId) : null
          const response = await mcp.handleRequest(req.body, sessionApiKey || apiKey)
          return res.json(response)
        }
      }

      // Main endpoint (/ or empty)
      if (path === '/' || path === '') {
        if (req.method === 'GET') {
          const format = req.query.format
          const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http'
          const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost'
          const baseUrl = `${protocol}://${host}${req.baseUrl || ''}`

          if (format === 'openapi' || format === 'gpt') {
            return res.json(mcp.generateOpenAPISchema(baseUrl))
          }
          return res.json(mcp.getServerInfo(baseUrl))
        }

        if (req.method === 'POST') {
          const response = await mcp.handleRequest(req.body, apiKey)
          return res.json(response)
        }
      }

      // Not handled by this middleware
      next()
    } catch (err: any) {
      console.error('MCP Error:', err)
      res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: err.message }, id: null })
    }
  }
}

/**
 * Next.js App Router handlers for main endpoint (with pre-initialized MCP)
 */
export function nextjsHandlers(mcp: DiscordMCPServer) {
  return createNextjsRoute(() => Promise.resolve(mcp))
}

/**
 * Next.js App Router main route - simplest usage
 *
 * Usage:
 * ```typescript
 * // app/api/mcp/route.ts
 * import { createNextjsRoute } from 'limitless-reign-mcp'
 * import { getMCPServer } from '@/lib/mcp/server'
 *
 * export const { GET, POST, OPTIONS } = createNextjsRoute(getMCPServer)
 * ```
 */
export function createNextjsRoute(getMcp: () => Promise<DiscordMCPServer>) {
  return {
    GET: async (req: Request) => {
      const mcp = await getMcp()
      const url = new URL(req.url)
      const format = url.searchParams.get('format')
      const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost'
      const protocol = req.headers.get('x-forwarded-proto') || 'https'
      const pathname = url.pathname.replace(/\/sse\/?$/, '')
      const baseUrl = `${protocol}://${host}${pathname}`

      if (format === 'openapi' || format === 'gpt') {
        return Response.json(mcp.generateOpenAPISchema(baseUrl))
      }
      return Response.json(mcp.getServerInfo(baseUrl))
    },

    POST: async (req: Request) => {
      const mcp = await getMcp()
      const authHeader = req.headers.get('authorization') || ''
      const url = new URL(req.url)
      const apiKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : url.searchParams.get('apiKey') || ''

      try {
        const body = await req.json()
        const response = await mcp.handleRequest(body, apiKey)
        return Response.json(response)
      } catch (err: any) {
        return Response.json({ jsonrpc: '2.0', error: { code: -32603, message: err.message }, id: null }, { status: 500 })
      }
    },

    OPTIONS: async () => new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      }
    })
  }
}

/**
 * Next.js App Router handlers for SSE endpoint (with pre-initialized MCP)
 */
export function nextjsSSEHandlers(mcp: DiscordMCPServer) {
  return createNextjsSSERoute(() => Promise.resolve(mcp))
}

/**
 * Next.js App Router SSE route - simplest usage
 *
 * Usage:
 * ```typescript
 * // app/api/mcp/sse/route.ts
 * import { createNextjsSSERoute } from 'limitless-reign-mcp'
 * import { getMCPServer } from '@/lib/mcp/server'
 *
 * export const { GET, POST, OPTIONS } = createNextjsSSERoute(getMCPServer)
 * ```
 */
export function createNextjsSSERoute(getMcp: () => Promise<DiscordMCPServer>) {
  return {
    GET: async (req: Request) => {
      const mcp = await getMcp()
      const authHeader = req.headers.get('authorization') || ''
      const url = new URL(req.url)
      const apiKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : url.searchParams.get('apiKey') || ''

      const validation = await mcp.validateApiKey(apiKey)
      if (!validation.valid) {
        return Response.json({ error: validation.error || 'Unauthorized' }, { status: 401 })
      }

      const sessionId = `mcp_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost'
      const protocol = req.headers.get('x-forwarded-proto') || 'https'
      const pathname = url.pathname
      const baseUrl = `${protocol}://${host}${pathname}`

      mcp.createSession(sessionId, apiKey)

      const stream = new ReadableStream({
        start(controller) {
          const encoder = new TextEncoder()
          controller.enqueue(encoder.encode(`event: endpoint\ndata: ${baseUrl}?sessionId=${sessionId}\n\n`))
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n\n`))

          const keepAlive = setInterval(() => {
            try { controller.enqueue(encoder.encode(': keepalive\n\n')) } catch { clearInterval(keepAlive) }
          }, 30000)

          req.signal.addEventListener('abort', () => {
            clearInterval(keepAlive)
            mcp.deleteSession(sessionId)
            try { controller.close() } catch {}
          })
        },
        cancel() { mcp.deleteSession(sessionId) }
      })

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        }
      })
    },

    POST: async (req: Request) => {
      const mcp = await getMcp()
      const authHeader = req.headers.get('authorization') || ''
      const url = new URL(req.url)
      const sessionId = url.searchParams.get('sessionId')
      let apiKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : url.searchParams.get('apiKey') || ''

      if (sessionId) {
        const sessionApiKey = mcp.getSessionApiKey(sessionId)
        if (sessionApiKey) apiKey = sessionApiKey
      }

      try {
        const body = await req.json()
        const response = await mcp.handleRequest(body, apiKey)
        return Response.json(response)
      } catch (err: any) {
        return Response.json({ jsonrpc: '2.0', error: { code: -32603, message: err.message }, id: null }, { status: 500 })
      }
    },

    OPTIONS: async () => new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      }
    })
  }
}

/**
 * Generic HTTP request handler (for any framework)
 */
export async function handleHTTPRequest(
  mcp: DiscordMCPServer,
  request: {
    method: string
    url: string
    headers: Record<string, string | undefined>
    body?: any
    basePath?: string // The base path where MCP is mounted
  }
) {
  const url = new URL(request.url, 'http://localhost')
  const authHeader = request.headers.authorization || request.headers.Authorization || ''
  const apiKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : url.searchParams.get('apiKey') || ''
  const basePath = request.basePath || url.pathname

  if (request.method === 'OPTIONS') {
    return {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      },
      body: null
    }
  }

  if (request.method === 'GET') {
    const format = url.searchParams.get('format')
    const baseUrl = `${url.protocol}//${url.host}${basePath}`

    if (format === 'openapi' || format === 'gpt') {
      return { status: 200, body: mcp.generateOpenAPISchema(baseUrl) }
    }
    return { status: 200, body: mcp.getServerInfo(baseUrl) }
  }

  if (request.method === 'POST') {
    try {
      const response = await mcp.handleRequest(request.body, apiKey)
      return { status: 200, body: response }
    } catch (err: any) {
      return { status: 500, body: { jsonrpc: '2.0', error: { code: -32603, message: err.message }, id: null } }
    }
  }

  return { status: 405, body: { error: 'Method not allowed' } }
}
