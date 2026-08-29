# Limitless Reign MCP - Discord AI Control

Control any Discord server with AI. 280+ tools included.

## Quick Start

Type `/limitless-reign` and paste your bot token. Done.

Or run manually:
```bash
npx limitless-reign --token YOUR_BOT_TOKEN
```

## What You Can Do

Once connected, ask Claude to:

**Messages**
- "Send an embed to #announcements"
- "Create a poll in #general"
- "Delete the last 50 messages"

**Channels**
- "Create a gaming category with voice channels"
- "Set up a ticket channel with buttons"
- "Make #admin private to moderators only"

**Members**
- "Timeout spammer123 for 1 hour"
- "Give VIP role to active members"
- "Kick all bots from the server"

**Server**
- "Set up automod to block spam and slurs"
- "Create welcome message with rules"
- "Schedule a game night event for Friday"

## Get Your Bot Token

1. https://discord.com/developers/applications
2. Create/select app → Bot → Reset Token
3. Copy and paste when prompted

## Custom & External Tools

You can extend Limitless Reign with custom tools, HTTP endpoints, or proxy remote MCP servers:
```bash
# Load custom tools or plugins
npx limitless-reign --token YOUR_BOT_TOKEN --tools ./my-tools.js --plugin ./my-plugin.js --external-mcp http://localhost:8000/mcp
```
Or in code via `mcp.registerTool()`, `createHttpTool()`, `mcp.registerExternalMCP()`, or `mcp.use()`.

## Need Help?

- GitHub: https://github.com/aayushchouhan24/limitless-reign-mcp
- Issues: https://github.com/aayushchouhan24/limitless-reign-mcp/issues

