# limitless-reign-mcp

### Discord MCP Server SDK - Connect AI to Discord with 100+ Tools

<p align="center">
  <img src="https://img.shields.io/npm/v/limitless-reign-mcp?style=for-the-badge&color=blue" alt="npm version" />
  <img src="https://img.shields.io/npm/dm/limitless-reign-mcp?style=for-the-badge&color=green" alt="npm downloads" />
  <img src="https://img.shields.io/github/stars/AayushChouhan/limitless-reign-mcp?style=for-the-badge&color=yellow" alt="github stars" />
  <img src="https://img.shields.io/github/license/AayushChouhan/limitless-reign-mcp?style=for-the-badge" alt="license" />
</p>

<p align="center">
  <b>The easiest way to let AI control your Discord bot</b><br>
  Works with Claude, ChatGPT, Cursor, Windsurf, and any MCP-compatible AI
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#connecting-ai-clients">Connect AI</a> •
  <a href="#complete-tool-reference">100+ Tools</a> •
  <a href="https://github.com/AayushChouhan/limitless-reign-mcp/issues">Get Help</a>
</p>

---

## Why limitless-reign-mcp?

> **"Let AI manage your Discord server"**

Turn your Discord.js bot into an MCP (Model Context Protocol) server in 5 minutes. Then connect Claude, ChatGPT, or any AI to control it with natural language.

```
You: "Create a welcome channel and set up auto-moderation"
AI:  ✓ Created #welcome channel
     ✓ Added welcome message embed
     ✓ Created automod rule for spam
     ✓ Created automod rule for bad words
```

**No complex setup. No manual API calls. Just AI + Discord.**

---

## Features

| Feature | Description |
|---------|-------------|
| **116 Discord Tools** | Full Discord.js v14 API - channels, messages, members, roles, emojis, webhooks, automod, events, commands |
| **Works with Any AI** | Claude Desktop, ChatGPT, Cursor, Windsurf, GPT Actions, any MCP client |
| **Multiple Transports** | HTTP, SSE, JSON-RPC - connect however you want |
| **5 Minute Setup** | npm install → configure → connect AI → done |
| **Access Control** | Built-in per-user guild permissions |
| **Framework Support** | Express, Next.js, or any Node.js server |
| **TypeScript** | Full type definitions included |
| **Open Source** | MIT License - use it however you want |

---

## Quick Start

### 1. Install

```bash
npm install limitless-reign-mcp discord.js
```

### 2. Create MCP Server

```typescript
import { Client, GatewayIntentBits } from 'discord.js'
import { createMCPServer, expressMiddleware } from 'limitless-reign-mcp'
import express from 'express'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers]
})

const mcp = createMCPServer({
  client,
  validateAccess: async (apiKey, guildId) => {
    // Your auth logic - check if API key is valid
    if (apiKey === 'my-secret-key') {
      return { valid: true, userId: 'user123' }
    }
    return { valid: false, error: 'Invalid API key' }
  }
})

const app = express()
app.use(express.json())
app.use('/mcp', expressMiddleware(mcp))

client.login(process.env.DISCORD_TOKEN)
app.listen(3000, () => console.log('MCP Server ready at http://localhost:3000/mcp'))
```

### 3. Connect AI

**Claude Desktop** - Edit `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "discord": {
      "url": "http://localhost:3000/mcp",
      "headers": { "Authorization": "Bearer my-secret-key" }
    }
  }
}
```

**ChatGPT** - Use the SSE endpoint:
```
http://localhost:3000/mcp/sse?api_key=my-secret-key
```

**That's it!** Now ask AI to manage your Discord server.

---

## What Can AI Do?

With 116 tools, AI can do almost anything on Discord:

### Messages & Content
```
"Send an announcement to #general"
"Create a poll asking what game to play"
"Delete the last 50 messages in #spam"
"Pin the rules message"
```

### Server Management
```
"Create a gaming category with voice channels"
"Set up roles for moderators and members"
"Configure auto-moderation for spam"
"Create a welcome message with embed"
```

### Member Management
```
"List all members with the Admin role"
"Timeout user123 for 10 minutes"
"Give the VIP role to active members"
"Kick inactive bots"
```

### Advanced
```
"Set up a ticket system with buttons"
"Create slash commands for the server"
"Schedule an event for Friday"
"Execute custom API call to Discord"
```

---

## Connecting AI Clients

### Claude Desktop / Claude Code

Edit config file:
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "discord": {
      "url": "https://your-server.com/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_API_KEY"
      }
    }
  }
}
```

### ChatGPT Web (Plugin)

1. Settings → Security → Enable Developer Mode
2. Go to chatgpt.com/plugins
3. Click + → Add plugin
4. URL: `https://your-server.com/mcp/sse?api_key=YOUR_KEY`

### ChatGPT Desktop

Settings → Integrations → Add MCP Server:
- Type: `Streamable HTTP`
- URL: `https://your-server.com/mcp`
- Header: `Authorization: Bearer YOUR_KEY`

### Cursor / Windsurf

Settings → Features → MCP → Add Server:
- URL: `https://your-server.com/mcp`
- Auth Header: `Authorization: Bearer YOUR_KEY`

### GPT Actions (Custom GPT)

1. Get schema: `GET https://your-server.com/mcp?format=openapi`
2. Create GPT → Configure → Actions → Paste schema
3. Set Bearer auth with your API key

---

## Configuration

```typescript
const mcp = createMCPServer({
  // Required: Your Discord.js client
  client: discordClient,

  // Required: Validate API keys and guild access
  validateAccess: async (apiKey, guildId) => {
    const user = await db.findUser(apiKey)
    if (!user) return { valid: false, error: 'Invalid key' }
    if (guildId && !user.canAccess(guildId)) {
      return { valid: false, error: 'No access to this server' }
    }
    return { valid: true, userId: user.id }
  },

  // Optional: Return guilds user can access (for discord_list_guilds)
  getAllowedGuilds: async (apiKey) => {
    const user = await db.findUser(apiKey)
    return user.guilds.map(g => ({
      id: g.id,
      name: g.name,
      icon: g.iconURL
    }))
  },

  // Optional: Log all tool calls
  onToolCall: (tool, args, result, apiKey) => {
    console.log(`${tool}: ${result.success ? 'OK' : 'FAIL'}`)
  },

  // Optional: Customize server info
  serverName: 'My Discord AI',
  serverVersion: '1.0.0'
})
```

---

## Complete Tool Reference

### API Access (1 tool)
| Tool | Description |
|------|-------------|
| `get_allowed_guilds` | List servers you have access to |

### Bot Status (5 tools)
| Tool | Description |
|------|-------------|
| `discord_get_bot_info` | Bot info, guilds count, uptime |
| `discord_get_gateway_info` | Connection status, latency |
| `discord_set_presence` | Set online/idle/dnd/invisible |
| `discord_set_activity` | Set playing/streaming/listening status |
| `discord_disconnect` | Disconnect bot |

### Guild Management (16 tools)
| Tool | Description |
|------|-------------|
| `discord_list_guilds` | List your accessible servers |
| `discord_get_guild` | Full server info |
| `discord_edit_guild` | Edit server settings |
| `discord_get_guild_channels` | List all channels |
| `discord_get_guild_roles` | List all roles |
| `discord_get_guild_emojis` | List custom emojis |
| `discord_get_guild_stickers` | List stickers |
| `discord_get_guild_invites` | List invites |
| `discord_get_guild_webhooks` | List webhooks |
| `discord_get_guild_bans` | List bans |
| `discord_get_audit_log` | Get audit log |
| `discord_get_vanity_url` | Get vanity URL |
| `discord_leave_guild` | Leave server |
| `discord_apply_template` | Apply server template |

### Channel Operations (7 tools)
| Tool | Description |
|------|-------------|
| `discord_create_channel` | Create text/voice/category/forum/stage |
| `discord_edit_channel` | Edit channel settings |
| `discord_delete_channel` | Delete channel |
| `discord_clone_channel` | Clone with settings |
| `discord_set_channel_permissions` | Set permissions |
| `discord_create_invite` | Create invite |

### Thread Management (5 tools)
| Tool | Description |
|------|-------------|
| `discord_create_thread` | Create thread |
| `discord_create_forum_post` | Create forum post |
| `discord_edit_thread` | Edit thread |
| `discord_delete_thread` | Delete thread |
| `discord_get_active_threads` | List active threads |

### Message Operations (14 tools)
| Tool | Description |
|------|-------------|
| `discord_send_message` | Send message with embeds/buttons |
| `discord_send_embed` | Send rich embed |
| `discord_send_components_v2` | Send Components V2 |
| `discord_edit_message` | Edit message |
| `discord_delete_message` | Delete message |
| `discord_bulk_delete_messages` | Bulk delete (2-100) |
| `discord_get_messages` | Fetch messages |
| `discord_pin_message` | Pin message |
| `discord_unpin_message` | Unpin message |
| `discord_add_reaction` | Add reaction |
| `discord_remove_reaction` | Remove reaction |
| `discord_create_poll` | Create poll |

### Member Management (16 tools)
| Tool | Description |
|------|-------------|
| `discord_get_member` | Get member info |
| `discord_search_members` | Search by username |
| `discord_list_members` | List members |
| `discord_kick_member` | Kick member |
| `discord_ban_member` | Ban member |
| `discord_unban_member` | Unban user |
| `discord_timeout_member` | Timeout (mute) |
| `discord_remove_timeout` | Remove timeout |
| `discord_add_role` | Add role |
| `discord_remove_role` | Remove role |
| `discord_set_nickname` | Set nickname |
| `discord_move_member_voice` | Move to voice channel |
| `discord_disconnect_member` | Disconnect from voice |
| `discord_server_mute_member` | Server mute |
| `discord_server_deafen_member` | Server deafen |

### Role Management (4 tools)
| Tool | Description |
|------|-------------|
| `discord_create_role` | Create role |
| `discord_edit_role` | Edit role |
| `discord_delete_role` | Delete role |
| `discord_list_permissions` | List permission names |

### Emoji & Stickers (6 tools)
| Tool | Description |
|------|-------------|
| `discord_create_emoji` | Create emoji |
| `discord_delete_emoji` | Delete emoji |
| `discord_create_sticker` | Create sticker |
| `discord_delete_sticker` | Delete sticker |
| `discord_search_emojigg` | Search emoji.gg |
| `discord_add_emojigg` | Add from emoji.gg |

### Webhooks (3 tools)
| Tool | Description |
|------|-------------|
| `discord_create_webhook` | Create webhook |
| `discord_delete_webhook` | Delete webhook |
| `discord_execute_webhook` | Send via webhook |

### Auto Moderation (3 tools)
| Tool | Description |
|------|-------------|
| `discord_get_automod_rules` | List rules |
| `discord_create_automod_rule` | Create rule |
| `discord_delete_automod_rule` | Delete rule |

### Scheduled Events (3 tools)
| Tool | Description |
|------|-------------|
| `discord_create_scheduled_event` | Create event |
| `discord_get_scheduled_events` | List events |
| `discord_delete_scheduled_event` | Delete event |

### Slash Commands (6 tools)
| Tool | Description |
|------|-------------|
| `discord_create_global_command` | Create global command |
| `discord_create_guild_command` | Create guild command |
| `discord_delete_global_command` | Delete global command |
| `discord_delete_guild_command` | Delete guild command |
| `discord_get_global_commands` | List global commands |
| `discord_get_guild_commands` | List guild commands |

### Interactions (4 tools)
| Tool | Description |
|------|-------------|
| `discord_register_button_handler` | Handle button clicks |
| `discord_register_select_handler` | Handle select menus |
| `discord_unregister_handler` | Remove handler |
| `discord_list_handlers` | List handlers |

### Raw API (1 tool)
| Tool | Description |
|------|-------------|
| `discord_api_call` | Direct Discord API call |

### Database (7 tools) - Requires handlers
| Tool | Description |
|------|-------------|
| `discord_get_logs` | Get action logs |
| `discord_get_guild_config` | Get config |
| `discord_set_guild_config` | Set config |
| `discord_get_db_stats` | Database stats |
| `discord_create_scheduled_task` | Create task |
| `discord_list_scheduled_tasks` | List tasks |
| `discord_cancel_scheduled_task` | Cancel task |

---

## Framework Examples

### Express
```typescript
import express from 'express'
import { createMCPServer, expressMiddleware } from 'limitless-reign-mcp'

const app = express()
app.use(express.json())
app.use('/mcp', expressMiddleware(mcp))
app.listen(3000)
```

### Next.js App Router
```typescript
// app/api/mcp/route.ts
import { createMCPServer, nextjsHandlers } from 'limitless-reign-mcp'

const mcp = createMCPServer({ client, validateAccess })
export const { GET, POST, OPTIONS } = nextjsHandlers(mcp)

// app/api/mcp/sse/route.ts
import { nextjsSSEHandlers } from 'limitless-reign-mcp'
export const { GET, POST, OPTIONS } = nextjsSSEHandlers(mcp)
```

---

## Use Cases

- **AI Discord Moderation** - Let AI handle spam, raids, and rule violations
- **Server Setup Automation** - "Set up my gaming server with channels and roles"
- **Community Management** - AI-powered welcomes, announcements, events
- **Developer Tools** - Create bots, test APIs, automate tasks
- **Support Systems** - AI ticket handling with Discord integration

---

## Related Projects

- **[Limitless Reign](https://github.com/AayushChouhan/limitless-reign)** - Full SaaS platform using this SDK
- **[MCP Protocol](https://modelcontextprotocol.io)** - The protocol specification
- **[discord.js](https://discord.js.org)** - The Discord library we build on

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

```bash
git clone https://github.com/AayushChouhan/limitless-reign-mcp.git
cd limitless-reign-mcp
npm install
npm run dev
```

---

## License

MIT License - see [LICENSE](LICENSE)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/AayushChouhan/limitless-reign-mcp/issues)
- **Discussions:** [GitHub Discussions](https://github.com/AayushChouhan/limitless-reign-mcp/discussions)

---

<p align="center">
  <b>If this helped you, give it a ⭐ on GitHub!</b><br>
  <a href="https://github.com/AayushChouhan/limitless-reign-mcp">github.com/AayushChouhan/limitless-reign-mcp</a>
</p>

---

**Keywords:** discord mcp, discord ai, discord bot ai, claude discord, chatgpt discord, discord model context protocol, ai discord server, discord automation, discord.js mcp, discord api ai, limitless reign
