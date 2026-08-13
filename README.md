# Discord MCP SDK

<p align="center">
  <img src="https://img.shields.io/npm/v/limitless-reign-mcp?style=flat-square" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/limitless-reign-mcp?style=flat-square" alt="npm downloads" />
  <img src="https://img.shields.io/github/license/AayushChouhan/limitless-reign-mcp?style=flat-square" alt="license" />
  <img src="https://img.shields.io/badge/discord.js-v14-blue?style=flat-square" alt="discord.js" />
</p>

<p align="center">
  <b>Turn any Discord.js bot into a full MCP server with 100+ tools</b><br>
  Supports Claude, ChatGPT, Cursor, Windsurf, and all MCP-compatible AI clients
</p>

---

## Features

- **95 Tool Handlers** - Full Discord.js v14 API coverage
- **116 Tool Definitions** - Complete MCP tool schemas
- **Multiple Transports** - HTTP POST, SSE, JSON-RPC
- **GPT Actions** - Auto-generated OpenAPI schema
- **Flexible Mounting** - Any URL path you want
- **Framework Support** - Express, Next.js, generic HTTP
- **Session Management** - SSE sessions with keep-alive
- **Database Hooks** - Optional persistence for configs/tasks
- **Full CORS** - Built-in support
- **TypeScript** - Full type definitions included

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Framework Guides](#framework-guides)
  - [Express](#express)
  - [Next.js](#nextjs)
  - [Generic HTTP](#generic-http)
- [Connecting AI Clients](#connecting-ai-clients)
  - [Claude Desktop](#claude-desktop)
  - [Claude Code](#claude-code)
  - [Cursor / Windsurf](#cursor--windsurf)
  - [ChatGPT Web](#chatgpt-web-plugin)
  - [ChatGPT Desktop](#chatgpt-desktop)
  - [GPT Actions](#gpt-actions-custom-gpt)
- [Complete Tool Reference](#complete-tool-reference)
- [Database Handlers](#database-handlers-optional)
- [Examples](#examples)
- [License](#license)

---

## Installation

```bash
npm install limitless-reign-mcp discord.js
```

```bash
yarn add limitless-reign-mcp discord.js
```

```bash
pnpm add limitless-reign-mcp discord.js
```

### Requirements

- Node.js 18+
- discord.js v14+

---

## Quick Start

```typescript
import { Client, GatewayIntentBits } from 'discord.js'
import { createMCPServer, expressMiddleware } from 'limitless-reign-mcp'
import express from 'express'

// 1. Create Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ]
})

// 2. Create MCP server
const mcp = createMCPServer({
  client,
  validateAccess: async (apiKey, guildId) => {
    // Your authentication logic
    const user = await db.apiKeys.findOne({ key: apiKey })
    if (!user) return { valid: false, error: 'Invalid API key' }
    if (guildId && !user.guilds.includes(guildId)) {
      return { valid: false, error: 'No access to this server' }
    }
    return { valid: true, userId: user.id }
  }
})

// 3. Create Express app and mount
const app = express()
app.use(express.json())
app.use('/api/mcp', expressMiddleware(mcp))

// 4. Start
client.login(process.env.DISCORD_TOKEN)
app.listen(3000, () => {
  console.log('MCP Server running on http://localhost:3000/api/mcp')
})
```

---

## Configuration

### createMCPServer Options

```typescript
interface MCPServerOptions {
  // Required: Discord.js client
  client: Client

  // Required: Authentication middleware
  validateAccess: (apiKey: string, guildId: string | null) => Promise<ValidateResult>

  // Optional: Get list of guilds the API key can access
  getAllowedGuilds?: (apiKey: string) => Promise<AllowedGuild[]>

  // Optional: Callback for logging tool calls
  onToolCall?: (tool: string, args: any, result: any, apiKey: string) => void

  // Optional: Database handlers for persistence
  database?: DatabaseHandlers

  // Optional: Customize server info
  serverName?: string        // Default: 'Discord MCP Server'
  serverVersion?: string     // Default: '1.0.0'
  serverDescription?: string // Default: 'Discord bot with MCP support - 100+ tools'
}

interface ValidateResult {
  valid: boolean
  error?: string
  userId?: string
}

interface AllowedGuild {
  id: string
  name?: string
  icon?: string | null
}
```

### Example with all options

```typescript
const mcp = createMCPServer({
  client,
  
  validateAccess: async (apiKey, guildId) => {
    const user = await db.apiKeys.findOne({ key: apiKey })
    if (!user) return { valid: false, error: 'Invalid API key' }
    if (guildId && !user.guilds.includes(guildId)) {
      return { valid: false, error: 'No access to this server' }
    }
    return { valid: true, userId: user.id }
  },

  // Return list of guilds this API key can access
  getAllowedGuilds: async (apiKey) => {
    const user = await db.apiKeys.findOne({ key: apiKey })
    if (!user) return []
    
    // Return guilds the user has access to
    return user.guilds.map(guildId => {
      const guild = client.guilds.cache.get(guildId)
      return {
        id: guildId,
        name: guild?.name,
        icon: guild?.iconURL()
      }
    })
  },

  onToolCall: (tool, args, result, apiKey) => {
    console.log(`[${new Date().toISOString()}] ${tool}: ${result.success ? 'OK' : 'FAIL'}`)
    // Log to database, analytics, etc.
  },

  database: {
    // See Database Handlers section
  },

  serverName: 'My Awesome Bot',
  serverVersion: '2.0.0',
  serverDescription: 'AI-powered Discord management'
})
```

---

## API Reference

### Endpoints Created

When you mount the middleware, these endpoints are created relative to your mount path:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | `POST` | JSON-RPC / GPT Actions endpoint |
| `/` | `GET` | Server info |
| `/?format=openapi` | `GET` | OpenAPI 3.1 schema for GPT Actions |
| `/?format=gpt` | `GET` | Same as above (alias) |
| `/sse` | `GET` | SSE connection for ChatGPT Web |
| `/sse` | `POST` | SSE message handler |

### Example URLs

If mounted at `/api/mcp`:
- `POST https://example.com/api/mcp` - Execute tools
- `GET https://example.com/api/mcp` - Server info
- `GET https://example.com/api/mcp?format=openapi` - OpenAPI schema
- `GET https://example.com/api/mcp/sse?apiKey=xxx` - SSE connection

### Authentication

The SDK supports two authentication methods:

**1. Bearer Token (Header)**
```
Authorization: Bearer your_api_key
```

**2. Query Parameter**
```
?apiKey=your_api_key
```

Both are automatically extracted and passed to your `validateAccess` function.

### Request Format

**JSON-RPC Format:**
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "discord_send_message",
    "arguments": {
      "channelId": "123456789",
      "content": "Hello from AI!"
    }
  },
  "id": 1
}
```

**GPT Actions Format (simplified):**
```json
{
  "name": "discord_send_message",
  "arguments": {
    "channelId": "123456789",
    "content": "Hello from AI!"
  }
}
```

Both formats are automatically supported.

### Response Format

```json
{
  "jsonrpc": "2.0",
  "result": {
    "content": [{ "type": "text", "text": "..." }],
    "isError": false
  },
  "success": true,
  "data": { "id": "message_id", "channelId": "123" },
  "id": 1
}
```

---

## Framework Guides

### Express

```typescript
import express from 'express'
import { createMCPServer, expressMiddleware } from 'limitless-reign-mcp'

const app = express()
app.use(express.json())

const mcp = createMCPServer({ client, validateAccess })

// Mount at any path you want
app.use('/api/mcp', expressMiddleware(mcp))
// or: app.use('/v1/discord', expressMiddleware(mcp))
// or: app.use('/bot/api', expressMiddleware(mcp))

app.listen(3000)
```

### Next.js

**App Router (recommended):**

```typescript
// app/api/mcp/route.ts
import { createMCPServer, nextjsHandlers } from 'limitless-reign-mcp'
import { getDiscordClient } from '@/lib/discord'

const mcp = createMCPServer({
  client: getDiscordClient(),
  validateAccess: async (apiKey, guildId) => {
    // Your auth logic
  }
})

export const { GET, POST, OPTIONS } = nextjsHandlers(mcp)
export const runtime = 'nodejs' // Required for discord.js
```

```typescript
// app/api/mcp/sse/route.ts
import { nextjsSSEHandlers } from 'limitless-reign-mcp'
import { mcp } from '../route' // Import from main route

export const { GET, POST, OPTIONS } = nextjsSSEHandlers(mcp)
export const runtime = 'nodejs'
```

**Custom path example:**

```typescript
// app/api/v1/discord/route.ts
export const { GET, POST, OPTIONS } = nextjsHandlers(mcp)

// app/api/v1/discord/sse/route.ts
export const { GET, POST, OPTIONS } = nextjsSSEHandlers(mcp)
```

### Generic HTTP

For any other framework:

```typescript
import { createMCPServer, handleHTTPRequest } from 'limitless-reign-mcp'

const mcp = createMCPServer({ client, validateAccess })

// Your HTTP handler
async function handler(req, res) {
  const result = await handleHTTPRequest(mcp, {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    basePath: '/api/mcp' // Your mount path
  })
  
  res.status(result.status).json(result.body)
}
```

---

## Connecting AI Clients

### Claude Desktop

Edit `claude_desktop_config.json`:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "discord": {
      "url": "https://your-server.com/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

Restart Claude Desktop after saving.

### Claude Code

Add to your MCP settings:

```json
{
  "mcpServers": {
    "discord": {
      "url": "https://your-server.com/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### Cursor / Windsurf

1. Open **Settings** → **Features** → **MCP**
2. Click **+ Add New MCP Server**
3. Configure:
   - **Type:** `sse` or `Streamable HTTP`
   - **URL:** `https://your-server.com/api/mcp`
   - **Headers:**
     - Key: `Authorization`
     - Value: `Bearer YOUR_API_KEY`

### ChatGPT Web (Plugin)

1. Go to **Settings** → **Security** → Enable **Developer Mode**
2. Navigate to [chatgpt.com/plugins](https://chatgpt.com/plugins)
3. Click **+** to add new plugin
4. Fill in:
   - **Name:** `Discord Bot`
   - **Connection URL:** `https://your-server.com/api/mcp/sse?apiKey=YOUR_API_KEY`
   - **Authentication:** `No Auth`
5. Check the confirmation checkbox
6. Click **Create**

### ChatGPT Desktop

1. Open **Settings** → **Integrations** → **Plugins**
2. Click **Add** → **Add MCP Server**
3. Configure:
   - **Name:** `Discord Bot`
   - **Type:** `Streamable HTTP`
   - **URL:** `https://your-server.com/api/mcp`
4. Add Header:
   - **Key:** `Authorization`
   - **Value:** `Bearer YOUR_API_KEY`
5. Click **Save**

### GPT Actions (Custom GPT)

1. Get the OpenAPI schema:
   ```
   GET https://your-server.com/api/mcp?format=openapi
   ```

2. In ChatGPT:
   - Go to **Explore GPTs** → **Create a GPT**
   - Go to **Configure** tab
   - Scroll to **Actions** → **Create new action**
   - Paste the OpenAPI schema

3. Set Authentication:
   - Click **Authentication**
   - Type: **API Key**
   - Auth Type: **Bearer**
   - Enter your API key

4. **Save** and test

---

## Complete Tool Reference

### API Access (1 tool)

| Tool | Description |
|------|-------------|
| `get_allowed_guilds` | List all Discord servers this API key has access to |

**Example Response:**
```json
{
  "success": true,
  "data": {
    "guilds": [
      { "id": "123456789", "name": "My Server", "icon": "https://cdn.discordapp.com/..." },
      { "id": "987654321", "name": "Another Server", "icon": null }
    ],
    "count": 2
  }
}
```

> **Note:** Requires `getAllowedGuilds` callback to be configured. Returns empty array if not configured.

### Bot Status (5 tools)

| Tool | Description |
|------|-------------|
| `discord_get_bot_info` | Get bot user info, guilds count, uptime |
| `discord_get_gateway_info` | Get gateway connection info, latency, shard status |
| `discord_set_presence` | Set bot status (online/idle/dnd/invisible) |
| `discord_set_activity` | Set bot activity (playing/streaming/listening/watching/competing) |
| `discord_disconnect` | Gracefully disconnect bot from Discord |

### Guild Management (16 tools)

| Tool | Description |
|------|-------------|
| `discord_list_guilds` | List servers you have access to (same as `get_allowed_guilds`) |
| `discord_get_guild` | Get full guild info (features, boost status, etc.) |
| `discord_edit_guild` | Edit guild settings (name, icon, verification, etc.) |
| `discord_get_guild_channels` | List all channels in a guild |
| `discord_get_guild_roles` | List all roles with permissions |
| `discord_get_guild_emojis` | List all custom emojis |
| `discord_get_guild_stickers` | List all custom stickers |
| `discord_get_guild_invites` | List all active invites |
| `discord_get_guild_webhooks` | List all webhooks |
| `discord_get_guild_bans` | List all banned users |
| `discord_get_audit_log` | Fetch audit log entries |
| `discord_get_vanity_url` | Get vanity URL info |
| `discord_leave_guild` | Make bot leave a guild |
| `discord_apply_template` | Apply server template (gaming, community, etc.) |

### Channel Operations (7 tools)

| Tool | Description |
|------|-------------|
| `discord_create_channel` | Create channel (text/voice/category/announcement/forum/stage) |
| `discord_edit_channel` | Edit channel settings |
| `discord_delete_channel` | Delete a channel |
| `discord_clone_channel` | Clone channel with settings |
| `discord_set_channel_permissions` | Set permissions for role/user |
| `discord_create_invite` | Create channel invite |

### Thread Management (5 tools)

| Tool | Description |
|------|-------------|
| `discord_create_thread` | Create a thread (public/private) |
| `discord_create_forum_post` | Create a forum post |
| `discord_edit_thread` | Edit thread settings |
| `discord_delete_thread` | Delete a thread |
| `discord_get_active_threads` | Get all active threads |

### Message Operations (14 tools)

| Tool | Description |
|------|-------------|
| `discord_send_message` | Send message with content/embeds/components |
| `discord_send_embed` | Send rich embed message |
| `discord_send_components_v2` | Send with Components V2 (containers, sections) |
| `discord_edit_message` | Edit existing message |
| `discord_delete_message` | Delete a message |
| `discord_bulk_delete_messages` | Bulk delete (2-100 messages) |
| `discord_get_messages` | Fetch messages from channel |
| `discord_pin_message` | Pin a message |
| `discord_unpin_message` | Unpin a message |
| `discord_add_reaction` | Add reaction to message |
| `discord_remove_reaction` | Remove reaction |
| `discord_create_poll` | Create a poll |

### Member Management (16 tools)

| Tool | Description |
|------|-------------|
| `discord_get_member` | Get detailed member info |
| `discord_search_members` | Search members by username |
| `discord_list_members` | List members in guild |
| `discord_kick_member` | Kick a member |
| `discord_ban_member` | Ban a member |
| `discord_unban_member` | Unban a user |
| `discord_timeout_member` | Timeout (mute) a member |
| `discord_remove_timeout` | Remove timeout |
| `discord_add_role` | Add role to member |
| `discord_remove_role` | Remove role from member |
| `discord_set_nickname` | Set member nickname |
| `discord_move_member_voice` | Move member to voice channel |
| `discord_disconnect_member` | Disconnect from voice |
| `discord_server_mute_member` | Server mute in voice |
| `discord_server_deafen_member` | Server deafen in voice |

### Role Management (4 tools)

| Tool | Description |
|------|-------------|
| `discord_create_role` | Create a new role |
| `discord_edit_role` | Edit existing role |
| `discord_delete_role` | Delete a role |
| `discord_list_permissions` | List all permission names |

### Emoji & Stickers (6 tools)

| Tool | Description |
|------|-------------|
| `discord_create_emoji` | Create custom emoji |
| `discord_delete_emoji` | Delete custom emoji |
| `discord_create_sticker` | Create guild sticker |
| `discord_delete_sticker` | Delete sticker |
| `discord_search_emojigg` | Search emoji.gg |
| `discord_add_emojigg` | Add emoji from emoji.gg |

### Webhooks (3 tools)

| Tool | Description |
|------|-------------|
| `discord_create_webhook` | Create webhook in channel |
| `discord_delete_webhook` | Delete a webhook |
| `discord_execute_webhook` | Send message via webhook |

### Auto Moderation (3 tools)

| Tool | Description |
|------|-------------|
| `discord_get_automod_rules` | List automod rules |
| `discord_create_automod_rule` | Create automod rule |
| `discord_delete_automod_rule` | Delete automod rule |

### Scheduled Events (3 tools)

| Tool | Description |
|------|-------------|
| `discord_create_scheduled_event` | Create event (voice/stage/external) |
| `discord_get_scheduled_events` | List scheduled events |
| `discord_delete_scheduled_event` | Delete event |

### Slash Commands (6 tools)

| Tool | Description |
|------|-------------|
| `discord_create_global_command` | Create global slash command |
| `discord_create_guild_command` | Create guild-specific command |
| `discord_delete_global_command` | Delete global command |
| `discord_delete_guild_command` | Delete guild command |
| `discord_get_global_commands` | List global commands |
| `discord_get_guild_commands` | List guild commands |

### Interaction Handlers (4 tools)

| Tool | Description |
|------|-------------|
| `discord_register_button_handler` | Register button click handler |
| `discord_register_select_handler` | Register select menu handler |
| `discord_unregister_handler` | Remove handler |
| `discord_list_handlers` | List registered handlers |

### Raw API (1 tool)

| Tool | Description |
|------|-------------|
| `discord_api_call` | Execute any Discord REST API call |

### Database Tools (7 tools) - Requires database handlers

| Tool | Description |
|------|-------------|
| `discord_get_logs` | Get action logs |
| `discord_get_guild_config` | Get guild configuration |
| `discord_set_guild_config` | Update guild configuration |
| `discord_get_db_stats` | Get database stats |
| `discord_create_scheduled_task` | Create scheduled task |
| `discord_list_scheduled_tasks` | List scheduled tasks |
| `discord_cancel_scheduled_task` | Cancel scheduled task |

---

## Database Handlers (Optional)

For persistence features, provide database handlers:

```typescript
const mcp = createMCPServer({
  client,
  validateAccess,
  
  database: {
    // Get action logs
    getLogs: async ({ guildId, tool, limit, success }) => {
      const query: any = {}
      if (guildId) query.guildId = guildId
      if (tool) query.tool = tool
      if (success !== undefined) query['result.success'] = success
      return await ActionLog.find(query).limit(limit || 50).sort({ createdAt: -1 })
    },

    // Get guild configuration
    getGuildConfig: async (guildId) => {
      return await GuildConfig.findOne({ guildId })
    },

    // Set guild configuration
    setGuildConfig: async (guildId, config) => {
      return await GuildConfig.findOneAndUpdate(
        { guildId },
        { $set: config },
        { upsert: true, new: true }
      )
    },

    // Get database stats
    getDbStats: async () => {
      return {
        connected: mongoose.connection.readyState === 1,
        collections: Object.keys(mongoose.connection.collections).length
      }
    },

    // Create scheduled task
    createScheduledTask: async (task) => {
      const newTask = new ScheduledTask(task)
      await newTask.save()
      return newTask
    },

    // List scheduled tasks
    listScheduledTasks: async ({ guildId, status }) => {
      const query: any = {}
      if (guildId) query.guildId = guildId
      if (status) query.status = status
      return await ScheduledTask.find(query)
    },

    // Cancel scheduled task
    cancelScheduledTask: async (taskId) => {
      return await ScheduledTask.findByIdAndUpdate(
        taskId,
        { status: 'cancelled' },
        { new: true }
      )
    }
  }
})
```

---

## Examples

### Basic Express Server

```typescript
import { Client, GatewayIntentBits } from 'discord.js'
import { createMCPServer, expressMiddleware } from 'limitless-reign-mcp'
import express from 'express'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

// Simple in-memory API key store (use a database in production)
const apiKeys = new Map([
  ['my-secret-key', { userId: 'user1', guilds: ['guild1', 'guild2'] }]
])

const mcp = createMCPServer({
  client,
  validateAccess: async (apiKey, guildId) => {
    const user = apiKeys.get(apiKey)
    if (!user) return { valid: false, error: 'Invalid API key' }
    if (guildId && !user.guilds.includes(guildId)) {
      return { valid: false, error: 'No access to this server' }
    }
    return { valid: true, userId: user.userId }
  }
})

const app = express()
app.use(express.json())
app.use('/api/mcp', expressMiddleware(mcp))

client.once('ready', () => {
  console.log(`Bot logged in as ${client.user?.tag}`)
})

client.login(process.env.DISCORD_TOKEN)
app.listen(3000, () => console.log('Server running on :3000'))
```

### With Logging

```typescript
const mcp = createMCPServer({
  client,
  validateAccess,
  onToolCall: async (tool, args, result, apiKey) => {
    // Log to console
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      tool,
      args,
      success: result.success,
      apiKey: apiKey.slice(0, 8) + '...'
    }))
    
    // Log to database
    await ActionLog.create({
      tool,
      args,
      result,
      apiKey,
      createdAt: new Date()
    })
  }
})
```

### Multiple Mount Points

```typescript
const app = express()
app.use(express.json())

// Mount at multiple paths
app.use('/api/mcp', expressMiddleware(mcp))
app.use('/v1/discord', expressMiddleware(mcp))
app.use('/bot', expressMiddleware(mcp))

// All these work:
// POST /api/mcp
// POST /v1/discord
// POST /bot
```

---

## TypeScript

Full TypeScript support with exported types:

```typescript
import {
  createMCPServer,
  expressMiddleware,
  nextjsHandlers,
  nextjsSSEHandlers,
  handleHTTPRequest,
  DiscordMCPServer,
  tools,
  handleToolCall,
  extractGuildId,
  // Types
  MCPServerOptions,
  ValidateResult,
  ToolDefinition,
  ToolResult,
  DatabaseHandlers,
  AllowedGuild
} from 'limitless-reign-mcp'
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Author

**Aayush Chouhan**

- GitHub: [@AayushChouhan](https://github.com/AayushChouhan)

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Support

If you find this package useful, please consider giving it a star on GitHub!

For issues and feature requests, please use the [GitHub Issues](https://github.com/AayushChouhan/limitless-reign-mcp/issues) page.
