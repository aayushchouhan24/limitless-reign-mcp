# Limitless Reign MCP

## AI-Powered Discord Bot Control | 100+ Tools | Works with Claude, ChatGPT, Cursor

<p align="center">
  <img src="https://img.shields.io/npm/v/limitless-reign-mcp?style=for-the-badge&color=5865F2" alt="npm" />
  <img src="https://img.shields.io/npm/dm/limitless-reign-mcp?style=for-the-badge&color=57F287" alt="downloads" />
  <img src="https://img.shields.io/github/stars/aayushchouhan2424/limitless-reign-mcp?style=for-the-badge&color=FEE75C" alt="stars" />
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
npx limitless-reign-mcp --token YOUR_BOT_TOKEN
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
Then type `/limitless-reign-mcp` in Claude Code.

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

For custom integrations:

```typescript
import { Client, GatewayIntentBits } from 'discord.js'
import { createMCPServer, expressMiddleware } from 'limitless-reign-mcp'
import express from 'express'

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
    // Return user's accessible guilds
    return [{ id: '123', name: 'My Server', icon: null }]
  }
})

const app = express()
app.use(express.json())
app.use('/mcp', expressMiddleware(mcp))

client.login(process.env.DISCORD_TOKEN)
app.listen(3000)
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
| `dist/cli.js` | CLI - `npx limitless-reign-mcp` |
| `dist/index.js` | SDK exports |
| `.claude/skills/` | Claude Code skill |
| `CLAUDE.md` | AI instructions |
| `AGENTS.md` | Agent documentation |

---

## 🔗 Links

- **GitHub:** [github.com/aayushchouhan24/limitless-reign-mcp](https://github.com/aayushchouhan24/limitless-reign-mcp)
- **npm:** [npmjs.com/package/limitless-reign-mcp](https://npmjs.com/package/limitless-reign-mcp)
- **Issues:** [Report bugs](https://github.com/aayushchouhan24/limitless-reign-mcp/issues)
- **Limitless Reign App:** [github.com/aayushchouhan24/limitless-reign](https://github.com/aayushchouhan24/limitless-reign)

---

## ⭐ Star This Repo

If this helped you, give it a star! It helps others find it.

[![Star](https://img.shields.io/github/stars/aayushchouhan24/limitless-reign-mcp?style=social)](https://github.com/aayushchouhan24/limitless-reign-mcp)

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
