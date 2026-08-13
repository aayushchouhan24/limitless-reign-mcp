#!/usr/bin/env node

import { Client, GatewayIntentBits } from 'discord.js'
import { createMCPServer } from './index'
import * as http from 'http'

const args = process.argv.slice(2)
const tokenIndex = args.indexOf('--token')
const portIndex = args.indexOf('--port')

const token = tokenIndex !== -1 ? args[tokenIndex + 1] : process.env.DISCORD_TOKEN
const port = portIndex !== -1 ? parseInt(args[portIndex + 1]) : 3000

if (!token) {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    limitless-reign-mcp                        ║
║           Discord MCP Server - AI Control for Discord         ║
╚═══════════════════════════════════════════════════════════════╝

Usage:
  npx limitless-reign-mcp --token YOUR_BOT_TOKEN
  npx limitless-reign-mcp --token YOUR_BOT_TOKEN --port 3001

Or set environment variable:
  DISCORD_TOKEN=your_token npx limitless-reign-mcp

Options:
  --token    Discord bot token (required)
  --port     Server port (default: 3000)

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
║                    limitless-reign-mcp                        ║
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

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = new URL(req.url || '/', `http://localhost:${port}`)

  // SSE endpoint
  if (url.pathname === '/sse' && req.method === 'GET') {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`
    mcp.createSession(sessionId, 'cli')

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    })

    res.write(`data: ${JSON.stringify({ type: 'session', sessionId })}\n\n`)

    const keepAlive = setInterval(() => {
      res.write(`: keep-alive\n\n`)
    }, 30000)

    req.on('close', () => {
      clearInterval(keepAlive)
      mcp.deleteSession(sessionId)
    })
    return
  }

  // SSE POST
  if (url.pathname === '/sse' && req.method === 'POST') {
    const sessionId = url.searchParams.get('sessionId') || ''
    if (!mcp.getSessionApiKey(sessionId)) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid session' }))
      return
    }

    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      try {
        const result = await mcp.handleRequest(JSON.parse(body), 'cli')
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result))
      } catch (e: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: e.message }))
      }
    })
    return
  }

  // GET - server info or OpenAPI schema
  if (req.method === 'GET') {
    const baseUrl = `http://localhost:${port}`
    if (url.searchParams.get('format') === 'openapi') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(mcp.generateOpenAPISchema(baseUrl)))
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(mcp.getServerInfo(baseUrl)))
    }
    return
  }

  // POST - tool calls
  if (req.method === 'POST') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', async () => {
      try {
        const result = await mcp.handleRequest(JSON.parse(body), 'cli')
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
  Edit claude_desktop_config.json and add:

  {
    "mcpServers": {
      "discord": {
        "url": "http://localhost:${port}"
      }
    }
  }

Connect ChatGPT:
  Settings → Plugins → Add: http://localhost:${port}/sse

Connect Cursor/Windsurf:
  Settings → MCP → Add server: http://localhost:${port}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Press Ctrl+C to stop
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
