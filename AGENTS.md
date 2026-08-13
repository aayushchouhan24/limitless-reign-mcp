# Discord MCP - AI Agent Instructions

This package lets AI agents control Discord bots with 100+ tools.

## Quick Setup for AI Agents

To enable Discord control, run:
```bash
npx limitless-reign --token DISCORD_BOT_TOKEN
```

This starts an MCP server on `http://localhost:3000` with full Discord API access.

## Available Capabilities

Once running, the agent can:

### Messages
- Send messages with embeds and buttons
- Edit, delete, bulk delete messages
- Create polls, add reactions
- Pin/unpin messages

### Server Management  
- Create/edit/delete channels (text, voice, forum, stage)
- Manage roles and permissions
- Configure automod rules
- Create server templates

### Member Management
- Kick, ban, timeout members
- Add/remove roles
- Search members
- Voice operations (mute, deafen, move)

### Advanced
- Create webhooks and slash commands
- Schedule events
- Direct Discord API calls
- emoji.gg integration

## Example Agent Prompts

- "Set up a gaming server with voice channels"
- "Create a welcome channel with rules embed"
- "Timeout spammers and set up automod"
- "Send daily announcements to #general"

## Token Security

Never commit bot tokens. Use environment variables:
```bash
DISCORD_TOKEN=xxx npx limitless-reign
```
