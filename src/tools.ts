// All MCP tool definitions - 280+ Discord tools

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

  // ============ DIRECT MESSAGES (PRIVATE MESSAGES) ============
  {
    name: 'discord_send_dm',
    description: 'Send a private direct message (DM) to a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID to send the DM to' },
        content: { type: 'string', description: 'Message text content' },
        embeds: { type: 'array', items: { type: 'object' }, description: 'Array of embed objects' }
      },
      required: ['userId']
    }
  },
  {
    name: 'discord_edit_dm',
    description: 'Edit a previously sent private direct message (DM) to a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID of the recipient' },
        messageId: { type: 'string', description: 'Message ID to edit' },
        content: { type: 'string', description: 'New message content' },
        embeds: { type: 'array', items: { type: 'object' }, description: 'New array of embed objects' }
      },
      required: ['userId', 'messageId']
    }
  },
  {
    name: 'discord_delete_dm',
    description: 'Delete a direct message sent by the bot to a user',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID of the recipient' },
        messageId: { type: 'string', description: 'Message ID to delete' }
      },
      required: ['userId', 'messageId']
    }
  },
  {
    name: 'discord_get_dms',
    description: 'Read private direct message history from a specific user (supports pagination and attachments)',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID' },
        limit: { type: 'number', description: 'Number of messages to fetch (1-100, default 50)' },
        before: { type: 'string', description: 'Get messages before this message ID' },
        after: { type: 'string', description: 'Get messages after this message ID' },
        around: { type: 'string', description: 'Get messages around this message ID' }
      },
      required: ['userId']
    }
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
  {
    name: 'discord_get_guild_prune_count',
    description: 'Get the number of members that would be kicked in a guild prune',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        days: { type: 'number', description: 'Number of days of inactivity (default 7, 1-30)' },
        roles: { type: 'array', items: { type: 'string' }, description: 'Include members with these role IDs' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_begin_guild_prune',
    description: 'Begin a guild member prune to kick inactive members without roles',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        days: { type: 'number', description: 'Number of days of inactivity (default 7)' },
        roles: { type: 'array', items: { type: 'string' }, description: 'Include members with these role IDs' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_widget',
    description: 'Get guild widget settings and embed information',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_edit_guild_widget',
    description: 'Modify guild widget settings (enable/disable, set invite channel)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        enabled: { type: 'boolean', description: 'Whether the widget is enabled' },
        channelId: { type: 'string', description: 'Widget invite channel ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_welcome_screen',
    description: 'Get the community welcome screen configuration for a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_edit_guild_welcome_screen',
    description: 'Edit the welcome screen of a community guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        description: { type: 'string', description: 'Server description shown in welcome screen' },
        enabled: { type: 'boolean', description: 'Whether welcome screen is enabled' },
        welcomeChannels: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              channelId: { type: 'string', description: 'Channel ID' },
              description: { type: 'string', description: 'Description of the channel' },
              emojiName: { type: 'string', description: 'Emoji unicode or name' }
            },
            required: ['channelId', 'description']
          },
          description: 'Channels displayed in welcome screen (up to 5)'
        }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_onboarding',
    description: 'Get the guild onboarding configuration and questions',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_edit_guild_onboarding',
    description: 'Modify the guild onboarding configuration',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        enabled: { type: 'boolean', description: 'Whether onboarding is enabled' },
        mode: { type: 'number', description: 'Onboarding mode (0=default, 1=advanced)' },
        defaultChannelIds: { type: 'array', items: { type: 'string' }, description: 'Default channel IDs all members join' },
        prompts: { type: 'array', items: { type: 'object' }, description: 'Onboarding prompt questions and options' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_integrations',
    description: 'List all integrations (Twitch, YouTube, bots) for a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_delete_guild_integration',
    description: 'Delete/remove an attached integration from a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        integrationId: { type: 'string', description: 'Integration ID to remove' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'integrationId']
    }
  },
  {
    name: 'discord_get_server_stats',
    description: 'Get comprehensive server statistics (total members, humans, bots, online, voice active, channels by type, roles, boost level)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
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
    name: 'discord_find_channel',
    description: 'Find a channel type and ID using name and server ID',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Channel name to search for (without #)' },
        type: { type: 'string', enum: ['text', 'voice', 'category', 'announcement', 'forum', 'stage'], description: 'Optional channel type filter' }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_get_channel_info',
    description: 'Get detailed information about a channel (topic, bitrate, slowmode, permissions, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_move_channel',
    description: 'Move a channel to another category and/or change its position',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        parentId: { type: 'string', description: 'Target category ID (or null to detach from category)' },
        position: { type: 'number', description: 'New sorting position' },
        lockPermissions: { type: 'boolean', description: 'Sync permissions with parent category' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_create_voice_channel',
    description: 'Create a new voice channel in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Voice channel name' },
        parentId: { type: 'string', description: 'Parent category ID' },
        bitrate: { type: 'number', description: 'Bitrate (e.g. 64000, 128000)' },
        userLimit: { type: 'number', description: 'User limit (0 for unlimited, 1-99)' },
        rtcRegion: { type: 'string', description: 'RTC region (e.g. "us-west", "rotterdam")' }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_create_stage_channel',
    description: 'Create a new stage channel for audio/speaking events in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Stage channel name' },
        parentId: { type: 'string', description: 'Parent category ID' },
        bitrate: { type: 'number', description: 'Bitrate' },
        topic: { type: 'string', description: 'Stage channel topic' }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_edit_voice_channel',
    description: 'Edit settings of a voice or stage channel (bitrate, userLimit, region, video quality)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Voice or Stage channel ID' },
        name: { type: 'string', description: 'New channel name' },
        bitrate: { type: 'number', description: 'Bitrate in bps (e.g. 64000)' },
        userLimit: { type: 'number', description: 'User limit (0 for unlimited, 1-99)' },
        rtcRegion: { type: 'string', description: 'RTC region' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_set_channel_permissions',
    description: 'Set channel permissions overwrite for a role or user',
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
    name: 'discord_list_channel_permissions',
    description: 'List all permission overwrites for a channel with role/member breakdown',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_delete_channel_permissions',
    description: 'Delete a permission overwrite for a role or member from a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        targetId: { type: 'string', description: 'Role ID or User ID whose overwrites should be deleted' }
      },
      required: ['channelId', 'targetId']
    }
  },
  {
    name: 'discord_lock_channel',
    description: 'Lock a text channel to prevent members from sending messages',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to lock' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_unlock_channel',
    description: 'Unlock a previously locked text channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to unlock' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_set_slowmode',
    description: 'Set or remove slowmode (rate limit per user) on a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        slowmode: { type: 'number', description: 'Slowmode delay in seconds (0 to disable, up to 21600)' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId', 'slowmode']
    }
  },
  {
    name: 'discord_set_channel_topic',
    description: 'Quickly change or update the topic of a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        topic: { type: 'string', description: 'New channel topic' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId', 'topic']
    }
  },
  {
    name: 'discord_modify_channel_positions',
    description: 'Modify sorting positions of multiple channels in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        channelPositions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel ID' },
              position: { type: 'number', description: 'New sorting position' },
              parent: { type: 'string', description: 'New parent category ID (optional)' },
              lockPermissions: { type: 'boolean', description: 'Sync permissions with parent (optional)' }
            },
            required: ['channel', 'position']
          },
          description: 'Array of channel position objects'
        }
      },
      required: ['guildId', 'channelPositions']
    }
  },
  {
    name: 'discord_sync_channel_permissions',
    description: 'Sync channel permissions with its parent category',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to sync with its category' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_get_voice_channel_members',
    description: 'Get all members currently connected to a voice or stage channel with mute, deaf, video, and streaming states',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Voice or Stage channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_get_guild_voice_states',
    description: 'Get a snapshot of all active voice channels and connected members across the entire server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
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
  {
    name: 'discord_delete_invite',
    description: 'Delete (revoke) an invite so the link stops working',
    inputSchema: {
      type: 'object',
      properties: {
        inviteCode: { type: 'string', description: 'The invite code to delete (e.g. "discord.gg/abc" or "abc")' }
      },
      required: ['inviteCode']
    }
  },
  {
    name: 'discord_get_invite_details',
    description: 'Get details about a specific invite (works for any public invite)',
    inputSchema: {
      type: 'object',
      properties: {
        inviteCode: { type: 'string', description: 'Invite code or full invite URL' },
        withCounts: { type: 'boolean', description: 'Whether to include member and online counts (default true)' }
      },
      required: ['inviteCode']
    }
  },

  // ============ CATEGORY MANAGEMENT ============
  {
    name: 'discord_create_category',
    description: 'Create a new category for organizing channels in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Category name' },
        position: { type: 'number', description: 'Category position' }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_edit_category',
    description: 'Edit a category (rename or change position)',
    inputSchema: {
      type: 'object',
      properties: {
        categoryId: { type: 'string', description: 'Category channel ID' },
        name: { type: 'string', description: 'New category name' },
        position: { type: 'number', description: 'New position' }
      },
      required: ['categoryId']
    }
  },
  {
    name: 'discord_delete_category',
    description: 'Delete a category from a guild',
    inputSchema: {
      type: 'object',
      properties: {
        categoryId: { type: 'string', description: 'Category channel ID to delete' }
      },
      required: ['categoryId']
    }
  },
  {
    name: 'discord_find_category',
    description: 'Find a category ID using name and server ID',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Category name' }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_list_channels_in_category',
    description: 'List all channels in a specific category',
    inputSchema: {
      type: 'object',
      properties: {
        categoryId: { type: 'string', description: 'Category channel ID' }
      },
      required: ['categoryId']
    }
  },

  // ============ FORUM MANAGEMENT ============
  {
    name: 'discord_create_forum_channel',
    description: 'Create a new forum channel with optional tags and default layout',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Forum channel name' },
        topic: { type: 'string', description: 'Forum guidelines / topic' },
        parentId: { type: 'string', description: 'Parent category ID' },
        availableTags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Tag name' },
              moderated: { type: 'boolean', description: 'Whether only moderators can apply this tag' },
              emojiName: { type: 'string', description: 'Unicode emoji or name' }
            },
            required: ['name']
          },
          description: 'Initial available tags for the forum'
        }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_edit_forum_channel',
    description: 'Edit settings of a forum channel (name, topic, tags, layout, slowmode)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Forum channel ID' },
        name: { type: 'string', description: 'New name' },
        topic: { type: 'string', description: 'Forum guidelines / topic' },
        nsfw: { type: 'boolean', description: 'NSFW flag' },
        slowmode: { type: 'number', description: 'Slowmode in seconds' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_list_forum_channels',
    description: 'List all forum channels in the server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_forum_channel_info',
    description: 'Get detailed information about a forum channel including tags and settings',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Forum channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_list_forum_tags',
    description: 'List all available tags in a forum channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Forum channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_list_forum_posts',
    description: 'List active posts (threads) in a forum channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Forum channel ID' }
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
  {
    name: 'discord_lock_thread',
    description: 'Lock a thread to prevent further messages and archiving',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID to lock' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_unlock_thread',
    description: 'Unlock a previously locked thread',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID to unlock' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['threadId']
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
  {
    name: 'discord_crosspost_message',
    description: 'Publish/crosspost an announcement message to all follower channels',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Announcement channel ID' },
        messageId: { type: 'string', description: 'Message ID to publish' }
      },
      required: ['channelId', 'messageId']
    }
  },
  {
    name: 'discord_get_pinned_messages',
    description: 'Get all pinned messages in a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_get_reactions',
    description: 'Get a list of users who reacted with a specific emoji on a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' },
        emoji: { type: 'string', description: 'Emoji to inspect' },
        limit: { type: 'number', description: 'Max users to fetch (default 25, 1-100)' }
      },
      required: ['channelId', 'messageId', 'emoji']
    }
  },
  {
    name: 'discord_clear_reaction_emoji',
    description: 'Clear all reactions for a specific emoji on a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' },
        emoji: { type: 'string', description: 'Emoji to clear' }
      },
      required: ['channelId', 'messageId', 'emoji']
    }
  },
  {
    name: 'discord_search_messages',
    description: 'Search messages in a channel or server by keyword, author, mentions, or attachment',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Optional channel ID to search in' },
        guildId: { type: 'string', description: 'Guild ID (required if searching across server)' },
        query: { type: 'string', description: 'Keyword or text to search for' },
        authorId: { type: 'string', description: 'Filter messages sent by this user ID' },
        hasAttachment: { type: 'boolean', description: 'Filter messages containing attachments' },
        hasEmbed: { type: 'boolean', description: 'Filter messages containing embeds' },
        limit: { type: 'number', description: 'Max messages to inspect/return (default 50, up to 500)' }
      },
      required: []
    }
  },
  {
    name: 'discord_get_user_messages',
    description: 'Fetch the recent messages sent by a specific user across text channels in a server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        userId: { type: 'string', description: 'User ID whose messages to retrieve' },
        limit: { type: 'number', description: 'Max messages to retrieve (default 100, up to 500)' },
        channelIds: { type: 'array', items: { type: 'string' }, description: 'Optional list of specific channel IDs to scan' }
      },
      required: ['guildId', 'userId']
    }
  },
  {
    name: 'discord_export_channel_transcript',
    description: 'Export message history transcript from a channel with author, timestamp, embeds, and attachments',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        limit: { type: 'number', description: 'Number of recent messages to export (default 100, up to 500)' }
      },
      required: ['channelId']
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
  {
    name: 'discord_modify_voice_state',
    description: 'Server mute, deafen, or suppress a member in voice channels',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        userId: { type: 'string', description: 'User / Member ID' },
        mute: { type: 'boolean', description: 'Mute in voice' },
        deaf: { type: 'boolean', description: 'Deafen in voice' },
        suppress: { type: 'boolean', description: 'Suppress speaker in stage channel' },
        channelId: { type: 'string', description: 'Move to voice channel ID' }
      },
      required: ['guildId', 'userId']
    }
  },
  {
    name: 'discord_get_user_id_by_name',
    description: 'Get a Discord user ID by username or nickname in a guild for ping usage <@id>',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        username: { type: 'string', description: 'Username or nickname to search' }
      },
      required: ['guildId', 'username']
    }
  },
  {
    name: 'discord_get_user',
    description: 'Fetch global Discord user profile, avatar, banner, and badges by user ID',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Discord User ID' }
      },
      required: ['userId']
    }
  },
  {
    name: 'discord_get_user_profile',
    description: 'Fetch comprehensive user profile including custom status, rich presence activities (games, Spotify), client platforms (desktop/mobile/web), bio, banner, and avatar decoration',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Discord User ID' },
        guildId: { type: 'string', description: 'Optional Guild ID for server-specific presence and nickname' }
      },
      required: ['userId']
    }
  },
  {
    name: 'discord_edit_bot_profile',
    description: 'Edit the bot username or avatar globally',
    inputSchema: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'New bot username' },
        avatar: { type: 'string', description: 'New avatar image URL or base64 data' }
      },
      required: []
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
    name: 'discord_get_role',
    description: 'Get detailed information about a single role in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID' }
      },
      required: ['guildId', 'roleId']
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
    name: 'discord_modify_role_positions',
    description: 'Modify role hierarchy positions in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        rolePositions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              role: { type: 'string', description: 'Role ID' },
              position: { type: 'number', description: 'New hierarchy position' }
            },
            required: ['role', 'position']
          },
          description: 'Array of role position objects'
        }
      },
      required: ['guildId', 'rolePositions']
    }
  },
  {
    name: 'discord_get_member_permissions',
    description: 'Calculate effective permissions for a member in a guild or channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' },
        channelId: { type: 'string', description: 'Optional channel ID for channel-specific permissions' }
      },
      required: ['guildId', 'memberId']
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
    name: 'discord_get_emoji_details',
    description: 'Get detailed information about a specific custom emoji (author, roles, animated, URL)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        emojiId: { type: 'string', description: 'Emoji ID' }
      },
      required: ['guildId', 'emojiId']
    }
  },
  {
    name: 'discord_edit_emoji',
    description: 'Edit an existing custom emoji (rename or restrict to roles)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        emojiId: { type: 'string', description: 'Emoji ID' },
        name: { type: 'string', description: 'New emoji name' },
        roles: { type: 'array', items: { type: 'string' }, description: 'Array of role IDs that can use this emoji' }
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
    name: 'discord_get_webhook',
    description: 'Get details about a specific webhook by ID',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        token: { type: 'string', description: 'Optional webhook token' }
      },
      required: ['webhookId']
    }
  },
  {
    name: 'discord_get_channel_webhooks',
    description: 'List all webhooks created in a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_edit_webhook',
    description: 'Modify a webhook (name, avatar, or target channel)',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        name: { type: 'string', description: 'New webhook name' },
        avatar: { type: 'string', description: 'New avatar URL or base64' },
        channelId: { type: 'string', description: 'Move webhook to new channel ID' },
        token: { type: 'string', description: 'Optional webhook token' }
      },
      required: ['webhookId']
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
    name: 'discord_get_automod_rule',
    description: 'Get details of a single AutoMod rule in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        ruleId: { type: 'string', description: 'AutoMod Rule ID' }
      },
      required: ['guildId', 'ruleId']
    }
  },
  {
    name: 'discord_edit_automod_rule',
    description: 'Modify an existing auto moderation rule',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        ruleId: { type: 'string', description: 'Rule ID' },
        name: { type: 'string', description: 'New rule name' },
        enabled: { type: 'boolean', description: 'Enable/disable rule' },
        triggerMetadata: { type: 'object', description: 'Trigger metadata (keywordFilter, presets, etc.)' },
        actions: { type: 'array', description: 'Actions to take' },
        exemptRoles: { type: 'array', items: { type: 'string' }, description: 'Exempt role IDs' },
        exemptChannels: { type: 'array', items: { type: 'string' }, description: 'Exempt channel IDs' }
      },
      required: ['guildId', 'ruleId']
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

  // ============ STAGE INSTANCES ============
  {
    name: 'discord_get_stage_instance',
    description: 'Get the active stage instance associated with a stage channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Stage channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_create_stage_instance',
    description: 'Start/open a stage instance in a stage channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Stage channel ID' },
        topic: { type: 'string', description: 'Stage instance topic (1-120 characters)' },
        privacyLevel: { type: 'number', description: 'Privacy level (1=public, 2=guild_only, default 2)' },
        sendStartNotification: { type: 'boolean', description: 'Notify @everyone that stage has started' }
      },
      required: ['channelId', 'topic']
    }
  },
  {
    name: 'discord_edit_stage_instance',
    description: 'Edit topic or privacy of an active stage instance',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Stage channel ID' },
        topic: { type: 'string', description: 'New stage topic' },
        privacyLevel: { type: 'number', description: 'Privacy level' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_delete_stage_instance',
    description: 'Close/end an active stage instance',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Stage channel ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['channelId']
    }
  },

  // ============ SOUNDBOARD ============
  {
    name: 'discord_list_soundboard_sounds',
    description: 'List all custom soundboard sounds in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_create_soundboard_sound',
    description: 'Upload a custom soundboard sound file to a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Sound name (2-32 chars)' },
        sound: { type: 'string', description: 'Base64 encoded MP3/OGG sound data' },
        volume: { type: 'number', description: 'Default volume (0.0 to 1.0)' },
        emojiName: { type: 'string', description: 'Custom/unicode emoji associated with sound' }
      },
      required: ['guildId', 'name', 'sound']
    }
  },
  {
    name: 'discord_delete_soundboard_sound',
    description: 'Delete a custom soundboard sound from a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        soundId: { type: 'string', description: 'Soundboard sound ID' }
      },
      required: ['guildId', 'soundId']
    }
  },
  {
    name: 'discord_send_soundboard_sound',
    description: 'Play/send a soundboard sound into a voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Voice channel ID' },
        soundId: { type: 'string', description: 'Sound ID to play' },
        sourceGuildId: { type: 'string', description: 'Guild ID where the sound originates' }
      },
      required: ['channelId', 'soundId']
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
    name: 'discord_edit_scheduled_event',
    description: 'Modify scheduled event details or change its status (start, complete, cancel)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        eventId: { type: 'string', description: 'Event ID' },
        name: { type: 'string', description: 'Event name' },
        description: { type: 'string', description: 'Event description' },
        scheduledStartTime: { type: 'string', description: 'Start time (ISO 8601)' },
        scheduledEndTime: { type: 'string', description: 'End time (ISO 8601)' },
        status: { type: 'string', enum: ['SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELED'], description: 'Event status' },
        channelId: { type: 'string', description: 'Channel ID for voice/stage' },
        location: { type: 'string', description: 'Location for external event' }
      },
      required: ['guildId', 'eventId']
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
    description: 'List all scheduled events in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        withUserCount: { type: 'boolean', description: 'Include user counts' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_scheduled_event_users',
    description: 'Get list of users interested in / subscribed to a scheduled event',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        eventId: { type: 'string', description: 'Event ID' },
        limit: { type: 'number', description: 'Max users to fetch (1-100, default 100)' },
        withMember: { type: 'boolean', description: 'Include guild member details' }
      },
      required: ['guildId', 'eventId']
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
  },

  // ============ EXTENDED MESSAGES ============
  {
    name: 'discord_get_message',
    description: 'Fetch one specific message by channel ID and message ID',
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
    name: 'discord_reply_to_message',
    description: 'Send a referenced inline reply to a specific message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID to reply to' },
        content: { type: 'string', description: 'Reply text content' },
        embeds: { type: 'array', description: 'Optional array of embeds' },
        pingAuthor: { type: 'boolean', description: 'Whether to mention/ping the author (default true)' }
      },
      required: ['channelId', 'messageId', 'content']
    }
  },
  {
    name: 'discord_send_typing',
    description: 'Trigger the "Bot is typing..." indicator in a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_send_attachment',
    description: 'Send a message with one or more uploaded file attachments from URLs or local paths',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        content: { type: 'string', description: 'Optional text message content' },
        fileUrl: { type: 'string', description: 'Direct URL to a file/image to attach' },
        filePath: { type: 'string', description: 'Local path to a file/image to attach' },
        base64: { type: 'string', description: 'Base64 data URI or raw base64 string to attach' },
        fileName: { type: 'string', description: 'Custom file name (e.g. image.png)' },
        files: {
          type: 'array',
          description: 'Array of file attachment URLs, paths, or objects ({ attachment, name, description })'
        }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_download_attachment',
    description: 'Fetch and retrieve metadata/URL for a message attachment to download',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' },
        attachmentId: { type: 'string', description: 'Attachment ID (optional, default first attachment)' }
      },
      required: ['channelId', 'messageId']
    }
  },
  {
    name: 'discord_forward_message',
    description: 'Forward a message to another channel using Discord message snapshots',
    inputSchema: {
      type: 'object',
      properties: {
        fromChannelId: { type: 'string', description: 'Source channel ID' },
        messageId: { type: 'string', description: 'Message ID to forward' },
        toChannelId: { type: 'string', description: 'Destination channel ID' }
      },
      required: ['fromChannelId', 'messageId', 'toChannelId']
    }
  },
  {
    name: 'discord_clear_all_reactions',
    description: 'Remove every reaction from a message',
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
    name: 'discord_end_poll',
    description: 'Immediately end / expire an active poll on a message',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID containing the poll' }
      },
      required: ['channelId', 'messageId']
    }
  },
  {
    name: 'discord_get_poll_voters',
    description: 'List users who voted for a specific answer in a poll',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        messageId: { type: 'string', description: 'Message ID' },
        answerId: { type: 'number', description: 'Answer ID index (1-10)' },
        limit: { type: 'number', description: 'Max voters to fetch (1-100)' }
      },
      required: ['channelId', 'messageId', 'answerId']
    }
  },
  {
    name: 'discord_create_announcement_follower',
    description: 'Follow an announcement channel to cross-post messages into a target channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Announcement channel ID to follow' },
        targetChannelId: { type: 'string', description: 'Target channel ID in your server to receive posts' }
      },
      required: ['channelId', 'targetChannelId']
    }
  },

  // ============ EXTENDED THREADS & FORUM POSTS ============
  {
    name: 'discord_get_thread',
    description: 'Get complete thread information including member count, parent channel, and metadata',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_list_archived_public_threads',
    description: 'List archived public threads in a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        before: { type: 'string', description: 'Optional ISO timestamp to fetch threads before' },
        limit: { type: 'number', description: 'Max threads to return (default 50)' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_list_archived_private_threads',
    description: 'List archived private threads in a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        before: { type: 'string', description: 'Optional ISO timestamp to fetch threads before' },
        limit: { type: 'number', description: 'Max threads to return (default 50)' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_list_joined_private_threads',
    description: 'List joined private archived threads in a channel',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        limit: { type: 'number', description: 'Max threads to return' }
      },
      required: ['channelId']
    }
  },
  {
    name: 'discord_join_thread',
    description: 'Join a thread so the bot receives thread updates',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID to join' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_leave_thread',
    description: 'Leave a thread',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID to leave' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_add_thread_member',
    description: 'Add another member to a thread',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' },
        userId: { type: 'string', description: 'User ID to add' }
      },
      required: ['threadId', 'userId']
    }
  },
  {
    name: 'discord_remove_thread_member',
    description: 'Remove a member from a thread',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' },
        userId: { type: 'string', description: 'User ID to remove' }
      },
      required: ['threadId', 'userId']
    }
  },
  {
    name: 'discord_get_thread_member',
    description: 'Get thread member details for a specific user',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' },
        userId: { type: 'string', description: 'User ID' }
      },
      required: ['threadId', 'userId']
    }
  },
  {
    name: 'discord_list_thread_members',
    description: 'List all members in a thread',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_archive_thread',
    description: 'Archive a thread',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_unarchive_thread',
    description: 'Unarchive a thread',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Thread ID' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['threadId']
    }
  },
  {
    name: 'discord_modify_forum_post',
    description: 'Modify forum post properties: change applied tags, pin/unpin, archive, lock, or rename',
    inputSchema: {
      type: 'object',
      properties: {
        threadId: { type: 'string', description: 'Forum post Thread ID' },
        name: { type: 'string', description: 'New post title' },
        appliedTags: { type: 'array', items: { type: 'string' }, description: 'Array of tag IDs to apply' },
        pinned: { type: 'boolean', description: 'Pin/unpin the forum post' },
        archived: { type: 'boolean', description: 'Archive status' },
        locked: { type: 'boolean', description: 'Lock status' },
        slowmode: { type: 'number', description: 'Slowmode in seconds' }
      },
      required: ['threadId']
    }
  },

  // ============ EXTENDED MEMBERS & MODERATION ============
  {
    name: 'discord_bulk_ban_members',
    description: 'Native Discord bulk-ban endpoint to ban multiple users in one operation',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        userIds: { type: 'array', items: { type: 'string' }, description: 'List of user IDs to ban (up to 200)' },
        deleteMessageSeconds: { type: 'number', description: 'Number of seconds to delete messages (0-604800)' },
        reason: { type: 'string', description: 'Audit log reason' }
      },
      required: ['guildId', 'userIds']
    }
  },
  {
    name: 'discord_get_current_member',
    description: 'Get the bot member object and server permissions in a server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_edit_current_member',
    description: 'Change the bot server nickname in a server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        nickname: { type: 'string', description: 'New nickname for the bot (null/empty to reset)' }
      },
      required: ['guildId', 'nickname']
    }
  },
  {
    name: 'discord_get_member_roles',
    description: 'Get all expanded role objects assigned to a member',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_list_role_members',
    description: 'Find all members who hold a specific role in a server',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID' }
      },
      required: ['guildId', 'roleId']
    }
  },
  {
    name: 'discord_get_member_avatar',
    description: 'Resolve a member server-specific avatar URL, banner, and display color',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        memberId: { type: 'string', description: 'Member ID' }
      },
      required: ['guildId', 'memberId']
    }
  },
  {
    name: 'discord_get_member_permissions_in_channel',
    description: 'Calculate effective computed permissions for a member in a specific channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        channelId: { type: 'string', description: 'Channel ID' },
        memberId: { type: 'string', description: 'Member ID' }
      },
      required: ['guildId', 'channelId', 'memberId']
    }
  },

  // ============ EXTENDED GUILD MANAGEMENT & SAFETY ============
  {
    name: 'discord_get_guild_preview',
    description: 'Get public preview data for a discoverable guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_regions',
    description: 'List voice RTC regions available for a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_active_threads',
    description: 'List all active threads and thread members across a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_edit_vanity_url',
    description: 'Edit server vanity URL code',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        code: { type: 'string', description: 'New vanity invite code' }
      },
      required: ['guildId', 'code']
    }
  },
  {
    name: 'discord_get_guild_incidents',
    description: 'Get raid alerts and incident actions (DMs/invites disabled status)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_edit_guild_incidents',
    description: 'Configure raid alerts and temporarily disable invites/DMs',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        invitesDisabledUntil: { type: 'string', description: 'ISO timestamp or null to enable' },
        dmsDisabledUntil: { type: 'string', description: 'ISO timestamp or null to enable' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_member_safety_settings',
    description: 'Get guild safety and verification requirements',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_mfa_level',
    description: 'Get server 2FA / MFA requirement level for moderation actions',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_guild_nsfw_level',
    description: 'Get guild NSFW classification level',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },

  // ============ NATIVE SERVER TEMPLATES ============
  {
    name: 'discord_get_template',
    description: 'Get native Discord server template details by code',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Template code' }
      },
      required: ['code']
    }
  },
  {
    name: 'discord_list_guild_templates',
    description: 'List all native server templates created for a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_create_guild_template',
    description: 'Create a native Discord template from current server layout',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        name: { type: 'string', description: 'Template name' },
        description: { type: 'string', description: 'Template description' }
      },
      required: ['guildId', 'name']
    }
  },
  {
    name: 'discord_sync_guild_template',
    description: 'Sync native guild template with current server structure',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        code: { type: 'string', description: 'Template code' }
      },
      required: ['guildId', 'code']
    }
  },
  {
    name: 'discord_edit_guild_template',
    description: 'Edit name and description of a native guild template',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        code: { type: 'string', description: 'Template code' },
        name: { type: 'string', description: 'New template name' },
        description: { type: 'string', description: 'New template description' }
      },
      required: ['guildId', 'code']
    }
  },
  {
    name: 'discord_delete_guild_template',
    description: 'Delete a native server template',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        code: { type: 'string', description: 'Template code' }
      },
      required: ['guildId', 'code']
    }
  },
  {
    name: 'discord_create_guild_from_template',
    description: 'Create a new Discord guild from a native template code',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Template code' },
        name: { type: 'string', description: 'New server name' },
        icon: { type: 'string', description: 'Base64 image icon (optional)' }
      },
      required: ['code', 'name']
    }
  },

  // ============ EXTENDED ROLES ============
  {
    name: 'discord_modify_single_role_position',
    description: 'Move a single role to a specific position index in role hierarchy',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID' },
        position: { type: 'number', description: 'New position index' }
      },
      required: ['guildId', 'roleId', 'position']
    }
  },
  {
    name: 'discord_get_role_members',
    description: 'Get list of member objects assigned to a role',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID' }
      },
      required: ['guildId', 'roleId']
    }
  },
  {
    name: 'discord_get_default_everyone_role',
    description: 'Get @everyone default role object and guild-wide default permissions',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_set_role_icon',
    description: 'Set or remove role custom icon image for boosted servers',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID' },
        icon: { type: 'string', description: 'Image URL or base64 (null to clear)' }
      },
      required: ['guildId', 'roleId']
    }
  },
  {
    name: 'discord_set_role_unicode_emoji',
    description: 'Set standard Unicode emoji for a role',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        roleId: { type: 'string', description: 'Role ID' },
        unicodeEmoji: { type: 'string', description: 'Unicode emoji character' }
      },
      required: ['guildId', 'roleId', 'unicodeEmoji']
    }
  },

  // ============ EXTENDED STICKERS, EMOJIS & SOUNDBOARD ============
  {
    name: 'discord_get_sticker',
    description: 'Fetch details of a single sticker by sticker ID',
    inputSchema: {
      type: 'object',
      properties: {
        stickerId: { type: 'string', description: 'Sticker ID' }
      },
      required: ['stickerId']
    }
  },
  {
    name: 'discord_edit_sticker',
    description: 'Edit custom sticker name, description, or tags',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        stickerId: { type: 'string', description: 'Sticker ID' },
        name: { type: 'string', description: 'New sticker name' },
        description: { type: 'string', description: 'New description' },
        tags: { type: 'string', description: 'Autocomplete/search tags' }
      },
      required: ['guildId', 'stickerId']
    }
  },
  {
    name: 'discord_get_soundboard_sound',
    description: 'Fetch details of a specific soundboard sound in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        soundId: { type: 'string', description: 'Soundboard sound ID' }
      },
      required: ['guildId', 'soundId']
    }
  },
  {
    name: 'discord_edit_soundboard_sound',
    description: 'Edit soundboard sound name, volume, or associated emoji',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        soundId: { type: 'string', description: 'Soundboard sound ID' },
        name: { type: 'string', description: 'New sound name' },
        volume: { type: 'number', description: 'Volume between 0 and 1' },
        emojiName: { type: 'string', description: 'Emoji name' }
      },
      required: ['guildId', 'soundId']
    }
  },
  {
    name: 'discord_list_default_soundboard_sounds',
    description: 'List Discord default built-in soundboard sounds',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },

  // ============ EXTENDED SCHEDULED EVENTS ============
  {
    name: 'discord_get_scheduled_event',
    description: 'Fetch single scheduled event details and interested user counts',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        eventId: { type: 'string', description: 'Scheduled Event ID' },
        withUserCount: { type: 'boolean', description: 'Include count of interested users' }
      },
      required: ['guildId', 'eventId']
    }
  },

  // ============ EXTENDED WEBHOOKS ============
  {
    name: 'discord_execute_webhook_slack',
    description: 'Execute a webhook using Slack-compatible message payload format',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        webhookToken: { type: 'string', description: 'Webhook Token' },
        payload: { type: 'object', description: 'Slack-compatible JSON payload' }
      },
      required: ['webhookId', 'webhookToken', 'payload']
    }
  },
  {
    name: 'discord_execute_webhook_github',
    description: 'Execute a webhook using GitHub-compatible webhook payload format',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        webhookToken: { type: 'string', description: 'Webhook Token' },
        payload: { type: 'object', description: 'GitHub event payload' }
      },
      required: ['webhookId', 'webhookToken', 'payload']
    }
  },
  {
    name: 'discord_get_webhook_message',
    description: 'Get a previously sent webhook message by ID',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        webhookToken: { type: 'string', description: 'Webhook Token' },
        messageId: { type: 'string', description: 'Message ID' },
        threadId: { type: 'string', description: 'Optional Thread ID' }
      },
      required: ['webhookId', 'webhookToken', 'messageId']
    }
  },
  {
    name: 'discord_edit_webhook_message',
    description: 'Edit a message previously sent by a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        webhookToken: { type: 'string', description: 'Webhook Token' },
        messageId: { type: 'string', description: 'Message ID' },
        content: { type: 'string', description: 'New message text' },
        embeds: { type: 'array', description: 'New embeds' },
        threadId: { type: 'string', description: 'Optional Thread ID' }
      },
      required: ['webhookId', 'webhookToken', 'messageId']
    }
  },
  {
    name: 'discord_delete_webhook_message',
    description: 'Delete a message previously sent by a webhook',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        webhookToken: { type: 'string', description: 'Webhook Token' },
        messageId: { type: 'string', description: 'Message ID' },
        threadId: { type: 'string', description: 'Optional Thread ID' }
      },
      required: ['webhookId', 'webhookToken', 'messageId']
    }
  },
  {
    name: 'discord_execute_webhook_in_thread',
    description: 'Execute a webhook directly into a thread or create a new thread',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        webhookToken: { type: 'string', description: 'Webhook Token' },
        threadId: { type: 'string', description: 'Thread ID to send into' },
        threadName: { type: 'string', description: 'Create a new thread with this name if sending in forum' },
        content: { type: 'string', description: 'Message text' },
        username: { type: 'string', description: 'Override bot username' },
        avatarUrl: { type: 'string', description: 'Override bot avatar URL' }
      },
      required: ['webhookId', 'webhookToken', 'content']
    }
  },
  {
    name: 'discord_execute_webhook_wait',
    description: 'Send a webhook message and wait to return the complete created message object',
    inputSchema: {
      type: 'object',
      properties: {
        webhookId: { type: 'string', description: 'Webhook ID' },
        webhookToken: { type: 'string', description: 'Webhook Token' },
        content: { type: 'string', description: 'Message text content' },
        embeds: { type: 'array', description: 'Embeds' },
        username: { type: 'string', description: 'Override username' },
        avatarUrl: { type: 'string', description: 'Override avatar URL' }
      },
      required: ['webhookId', 'webhookToken']
    }
  },

  // ============ EXTENDED SLASH COMMANDS ============
  {
    name: 'discord_get_global_command',
    description: 'Fetch details of a single global slash command by command ID',
    inputSchema: {
      type: 'object',
      properties: {
        commandId: { type: 'string', description: 'Command ID' }
      },
      required: ['commandId']
    }
  },
  {
    name: 'discord_edit_global_command',
    description: 'Edit a global slash command description or options',
    inputSchema: {
      type: 'object',
      properties: {
        commandId: { type: 'string', description: 'Command ID' },
        name: { type: 'string', description: 'Command name' },
        description: { type: 'string', description: 'Command description' },
        options: { type: 'array', description: 'Command options' }
      },
      required: ['commandId']
    }
  },
  {
    name: 'discord_bulk_overwrite_global_commands',
    description: 'Bulk overwrite all global slash commands for the application',
    inputSchema: {
      type: 'object',
      properties: {
        commands: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Command name' },
              description: { type: 'string', description: 'Command description' },
              options: { type: 'array', description: 'Options' }
            },
            required: ['name', 'description']
          },
          description: 'Array of command objects'
        }
      },
      required: ['commands']
    }
  },
  {
    name: 'discord_get_guild_command',
    description: 'Fetch single guild slash command details by ID',
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
    name: 'discord_edit_guild_command',
    description: 'Edit a guild slash command description or options',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        commandId: { type: 'string', description: 'Command ID' },
        name: { type: 'string', description: 'Command name' },
        description: { type: 'string', description: 'Command description' },
        options: { type: 'array', description: 'Options' }
      },
      required: ['guildId', 'commandId']
    }
  },
  {
    name: 'discord_bulk_overwrite_guild_commands',
    description: 'Bulk overwrite all slash commands in a specific guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        commands: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Command name' },
              description: { type: 'string', description: 'Command description' },
              options: { type: 'array', description: 'Options' }
            },
            required: ['name', 'description']
          },
          description: 'Array of command objects'
        }
      },
      required: ['guildId', 'commands']
    }
  },
  {
    name: 'discord_get_command_permissions',
    description: 'Get role and user permission overrides for a guild slash command',
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
    name: 'discord_edit_command_permissions',
    description: 'Set role/user permissions for a guild command',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        commandId: { type: 'string', description: 'Command ID' },
        permissions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Role or User ID' },
              type: { type: 'number', description: '1 for Role, 2 for User' },
              permission: { type: 'boolean', description: 'Allow or deny' }
            },
            required: ['id', 'type', 'permission']
          },
          description: 'Array of permission objects'
        }
      },
      required: ['guildId', 'commandId', 'permissions']
    }
  },
  {
    name: 'discord_batch_edit_command_permissions',
    description: 'Batch edit permissions for multiple commands in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        commandPermissions: { type: 'array', items: { type: 'object' }, description: 'Array of command permission objects' }
      },
      required: ['guildId', 'commandPermissions']
    }
  },

  // ============ EXTENDED INTERACTIONS ============
  {
    name: 'discord_delete_interaction_reply',
    description: 'Delete initial response to an interaction',
    inputSchema: {
      type: 'object',
      properties: {
        applicationId: { type: 'string', description: 'Bot Application ID (optional)' },
        interactionToken: { type: 'string', description: 'Interaction Token' }
      },
      required: ['interactionToken']
    }
  },
  {
    name: 'discord_send_interaction_followup',
    description: 'Send a follow-up message to an interaction',
    inputSchema: {
      type: 'object',
      properties: {
        interactionToken: { type: 'string', description: 'Interaction Token' },
        content: { type: 'string', description: 'Follow-up message text' },
        embeds: { type: 'array', description: 'Embeds' },
        ephemeral: { type: 'boolean', description: 'Only visible to interacting user' }
      },
      required: ['interactionToken']
    }
  },
  {
    name: 'discord_get_interaction_followup',
    description: 'Get a follow-up message sent for an interaction',
    inputSchema: {
      type: 'object',
      properties: {
        interactionToken: { type: 'string', description: 'Interaction Token' },
        messageId: { type: 'string', description: 'Follow-up Message ID' }
      },
      required: ['interactionToken', 'messageId']
    }
  },
  {
    name: 'discord_edit_interaction_followup',
    description: 'Edit a follow-up message previously sent for an interaction',
    inputSchema: {
      type: 'object',
      properties: {
        interactionToken: { type: 'string', description: 'Interaction Token' },
        messageId: { type: 'string', description: 'Follow-up Message ID' },
        content: { type: 'string', description: 'New message text' },
        embeds: { type: 'array', description: 'New embeds' }
      },
      required: ['interactionToken', 'messageId']
    }
  },
  {
    name: 'discord_delete_interaction_followup',
    description: 'Delete a follow-up message from an interaction',
    inputSchema: {
      type: 'object',
      properties: {
        interactionToken: { type: 'string', description: 'Interaction Token' },
        messageId: { type: 'string', description: 'Follow-up Message ID' }
      },
      required: ['interactionToken', 'messageId']
    }
  },
  {
    name: 'discord_reply_autocomplete',
    description: 'Respond to an autocomplete interaction with suggestion choices',
    inputSchema: {
      type: 'object',
      properties: {
        interactionId: { type: 'string', description: 'Interaction ID' },
        interactionToken: { type: 'string', description: 'Interaction Token' },
        choices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Display name' },
              value: { type: 'string', description: 'Choice value' }
            },
            required: ['name', 'value']
          },
          description: 'List of autocomplete choices (max 25)'
        }
      },
      required: ['interactionId', 'interactionToken', 'choices']
    }
  },
  {
    name: 'discord_launch_activity',
    description: 'Create an activity invite link in a voice channel (e.g. YouTube Together, Chess)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Voice channel ID' },
        applicationId: { type: 'string', description: 'Embedded Activity Application ID' }
      },
      required: ['channelId', 'applicationId']
    }
  },

  // ============ GATEWAY EVENT SYSTEM ============
  {
    name: 'discord_subscribe_events',
    description: 'Subscribe to gateway event types for background listening (e.g., messageCreate, voiceStateUpdate)',
    inputSchema: {
      type: 'object',
      properties: {
        events: {
          type: 'array',
          items: { type: 'string' },
          description: 'Event names: messageCreate, messageDelete, messageReactionAdd, guildMemberAdd, voiceStateUpdate, interactionCreate, threadCreate, etc.'
        }
      },
      required: ['events']
    }
  },
  {
    name: 'discord_unsubscribe_events',
    description: 'Unsubscribe from specific gateway events',
    inputSchema: {
      type: 'object',
      properties: {
        events: { type: 'array', items: { type: 'string' }, description: 'List of events to remove' }
      },
      required: ['events']
    }
  },
  {
    name: 'discord_list_event_subscriptions',
    description: 'List all currently active gateway event subscriptions',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'discord_wait_for_event',
    description: 'Wait / poll until a specific Discord event occurs (e.g., waiting for user to send a message or react)',
    inputSchema: {
      type: 'object',
      properties: {
        event: { type: 'string', description: 'Event to wait for (e.g., messageCreate, messageReactionAdd, voiceStateUpdate)' },
        timeoutMs: { type: 'number', description: 'Max wait time in milliseconds (default 30000)' },
        channelId: { type: 'string', description: 'Filter events from specific channel' },
        userId: { type: 'string', description: 'Filter events from specific user' }
      },
      required: ['event']
    }
  },
  {
    name: 'discord_get_recent_events',
    description: 'Get the latest gateway events captured in the event buffer with filters',
    inputSchema: {
      type: 'object',
      properties: {
        event: { type: 'string', description: 'Filter by event name' },
        guildId: { type: 'string', description: 'Filter by guild ID' },
        channelId: { type: 'string', description: 'Filter by channel ID' },
        userId: { type: 'string', description: 'Filter by user ID' },
        limit: { type: 'number', description: 'Max events to return (default 50)' }
      },
      required: []
    }
  },
  {
    name: 'discord_register_message_handler',
    description: 'Register a persistent automated handler for message events (log, collect, auto-respond)',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID to listen on (optional, listens server-wide if omitted)' },
        action: { type: 'string', enum: ['log', 'collect', 'forward'], description: 'Action type' }
      },
      required: ['action']
    }
  },
  {
    name: 'discord_register_reaction_handler',
    description: 'Register a persistent handler for emoji reactions',
    inputSchema: {
      type: 'object',
      properties: {
        channelId: { type: 'string', description: 'Channel ID' },
        action: { type: 'string', enum: ['log', 'collect', 'forward'], description: 'Action type' }
      },
      required: ['action']
    }
  },
  {
    name: 'discord_register_member_handler',
    description: 'Register a persistent handler for member joins, leaves, and role updates',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        action: { type: 'string', enum: ['log', 'collect', 'forward'], description: 'Action type' }
      },
      required: ['guildId', 'action']
    }
  },
  {
    name: 'discord_register_voice_handler',
    description: 'Register a persistent handler for voice channel join/leave/mute state changes',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        action: { type: 'string', enum: ['log', 'collect', 'forward'], description: 'Action type' }
      },
      required: ['guildId', 'action']
    }
  },
  {
    name: 'discord_register_thread_handler',
    description: 'Register a persistent handler for thread create/update/archive events',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        action: { type: 'string', enum: ['log', 'collect', 'forward'], description: 'Action type' }
      },
      required: ['guildId', 'action']
    }
  },
  {
    name: 'discord_register_interaction_handler',
    description: 'Register a persistent handler for button clicks, select menu changes, and modal submits',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        action: { type: 'string', enum: ['log', 'collect', 'forward'], description: 'Action type' }
      },
      required: ['guildId', 'action']
    }
  },
  {
    name: 'discord_unregister_handler',
    description: 'Remove a previously registered automated event handler by ID',
    inputSchema: {
      type: 'object',
      properties: {
        handlerId: { type: 'string', description: 'Handler registration ID' }
      },
      required: ['handlerId']
    }
  },

  // ============ LIVE VOICE & AUDIO CONNECTION ============
  {
    name: 'discord_join_voice_channel',
    description: 'Connect the bot to a voice or stage channel in a guild',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        channelId: { type: 'string', description: 'Voice channel ID' },
        selfMute: { type: 'boolean', description: 'Join muted' },
        selfDeaf: { type: 'boolean', description: 'Join deafened' }
      },
      required: ['guildId', 'channelId']
    }
  },
  {
    name: 'discord_leave_voice_channel',
    description: 'Disconnect the bot from its active voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_get_bot_voice_state',
    description: 'Get current bot voice connection status, volume, and currently playing audio',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_play_audio',
    description: 'Play an audio stream or URL in the connected voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        source: { type: 'string', description: 'Audio URL or stream source' },
        title: { type: 'string', description: 'Audio title (optional)' }
      },
      required: ['guildId', 'source']
    }
  },
  {
    name: 'discord_pause_audio',
    description: 'Pause audio playback in voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_resume_audio',
    description: 'Resume paused audio playback in voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_stop_audio',
    description: 'Stop audio playback and clear audio queue in voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_set_audio_volume',
    description: 'Set audio playback volume (0 to 200%)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        volume: { type: 'number', description: 'Volume level (0-200)' }
      },
      required: ['guildId', 'volume']
    }
  },
  {
    name: 'discord_play_audio_url',
    description: 'Stream audio directly from a web URL into the voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        url: { type: 'string', description: 'Direct audio URL (e.g. mp3/wav/ogg stream)' },
        title: { type: 'string', description: 'Track title' }
      },
      required: ['guildId', 'url']
    }
  },
  {
    name: 'discord_play_local_audio',
    description: 'Play a local sound file from disk in the voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        filePath: { type: 'string', description: 'Local path to the audio file' }
      },
      required: ['guildId', 'filePath']
    }
  },
  {
    name: 'discord_speak_tts',
    description: 'Convert text to speech and speak it in the connected voice channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        text: { type: 'string', description: 'Text message to speak' },
        voice: { type: 'string', description: 'Voice accent/language (e.g. en, es, fr)' }
      },
      required: ['guildId', 'text']
    }
  },
  {
    name: 'discord_start_voice_recording',
    description: 'Start recording audio from users in the active voice channel with multi-track and user filter support',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        userId: { type: 'string', description: 'Optional: record only a specific user ID' },
        excludedUserIds: { type: 'array', items: { type: 'string' }, description: 'User IDs to ignore/block from recording' },
        multiTrack: { type: 'boolean', description: 'Save separate audio files per speaker in addition to combined master track (default true)' },
        format: { type: 'string', enum: ['opus', 'raw'], description: 'Audio file format' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_stop_voice_recording',
    description: 'Stop active voice recording, finalize in-memory audio buffers, get Base64 data URIs, and optionally post directly to a Discord channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        sendToChannelId: { type: 'string', description: 'Optional: Text channel ID to upload the recorded audio directly as a Discord attachment message' }
      },
      required: ['guildId']
    }
  },
  {
    name: 'discord_list_voice_recordings',
    description: 'List saved voice channel audio recordings on disk with timestamps and duration',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Optional: filter by Guild ID' }
      },
      required: []
    }
  },

  // ============ HIGH-LEVERAGE POWER PRIMITIVES ============
  {
    name: 'discord_resolve',
    description: 'Resolve a Discord server, channel, role, member, emoji, command, or message from a URL, ID, mention (<#id>, <@id>, <@&id>), or name',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'URL, ID, mention string, or name to resolve' },
        guildId: { type: 'string', description: 'Optional Guild ID context to search in' },
        type: { type: 'string', enum: ['channel', 'user', 'member', 'role', 'guild', 'message', 'emoji'], description: 'Optional target entity type filter' }
      },
      required: ['query']
    }
  },
  {
    name: 'discord_permission_check',
    description: 'Preflight check if bot has required permissions and role hierarchy to perform an action on a target member/role/channel',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        action: { type: 'string', description: 'Action to check (e.g. ban_member, kick_member, manage_roles, send_messages, manage_channels, manage_webhooks, mute_members)' },
        channelId: { type: 'string', description: 'Optional Channel ID to check channel-specific permissions' },
        targetUserId: { type: 'string', description: 'Optional Target Member/User ID to check role hierarchy' },
        targetRoleId: { type: 'string', description: 'Optional Target Role ID to check role hierarchy' }
      },
      required: ['guildId', 'action']
    }
  },
  {
    name: 'discord_batch',
    description: 'Execute multiple independent Discord MCP tool calls in a batch with concurrency control and per-operation results',
    inputSchema: {
      type: 'object',
      properties: {
        operations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: 'Operation identifier' },
              tool: { type: 'string', description: 'MCP Tool name to execute' },
              args: { type: 'object', description: 'Arguments object for the tool' }
            },
            required: ['id', 'tool', 'args']
          },
          description: 'Array of tool operations to execute'
        },
        continueOnError: { type: 'boolean', description: 'Continue executing remaining operations if one fails (default true)' },
        concurrency: { type: 'number', description: 'Maximum parallel operations (1-10, default 3)' }
      },
      required: ['operations']
    }
  },
  {
    name: 'discord_get_api_capabilities',
    description: 'Report bot Gateway intents, application flags, voice readiness, REST API version, and available privileged intents',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'discord_asset_to_data_uri',
    description: 'Convert an image/file from a web URL or local path into a Discord-compatible base64 Data URI string for emoji/sticker/icon uploads',
    inputSchema: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'Web URL (http/https) or local file path to the image' }
      },
      required: ['url']
    }
  },
  {
    name: 'discord_add_guild_member',
    description: 'Add an OAuth2-authorized user to a server using their OAuth access token (requires guilds.join scope)',
    inputSchema: {
      type: 'object',
      properties: {
        guildId: { type: 'string', description: 'Guild ID' },
        userId: { type: 'string', description: 'Discord User ID' },
        accessToken: { type: 'string', description: 'OAuth2 access token with guilds.join scope' },
        nickname: { type: 'string', description: 'Optional server nickname' },
        roles: { type: 'array', items: { type: 'string' }, description: 'Optional array of role IDs to assign' },
        mute: { type: 'boolean', description: 'Join voice muted' },
        deaf: { type: 'boolean', description: 'Join voice deafened' }
      },
      required: ['guildId', 'userId', 'accessToken']
    }
  },
  {
    name: 'discord_api_call',
    description: 'Universal fallback to execute raw Discord REST API endpoints (GET, POST, PATCH, PUT, DELETE) with query params, body, and audit log reason',
    inputSchema: {
      type: 'object',
      properties: {
        method: { type: 'string', enum: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], description: 'HTTP method (default GET)' },
        endpoint: { type: 'string', description: 'Discord REST endpoint path (e.g. /guilds/123/members or /channels/456/messages)' },
        body: { type: 'object', description: 'Optional JSON payload body' },
        query: { type: 'object', description: 'Optional key-value query parameters' },
        reason: { type: 'string', description: 'Optional X-Audit-Log-Reason header string' },
        apiVersion: { type: 'string', description: 'Discord API version (default 10)' }
      },
      required: ['endpoint']
    }
  }
]

