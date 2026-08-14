# Limitless Reign MCP

## AI-Powered Discord Bot Control | 100+ Tools | Works with Claude, ChatGPT, Cursor

<p align="center">
  <img src="https://img.shields.io/npm/v/limitless-reign-mcp?style=for-the-badge&color=5865F2" alt="npm" />
  <img src="https://img.shields.io/npm/dm/limitless-reign-mcp?style=for-the-badge&color=57F287" alt="downloads" />
  <img src="https://img.shields.io/github/stars/aayushchouhan24/limitless-reign?style=for-the-badge&color=FEE75C" alt="stars" />
  <img src="https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge" alt="discord.js" />
</p>

<p align="center">
  <strong>Let AI manage your Discord server with natural language</strong>
</p>

<p align="center">
  <a href="#-one-command-setup">Quick Start</a> •
  <a href="#-what-ai-can-do">Features</a> •
  <a href="#-all-116-tools">All Tools</a> •
  <a href="#-connect-any-ai">Connect AI</a> •
  <a href="https://github.com/aayushchouhan24/limitless-reign-mcp/issues">Support</a>
</p>

---

## Why Limitless Reign MCP?

Stop writing Discord bot commands. Just tell AI what you want.

```
You:  "Set up my gaming server with channels and automod"

AI:   ✓ Created #rules, #announcements, #general
      ✓ Created Gaming voice channels  
      ✓ Set up automod for spam/slurs
      ✓ Created Moderator and Member roles
      Done! Your server is ready.
```

**The most complete Discord MCP integration:**
- **116 Discord tools** - Every Discord.js v14 API
- **Any AI client** - Claude, ChatGPT, Cursor, Windsurf, GPT Actions
- **Zero config** - One command to start
- **Open source** - MIT license, free forever

---

## 🚀 One Command Setup

```bash
npx limitless-reign --token YOUR_BOT_TOKEN
```

**That's it.** Server runs at `http://localhost:3000`. Connect your AI and go.

<details>
<summary><strong>Get your bot token</strong></summary>

1. Go to [discord.com/developers/applications](https://discord.com/developers/applications)
2. Create app or select existing
3. Go to **Bot** → **Reset Token** → Copy
4. Add bot to server with **Administrator** permission

</details>

---

## 🎯 What AI Can Do

### Messages & Content
| Ask AI | What Happens |
|--------|--------------|
| "Announce the new update in #general" | Sends formatted message |
| "Create a poll: What game tonight?" | Creates interactive poll |
| "Delete spam from the last hour" | Bulk deletes messages |
| "Pin the rules message" | Pins to channel |

### Server Setup
| Ask AI | What Happens |
|--------|--------------|
| "Create a gaming server layout" | Creates categories + channels |
| "Set up roles for staff and members" | Creates role hierarchy |
| "Make #admin visible only to mods" | Sets channel permissions |
| "Add automod to block spam" | Creates automod rules |

### Member Management
| Ask AI | What Happens |
|--------|--------------|
| "Timeout toxic_user for 1 day" | Applies timeout |
| "Give VIP role to our supporters" | Adds roles to members |
| "Kick inactive members" | Removes members |
| "Who has the Admin role?" | Lists members |

### Advanced
| Ask AI | What Happens |
|--------|--------------|
| "Create a /announce command" | Registers slash command |
| "Set up a webhook for alerts" | Creates webhook |
| "Schedule game night for Friday" | Creates event |
| "Add trending emojis from emoji.gg" | Imports emojis |

---

## 📋 All 116 Tools

<details>
<summary><strong>Bot & Connection (5)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_bot_info` | Bot info, server count, uptime |
| `discord_get_gateway_info` | Connection status, ping |
| `discord_set_presence` | Online/idle/dnd/invisible |
| `discord_set_activity` | Playing/streaming/listening |
| `discord_disconnect` | Disconnect bot |

</details>

<details>
<summary><strong>Servers (16)</strong></summary>

| Tool | Description |
|------|-------------|
| `get_allowed_guilds` | List your servers |
| `discord_list_guilds` | List accessible servers |
| `discord_get_guild` | Server details |
| `discord_edit_guild` | Edit server settings |
| `discord_get_guild_channels` | List channels |
| `discord_get_guild_roles` | List roles |
| `discord_get_guild_emojis` | List emojis |
| `discord_get_guild_stickers` | List stickers |
| `discord_get_guild_invites` | List invites |
| `discord_get_guild_webhooks` | List webhooks |
| `discord_get_guild_bans` | List bans |
| `discord_get_audit_log` | Audit log |
| `discord_get_vanity_url` | Vanity URL |
| `discord_leave_guild` | Leave server |
| `discord_apply_template` | Apply template |

</details>

<details>
<summary><strong>Channels (7)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_channel` | Create any channel type |
| `discord_edit_channel` | Edit settings |
| `discord_delete_channel` | Delete channel |
| `discord_clone_channel` | Clone with settings |
| `discord_set_channel_permissions` | Set permissions |
| `discord_create_invite` | Create invite |

</details>

<details>
<summary><strong>Threads (5)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_thread` | Create thread |
| `discord_create_forum_post` | Create forum post |
| `discord_edit_thread` | Edit thread |
| `discord_delete_thread` | Delete thread |
| `discord_get_active_threads` | List active threads |

</details>

<details>
<summary><strong>Messages (14)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_send_message` | Send with embeds/buttons |
| `discord_send_embed` | Rich embed |
| `discord_send_components_v2` | Components V2 |
| `discord_edit_message` | Edit message |
| `discord_delete_message` | Delete message |
| `discord_bulk_delete_messages` | Bulk delete |
| `discord_get_messages` | Fetch messages |
| `discord_pin_message` | Pin |
| `discord_unpin_message` | Unpin |
| `discord_add_reaction` | Add reaction |
| `discord_remove_reaction` | Remove reaction |
| `discord_create_poll` | Create poll |

</details>

<details>
<summary><strong>Members (16)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_member` | Member info |
| `discord_search_members` | Search members |
| `discord_list_members` | List members |
| `discord_kick_member` | Kick |
| `discord_ban_member` | Ban |
| `discord_unban_member` | Unban |
| `discord_timeout_member` | Timeout |
| `discord_remove_timeout` | Remove timeout |
| `discord_add_role` | Add role |
| `discord_remove_role` | Remove role |
| `discord_set_nickname` | Set nickname |
| `discord_move_member_voice` | Move to voice |
| `discord_disconnect_member` | Disconnect from voice |
| `discord_server_mute_member` | Server mute |
| `discord_server_deafen_member` | Server deafen |

</details>

<details>
<summary><strong>Roles (4)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_role` | Create role |
| `discord_edit_role` | Edit role |
| `discord_delete_role` | Delete role |
| `discord_list_permissions` | List permissions |

</details>

<details>
<summary><strong>Emojis & Stickers (6)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_emoji` | Create emoji |
| `discord_delete_emoji` | Delete emoji |
| `discord_create_sticker` | Create sticker |
| `discord_delete_sticker` | Delete sticker |
| `discord_search_emojigg` | Search emoji.gg |
| `discord_add_emojigg` | Add from emoji.gg |

</details>

<details>
<summary><strong>Webhooks (3)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_webhook` | Create |
| `discord_delete_webhook` | Delete |
| `discord_execute_webhook` | Send via webhook |

</details>

<details>
<summary><strong>AutoMod (3)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_automod_rules` | List rules |
| `discord_create_automod_rule` | Create rule |
| `discord_delete_automod_rule` | Delete rule |

</details>

<details>
<summary><strong>Events (3)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_scheduled_event` | Create event |
| `discord_get_scheduled_events` | List events |
| `discord_delete_scheduled_event` | Delete event |

</details>

<details>
<summary><strong>Slash Commands (6)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_global_command` | Create global |
| `discord_create_guild_command` | Create guild |
| `discord_delete_global_command` | Delete global |
| `discord_delete_guild_command` | Delete guild |
| `discord_get_global_commands` | List global |
| `discord_get_guild_commands` | List guild |

</details>

<details>
<summary><strong>Interactions (4)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_register_button_handler` | Button handler |
| `discord_register_select_handler` | Select handler |
| `discord_unregister_handler` | Remove handler |
| `discord_list_handlers` | List handlers |

</details>

<details>
<summary><strong>Advanced (8)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_api_call` | Raw Discord API |
| `discord_get_logs` | Action logs |
| `discord_get_guild_config` | Get config |
| `discord_set_guild_config` | Set config |
| `discord_get_db_stats` | DB stats |
| `discord_create_scheduled_task` | Create task |
| `discord_list_scheduled_tasks` | List tasks |
| `discord_cancel_scheduled_task` | Cancel task |

</details>

---

## 🔌 Connect Any AI

### Claude Desktop

Edit `claude_desktop_config.json`:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "discord": {
      "url": "http://localhost:3000"
    }
  }
}
```

### Claude Code

Install package and use the skill:
```bash
npm install limitless-reign-mcp
```
Then type `/limitless-reign` in Claude Code.

### ChatGPT

**Web Plugin:** Settings → Security → Developer Mode → Plugins → Add:
```
http://localhost:3000/sse
```

**Desktop:** Settings → Integrations → Add MCP Server → Streamable HTTP:
```
http://localhost:3000
```

### Cursor / Windsurf

Settings → Features → MCP → Add Server:
```
URL: http://localhost:3000
```

### GPT Actions

Get OpenAPI schema:
```
GET http://localhost:3000?format=openapi
```
Paste in Custom GPT → Configure → Actions

---

## 💻 SDK Usage

Works with **any** backend framework. Just create the MCP server and mount it.

### Core Setup (All Frameworks)

```typescript
import { Client, GatewayIntentBits } from 'discord.js'
import { createMCPServer } from 'limitless-reign-mcp'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
})

const mcp = createMCPServer({
  client,
  validateAccess: async (apiKey, guildId) => {
    // Your auth logic
    return { valid: true, userId: 'user-id' }
  },
  getAllowedGuilds: async (apiKey) => {
    return [{ id: '123', name: 'My Server', icon: null }]
  }
})

await client.login(process.env.DISCORD_TOKEN)
```

---

### Express

```typescript
import express from 'express'
import { expressMiddleware } from 'limitless-reign-mcp'

const app = express()
app.use(express.json())
app.use('/mcp', expressMiddleware(mcp))

app.listen(3000)
```

---

### Next.js (App Router)

```typescript
// lib/mcp.ts
import { createMCPServer } from 'limitless-reign-mcp'

let mcp: ReturnType<typeof createMCPServer>

export async function getMCP() {
  if (!mcp) {
    // ... setup client
    mcp = createMCPServer({ client, validateAccess, getAllowedGuilds })
  }
  return mcp
}
```

```typescript
// app/api/mcp/route.ts
import { createNextjsRoute } from 'limitless-reign-mcp'
import { getMCP } from '@/lib/mcp'

export const { GET, POST, OPTIONS } = createNextjsRoute(getMCP)
```

```typescript
// app/api/mcp/sse/route.ts
import { createNextjsSSERoute } from 'limitless-reign-mcp'
import { getMCP } from '@/lib/mcp'

export const { GET, POST, OPTIONS } = createNextjsSSERoute(getMCP)
```

---

### Fastify

```typescript
import Fastify from 'fastify'
import { handleHTTPRequest } from 'limitless-reign-mcp'

const app = Fastify()

app.all('/mcp', async (req, reply) => {
  const result = await handleHTTPRequest(mcp, {
    method: req.method,
    url: req.url,
    headers: req.headers as Record<string, string>,
    body: req.body,
    basePath: '/mcp'
  })
  reply.status(result.status).send(result.body)
})

app.listen({ port: 3000 })
```

---

### Hono

```typescript
import { Hono } from 'hono'
import { handleHTTPRequest } from 'limitless-reign-mcp'

const app = new Hono()

app.all('/mcp', async (c) => {
  const result = await handleHTTPRequest(mcp, {
    method: c.req.method,
    url: c.req.url,
    headers: Object.fromEntries(c.req.raw.headers),
    body: await c.req.json().catch(() => null),
    basePath: '/mcp'
  })
  return c.json(result.body, result.status)
})

export default app
```

---

### Koa

```typescript
import Koa from 'koa'
import Router from '@koa/router'
import bodyParser from 'koa-bodyparser'
import { handleHTTPRequest } from 'limitless-reign-mcp'

const app = new Koa()
const router = new Router()

router.all('/mcp', async (ctx) => {
  const result = await handleHTTPRequest(mcp, {
    method: ctx.method,
    url: ctx.href,
    headers: ctx.headers as Record<string, string>,
    body: ctx.request.body,
    basePath: '/mcp'
  })
  ctx.status = result.status
  ctx.body = result.body
})

app.use(bodyParser())
app.use(router.routes())
app.listen(3000)
```

---

### Bun

```typescript
import { handleHTTPRequest } from 'limitless-reign-mcp'

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url)
    if (url.pathname.startsWith('/mcp')) {
      const result = await handleHTTPRequest(mcp, {
        method: req.method,
        url: req.url,
        headers: Object.fromEntries(req.headers),
        body: await req.json().catch(() => null),
        basePath: '/mcp'
      })
      return Response.json(result.body, { status: result.status })
    }
    return new Response('Not found', { status: 404 })
  }
})
```

---

### Deno

```typescript
import { handleHTTPRequest } from 'npm:limitless-reign-mcp'

Deno.serve({ port: 3000 }, async (req) => {
  const url = new URL(req.url)
  if (url.pathname.startsWith('/mcp')) {
    const result = await handleHTTPRequest(mcp, {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers),
      body: await req.json().catch(() => null),
      basePath: '/mcp'
    })
    return Response.json(result.body, { status: result.status })
  }
  return new Response('Not found', { status: 404 })
})
```

---

### Node.js HTTP (No Framework)

```typescript
import http from 'http'
import { handleHTTPRequest } from 'limitless-reign-mcp'

http.createServer(async (req, res) => {
  let body = ''
  for await (const chunk of req) body += chunk
  
  const result = await handleHTTPRequest(mcp, {
    method: req.method!,
    url: `http://localhost:3000${req.url}`,
    headers: req.headers as Record<string, string>,
    body: body ? JSON.parse(body) : null,
    basePath: '/mcp'
  })
  
  res.writeHead(result.status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(result.body))
}).listen(3000)
```

---

## 🧩 Adding Custom & External Tools

Limitless Reign MCP is fully extensible. You can add custom tools, external HTTP REST APIs, bridge remote MCP servers, and write modular plugins using 6 different methods:

### 1. Server Configuration (`customTools` option)

Pass custom tools directly when creating your server:

```typescript
import { createMCPServer } from 'limitless-reign-mcp'

const mcp = createMCPServer({
  client,
  validateAccess: async (key) => ({ valid: true }),
  customTools: [
    {
      name: 'calculate_stats',
      description: 'Compute server analytics score',
      inputSchema: {
        type: 'object',
        properties: {
          multiplier: { type: 'number', description: 'Score multiplier' }
        },
        required: ['multiplier']
      },
      handler: async (args, { client, database }) => {
        const memberCount = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)
        return { totalMembers: memberCount, score: memberCount * args.multiplier }
      }
    }
  ]
})
```

---

### 2. Runtime Registration (`mcp.registerTool` & `mcp.registerTools`)

Register or unregister custom tools dynamically at any point:

```typescript
import { defineTool } from 'limitless-reign-mcp'

// Register a single custom tool
mcp.registerTool(
  defineTool({
    name: 'custom_send_alert',
    description: 'Send high priority alert to moderator channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string' },
        alertMessage: { type: 'string' }
      },
      required: ['channelId', 'alertMessage']
    },
    handler: async (args, { client }) => {
      const channel = await client.channels.fetch(args.channelId)
      if (channel?.isTextBased()) {
        await channel.send(`🚨 **ALERT:** ${args.alertMessage}`)
        return { success: true, delivered: true }
      }
      return { success: false, error: 'Channel is not text-based' }
    }
  })
)

// Check or unregister tools
mcp.hasTool('custom_send_alert') // true
mcp.unregisterTool('custom_send_alert')
```

---

### 3. External HTTP / REST API Tools (`createHttpTool`)

Turn any REST API endpoint or Webhook into an MCP tool with schema validation and authentication:

```typescript
import { createHttpTool } from 'limitless-reign-mcp'

const weatherTool = createHttpTool({
  name: 'get_weather_report',
  description: 'Fetch current weather for a city',
  url: (args) => `https://api.weatherapi.com/v1/current.json?q=${encodeURIComponent(args.city)}&key=YOUR_API_KEY`,
  method: 'GET',
  inputSchema: {
    type: 'object',
    properties: {
      city: { type: 'string', description: 'City name' }
    },
    required: ['city']
  },
  transformResponse: (data) => ({
    city: data.location?.name,
    temp_c: data.current?.temp_c,
    condition: data.current?.condition?.text
  })
})

mcp.registerTool(weatherTool)
```

---

### 4. Bridge & Proxy External MCP Servers (`registerExternalMCP`)

Seamlessly connect remote MCP servers (such as GitHub MCP, Database MCP, or Web Search MCP) and merge their tools into your Discord MCP catalog:

```typescript
// Proxy an external MCP server over HTTP/SSE
await mcp.registerExternalMCP({
  url: 'http://localhost:8080/mcp',
  prefix: 'ext_', // Optional prefix to avoid tool name clashes
  headers: {
    'Authorization': 'Bearer YOUR_REMOTE_TOKEN'
  },
  filterTools: (toolName) => !toolName.startsWith('dangerous_')
})
```

---

### 5. Modular Plugins (`mcp.use`)

Package and organize custom tools into reusable plugins:

```typescript
import type { DiscordMCPServer } from 'limitless-reign-mcp'

function moderationPlugin(server: DiscordMCPServer) {
  server.registerTool({
    name: 'auto_quarantine_user',
    description: 'Move user to isolated quarantine role',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string' },
        userId: { type: 'string' }
      },
      required: ['guildId', 'userId']
    },
    handler: async (args, { client }) => {
      // Your custom quarantine logic
      return { quarantined: true, userId: args.userId }
    }
  })
}

mcp.use(moderationPlugin)
```

---

### 6. CLI Dynamic Loading (`--tools`, `--plugin`, `--external-mcp`)

When using the standalone CLI, pass custom tools, plugins, or external MCP servers via command line flags or environment variables:

```bash
# Load custom tools file
npx limitless-reign --token YOUR_BOT_TOKEN --tools ./my-tools.js

# Load a plugin
npx limitless-reign --token YOUR_BOT_TOKEN --plugin ./my-plugin.js

# Proxy a remote MCP server
npx limitless-reign --token YOUR_BOT_TOKEN --external-mcp http://localhost:8000/mcp
```

---

## 🛡️ Access Control

Built-in permission system:

```typescript
validateAccess: async (apiKey, guildId) => {
  const user = await db.users.findByApiKey(apiKey)
  
  if (!user) {
    return { valid: false, error: 'Invalid API key' }
  }
  
  if (guildId && !user.hasAccessTo(guildId)) {
    return { valid: false, error: 'No access to this server' }  
  }
  
  return { valid: true, userId: user.id }
}
```

---

## 📦 What's Included

| File | Purpose |
|------|---------|
| `dist/cli.js` | CLI - `npx limitless-reign` |
| `dist/index.js` | SDK exports |
| `.claude/skills/` | Claude Code skill |
| `CLAUDE.md` | AI instructions |
| `AGENTS.md` | Agent documentation |

---

## 🔗 Links

- **GitHub:** [github.com/aayushchouhan24/limitless-reign-mcp](https://github.com/aayushchouhan24/limitless-reign-mcp)
- **npm:** [npmjs.com/package/limitless-reign-mcp](https://npmjs.com/package/limitless-reign-mcp)
- **Issues:** [Report bugs](https://github.com/aayushchouhan24/limitless-reign-mcp/issues)
- **Limitless Reign App:** [github.com/aayushchouhan24/limitless-reign-mcp](https://github.com/aayushchouhan24/limitless-reign-mcp)

---

## ⭐ Star This Repo

If this helped you, give it a star! It helps others find it.

[![Star](https://img.shields.io/github/stars/aayushchouhan24/limitless-reign?style=social)](https://github.com/aayushchouhan24/limitless-reign-mcp)

---

## 🌟 Author

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/aayushchouhan24">
        <img src="https://gravatar.com/userimage/226260988/f5429ad9b09c533449dab984eb05cdbf.jpeg?size=256" width="100px;" alt="Aayush Chouhan" style="border-radius: 50%;" />
        <br />
        <sub><b>Aayush Chouhan</b></sub>
      </a>
      <br />
      <a href="https://www.instagram.com/aayushchouhan_24/" title="Instagram"><img src="https://img.shields.io/badge/-Instagram-E4405F?style=flat-square&logo=instagram&logoColor=white" /></a>
      <a href="https://www.linkedin.com/in/aayushchouhan24/" title="LinkedIn"><img src="https://img.shields.io/badge/-LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white" /></a>
      <a href="https://github.com/aayushchouhan24" title="GitHub"><img src="https://img.shields.io/badge/-GitHub-181717?style=flat-square&logo=github&logoColor=white" /></a>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [Aayush Chouhan](https://github.com/aayushchouhan24)

---

<p align="center">
  Built with ❤️ using
  <a href="https://discord.js.org/">Discord.js</a> •
  <a href="https://nodejs.org/">Node.js</a> •
  <a href="https://www.typescriptlang.org/">TypeScript</a>
</p>

<!-- SEO: discord mcp, discord ai bot, discord chatgpt, discord claude, ai discord server management, discord bot ai control, model context protocol discord, discord.js mcp server, discord automation ai, chatgpt discord plugin, claude discord integration, discord api ai tools, limitless reign, discord mcp server, ai powered discord bot -->
