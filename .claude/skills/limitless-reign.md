---
name: limitless-reign
description: Control Discord with AI - 280+ tools for messages, voice audio streaming, gateway automations, channels, moderation, roles, webhooks, automod, events, and power primitives
---

# Limitless Reign - Discord AI Control

## Step 1: Get Bot Token

Ask user:
"Let's connect your Discord bot to AI.

**Get your bot token:**
1. Go to https://discord.com/developers/applications
2. Select your app (or create one)
3. Go to **Bot** section
4. Click **Reset Token** → Copy it

Paste your Discord bot token:"

## Step 2: Start Server

Once user provides token, run in background:
```bash
npx limitless-reign --token {TOKEN} --port 3847 &
```

Wait 5 seconds.

## Step 3: Verify Connection

```bash
curl -s http://localhost:3847 2>/dev/null | head -c 100
```

## Step 4: Success Response

"**Discord connected!** You now have 280+ AI tools:

**Messages:** send, edit, delete, embeds, polls, reactions, forward, attachments
**Channels & Voice:** create, edit, delete, permissions, threads, forums, live voice audio streaming, TTS
**Members:** kick, ban, bulk-ban, timeout, roles, voice control, member profiling
**Server & Automations:** gateway event automation, automod, webhooks, emojis, events, slash commands, power primitives

**Try asking:**
- 'List my Discord servers'
- 'Send an announcement to #general'
- 'Create a gaming category with voice channels'
- 'Set up automod to block spam'
- 'Give @user the Moderator role'

What would you like to do?"

## Step 5: Error Handling

If failed:
"**Connection failed.** Please verify:

1. Token is from https://discord.com/developers/applications
2. Bot is added to at least one server
3. Bot has Administrator permission

Run `/limitless-reign` to try again."
