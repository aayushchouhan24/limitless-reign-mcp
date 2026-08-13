// All MCP tool definitions - 100+ Discord tools

export const tools = [
  // ============ CONNECTION & BOT STATUS ============
  {
    name: 'discord_get_bot_info',
    description: 'Get bot user info, guilds count, uptime, and connection status',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'discord_get_gateway_info',
    description: 'Get gateway connection info, latency, and shard status',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'discord_set_presence',
    description: 'Set bot status (online/idle/dnd/invisible)',
    inputSchema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['online', 'idle', 'dnd', 'invisible'], description: 'Presence status' }
      },
      required: ['status']
    }
  },
  {
    name: 'discord_set_activity',
    description: 'Set bot activity (playing/streaming/listening/watching/competing)',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['playing', 'streaming', 'listening', 'watching', 'competing', 'custom'], description: 'Activity type' },
        name: { type: 'string', description: 'Activity text' },
        url: { type: 'string', description: 'Stream URL (for streaming type only)' }
      },
      required: ['type', 'name']
    }
  },
  {
    name: 'discord_disconnect',
    description: 'Gracefully disconnect bot from Discord gateway',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },

  // ============ API ACCESS ============
  {
    name: 'get_allowed_guilds',
    description: 'List all Discord servers this API key has access to',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },

  // ============ GUILD (SERVER) MANAGEMENT ============
  {
    name: 'discord_list_guilds',
    description: 'List all Discord servers you have access to (owner, admin, or higher role than bot)',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'discord_get_guild',
    description: 'Get full guild info including features, verification level, boost status',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_edit_guild',
    description: 'Edit guild settings (name, icon, banner, verification level, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'New server name' },
        description: { type: 'string', description: 'Server description' },
        icon: { type: 'string', description: 'Icon URL or base64' },
        banner: { type: 'string', description: 'Banner URL (requires boost level 2)' },
        splash: { type: 'string', description: 'Invite splash URL (requires boost level 1)' },
        afkChannelId: { type: 'string', description: 'AFK voice channel ID' },
        afkTimeout: { type: 'number', description: 'AFK timeout in seconds (60, 300, 900, 1800, 3600)' },
        systemChannelId: { type: 'string', description: 'System messages channel ID' },
        rulesChannelId: { type: 'string', description: 'Rules channel ID (community servers)' },
        publicUpdatesChannelId: { type: 'string', description: 'Community updates channel ID' },
        verificationLevel: { type: 'string', enum: ['none', 'low', 'medium', 'high', 'very_high'], description: 'Verification level' },
        explicitContentFilter: { type: 'string', enum: ['disabled', 'members_without_roles', 'all_members'], description: 'Content filter' },
        defaultNotifications: { type: 'string', enum: ['all', 'mentions'], description: 'Default notification setting' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_channels',
    description: 'List all channels in a guild organized by category',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_roles',
    description: 'List all roles in a guild with permissions',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_emojis',
    description: 'List all custom emojis in a guild',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_stickers',
    description: 'List all custom stickers in a guild',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_invites',
    description: 'List all active invites in a guild',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_webhooks',
    description: 'List all webhooks in a guild',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_bans',
    description: 'List all banned users in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        limit: { type: 'number', description: 'Max bans to fetch (default 100)' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_audit_log',
    description: 'Fetch audit log entries with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        userId: { type: 'string', description: 'Filter by user who performed action' },
        actionType: { type: 'number', description: 'Filter by action type' },
        limit: { type: 'number', description: 'Number of entries (1-100)' },
        before: { type: 'string', description: 'Get entries before this ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_vanity_url',
    description: 'Get guild vanity URL info (if available)',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_leave_guild',
    description: 'Make the bot leave a guild',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID to leave' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_apply_template',
    description: 'Apply a predefined server template (gaming, community, business, study, creator)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        templateName: { type: 'string', enum: ['gaming', 'community', 'business', 'study', 'creator'], description: 'Template to apply' },
        clearExisting: { type: 'boolean', description: 'Clear existing channels/roles first' }
      },
      required: ['guildId', 'templateName']
    }
  },

  // ============ CHANNEL MANAGEMENT ============
  {
    name: 'discord_create_channel',
    description: 'Create any channel type (text/voice/category/announcement/forum/stage)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Channel name' },
        type: { type: 'string', enum: ['text', 'voice', 'category', 'announcement', 'forum', 'stage'], description: 'Channel type' },
        parentId: { type: 'string', description: 'Parent category ID' },
        topic: { type: 'string', description: 'Channel topic' },
        nsfw: { type: 'boolean', description: 'NSFW flag' },
        slowmode: { type: 'number', description: 'Slowmode in seconds (0-21600)' },
        userLimit: { type: 'number', description: 'User limit for voice (0-99)' },
        bitrate: { type: 'number', description: 'Bitrate for voice channels' },
        position: { type: 'number', description: 'Channel position' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'name', 'type']
    }
  },
  {
    name: 'discord_edit_channel',
    description: 'Edit channel settings',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        name: { type: 'string', description: 'New channel name' },
        topic: { type: 'string', description: 'Channel topic' },
        nsfw: { type: 'boolean', description: 'NSFW flag' },
        slowmode: { type: 'number', description: 'Slowmode in seconds' },
        userLimit: { type: 'number', description: 'User limit (voice)' },
        bitrate: { type: 'number', description: 'Bitrate (voice)' },
        parentId: { type: 'string', description: 'Parent category ID' },
        position: { type: 'number', description: 'Channel position' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_delete_channel',
    description: 'Delete a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_clone_channel',
    description: 'Clone a channel with all settings and permissions',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to clone' },
        name: { type: 'string', description: 'New channel name (optional)' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_set_channel_permissions',
    description: 'Set channel permissions for a role or user',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        targetId: { type: 'string', description: 'Role or User ID' },
        allow: { type: 'array', items: { type: 'string' }, description: 'Permissions to allow' },
        deny: { type: 'array', items: { type: 'string' }, description: 'Permissions to deny' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId', 'targetId']
    }
  },
  {
    name: 'discord_create_invite',
    description: 'Create an invite to a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        maxAge: { type: 'number', description: 'Invite lifetime in seconds (0 = infinite)' },
        maxUses: { type: 'number', description: 'Max uses (0 = unlimited)' },
        temporary: { type: 'boolean', description: 'Temporary membership' },
        unique: { type: 'boolean', description: 'Create unique invite' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId']
    }
  },

  // ============ THREAD MANAGEMENT ============
  {
    name: 'discord_create_thread',
    description: 'Create a new thread (from message or standalone)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Parent channel ID' },
        name: { type: 'string', description: 'Thread name' },
        messageId: { type: 'string', description: 'Message ID to start thread from (optional)' },
        type: { type: 'string', enum: ['public', 'private'], description: 'Thread type' },
        autoArchiveDuration: { type: 'number', enum: [60, 1440, 4320, 10080], description: 'Auto archive duration in minutes' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId', 'name']
    }
  },
  {
    name: 'discord_create_forum_post',
    description: 'Create a forum post with tags and starter message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Forum channel ID' },
        name: { type: 'string', description: 'Post name' },
        content: { type: 'string', description: 'Starter message content' },
        appliedTags: { type: 'array', items: { type: 'string' }, description: 'Tag IDs to apply' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId', 'name', 'content']
    }
  },
  {
    name: 'discord_edit_thread',
    description: 'Edit thread settings',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' },
        name: { type: 'string', description: 'New thread name' },
        archived: { type: 'boolean', description: 'Archive status' },
        locked: { type: 'boolean', description: 'Lock status' },
        slowmode: { type: 'number', description: 'Slowmode in seconds' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_delete_thread',
    description: 'Delete a thread',
    inputSchema: {
      type: 'object',
      properties: { threadId: { type: 'string', description: 'Thread ID' } },
      required: ['threadId']
    }
  },
  {
    name: 'discord_get_active_threads',
    description: 'Get all active threads in a guild',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },

  // ============ MESSAGE OPERATIONS ============
  {
    name: 'discord_send_message',
    description: 'Send a message with content, embeds, and/or components (buttons, selects)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        content: { type: 'string', description: 'Message text content' },
        embeds: { type: 'array', description: 'Array of embed objects' },
        components: { type: 'array', description: 'Array of component rows (buttons, selects)' },
        replyTo: { type: 'string', description: 'Message ID to reply to' },
        tts: { type: 'boolean', description: 'Text-to-speech' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_send_components_v2',
    description: 'Send a message with full Components V2 support (containers, sections, media galleries)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        components: { type: 'array', description: 'Components V2 array (container, section, text, media_gallery, separator, buttons)' },
        content: { type: 'string', description: 'Optional text content' }
      },
      required: ['channelId', 'components']
    }
  },
  {
    name: 'discord_send_embed',
    description: 'Send a rich embed message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        title: { type: 'string', description: 'Embed title' },
        description: { type: 'string', description: 'Embed description' },
        color: { type: 'number', description: 'Embed color (decimal)' },
        url: { type: 'string', description: 'Title URL' },
        timestamp: { type: 'string', description: 'ISO timestamp' },
        footer: { type: 'object', description: 'Footer object with text and icon_url' },
        thumbnail: { type: 'object', description: 'Thumbnail object with url' },
        image: { type: 'object', description: 'Image object with url' },
        author: { type: 'object', description: 'Author object with name, url, icon_url' },
        fields: { type: 'array', description: 'Array of field objects with name, value, inline' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_edit_message',
    description: 'Edit an existing message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' },
        content: { type: 'string', description: 'New content' },
        embeds: { type: 'array', description: 'New embeds' },
        components: { type: 'array', description: 'New components' }
      },
      required: ['channelId', 'messageId']
    }
  },
  {
    name: 'discord_delete_message',
    description: 'Delete a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' }
      },
      required: ['channelId', 'messageId']
    }
  },
  {
    name: 'discord_bulk_delete_messages',
    description: 'Bulk delete messages (2-100 messages, not older than 14 days)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageIds: { type: 'array', items: { type: 'string' }, description: 'Array of message IDs' }
      },
      required: ['channelId', 'messageIds']
    }
  },
  {
    name: 'discord_get_messages',
    description: 'Get messages from a channel with filters',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        limit: { type: 'number', description: 'Number of messages (1-100)' },
        before: { type: 'string', description: 'Get messages before this ID' },
        after: { type: 'string', description: 'Get messages after this ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_pin_message',
    description: 'Pin a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' }
      },
      required: ['channelId', 'messageId']
    }
  },
  {
    name: 'discord_unpin_message',
    description: 'Unpin a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' }
      },
      required: ['channelId', 'messageId']
    }
  },
  {
    name: 'discord_add_reaction',
    description: 'Add a reaction to a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' },
        emoji: { type: 'string', description: 'Emoji (unicode or custom format)' }
      },
      required: ['channelId', 'messageId', 'emoji']
    }
  },
  {
    name: 'discord_remove_reaction',
    description: 'Remove a reaction from a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' },
        emoji: { type: 'string', description: 'Emoji to remove' },
        userId: { type: 'string', description: 'User ID (omit for bot reaction)' }
      },
      required: ['channelId', 'messageId', 'emoji']
    }
  },
  {
    name: 'discord_create_poll',
    description: 'Create a poll message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        question: { type: 'string', description: 'Poll question' },
        answers: { type: 'array', items: { type: 'object' }, description: 'Poll answers (max 10)' },
        duration: { type: 'number', description: 'Duration in hours (1-768)' },
        allowMultiselect: { type: 'boolean', description: 'Allow multiple selections' }
      },
      required: ['channelId', 'question', 'answers', 'duration']
    }
  },

  // ============ MEMBER MANAGEMENT ============
  {
    name: 'discord_get_member',
    description: 'Get detailed info about a specific member',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member/User ID' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_search_members',
    description: 'Search members by username',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        query: { type: 'string', description: 'Search query (username)' },
        limit: { type: 'number', description: 'Max members to return' }
      },
      required: ['guildId', 'query']
    }
  },
  {
    name: 'discord_list_members',
    description: 'List members in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        limit: { type: 'number', description: 'Max members to fetch' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_kick_member',
    description: 'Kick a member from the server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID to kick' },
        reason: { type: 'string', description: 'Reason for kick' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_ban_member',
    description: 'Ban a member from the server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member/User ID to ban' },
        reason: { type: 'string', description: 'Reason for ban' },
        deleteMessageSeconds: { type: 'number', description: 'Seconds of messages to delete (0-604800)' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_unban_member',
    description: 'Unban a user from the server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        userId: { type: 'string', description: 'User ID to unban' },
        reason: { type: 'string', description: 'Reason for unban' }
      },
      required: ['guildId', 'userId']
    }
  },
  {
    name: 'discord_timeout_member',
    description: 'Timeout (mute) a member for a duration',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        duration: { type: 'number', description: 'Duration in seconds (max 2419200 = 28 days)' },
        reason: { type: 'string', description: 'Reason for timeout' }
      },
      required: ['guildId', 'memberId', 'duration']
    }
  },
  {
    name: 'discord_remove_timeout',
    description: 'Remove timeout from a member',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        reason: { type: 'string', description: 'Reason' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_add_role',
    description: 'Add a role to a member',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        roleId: { type: 'string', description: 'Role ID to add' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'memberId', 'roleId']
    }
  },
  {
    name: 'discord_remove_role',
    description: 'Remove a role from a member',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        roleId: { type: 'string', description: 'Role ID to remove' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'memberId', 'roleId']
    }
  },
  {
    name: 'discord_set_nickname',
    description: 'Set a member nickname',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        nickname: { type: 'string', description: 'New nickname (null to reset)' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_move_member_voice',
    description: 'Move member to a voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        channelId: { type: 'string', description: 'Target voice channel ID' }
      },
      required: ['guildId', 'memberId', 'channelId']
    }
  },
  {
    name: 'discord_disconnect_member',
    description: 'Disconnect member from voice',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_server_mute_member',
    description: 'Server mute a member in voice',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        mute: { type: 'boolean', description: 'Mute status' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'memberId', 'mute']
    }
  },
  {
    name: 'discord_server_deafen_member',
    description: 'Server deafen a member in voice',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        deaf: { type: 'boolean', description: 'Deafen status' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'memberId', 'deaf']
    }
  },

  // ============ ROLE MANAGEMENT ============
  {
    name: 'discord_create_role',
    description: 'Create a new role with all options',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Role name' },
        color: { type: 'string', description: 'Hex color (e.g., #FF5733)' },
        hoist: { type: 'boolean', description: 'Display separately in member list' },
        mentionable: { type: 'boolean', description: 'Allow anyone to mention this role' },
        permissions: { type: 'string', description: 'Permission bitfield as string' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_edit_role',
    description: 'Edit an existing role',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID' },
        name: { type: 'string', description: 'New role name' },
        color: { type: 'string', description: 'Hex color' },
        hoist: { type: 'boolean', description: 'Display separately' },
        mentionable: { type: 'boolean', description: 'Mentionable' },
        permissions: { type: 'string', description: 'Permission bitfield' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'roleId']
    }
  },
  {
    name: 'discord_delete_role',
    description: 'Delete a role',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID to delete' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'roleId']
    }
  },
  {
    name: 'discord_list_permissions',
    description: 'List all available Discord permission names',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },

  // ============ EMOJI & STICKER ============
  {
    name: 'discord_create_emoji',
    description: 'Create a custom emoji from URL or base64',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Emoji name' },
        image: { type: 'string', description: 'Image URL or base64 data' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'name', 'image']
    }
  },
  {
    name: 'discord_delete_emoji',
    description: 'Delete a custom emoji',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        emojiId: { type: 'string', description: 'Emoji ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'emojiId']
    }
  },
  {
    name: 'discord_create_sticker',
    description: 'Create a guild sticker',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Sticker name' },
        description: { type: 'string', description: 'Sticker description' },
        tags: { type: 'string', description: 'Autocomplete tags' },
        file: { type: 'string', description: 'File path or URL' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'name', 'tags', 'file']
    }
  },
  {
    name: 'discord_delete_sticker',
    description: 'Delete a sticker',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        stickerId: { type: 'string', description: 'Sticker ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'stickerId']
    }
  },

  // ============ WEBHOOKS ============
  {
    name: 'discord_create_webhook',
    description: 'Create a webhook in a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        name: { type: 'string', description: 'Webhook name' },
        avatar: { type: 'string', description: 'Avatar URL' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId', 'name']
    }
  },
  {
    name: 'discord_delete_webhook',
    description: 'Delete a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['webhookId']
    }
  },
  {
    name: 'discord_execute_webhook',
    description: 'Send a message via webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        token: { type: 'string', description: 'Webhook token' },
        content: { type: 'string', description: 'Message content' },
        username: { type: 'string', description: 'Override username' },
        avatarUrl: { type: 'string', description: 'Override avatar' },
        embeds: { type: 'array', description: 'Embed objects' }
      },
      required: ['webhookId', 'token']
    }
  },

  // ============ AUTO MODERATION ============
  {
    name: 'discord_create_automod_rule',
    description: 'Create an auto moderation rule',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Rule name' },
        eventType: { type: 'number', description: '1 = MESSAGE_SEND' },
        triggerType: { type: 'number', description: '1=keyword, 3=spam, 4=keyword_preset, 5=mention_spam' },
        triggerMetadata: { type: 'object', description: 'Trigger metadata (keywordFilter, presets, etc.)' },
        actions: { type: 'array', description: 'Actions to take (type: 1=block, 2=alert, 3=timeout)' },
        enabled: { type: 'boolean', description: 'Enable rule' },
        exemptRoles: { type: 'array', items: { type: 'string' }, description: 'Exempt role IDs' },
        exemptChannels: { type: 'array', items: { type: 'string' }, description: 'Exempt channel IDs' }
      },
      required: ['guildId', 'name', 'eventType', 'triggerType', 'actions']
    }
  },
  {
    name: 'discord_delete_automod_rule',
    description: 'Delete an auto moderation rule',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        ruleId: { type: 'string', description: 'Rule ID' }
      },
      required: ['guildId', 'ruleId']
    }
  },
  {
    name: 'discord_get_automod_rules',
    description: 'List all auto moderation rules',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },

  // ============ SCHEDULED EVENTS ============
  {
    name: 'discord_create_scheduled_event',
    description: 'Create a scheduled event (stage/voice/external)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Event name' },
        description: { type: 'string', description: 'Event description' },
        scheduledStartTime: { type: 'string', description: 'Start time (ISO 8601)' },
        scheduledEndTime: { type: 'string', description: 'End time (ISO 8601)' },
        entityType: { type: 'number', description: '1=stage, 2=voice, 3=external' },
        channelId: { type: 'string', description: 'Channel ID (for voice/stage)' },
        location: { type: 'string', description: 'Location (for external events)' },
        image: { type: 'string', description: 'Cover image URL' }
      },
      required: ['guildId', 'name', 'scheduledStartTime', 'entityType']
    }
  },
  {
    name: 'discord_delete_scheduled_event',
    description: 'Delete a scheduled event',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        eventId: { type: 'string', description: 'Event ID' }
      },
      required: ['guildId', 'eventId']
    }
  },
  {
    name: 'discord_get_scheduled_events',
    description: 'List all scheduled events',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        withUserCount: { type: 'boolean', description: 'Include user counts' }
      },
      required: ['guildId']
    }
  },

  // ============ SLASH COMMANDS ============
  {
    name: 'discord_create_global_command',
    description: 'Create a global slash command',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Command name (lowercase, no spaces)' },
        description: { type: 'string', description: 'Command description' },
        options: { type: 'array', description: 'Command options' }
      },
      required: ['name', 'description']
    }
  },
  {
    name: 'discord_create_guild_command',
    description: 'Create a guild-specific slash command',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Command name' },
        description: { type: 'string', description: 'Command description' },
        options: { type: 'array', description: 'Command options' }
      },
      required: ['guildId', 'name', 'description']
    }
  },
  {
    name: 'discord_delete_global_command',
    description: 'Delete a global slash command',
    inputSchema: {
      type: 'object',
      properties: { commandId: { type: 'string', description: 'Command ID' } },
      required: ['commandId']
    }
  },
  {
    name: 'discord_delete_guild_command',
    description: 'Delete a guild-specific slash command',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        commandId: { type: 'string', description: 'Command ID' }
      },
      required: ['guildId', 'commandId']
    }
  },
  {
    name: 'discord_get_global_commands',
    description: 'List all global commands',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'discord_get_guild_commands',
    description: 'List guild-specific commands',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },

  // ============ INTERACTION HANDLERS ============
  {
    name: 'discord_register_button_handler',
    description: 'Register a handler for button clicks',
    inputSchema: {
      type: 'object',
      properties: {
        customId: { type: 'string', description: 'Button custom ID' },
        action: { type: 'string', enum: ['reply', 'edit', 'delete', 'defer'], description: 'Action to take' },
        response: { type: 'string', description: 'Response content' },
        ephemeral: { type: 'boolean', description: 'Ephemeral response' }
      },
      required: ['customId', 'action']
    }
  },
  {
    name: 'discord_register_select_handler',
    description: 'Register a handler for select menu interactions',
    inputSchema: {
      type: 'object',
      properties: {
        customId: { type: 'string', description: 'Select menu custom ID' },
        action: { type: 'string', enum: ['reply', 'edit', 'delete', 'defer'], description: 'Action to take' },
        response: { type: 'string', description: 'Response content' },
        ephemeral: { type: 'boolean', description: 'Ephemeral response' }
      },
      required: ['customId', 'action']
    }
  },
  {
    name: 'discord_unregister_handler',
    description: 'Remove an interaction handler',
    inputSchema: {
      type: 'object',
      properties: { customId: { type: 'string', description: 'Custom ID to unregister' } },
      required: ['customId']
    }
  },
  {
    name: 'discord_list_handlers',
    description: 'List all registered interaction handlers',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },

  // ============ DATABASE & LOGGING ============
  {
    name: 'discord_get_logs',
    description: 'Get action logs from database with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Filter by guild ID' },
        tool: { type: 'string', description: 'Filter by tool name' },
        limit: { type: 'number', description: 'Max results (default 50)' },
        success: { type: 'boolean', description: 'Filter by success status' }
      },
      required: []
    }
  },
  {
    name: 'discord_get_guild_config',
    description: 'Get stored configuration for a guild',
    inputSchema: {
      type: 'object',
      properties: { guildId: { type: 'string', description: 'Guild ID' } },
      required: ['guildId']
    }
  },
  {
    name: 'discord_set_guild_config',
    description: 'Update guild configuration (welcome channel, log channel, settings)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        welcomeChannel: { type: 'string', description: 'Welcome message channel ID' },
        welcomeMessage: { type: 'string', description: 'Welcome message template (use {user} for mention)' },
        logChannel: { type: 'string', description: 'Action log channel ID' },
        autoRoles: { type: 'array', items: { type: 'string' }, description: 'Role IDs to auto-assign on join' },
        enableLogging: { type: 'boolean', description: 'Enable action logging' },
        enableAutomod: { type: 'boolean', description: 'Enable automod features' },
        enableWelcome: { type: 'boolean', description: 'Enable welcome messages' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_db_stats',
    description: 'Get database connection status and statistics',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'discord_create_scheduled_task',
    description: 'Create a scheduled task (message, announcement, reminder)',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Task name' },
        type: { type: 'string', enum: ['message', 'announcement', 'reminder', 'custom'], description: 'Task type' },
        guildId: { type: 'string', description: 'Guild ID' },
        channelId: { type: 'string', description: 'Target channel ID' },
        content: { type: 'string', description: 'Message content' },
        embeds: { type: 'array', description: 'Embed objects' },
        executeAt: { type: 'string', description: 'ISO timestamp for execution' },
        repeat: { type: 'string', enum: ['once', 'daily', 'weekly', 'monthly'], description: 'Repeat schedule' }
      },
      required: ['name', 'type', 'channelId', 'executeAt']
    }
  },
  {
    name: 'discord_list_scheduled_tasks',
    description: 'List scheduled tasks for a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Filter by guild ID' },
        status: { type: 'string', enum: ['pending', 'completed', 'failed', 'cancelled'], description: 'Filter by status' }
      },
      required: []
    }
  },
  {
    name: 'discord_cancel_scheduled_task',
    description: 'Cancel a scheduled task',
    inputSchema: {
      type: 'object',
      properties: { taskId: { type: 'string', description: 'Task ID to cancel' } },
      required: ['taskId']
    }
  },
  {
    name: 'discord_api_call',
    description: 'Execute any raw Discord REST API call. Use this to perform actions not covered by other tools. Endpoints must be relative (e.g., `/guilds/123/roles`).',
    inputSchema: {
      type: 'object',
      properties: {
        method: { type: 'string', enum: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], description: 'HTTP method' },
        endpoint: { type: 'string', description: 'Discord API endpoint (e.g., /guilds/123/roles)' },
        body: { type: 'object', description: 'JSON body for the request (if applicable)' },
        query: { type: 'object', description: 'Query parameters (if applicable)' }
      },
      required: ['method', 'endpoint']
    }
  },
  {
    name: 'discord_search_emojigg',
    description: 'Search for emojis on emoji.gg by query',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query for the emoji' }
      },
      required: ['query']
    }
  },
  {
    name: 'discord_add_emojigg',
    description: 'Add an emoji from emoji.gg to a server by its URL',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Name of the emoji' },
        url: { type: 'string', description: 'URL of the emoji image from emoji.gg' }
      },
      required: ['guildId', 'name', 'url']
    }
  }
]
