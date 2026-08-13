# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-13

### Added

- Initial release
- **CLI Tool** - Run with `npx limitless-reign-mcp --token YOUR_TOKEN`
- 95 Discord tool handlers covering full Discord.js v14 API
- 116 MCP tool definitions with complete schemas
- HTTP POST endpoint for JSON-RPC and GPT Actions
- SSE endpoint for ChatGPT Web plugins
- Auto-generated OpenAPI schema for GPT Actions
- Express middleware with flexible path mounting
- Next.js App Router handlers
- Generic HTTP request handler for any framework
- Session management for SSE connections
- Optional database handlers for persistence features
- Full CORS support
- Customizable server name, version, and description
- `getAllowedGuilds` callback for access control
- `get_allowed_guilds` tool to list accessible servers
- `discord_list_guilds` respects user access permissions

### Tool Categories

- **API Access** (1 tool): get_allowed_guilds
- **Bot Status** (5 tools): get_bot_info, get_gateway_info, set_presence, set_activity, disconnect
- **Guild Management** (16 tools): list_guilds, get_guild, edit_guild, channels, roles, emojis, etc.
- **Channel Operations** (7 tools): create, edit, delete, clone, permissions, invites
- **Thread Management** (5 tools): create_thread, forum_post, edit, delete, active_threads
- **Message Operations** (14 tools): send, embed, components, edit, delete, bulk, reactions, polls
- **Member Management** (16 tools): get, search, kick, ban, timeout, roles, voice operations
- **Role Management** (4 tools): create, edit, delete, list_permissions
- **Emoji & Stickers** (6 tools): create, delete, emoji.gg integration
- **Webhooks** (3 tools): create, delete, execute
- **Auto Moderation** (3 tools): get_rules, create_rule, delete_rule
- **Scheduled Events** (3 tools): create, delete, get_events
- **Slash Commands** (6 tools): global and guild commands
- **Interactions** (4 tools): button and select handlers
- **Raw API** (1 tool): direct Discord API calls
- **Database** (7 tools): configs, tasks, logs (requires database handlers)

### Supported Clients

- Claude Desktop
- Claude Web (Teams)
- Claude Code
- Cursor
- Windsurf
- ChatGPT Web (Plugins)
- ChatGPT Desktop (MCP)
- GPT Actions (Custom GPTs)
- Any MCP-compatible client
