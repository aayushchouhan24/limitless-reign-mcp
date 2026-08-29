#!/usr/bin/env node

import { Client, GatewayIntentBits } from 'discord.js'
import { createMCPServer } from './index'
import * as http from 'http'
import * as path from 'path'
import * as fs from 'fs'

const args = process.argv.slice(2)
const tokenIndex = args.indexOf('--token')
const portIndex = args.indexOf('--port')
const toolsIndex = args.indexOf('--tools')
const pluginIndex = args.indexOf('--plugin')
const externalMcpIndex = args.indexOf('--external-mcp')

const token = tokenIndex !== -1 ? args[tokenIndex + 1] : process.env.DISCORD_TOKEN
const port = portIndex !== -1 ? parseInt(args[portIndex + 1]) : (process.env.PORT ? parseInt(process.env.PORT) : 3000)
const toolsPath = toolsIndex !== -1 ? args[toolsIndex + 1] : process.env.CUSTOM_TOOLS_PATH
const pluginPath = pluginIndex !== -1 ? args[pluginIndex + 1] : process.env.PLUGIN_PATH
const externalMcpUrl = externalMcpIndex !== -1 ? args[externalMcpIndex + 1] : process.env.EXTERNAL_MCP_URL

if (!token) {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    limitless-reign                        ║
║           Discord MCP Server - AI Control for Discord         ║
╚═══════════════════════════════════════════════════════════════╝

Usage:
  npx limitless-reign --token YOUR_BOT_TOKEN
  npx limitless-reign --token YOUR_BOT_TOKEN --port 3001
  npx limitless-reign --token YOUR_BOT_TOKEN --tools ./my-tools.js
  npx limitless-reign --token YOUR_BOT_TOKEN --plugin ./my-plugin.js
  npx limitless-reign --token YOUR_BOT_TOKEN --external-mcp http://localhost:8000/mcp

Or set environment variables:
  DISCORD_TOKEN=your_token npx limitless-reign

Options:
  --token         Discord bot token (required)
  --port          Server port (default: 3000)
  --tools         Path to JS/TS file exporting custom tools array
  --plugin        Path to JS/TS file exporting an MCP plugin function
  --external-mcp  URL of an external MCP server to proxy

Then add to Claude Desktop config:
  {
    "mcpServers": {
      "discord": {
        "url": "http://localhost:3000"
      }
    }
  }
`)
  process.exit(1)
}

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    limitless-reign                        ║
║           Discord MCP Server - AI Control for Discord         ║
╚═══════════════════════════════════════════════════════════════╝
`)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildModeration
  ]
})

const mcp = createMCPServer({
  client,
  validateAccess: async () => ({ valid: true, userId: 'cli-user' }),
  getAllowedGuilds: async () => {
    return Array.from(client.guilds.cache.values()).map(g => ({
      id: g.id,
      name: g.name,
      icon: g.iconURL()
    }))
  },
  serverName: 'Discord MCP (CLI)',
  serverVersion: '1.0.0'
})

// Load custom tools if specified
if (toolsPath) {
  try {
    const fullPath = path.resolve(process.cwd(), toolsPath)
    if (fs.existsSync(fullPath)) {
      const loaded = require(fullPath)
      const toolsToRegister = loaded.default || loaded.tools || loaded
      if (Array.isArray(toolsToRegister)) {
        mcp.registerTools(toolsToRegister)
        console.log(`✓ Loaded ${toolsToRegister.length} custom tool(s) from ${toolsPath}`)
      } else if (toolsToRegister && typeof toolsToRegister === 'object') {
        mcp.registerTool(toolsToRegister)
        console.log(`✓ Loaded custom tool "${toolsToRegister.name}" from ${toolsPath}`)
      }
    } else {
      console.warn(`! Warning: Tools file not found at ${fullPath}`)
    }
  } catch (err: any) {
    console.error(`! Failed to load custom tools from ${toolsPath}:`, err.message)
  }
}

// Load plugin if specified
if (pluginPath) {
  try {
    const fullPath = path.resolve(process.cwd(), pluginPath)
    if (fs.existsSync(fullPath)) {
      const loaded = require(fullPath)
      const pluginFn = loaded.default || loaded.plugin || loaded
      if (typeof pluginFn === 'function') {
        mcp.use(pluginFn)
        console.log(`✓ Applied MCP plugin from ${pluginPath}`)
      }
    } else {
      console.warn(`! Warning: Plugin file not found at ${fullPath}`)
    }
  } catch (err: any) {
    console.error(`! Failed to load plugin from ${pluginPath}:`, err.message)
  }
}

// Load external MCP server if specified
if (externalMcpUrl) {
  mcp.registerExternalMCP({ url: externalMcpUrl })
    .then((proxied) => {
      console.log(`✓ Proxied ${proxied.length} tools from external MCP server: ${externalMcpUrl}`)
    })
    .catch((err) => {
      console.warn(`! Warning: Could not connect to external MCP at ${externalMcpUrl}: ${err.message}`)
    })
}


const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, X-Requested-With, Accept')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${port}`
  const baseUrl = `${protocol}://${host}`
  const url = new URL(req.url || '/', baseUrl)

  const authHeader = req.headers.authorization || ''
  const customKeyHeader = (req.headers['x-api-key'] as string) || ''
  const apiKey = customKeyHeader || (authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (url.searchParams.get('apiKey') || url.searchParams.get('key') || 'cli'))

  // SSE or MCP GET endpoint (/sse, /mcp)
  if ((url.pathname === '/sse' || url.pathname === '/mcp') && req.method === 'GET') {
    if (url.pathname === '/sse' || req.headers.accept?.includes('text/event-stream') || url.searchParams.get('transport') === 'sse') {
      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
      mcp.createSession(sessionId, apiKey)

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      })

      res.write(`event: endpoint\ndata: ${baseUrl}/messages?sessionId=${sessionId}\n\n`)
      res.write(`event: message\ndata: ${JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} })}\n\n`)

      const keepAlive = setInterval(() => {
        try { res.write(`: keep-alive\n\n`) } catch { clearInterval(keepAlive) }
      }, 30000)

      req.on('close', () => {
        clearInterval(keepAlive)
        mcp.deleteSession(sessionId)
      })
      return
    }
  }

  // SSE POST /messages, /sse, or /mcp with sessionId
  if ((url.pathname === '/messages' || url.pathname === '/sse') && req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      try {
        const sessionId = url.searchParams.get('sessionId') || ''
        const sessionApiKey = sessionId ? mcp.getSessionApiKey(sessionId) : null
        const result = await mcp.handleRequest(JSON.parse(body), sessionApiKey || apiKey)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (e: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  // Health check endpoint
  if (url.pathname === '/health' || url.pathname === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', tools: mcp.getTools().length, server: mcp.serverName, version: mcp.serverVersion }))
    return
  }

  // GET - server info or OpenAPI schema
  if (req.method === 'GET') {
    const format = url.searchParams.get('format')
    if (format === 'openapi' || format === 'gpt') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(mcp.generateOpenAPISchema(baseUrl)))
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(mcp.getServerInfo(baseUrl)))
    }
    return
  }

  // POST - Streamable HTTP tool calls / JSON-RPC
  if (req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body)
        const result = await mcp.handleRequest(parsed, apiKey)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (e: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  res.writeHead(404)
  res.end('Not found')
})

client.once('ready', () => {
  console.log(`✓ Bot logged in as ${client.user?.tag}`)
  console.log(`✓ Connected to ${client.guilds.cache.size} server(s)`)

  server.listen(port, () => {
    console.log(`
✓ MCP Server running on http://localhost:${port}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connect Claude Desktop:
  Edit claude_desktop_config.json:
  {
    "mcpServers": {
      "discord": {
        "url": "http://localhost:${port}"
      }
    }
  }

Connect ChatGPT:
  Settings → Plugins → Add: http://localhost:${port}/sse

Connect Cursor / Windsurf:
  Settings → MCP → Add server: http://localhost:${port}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`)
  })
})

client.on('error', (err) => {
  console.error('Discord client error:', err.message)
})

console.log('Connecting to Discord...')
client.login(token).catch((err) => {
  console.error(`\n✗ Failed to login: ${err.message}`)
  console.log('\nMake sure your bot token is correct.')
  console.log('Get your token from: https://discord.com/developers/applications')
  process.exit(1)
})

process.on('SIGINT', () => {
  console.log('\nShutting down...')
  client.destroy()
  server.close()
  process.exit(0)
})
