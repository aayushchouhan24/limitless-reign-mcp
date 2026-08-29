# Limitless Reign MCP

## AI-Powered Discord Bot Control | 280+ Tools | Works with Claude, ChatGPT, Cursor

<p align="center">
  <img src="https://img.shields.io/npm/v/limitless-reign-mcp?style=for-the-badge&color=5865F2" alt="npm" />
  <img src="https://img.shields.io/npm/dm/limitless-reign-mcp?style=for-the-badge&color=57F287" alt="downloads" />
  <img src="https://img.shields.io/github/stars/aayushchouhan24/limitless-reign-mcp?style=for-the-badge&color=FEE75C" alt="stars" />
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

## 📋 All 283 Tools

<details>
<summary><strong>Bot & Gateway Connection (5)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_bot_info` | Bot user details, guild count, uptime, and ready status |
| `discord_get_gateway_info` | Gateway ping, connection status, shard count |
| `discord_set_presence` | Online/idle/dnd/invisible status |
| `discord_set_activity` | Playing/streaming/listening/watching/custom activity |
| `discord_disconnect` | Gracefully disconnect bot from gateway |

</details>

<details>
<summary><strong>Direct Messages / DMs (4)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_send_dm` | Send a private DM to a user |
| `discord_edit_dm` | Edit a private DM |
| `discord_delete_dm` | Delete a private DM |
| `discord_get_dms` | Read DM message history with user |

</details>

<details>
<summary><strong>Servers & Community (33)</strong></summary>

| Tool | Description |
|------|-------------|
| `get_allowed_guilds` | List your authorized servers |
| `discord_list_guilds` | List accessible servers |
| `discord_get_guild` | Server details & features |
| `discord_edit_guild` | Edit server settings & icons |
| `discord_get_server_stats` | Comprehensive stats (humans, bots, voice active, channels, boost tier) |
| `discord_get_guild_preview` | Get public preview of discoverable server |
| `discord_get_guild_regions` | List voice RTC regions |
| `discord_get_guild_active_threads` | List all active threads across server |
| `discord_edit_vanity_url` | Modify vanity invite code |
| `discord_get_guild_incidents` | Get raid alerts & incident state |
| `discord_edit_guild_incidents` | Configure raid alerts & disable invites/DMs |
| `discord_get_member_safety_settings` | Get verification & safety requirements |
| `discord_get_mfa_level` | Get server 2FA/MFA moderation level |
| `discord_get_guild_nsfw_level` | Get server NSFW classification |
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
| `discord_apply_template` | Apply predefined template |
| `discord_get_guild_prune_count` | Preview inactive member prune count |
| `discord_begin_guild_prune` | Prune inactive members |
| `discord_get_guild_widget` | Get server widget embed & settings |
| `discord_edit_guild_widget` | Enable/disable widget & channel |
| `discord_get_guild_welcome_screen` | Community welcome screen info |
| `discord_edit_guild_welcome_screen` | Edit welcome screen & channels |
| `discord_get_guild_onboarding` | Get community onboarding flow |
| `discord_edit_guild_onboarding` | Edit onboarding questions & default channels |
| `discord_get_guild_integrations` | List Twitch/YouTube/bot integrations |
| `discord_delete_guild_integration` | Delete server integration |

</details>

<details>
<summary><strong>Native Discord Server Templates (7)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_template` | Get native template by code |
| `discord_list_guild_templates` | List server's native templates |
| `discord_create_guild_template` | Create template from server |
| `discord_sync_guild_template` | Sync template with server layout |
| `discord_edit_guild_template` | Edit template name & description |
| `discord_delete_guild_template` | Delete server template |
| `discord_create_guild_from_template` | Create new guild from template |

</details>

<details>
<summary><strong>Channels, Voice & Stage (22)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_channel` | Create any channel type |
| `discord_edit_channel` | Edit settings |
| `discord_delete_channel` | Delete channel |
| `discord_clone_channel` | Clone with settings |
| `discord_find_channel` | Find channel by name & type |
| `discord_get_channel_info` | Get channel details |
| `discord_move_channel` | Move channel to category/position |
| `discord_lock_channel` | Lock channel to prevent member messages |
| `discord_unlock_channel` | Unlock a locked channel |
| `discord_set_slowmode` | Set or remove channel slowmode delay |
| `discord_set_channel_topic` | Update channel topic |
| `discord_modify_channel_positions` | Reorder multiple channels |
| `discord_sync_channel_permissions` | Sync permissions with parent category |
| `discord_create_voice_channel` | Create voice channel |
| `discord_create_stage_channel` | Create stage channel |
| `discord_edit_voice_channel` | Edit voice/stage settings |
| `discord_get_voice_channel_members` | List connected members in voice channel with audio/video status |
| `discord_get_guild_voice_states` | Snapshot of all active voice channels & users in server |
| `discord_set_channel_permissions` | Set permissions overwrite |
| `discord_list_channel_permissions` | List channel overwrites |
| `discord_delete_channel_permissions` | Delete channel overwrite |
| `discord_create_invite` | Create invite link |
| `discord_delete_invite` | Revoke invite link |
| `discord_get_invite_details` | Get invite details & stats |

</details>

<details>
<summary><strong>Categories (5)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_category` | Create new category |
| `discord_edit_category` | Edit category name/position |
| `discord_delete_category` | Delete category |
| `discord_find_category` | Find category by name |
| `discord_list_channels_in_category` | List category's channels |

</details>

<details>
<summary><strong>Forums & Threads (24)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_forum_channel` | Create forum channel |
| `discord_edit_forum_channel` | Edit forum settings/tags |
| `discord_list_forum_channels` | List forum channels |
| `discord_get_forum_channel_info` | Forum settings & tags |
| `discord_list_forum_tags` | List available tags |
| `discord_list_forum_posts` | List active posts |
| `discord_create_forum_post` | Create forum post |
| `discord_modify_forum_post` | Edit tags, pin/unpin, lock, archive forum post |
| `discord_create_thread` | Create thread |
| `discord_get_thread` | Get full thread metadata & counts |
| `discord_edit_thread` | Edit thread |
| `discord_delete_thread` | Delete thread |
| `discord_lock_thread` | Lock thread to prevent new replies |
| `discord_unlock_thread` | Unlock thread |
| `discord_archive_thread` | Archive thread |
| `discord_unarchive_thread` | Unarchive thread |
| `discord_get_active_threads` | List active threads |
| `discord_list_archived_public_threads` | List public archived threads |
| `discord_list_archived_private_threads` | List private archived threads |
| `discord_list_joined_private_threads` | List joined private archived threads |
| `discord_join_thread` | Bot joins thread |
| `discord_leave_thread` | Bot leaves thread |
| `discord_add_thread_member` | Add user to thread |
| `discord_remove_thread_member` | Remove user from thread |
| `discord_get_thread_member` | Get user thread membership |
| `discord_list_thread_members` | List all thread members |

</details>

<details>
<summary><strong>Messages (29)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_send_message` | Send with embeds/buttons |
| `discord_send_embed` | Rich embed |
| `discord_send_components_v2` | Components V2 |
| `discord_get_message` | Fetch single message |
| `discord_reply_to_message` | Referenced inline reply |
| `discord_send_typing` | Trigger typing indicator |
| `discord_send_attachment` | Upload files with message |
| `discord_download_attachment` | Retrieve file attachment metadata & URL |
| `discord_forward_message` | Forward message using snapshots |
| `discord_edit_message` | Edit message |
| `discord_delete_message` | Delete message |
| `discord_bulk_delete_messages` | Bulk delete |
| `discord_get_messages` | Fetch messages |
| `discord_search_messages` | Search messages across channel or server with keyword & author filters |
| `discord_get_user_messages` | Fetch last 100-500 messages sent by a specific user across channels |
| `discord_export_channel_transcript` | Export full message transcript from channel |
| `discord_crosspost_message` | Publish announcement message to follower channels |
| `discord_create_announcement_follower` | Follow announcement channel to auto-receive posts |
| `discord_get_pinned_messages` | Get all pinned messages in channel |
| `discord_pin_message` | Pin message |
| `discord_unpin_message` | Unpin message |
| `discord_get_reactions` | Get users who reacted with emoji |
| `discord_add_reaction` | Add reaction |
| `discord_remove_reaction` | Remove reaction |
| `discord_clear_reaction_emoji` | Clear all reactions for emoji |
| `discord_clear_all_reactions` | Remove every reaction from message |
| `discord_create_poll` | Create poll |
| `discord_end_poll` | Immediately expire active poll |
| `discord_get_poll_voters` | List voters for poll answer |

</details>

<details>
<summary><strong>Users & Members (27)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_user` | Fetch global Discord user profile, avatar, banner |
| `discord_get_user_profile` | Full profile: bio, custom status, rich presence games/Spotify, desktop/mobile status |
| `discord_edit_bot_profile` | Edit bot username or avatar globally |
| `discord_get_current_member` | Get bot's server member & permissions |
| `discord_edit_current_member` | Change bot server nickname |
| `discord_get_member` | Member info |
| `discord_search_members` | Search members |
| `discord_list_members` | List members |
| `discord_get_user_id_by_name` | Get user ID for `<@id>` ping |
| `discord_get_member_roles` | Get expanded role list for member |
| `discord_list_role_members` | Find all members holding a role |
| `discord_get_member_avatar` | Resolve server-specific avatar/banner |
| `discord_get_member_permissions_in_channel` | Calculate channel effective permissions |
| `discord_kick_member` | Kick |
| `discord_ban_member` | Ban |
| `discord_bulk_ban_members` | Native bulk ban multiple users |
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
| `discord_modify_voice_state` | Mute/deafen/suppress in voice |

</details>

<details>
<summary><strong>Roles & Permissions (12)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_role` | Create role |
| `discord_get_role` | Get detailed role settings, permissions, icon |
| `discord_edit_role` | Edit role |
| `discord_delete_role` | Delete role |
| `discord_modify_single_role_position` | Set single role position |
| `discord_modify_role_positions` | Reorder role hierarchy |
| `discord_get_role_members` | List members holding role |
| `discord_get_default_everyone_role` | Get @everyone role & permissions |
| `discord_set_role_icon` | Set role icon image |
| `discord_set_role_unicode_emoji` | Set role emoji |
| `discord_get_member_permissions` | Compute effective member permissions |
| `discord_list_permissions` | List permissions |

</details>

<details>
<summary><strong>Emojis & Stickers (10)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_emoji` | Create emoji |
| `discord_get_emoji_details` | Emoji details & author |
| `discord_edit_emoji` | Rename or role-restrict emoji |
| `discord_delete_emoji` | Delete emoji |
| `discord_create_sticker` | Create sticker |
| `discord_get_sticker` | Get sticker details |
| `discord_edit_sticker` | Edit sticker name/description/tags |
| `discord_delete_sticker` | Delete sticker |
| `discord_search_emojigg` | Search emoji.gg |
| `discord_add_emojigg` | Add from emoji.gg |

</details>

<details>
<summary><strong>Webhooks (13)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_webhook` | Create webhook |
| `discord_get_webhook` | Get webhook details by ID |
| `discord_get_channel_webhooks` | List all webhooks in channel |
| `discord_edit_webhook` | Edit webhook name, avatar, or channel |
| `discord_delete_webhook` | Delete webhook |
| `discord_execute_webhook` | Send via webhook |
| `discord_execute_webhook_wait` | Send webhook message & return created object |
| `discord_execute_webhook_in_thread` | Send into thread or create forum post |
| `discord_execute_webhook_slack` | Send Slack-compatible webhook payload |
| `discord_execute_webhook_github` | Send GitHub-compatible webhook payload |
| `discord_get_webhook_message` | Fetch webhook message |
| `discord_edit_webhook_message` | Edit webhook message |
| `discord_delete_webhook_message` | Delete webhook message |

</details>

<details>
<summary><strong>AutoMod (5)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_automod_rules` | List rules |
| `discord_get_automod_rule` | Get single rule details |
| `discord_create_automod_rule` | Create rule |
| `discord_edit_automod_rule` | Edit rule & filters |
| `discord_delete_automod_rule` | Delete rule |

</details>

<details>
<summary><strong>Stage Instances (4)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_get_stage_instance` | Get active stage instance details |
| `discord_create_stage_instance` | Start/open a stage instance with topic |
| `discord_edit_stage_instance` | Edit active stage topic/privacy |
| `discord_delete_stage_instance` | Close/end a stage instance |

</details>

<details>
<summary><strong>Soundboard (7)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_list_soundboard_sounds` | List custom soundboard sounds |
| `discord_get_soundboard_sound` | Get soundboard sound details |
| `discord_create_soundboard_sound` | Upload custom soundboard audio |
| `discord_edit_soundboard_sound` | Edit sound name/volume/emoji |
| `discord_delete_soundboard_sound` | Delete soundboard sound |
| `discord_send_soundboard_sound` | Play soundboard audio in voice channel |
| `discord_list_default_soundboard_sounds` | List Discord default soundboard sounds |

</details>

<details>
<summary><strong>Scheduled Events (6)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_scheduled_event` | Create event |
| `discord_get_scheduled_event` | Fetch event details & interested user count |
| `discord_edit_scheduled_event` | Edit event & status |
| `discord_get_scheduled_events` | List events |
| `discord_get_scheduled_event_users` | List interested users |
| `discord_delete_scheduled_event` | Delete event |

</details>

<details>
<summary><strong>Slash Commands (15)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_create_global_command` | Create global command |
| `discord_get_global_command` | Fetch single global command |
| `discord_get_global_commands` | List global commands |
| `discord_edit_global_command` | Edit global command |
| `discord_delete_global_command` | Delete global command |
| `discord_bulk_overwrite_global_commands` | Bulk overwrite all global commands |
| `discord_create_guild_command` | Create guild command |
| `discord_get_guild_command` | Fetch single guild command |
| `discord_get_guild_commands` | List guild commands |
| `discord_edit_guild_command` | Edit guild command |
| `discord_delete_guild_command` | Delete guild command |
| `discord_bulk_overwrite_guild_commands` | Bulk overwrite all guild commands |
| `discord_get_command_permissions` | Get command permissions |
| `discord_edit_command_permissions` | Set command permissions |
| `discord_batch_edit_command_permissions` | Batch edit permissions for commands |

</details>

<details>
<summary><strong>Interactions & Activities (11)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_reply_interaction` | Reply to interaction |
| `discord_defer_interaction` | Defer interaction ("thinking...") |
| `discord_edit_interaction_reply` | Edit initial interaction reply |
| `discord_delete_interaction_reply` | Delete initial interaction reply |
| `discord_send_interaction_followup` | Send interaction follow-up |
| `discord_get_interaction_followup` | Fetch interaction follow-up |
| `discord_edit_interaction_followup` | Edit interaction follow-up |
| `discord_delete_interaction_followup` | Delete interaction follow-up |
| `discord_reply_autocomplete` | Respond to autocomplete suggestions |
| `discord_show_modal` | Open modal popup |
| `discord_launch_activity` | Create activity link in voice channel |

</details>

<details>
<summary><strong>Gateway Event Subscriptions & Automations (12)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_subscribe_events` | Subscribe to gateway events |
| `discord_unsubscribe_events` | Unsubscribe from gateway events |
| `discord_list_event_subscriptions` | List active event subscriptions |
| `discord_wait_for_event` | Wait/poll until specific event occurs |
| `discord_get_recent_events` | Query recent events buffer with filters |
| `discord_register_message_handler` | Automated message handler |
| `discord_register_reaction_handler` | Automated reaction handler |
| `discord_register_member_handler` | Automated member join/leave handler |
| `discord_register_voice_handler` | Automated voice state handler |
| `discord_register_thread_handler` | Automated thread handler |
| `discord_register_interaction_handler` | Automated interaction handler |
| `discord_unregister_handler` | Remove automated handler |

</details>

<details>
<summary><strong>Live Voice Connection & Audio (11)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_join_voice_channel` | Connect bot to voice/stage channel |
| `discord_leave_voice_channel` | Disconnect bot from voice |
| `discord_get_bot_voice_state` | Get bot voice state & audio playback info |
| `discord_play_audio` | Stream audio into voice channel |
| `discord_pause_audio` | Pause audio playback |
| `discord_resume_audio` | Resume audio playback |
| `discord_stop_audio` | Stop audio & clear queue |
| `discord_set_audio_volume` | Set audio volume (0-200%) |
| `discord_play_audio_url` | Stream audio from direct URL |
| `discord_play_local_audio` | Play local audio file from disk |
| `discord_speak_tts` | Speak text-to-speech in voice channel |

</details>

<details>
<summary><strong>Database & Scheduled Tasks (8)</strong></summary>

| Tool | Description |
|------|-------------|
| `db_query` | SQL query on local SQLite |
| `db_execute` | Execute SQL statement |
| `db_list_tables` | List tables in DB |
| `db_get_schema` | Get table schema |
| `discord_get_logs` | Query action logs |
| `discord_get_guild_config` | Get guild config |
| `discord_set_guild_config` | Update guild config |
| `discord_get_db_stats` | Database stats |
| `schedule_task` | Schedule cron task |
| `list_scheduled_tasks` | List scheduled tasks |
| `cancel_scheduled_task` | Cancel scheduled task |

</details>

</details>

<details>
<summary><strong>High-Leverage Power Primitives (7)</strong></summary>

| Tool | Description |
|------|-------------|
| `discord_resolve` | Universal parser for URLs, mentions (`<#id>`, `<@id>`, `<@&id>`), IDs, and names into Discord entities |
| `discord_permission_check` | Preflight check for bot permissions & role hierarchy before executing destructive actions |
| `discord_batch` | Execute multiple independent MCP tool calls concurrently with per-operation results |
| `discord_get_api_capabilities` | Inspect active Gateway intents, privileged flags, voice readiness, and REST API version |
| `discord_asset_to_data_uri` | Convert web URLs or local images into Discord base64 Data URIs for emojis/stickers/icons |
| `discord_add_guild_member` | Add OAuth2-authorized user to a server using their OAuth access token |
| `discord_api_call` | Raw Discord REST API call (`GET`, `POST`, `PATCH`, `PUT`, `DELETE`) with query params & audit log reason |

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
