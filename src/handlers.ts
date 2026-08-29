import {
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  WebhookClient,
  ActivityType,
  AttachmentBuilder,
  type PresenceStatusData,
  type Client,
  type TextChannel,
  type GuildChannel
} from 'discord.js'
import type { ToolResult, DatabaseHandlers } from './types'
import { eventManager } from './events'
import { voiceManager } from './voice'

function success(data: any): ToolResult {
  return { success: true, data }
}

function error(code: string, message: string): ToolResult {
  return { success: false, error: { code, message } }
}

function normalizeAttachments(args: any): AttachmentBuilder[] {
  const result: AttachmentBuilder[] = []
  
  if (args.fileUrl || args.url) {
    const u = args.fileUrl || args.url
    result.push(new AttachmentBuilder(u, { name: args.fileName || args.name }))
  }
  if (args.filePath) {
    result.push(new AttachmentBuilder(args.filePath, { name: args.fileName || args.name }))
  }
  if (args.base64) {
    const raw = args.base64.includes(',') ? args.base64.split(',')[1] : args.base64
    const buffer = Buffer.from(raw, 'base64')
    result.push(new AttachmentBuilder(buffer, { name: args.fileName || 'attachment.png' }))
  }
  if (args.files && Array.isArray(args.files)) {
    for (const f of args.files) {
      if (typeof f === 'string') {
        result.push(new AttachmentBuilder(f))
      } else if (f && typeof f === 'object') {
        const source = f.attachment || f.url || f.filePath || f.file
        if (source) {
          result.push(new AttachmentBuilder(source, { name: f.name || f.filename, description: f.description }))
        }
      }
    }
  } else if (args.files && typeof args.files === 'string') {
    result.push(new AttachmentBuilder(args.files))
  }
  return result
}

const SERVER_TEMPLATES: Record<string, any> = {
  gaming: {
    categories: [
      { name: 'INFORMATION', channels: [{ name: 'rules', type: 'text' }, { name: 'announcements', type: 'text' }] },
      { name: 'GENERAL', channels: [{ name: 'general-chat', type: 'text' }, { name: 'memes', type: 'text' }] },
      { name: 'VOICE', channels: [{ name: 'General Voice', type: 'voice' }, { name: 'Gaming 1', type: 'voice' }] }
    ],
    roles: [
      { name: 'Admin', color: '#FF0000', hoist: true },
      { name: 'Moderator', color: '#00FF00', hoist: true },
      { name: 'Member', color: '#0099FF', hoist: true }
    ]
  },
  community: {
    categories: [
      { name: 'WELCOME', channels: [{ name: 'rules', type: 'text' }, { name: 'introductions', type: 'text' }] },
      { name: 'COMMUNITY', channels: [{ name: 'general', type: 'text' }, { name: 'off-topic', type: 'text' }] },
      { name: 'HANGOUT', channels: [{ name: 'Lounge', type: 'voice' }] }
    ],
    roles: [
      { name: 'Staff', color: '#E74C3C', hoist: true },
      { name: 'Member', color: '#95A5A6' }
    ]
  }
}

export function extractGuildId(name: string, args: any, client: Client): string | null {
  if (args?.guildId) return args.guildId
  if (args?.guild_id) return args.guild_id

  if (args?.channelId) {
    const channel = client.channels.cache.get(args.channelId) as GuildChannel | undefined
    return channel?.guildId || null
  }
  if (args?.categoryId) {
    const channel = client.channels.cache.get(args.categoryId) as GuildChannel | undefined
    return channel?.guildId || null
  }
  if (args?.threadId) {
    const channel = client.channels.cache.get(args.threadId) as GuildChannel | undefined
    return channel?.guildId || null
  }

  const globalCommands = [
    'discord_get_bot_info',
    'discord_get_gateway_info',
    'discord_set_presence',
    'discord_set_activity',
    'discord_list_guilds',
    'discord_disconnect',
    'discord_send_dm',
    'discord_edit_dm',
    'discord_delete_dm',
    'discord_get_dms',
    'discord_delete_invite',
    'discord_get_invite_details',
    'discord_get_user',
    'discord_get_user_profile',
    'discord_edit_bot_profile',
    'discord_get_template',
    'discord_create_guild_from_template',
    'discord_get_sticker',
    'discord_list_default_soundboard_sounds',
    'discord_get_global_command',
    'discord_get_global_commands',
    'discord_create_global_command',
    'discord_edit_global_command',
    'discord_delete_global_command',
    'discord_bulk_overwrite_global_commands',
    'discord_execute_webhook_slack',
    'discord_execute_webhook_github',
    'discord_get_webhook_message',
    'discord_edit_webhook_message',
    'discord_delete_webhook_message',
    'discord_execute_webhook_in_thread',
    'discord_execute_webhook_wait',
    'discord_delete_interaction_reply',
    'discord_send_interaction_followup',
    'discord_get_interaction_followup',
    'discord_edit_interaction_followup',
    'discord_delete_interaction_followup',
    'discord_reply_autocomplete',
    'discord_subscribe_events',
    'discord_unsubscribe_events',
    'discord_list_event_subscriptions',
    'discord_wait_for_event',
    'discord_get_recent_events',
    'discord_register_message_handler',
    'discord_register_reaction_handler',
    'discord_unregister_handler',
    'discord_search_emojigg',
    'discord_api_call',
    'discord_resolve',
    'discord_get_api_capabilities',
    'discord_asset_to_data_uri',
    'discord_batch',
    'get_allowed_guilds'
  ]
  if (globalCommands.includes(name)) return null

  return null
}

export async function handleToolCall(client: Client, name: string, args: any, db?: DatabaseHandlers): Promise<ToolResult> {
  try {
    eventManager.init(client)
    switch (name) {
      // ========== BOT STATUS ==========
      case 'discord_get_bot_info': {
        const user = client.user!
        return success({
          id: user.id,
          username: user.username,
          discriminator: user.discriminator,
          tag: user.tag,
          avatar: user.displayAvatarURL(),
          bot: user.bot,
          guildsCount: client.guilds.cache.size,
          uptime: client.uptime,
          readyAt: client.readyAt
        })
      }

      case 'discord_get_gateway_info':
        return success({ ping: client.ws.ping, status: client.ws.status, shardCount: client.options.shardCount || 1 })

      case 'discord_set_presence': {
        const statusMap: Record<string, PresenceStatusData> = { online: 'online', idle: 'idle', dnd: 'dnd', invisible: 'invisible' }
        client.user?.setPresence({ status: statusMap[args.status] || 'online' })
        return success({ status: args.status })
      }

      case 'discord_set_activity': {
        const typeMap: Record<string, ActivityType> = {
          playing: ActivityType.Playing, streaming: ActivityType.Streaming, listening: ActivityType.Listening,
          watching: ActivityType.Watching, competing: ActivityType.Competing, custom: ActivityType.Custom
        }
        client.user?.setActivity(args.name, { type: typeMap[args.type] || ActivityType.Playing, url: args.url })
        return success({ activity: args.name, type: args.type })
      }

      case 'discord_disconnect':
        client.destroy()
        return success({ message: 'Bot disconnected from Discord gateway' })

      // ========== DIRECT MESSAGES (DMs) ==========
      case 'discord_send_dm': {
        const user = await client.users.fetch(args.userId)
        if (!user) return error('NOT_FOUND', 'User not found')
        const dmChannel = user.dmChannel || await user.createDM()
        const msg = await dmChannel.send({ content: args.content, embeds: args.embeds })
        return success({ messageId: msg.id, userId: user.id })
      }

      case 'discord_edit_dm': {
        const user = await client.users.fetch(args.userId)
        if (!user) return error('NOT_FOUND', 'User not found')
        const dmChannel = user.dmChannel || await user.createDM()
        const message = await dmChannel.messages.fetch(args.messageId)
        if (!message) return error('NOT_FOUND', 'DM message not found')
        const updated = await message.edit({ content: args.content, embeds: args.embeds })
        return success({ messageId: updated.id, userId: user.id })
      }

      case 'discord_delete_dm': {
        const user = await client.users.fetch(args.userId)
        if (!user) return error('NOT_FOUND', 'User not found')
        const dmChannel = user.dmChannel || await user.createDM()
        const message = await dmChannel.messages.fetch(args.messageId)
        if (!message) return error('NOT_FOUND', 'DM message not found')
        await message.delete()
        return success({ deleted: true, messageId: args.messageId })
      }

      case 'discord_get_dms': {
        const user = await client.users.fetch(args.userId)
        if (!user) return error('NOT_FOUND', 'User not found')
        const dmChannel = user.dmChannel || await user.createDM()
        const fetchOptions: any = { limit: Math.min(args.limit || 50, 100) }
        if (args.before) fetchOptions.before = args.before
        if (args.after) fetchOptions.after = args.after
        if (args.around) fetchOptions.around = args.around
        const messages = (await dmChannel.messages.fetch(fetchOptions)) as any
        return success({
          messages: messages.map((m: any) => ({
            id: m.id,
            author: { id: m.author.id, username: m.author.username, bot: m.author.bot },
            content: m.content,
            embeds: m.embeds?.map((e: any) => e.toJSON ? e.toJSON() : e),
            attachments: m.attachments?.map((a: any) => ({ id: a.id, name: a.name, url: a.url, size: a.size, contentType: a.contentType })),
            createdAt: m.createdAt
          })),
          total: messages.size
        })
      }

      // ========== GUILD MANAGEMENT ==========
      case 'discord_list_guilds':
        return success({
          guilds: client.guilds.cache.map(g => ({
            id: g.id,
            name: g.name,
            icon: g.iconURL(),
            memberCount: g.memberCount,
            ownerId: g.ownerId
          }))
        })

      case 'discord_get_guild': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        return success({
          id: guild.id,
          name: guild.name,
          icon: guild.iconURL(),
          splash: guild.splashURL(),
          banner: guild.bannerURL(),
          description: guild.description,
          ownerId: guild.ownerId,
          memberCount: guild.memberCount,
          rolesCount: guild.roles.cache.size,
          channelsCount: guild.channels.cache.size,
          emojisCount: guild.emojis.cache.size,
          stickersCount: guild.stickers.cache.size,
          premiumTier: guild.premiumTier,
          premiumSubscriptionCount: guild.premiumSubscriptionCount,
          verificationLevel: guild.verificationLevel,
          explicitContentFilter: guild.explicitContentFilter,
          defaultMessageNotifications: guild.defaultMessageNotifications,
          afkChannelId: guild.afkChannelId,
          afkTimeout: guild.afkTimeout,
          systemChannelId: guild.systemChannelId,
          rulesChannelId: guild.rulesChannelId,
          publicUpdatesChannelId: guild.publicUpdatesChannelId,
          preferredLocale: guild.preferredLocale,
          features: guild.features,
          createdAt: guild.createdAt
        })
      }

      case 'discord_edit_guild': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const updated = await guild.edit({
          name: args.name,
          verificationLevel: args.verificationLevel,
          defaultMessageNotifications: args.defaultMessageNotifications,
          explicitContentFilter: args.explicitContentFilter,
          afkChannel: args.afkChannelId,
          afkTimeout: args.afkTimeout,
          systemChannel: args.systemChannelId,
          systemChannelFlags: args.systemChannelFlags,
          rulesChannel: args.rulesChannelId,
          publicUpdatesChannel: args.publicUpdatesChannelId,
          preferredLocale: args.preferredLocale,
          description: args.description,
          premiumProgressBarEnabled: args.premiumProgressBarEnabled
        })
        return success({ id: updated.id, name: updated.name })
      }

      case 'discord_get_guild_channels': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const channels = Array.from(guild.channels.cache.values()).map(c => ({
          id: c.id,
          name: c.name,
          type: c.type,
          parentId: c.parentId,
          position: 'position' in c ? (c as any).position : 0
        }))
        return success({ channels })
      }

      case 'discord_get_guild_roles': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const roles = Array.from(guild.roles.cache.values()).map(r => ({
          id: r.id,
          name: r.name,
          color: r.color,
          hoist: r.hoist,
          position: r.position,
          permissions: r.permissions.bitfield.toString(),
          mentionable: r.mentionable
        }))
        return success({ roles })
      }

      case 'discord_get_guild_emojis': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const emojis = Array.from(guild.emojis.cache.values()).map(e => ({
          id: e.id,
          name: e.name,
          animated: e.animated,
          url: e.url
        }))
        return success({ emojis })
      }

      case 'discord_get_guild_stickers': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const stickers = Array.from(guild.stickers.cache.values()).map(s => ({
          id: s.id,
          name: s.name,
          tags: s.tags,
          url: s.url
        }))
        return success({ stickers })
      }

      case 'discord_get_guild_invites': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const invites = await guild.invites.fetch()
        return success({ invites: Array.from(invites.values()).map(i => ({ code: i.code, uses: i.uses, maxUses: i.maxUses, inviter: i.inviter?.username })) })
      }

      case 'discord_get_guild_webhooks': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const webhooks = await guild.fetchWebhooks()
        return success({ webhooks: webhooks.map(w => ({ id: w.id, name: w.name, channelId: w.channelId })) })
      }

      case 'discord_get_guild_bans': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const bans = await guild.bans.fetch()
        return success({ bans: bans.map(b => ({ user: b.user.username, reason: b.reason })) })
      }

      case 'discord_get_audit_log': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const logs = await guild.fetchAuditLogs({ limit: args.limit || 50 })
        return success({ entries: logs.entries.map(e => ({ id: e.id, action: e.action, executorId: e.executorId, targetId: e.targetId })) })
      }

      case 'discord_get_vanity_url': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const vanity = await guild.fetchVanityData().catch(() => null)
        return success({ vanity })
      }

      case 'discord_leave_guild': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.leave()
        return success({ left: args.guildId })
      }

      case 'discord_apply_template': {
        const template = SERVER_TEMPLATES[args.templateName]
        if (!template) return error('INVALID_TEMPLATE', `Template "${args.templateName}" not found`)
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const created = { roles: [] as any[], categories: [] as any[], channels: [] as any[] }
        for (const roleData of template.roles) {
          const role = await guild.roles.create({ name: roleData.name, color: roleData.color, hoist: roleData.hoist })
          created.roles.push({ id: role.id, name: role.name })
        }
        for (const catData of template.categories) {
          const category = await guild.channels.create({ name: catData.name, type: ChannelType.GuildCategory })
          created.categories.push({ id: category.id, name: category.name })
          for (const chData of catData.channels) {
            const typeMap: Record<string, any> = { text: ChannelType.GuildText, voice: ChannelType.GuildVoice }
            const channel = await guild.channels.create({ name: chData.name, type: typeMap[chData.type] || ChannelType.GuildText, parent: category.id } as any)
            created.channels.push({ id: channel.id, name: channel.name })
          }
        }
        return success({ template: args.templateName, created })
      }

      case 'discord_get_guild_prune_count': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const count = await guild.members.prune({ days: args.days || 7, dry: true, roles: args.roles })
        return success({ guildId: guild.id, pruneCount: count, days: args.days || 7 })
      }

      case 'discord_begin_guild_prune': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const count = await guild.members.prune({ days: args.days || 7, roles: args.roles, reason: args.reason })
        return success({ guildId: guild.id, prunedCount: count, days: args.days || 7 })
      }

      case 'discord_get_guild_widget': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const settings = await (guild as any).fetchWidgetSettings?.().catch(() => null)
        const widget = await (guild as any).fetchWidget?.().catch(() => null)
        return success({ settings, widget })
      }

      case 'discord_edit_guild_widget': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const settings = await (guild as any).setWidgetSettings?.({ enabled: args.enabled, channel: args.channelId })
        return success({ settings })
      }

      case 'discord_get_guild_welcome_screen': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const screen = await (guild as any).fetchWelcomeScreen?.().catch(() => null)
        return success({ welcomeScreen: screen })
      }

      case 'discord_edit_guild_welcome_screen': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const screen = await (guild as any).editWelcomeScreen?.({
          description: args.description,
          enabled: args.enabled,
          welcomeChannels: args.welcomeChannels
        })
        return success({ welcomeScreen: screen })
      }

      case 'discord_get_guild_onboarding': {
        try {
          const response = await client.rest.get(`/guilds/${args.guildId}/onboarding` as any)
          return success({ onboarding: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_edit_guild_onboarding': {
        try {
          const response = await client.rest.patch(`/guilds/${args.guildId}/onboarding` as any, {
            body: {
              prompts: args.prompts,
              default_channel_ids: args.defaultChannelIds,
              enabled: args.enabled,
              mode: args.mode
            }
          })
          return success({ onboarding: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_get_guild_integrations': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const integrations = await (guild as any).fetchIntegrations?.()
        return success({
          integrations: Array.from(((integrations as any) || new Map()).values()).map((i: any) => ({
            id: i.id,
            name: i.name,
            type: i.type,
            enabled: i.enabled,
            syncing: i.syncing,
            roleId: i.role?.id,
            user: i.user ? { id: i.user.id, username: i.user.username } : null
          }))
        })
      }

      case 'discord_delete_guild_integration': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const integrations = await (guild as any).fetchIntegrations?.()
        const integration = integrations?.get(args.integrationId)
        if (!integration) return error('NOT_FOUND', 'Integration not found')
        await integration.delete(args.reason)
        return success({ deleted: true, integrationId: args.integrationId })
      }

      case 'discord_get_server_stats': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const members = await guild.members.fetch()
        const channels = Array.from(guild.channels.cache.values())
        const textCount = channels.filter(c => c.type === ChannelType.GuildText).length
        const voiceCount = channels.filter(c => c.type === ChannelType.GuildVoice).length
        const categoryCount = channels.filter(c => c.type === ChannelType.GuildCategory).length
        const forumCount = channels.filter(c => c.type === ChannelType.GuildForum).length
        const stageCount = channels.filter(c => c.type === ChannelType.GuildStageVoice).length
        const botsCount = members.filter(m => m.user.bot).size
        const humansCount = members.filter(m => !m.user.bot).size
        const voiceActiveCount = members.filter(m => !!m.voice.channelId).size

        return success({
          guildId: guild.id,
          name: guild.name,
          ownerId: guild.ownerId,
          totalMembers: guild.memberCount,
          humans: humansCount,
          bots: botsCount,
          voiceActiveMembers: voiceActiveCount,
          channels: { total: channels.length, text: textCount, voice: voiceCount, category: categoryCount, forum: forumCount, stage: stageCount },
          rolesCount: guild.roles.cache.size,
          emojisCount: guild.emojis.cache.size,
          stickersCount: guild.stickers.cache.size,
          boostLevel: guild.premiumTier,
          boostCount: guild.premiumSubscriptionCount,
          createdAt: guild.createdAt
        })
      }

      // ========== CHANNEL MANAGEMENT ==========
      case 'discord_create_channel': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const typeMap: Record<string, any> = {
          text: ChannelType.GuildText, voice: ChannelType.GuildVoice, category: ChannelType.GuildCategory,
          announcement: ChannelType.GuildAnnouncement, forum: ChannelType.GuildForum, stage: ChannelType.GuildStageVoice
        }
        const channel = await guild.channels.create({
          name: args.name, type: typeMap[args.type] ?? ChannelType.GuildText, parent: args.parentId,
          topic: args.topic, nsfw: args.nsfw, rateLimitPerUser: args.slowmode, userLimit: args.userLimit, bitrate: args.bitrate
        } as any)
        return success({ id: channel.id, name: channel.name, type: channel.type })
      }

      case 'discord_edit_channel': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const edited = await channel.edit(args)
        return success({ id: edited.id, name: edited.name })
      }

      case 'discord_delete_channel': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        await channel.delete(args.reason)
        return success({ deleted: args.channelId })
      }

      case 'discord_clone_channel': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const cloned = await channel.clone({ name: args.name, reason: args.reason })
        return success({ id: cloned.id, name: cloned.name })
      }

      case 'discord_find_channel': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const query = args.name.toLowerCase().replace(/^#/, '')
        const channel = guild.channels.cache.find(c => {
          if (c.name.toLowerCase() !== query) return false
          if (args.type) {
            if (args.type === 'text' && c.type !== ChannelType.GuildText) return false
            if (args.type === 'voice' && c.type !== ChannelType.GuildVoice) return false
            if (args.type === 'category' && c.type !== ChannelType.GuildCategory) return false
            if (args.type === 'forum' && c.type !== ChannelType.GuildForum) return false
            if (args.type === 'stage' && c.type !== ChannelType.GuildStageVoice) return false
          }
          return true
        })
        if (!channel) return error('NOT_FOUND', `Channel "${args.name}" not found in server`)
        return success({ id: channel.id, name: channel.name, type: channel.type, parentId: (channel as any).parentId || null, position: (channel as any).position })
      }

      case 'discord_get_channel_info': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        return success({
          id: channel.id,
          name: channel.name,
          type: channel.type,
          guildId: channel.guildId || null,
          parentId: channel.parentId || null,
          topic: channel.topic || null,
          nsfw: channel.nsfw || false,
          position: channel.position,
          bitrate: channel.bitrate || null,
          userLimit: channel.userLimit || null,
          rateLimitPerUser: channel.rateLimitPerUser || 0,
          createdAt: channel.createdAt
        })
      }

      case 'discord_move_channel': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.guild) return error('NOT_FOUND', 'Channel not found')
        const editData: any = {}
        if (args.parentId !== undefined) editData.parent = args.parentId
        if (args.position !== undefined) editData.position = args.position
        if (args.lockPermissions !== undefined) editData.lockPermissions = args.lockPermissions
        const updated = await channel.edit(editData)
        return success({ id: updated.id, name: updated.name, parentId: updated.parentId, position: updated.position })
      }

      case 'discord_create_voice_channel': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const channel = await guild.channels.create({
          name: args.name,
          type: ChannelType.GuildVoice,
          parent: args.parentId,
          bitrate: args.bitrate,
          userLimit: args.userLimit,
          rtcRegion: args.rtcRegion
        })
        return success({ id: channel.id, name: channel.name, type: 'voice' })
      }

      case 'discord_create_stage_channel': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const channel = await guild.channels.create({
          name: args.name,
          type: ChannelType.GuildStageVoice,
          parent: args.parentId,
          bitrate: args.bitrate,
          topic: args.topic
        } as any)
        return success({ id: channel.id, name: channel.name, type: 'stage' })
      }

      case 'discord_edit_voice_channel': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || (channel.type !== ChannelType.GuildVoice && channel.type !== ChannelType.GuildStageVoice)) {
          return error('NOT_FOUND', 'Voice or stage channel not found')
        }
        const editData: any = {}
        if (args.name) editData.name = args.name
        if (args.bitrate) editData.bitrate = args.bitrate
        if (args.userLimit !== undefined) editData.userLimit = args.userLimit
        if (args.rtcRegion !== undefined) editData.rtcRegion = args.rtcRegion
        const updated = await channel.edit(editData)
        return success({ id: updated.id, name: updated.name })
      }

      case 'discord_set_channel_permissions': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        await channel.permissionOverwrites.edit(args.targetId, {
          ...(args.allow || []).reduce((acc: any, p: string) => ({...acc, [p]: true}), {}),
          ...(args.deny || []).reduce((acc: any, p: string) => ({...acc, [p]: false}), {})
        }, { reason: args.reason })
        return success({ channelId: channel.id, targetId: args.targetId })
      }

      case 'discord_list_channel_permissions': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.permissionOverwrites) return error('NOT_FOUND', 'Channel not found or does not support permissions')
        const overwrites = channel.permissionOverwrites.cache.map((o: any) => ({
          id: o.id,
          type: o.type === 0 ? 'role' : 'member',
          allow: o.allow.toArray(),
          deny: o.deny.toArray()
        }))
        return success({ channelId: channel.id, overwrites })
      }

      case 'discord_delete_channel_permissions': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.permissionOverwrites) return error('NOT_FOUND', 'Channel not found')
        await channel.permissionOverwrites.delete(args.targetId)
        return success({ deleted: true, channelId: args.channelId, targetId: args.targetId })
      }

      case 'discord_lock_channel': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel || !channel.guild) return error('NOT_FOUND', 'Channel not found')
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
          SendMessages: false
        }, { reason: args.reason || 'Locked by MCP' })
        return success({ locked: true, channelId: args.channelId })
      }

      case 'discord_unlock_channel': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel || !channel.guild) return error('NOT_FOUND', 'Channel not found')
        await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
          SendMessages: null
        }, { reason: args.reason || 'Unlocked by MCP' })
        return success({ unlocked: true, channelId: args.channelId })
      }

      case 'discord_set_slowmode': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.setRateLimitPerUser) return error('NOT_FOUND', 'Channel does not support slowmode')
        await channel.setRateLimitPerUser(args.slowmode, args.reason)
        return success({ channelId: args.channelId, slowmode: args.slowmode })
      }

      case 'discord_set_channel_topic': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.setTopic) return error('NOT_FOUND', 'Channel does not support topic')
        await channel.setTopic(args.topic, args.reason)
        return success({ channelId: args.channelId, topic: args.topic })
      }

      case 'discord_modify_channel_positions': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.channels.setPositions(args.channelPositions)
        return success({ updated: true, total: args.channelPositions.length })
      }

      case 'discord_sync_channel_permissions': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel || !('lockPermissions' in channel)) return error('NOT_FOUND', 'Channel not found or cannot sync permissions')
        await (channel as any).lockPermissions()
        return success({ synced: true, channelId: channel.id, parentId: channel.parentId })
      }

      case 'discord_get_voice_channel_members': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.members) return error('NOT_FOUND', 'Voice or stage channel not found')
        const members = Array.from((channel.members as any).values()).map((m: any) => ({
          id: m.id,
          username: m.user.username,
          displayName: m.displayName,
          serverMute: m.voice.serverMute,
          serverDeaf: m.voice.serverDeaf,
          selfMute: m.voice.selfMute,
          selfDeaf: m.voice.selfDeaf,
          streaming: m.voice.streaming,
          selfVideo: m.voice.selfVideo,
          suppress: m.voice.suppress
        }))
        return success({ channelId: channel.id, count: members.length, members })
      }

      case 'discord_get_guild_voice_states': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const activeChannels = guild.channels.cache
          .filter(c => c.type === ChannelType.GuildVoice || c.type === ChannelType.GuildStageVoice)
          .map((c: any) => ({
            id: c.id,
            name: c.name,
            type: c.type === ChannelType.GuildStageVoice ? 'stage' : 'voice',
            connectedCount: c.members?.size || 0,
            members: Array.from((c.members || new Map()).values()).map((m: any) => ({
              id: m.id,
              username: m.user.username,
              displayName: m.displayName,
              mute: m.voice.mute,
              deaf: m.voice.deaf,
              streaming: m.voice.streaming,
              video: m.voice.selfVideo
            }))
          }))
          .filter(c => c.connectedCount > 0)
        return success({ guildId: guild.id, activeVoiceChannels: activeChannels })
      }

      case 'discord_create_invite': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const invite = await channel.createInvite({ maxAge: args.maxAge, maxUses: args.maxUses, temporary: args.temporary, unique: args.unique } as any)
        return success({ code: invite.code, url: invite.url })
      }

      case 'discord_delete_invite': {
        const invite = await client.fetchInvite(args.inviteCode)
        if (!invite) return error('NOT_FOUND', 'Invite not found')
        await invite.delete()
        return success({ deleted: true, code: args.inviteCode })
      }

      case 'discord_get_invite_details': {
        const invite = await (client as any).fetchInvite(args.inviteCode, {
          withCounts: args.withCounts !== undefined ? args.withCounts : true
        })
        return success({
          code: invite.code,
          url: invite.url,
          guild: invite.guild ? { id: invite.guild.id, name: invite.guild.name, icon: invite.guild.iconURL() } : null,
          channel: invite.channel ? { id: invite.channel.id, name: invite.channel.name } : null,
          inviter: invite.inviter ? { id: invite.inviter.id, username: invite.inviter.username } : null,
          memberCount: invite.memberCount,
          presenceCount: invite.presenceCount,
          expiresAt: invite.expiresAt,
          temporary: invite.temporary
        })
      }

      // ========== CATEGORY MANAGEMENT ==========
      case 'discord_create_category': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const cat = await guild.channels.create({
          name: args.name,
          type: ChannelType.GuildCategory,
          position: args.position
        })
        return success({ id: cat.id, name: cat.name, position: cat.position })
      }

      case 'discord_edit_category': {
        const channel = client.channels.cache.get(args.categoryId) as any
        if (!channel || channel.type !== ChannelType.GuildCategory) return error('NOT_FOUND', 'Category not found')
        const editData: any = {}
        if (args.name) editData.name = args.name
        if (args.position !== undefined) editData.position = args.position
        const updated = await channel.edit(editData)
        return success({ id: updated.id, name: updated.name, position: updated.position })
      }

      case 'discord_delete_category': {
        const channel = client.channels.cache.get(args.categoryId) as any
        if (!channel || channel.type !== ChannelType.GuildCategory) return error('NOT_FOUND', 'Category not found')
        await channel.delete()
        return success({ deleted: true, categoryId: args.categoryId })
      }

      case 'discord_find_category': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const query = args.name.toLowerCase()
        const cat = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name.toLowerCase() === query)
        if (!cat) return error('NOT_FOUND', `Category "${args.name}" not found`)
        return success({ id: cat.id, name: cat.name, position: (cat as any).position })
      }

      case 'discord_list_channels_in_category': {
        const cat = client.channels.cache.get(args.categoryId) as any
        if (!cat || cat.type !== ChannelType.GuildCategory) return error('NOT_FOUND', 'Category not found')
        const guild = cat.guild
        const children = guild.channels.cache.filter((c: any) => c.parentId === cat.id).map((c: any) => ({
          id: c.id, name: c.name, type: c.type, position: c.position
        }))
        return success({ categoryId: cat.id, categoryName: cat.name, channels: children, count: children.length })
      }

      // ========== FORUM MANAGEMENT ==========
      case 'discord_create_forum_channel': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const channel = await guild.channels.create({
          name: args.name,
          type: ChannelType.GuildForum,
          topic: args.topic,
          parent: args.parentId,
          availableTags: args.availableTags
        } as any)
        return success({ id: channel.id, name: channel.name, type: 'forum' })
      }

      case 'discord_edit_forum_channel': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || channel.type !== ChannelType.GuildForum) return error('NOT_FOUND', 'Forum channel not found')
        const editData: any = {}
        if (args.name) editData.name = args.name
        if (args.topic !== undefined) editData.topic = args.topic
        if (args.nsfw !== undefined) editData.nsfw = args.nsfw
        if (args.slowmode !== undefined) editData.rateLimitPerUser = args.slowmode
        const updated = await channel.edit(editData)
        return success({ id: updated.id, name: updated.name })
      }

      case 'discord_list_forum_channels': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const forums = guild.channels.cache
          .filter(c => c.type === ChannelType.GuildForum)
          .map(c => ({
            id: c.id,
            name: c.name,
            parentId: (c as any).parentId,
            position: (c as any).position
          }))
        return success({ forums, count: forums.length })
      }

      case 'discord_get_forum_channel_info': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || channel.type !== ChannelType.GuildForum) return error('NOT_FOUND', 'Forum channel not found')
        return success({
          id: channel.id,
          name: channel.name,
          topic: channel.topic,
          availableTags: channel.availableTags || [],
          defaultReactionEmoji: channel.defaultReactionEmoji || null,
          defaultSortOrder: channel.defaultSortOrder || null,
          rateLimitPerUser: channel.rateLimitPerUser || 0,
          nsfw: channel.nsfw || false
        })
      }

      case 'discord_list_forum_tags': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || channel.type !== ChannelType.GuildForum) return error('NOT_FOUND', 'Forum channel not found')
        return success({ channelId: channel.id, tags: channel.availableTags || [] })
      }

      case 'discord_list_forum_posts': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || channel.type !== ChannelType.GuildForum) return error('NOT_FOUND', 'Forum channel not found')
        const active = await channel.threads.fetchActive()
        return success({
          posts: active.threads.map((t: any) => ({
            id: t.id,
            name: t.name,
            appliedTags: t.appliedTags,
            messageCount: t.messageCount,
            archived: t.archived,
            locked: t.locked,
            createdAt: t.createdAt
          })),
          count: active.threads.size
        })
      }

      // ========== THREAD MANAGEMENT ==========
      case 'discord_create_thread': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const thread = await channel.threads.create({
          name: args.name, startMessage: args.messageId, type: args.type === 'private' ? 12 : 11,
          autoArchiveDuration: args.autoArchiveDuration, reason: args.reason
        })
        return success({ id: thread.id, name: thread.name })
      }

      case 'discord_create_forum_post': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const thread = await channel.threads.create({
          name: args.name, message: { content: args.content }, appliedTags: args.appliedTags, reason: args.reason
        })
        return success({ id: thread.id, name: thread.name })
      }

      case 'discord_edit_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread) return error('NOT_FOUND', 'Thread not found')
        const edited = await thread.edit(args)
        return success({ id: edited.id, name: edited.name })
      }

      case 'discord_delete_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread) return error('NOT_FOUND', 'Thread not found')
        await thread.delete()
        return success({ deleted: args.threadId })
      }

      case 'discord_get_active_threads': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const threads = await guild.channels.fetchActiveThreads()
        return success({ threads: threads.threads.map(t => ({ id: t.id, name: t.name })) })
      }

      case 'discord_lock_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.setLocked(true, args.reason)
        return success({ locked: true, threadId: thread.id })
      }

      case 'discord_unlock_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.setLocked(false, args.reason)
        return success({ unlocked: true, threadId: thread.id })
      }

      // ========== MESSAGE OPERATIONS ==========
      case 'discord_send_message': {
        const channel = (client.channels.cache.get(args.channelId) || await client.channels.fetch(args.channelId).catch(() => null)) as any
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Channel is not a text channel or is inaccessible')
        const opts: any = {}
        if (args.content) opts.content = args.content
        if (args.embeds) {
          opts.embeds = args.embeds.map((e: any) => {
            const embed = new EmbedBuilder()
            if (e.title) embed.setTitle(e.title)
            if (e.description) embed.setDescription(e.description)
            if (e.color) embed.setColor(e.color)
            if (e.url) embed.setURL(e.url)
            if (e.thumbnail) embed.setThumbnail(e.thumbnail)
            if (e.image) embed.setImage(e.image)
            if (e.footer) embed.setFooter({ text: e.footer.text, iconURL: e.footer.icon_url })
            if (e.author) embed.setAuthor({ name: e.author.name, iconURL: e.author.icon_url, url: e.author.url })
            if (e.fields) embed.setFields(e.fields)
            if (e.timestamp) embed.setTimestamp(new Date(e.timestamp))
            return embed
          })
        }
        const attachments = normalizeAttachments(args)
        if (attachments.length > 0) opts.files = attachments
        if (args.replyTo) opts.reply = { messageReference: args.replyTo }
        if (args.tts) opts.tts = true
        const msg = await channel.send(opts)
        return success({
          id: msg.id,
          channelId: msg.channelId,
          attachments: msg.attachments.map((a: any) => ({ id: a.id, name: a.name, url: a.url }))
        })
      }

      case 'discord_send_embed': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const embed = new EmbedBuilder()
        if (args.title) embed.setTitle(args.title)
        if (args.description) embed.setDescription(args.description)
        if (args.color) embed.setColor(args.color)
        if (args.url) embed.setURL(args.url)
        if (args.timestamp) embed.setTimestamp(new Date(args.timestamp))
        if (args.footer) embed.setFooter(args.footer)
        if (args.thumbnail) embed.setThumbnail(args.thumbnail.url)
        if (args.image) embed.setImage(args.image.url)
        if (args.author) embed.setAuthor(args.author)
        if (args.fields) embed.setFields(args.fields)
        const msg = await channel.send({ embeds: [embed] })
        return success({ id: msg.id })
      }

      case 'discord_send_components_v2': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const embeds: EmbedBuilder[] = []
        const components: ActionRowBuilder<any>[] = []
        let currentEmbed = new EmbedBuilder()
        let hasEmbedContent = false
        if (args.components && Array.isArray(args.components)) {
          for (const comp of args.components) {
            if (comp.type === 'section' || comp.type === 'container') {
              if (hasEmbedContent) { embeds.push(currentEmbed); currentEmbed = new EmbedBuilder(); hasEmbedContent = false }
              if (comp.title) currentEmbed.setTitle(comp.title)
              if (comp.description) currentEmbed.setDescription(comp.description)
              hasEmbedContent = true
            } else if (comp.type === 'text') {
              currentEmbed.addFields({ name: '​', value: comp.content || ' ' })
              hasEmbedContent = true
            } else if (comp.type === 'media_gallery' && comp.images?.length > 0) {
              currentEmbed.setImage(comp.images[0])
              hasEmbedContent = true
            } else if (comp.type === 'buttons' && comp.items) {
              const row = new ActionRowBuilder<ButtonBuilder>()
              for (const btn of comp.items) {
                const button = new ButtonBuilder()
                  .setCustomId(btn.id || `btn_${Math.random().toString(36).substring(7)}`)
                  .setLabel(btn.label || 'Button')
                  .setStyle(btn.style === 'primary' ? ButtonStyle.Primary : btn.style === 'danger' ? ButtonStyle.Danger : ButtonStyle.Secondary)
                if (btn.url) { button.setStyle(ButtonStyle.Link); button.setURL(btn.url) }
                row.addComponents(button)
              }
              components.push(row)
            }
          }
        }
        if (hasEmbedContent) embeds.push(currentEmbed)
        const payload: any = {}
        if (args.content) payload.content = args.content
        if (embeds.length > 0) payload.embeds = embeds
        if (components.length > 0) payload.components = components
        if (!payload.content && !payload.embeds && !payload.components) payload.content = 'Empty message'
        const msg = await channel.send(payload)
        return success({ id: msg.id })
      }

      case 'discord_edit_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const message = await channel.messages.fetch(args.messageId)
        const edited = await message.edit({ content: args.content })
        return success({ id: edited.id })
      }

      case 'discord_delete_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const message = await channel.messages.fetch(args.messageId)
        await message.delete()
        return success({ deleted: args.messageId })
      }

      case 'discord_bulk_delete_messages': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        await channel.bulkDelete(args.messageIds)
        return success({ deleted: args.messageIds.length })
      }

      case 'discord_get_messages': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const messages = await channel.messages.fetch({ limit: args.limit || 50, before: args.before, after: args.after })
        return success({ messages: messages.map(m => ({
          id: m.id, content: m.content, author: { id: m.author.id, username: m.author.username }, createdAt: m.createdAt, embeds: m.embeds.length
        }))})
      }

      case 'discord_pin_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const msg = await channel.messages.fetch(args.messageId)
        await msg.pin()
        return success({ pinned: args.messageId })
      }

      case 'discord_unpin_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const msg = await channel.messages.fetch(args.messageId)
        await msg.unpin()
        return success({ unpinned: args.messageId })
      }

      case 'discord_add_reaction': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const msg = await channel.messages.fetch(args.messageId)
        await msg.react(args.emoji)
        return success({ reacted: args.emoji })
      }

      case 'discord_remove_reaction': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const msg = await channel.messages.fetch(args.messageId)
        if (args.userId) {
          const reaction = msg.reactions.cache.get(args.emoji)
          if (reaction) await reaction.users.remove(args.userId)
        } else {
          const reaction = msg.reactions.cache.get(args.emoji)
          if (reaction) await reaction.remove()
        }
        return success({ removed: args.emoji })
      }

      case 'discord_create_poll': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        const msg = await channel.send({
          poll: {
            question: { text: args.question },
            answers: args.answers.map((a: any) => ({ text: a.text })),
            allowMultiselect: args.allowMultiselect,
            duration: args.duration
          }
        })
        return success({ id: msg.id })
      }

      case 'discord_crosspost_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Channel is not a text channel')
        const message = await channel.messages.fetch(args.messageId)
        if (!message) return error('NOT_FOUND', 'Message not found')
        const crossposted = await (message as any).crosspost?.()
        return success({ id: crossposted?.id || message.id, crossposted: true })
      }

      case 'discord_get_pinned_messages': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const pins = await channel.messages.fetchPinned()
        return success({
          pins: pins.map(p => ({
            id: p.id,
            author: { id: p.author.id, username: p.author.username },
            content: p.content,
            createdAt: p.createdAt
          })),
          count: pins.size
        })
      }

      case 'discord_get_reactions': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const message = await channel.messages.fetch(args.messageId)
        if (!message) return error('NOT_FOUND', 'Message not found')
        const reaction = message.reactions.cache.get(args.emoji)
        if (!reaction) return success({ users: [], count: 0 })
        const users = await reaction.users.fetch({ limit: args.limit || 50 })
        return success({
          emoji: args.emoji,
          users: users.map(u => ({ id: u.id, username: u.username, bot: u.bot })),
          count: users.size
        })
      }

      case 'discord_clear_reaction_emoji': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const message = await channel.messages.fetch(args.messageId)
        if (!message) return error('NOT_FOUND', 'Message not found')
        const reaction = message.reactions.cache.get(args.emoji)
        if (reaction) await reaction.remove()
        return success({ cleared: true, emoji: args.emoji })
      }

      case 'discord_search_messages': {
        const limit = Math.min(args.limit || 50, 500)
        const results: any[] = []

        if (args.channelId) {
          const channel = client.channels.cache.get(args.channelId) as TextChannel
          if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
          let lastId: string | undefined = undefined
          while (results.length < limit) {
            const batchSize = Math.min(limit - results.length, 100)
            const fetched = await channel.messages.fetch({ limit: batchSize, before: lastId })
            if (fetched.size === 0) break
            for (const msg of fetched.values()) {
              lastId = msg.id
              if (args.authorId && msg.author.id !== args.authorId) continue
              if (args.query && !msg.content.toLowerCase().includes(args.query.toLowerCase())) continue
              if (args.hasAttachment && msg.attachments.size === 0) continue
              if (args.hasEmbed && msg.embeds.length === 0) continue
              results.push({
                id: msg.id,
                channelId: msg.channelId,
                author: { id: msg.author.id, username: msg.author.username },
                content: msg.content,
                attachments: msg.attachments.map(a => ({ name: a.name, url: a.url })),
                createdAt: msg.createdAt
              })
              if (results.length >= limit) break
            }
          }
        } else if (args.guildId) {
          const guild = client.guilds.cache.get(args.guildId)
          if (!guild) return error('NOT_FOUND', 'Guild not found')
          const textChannels = Array.from(guild.channels.cache.values()).filter(c => c.isTextBased()) as TextChannel[]
          for (const ch of textChannels) {
            if (results.length >= limit) break
            try {
              const fetched = await ch.messages.fetch({ limit: Math.min(limit - results.length, 50) })
              for (const msg of fetched.values()) {
                if (args.authorId && msg.author.id !== args.authorId) continue
                if (args.query && !msg.content.toLowerCase().includes(args.query.toLowerCase())) continue
                if (args.hasAttachment && msg.attachments.size === 0) continue
                if (args.hasEmbed && msg.embeds.length === 0) continue
                results.push({
                  id: msg.id,
                  channelId: msg.channelId,
                  channelName: ch.name,
                  author: { id: msg.author.id, username: msg.author.username },
                  content: msg.content,
                  attachments: msg.attachments.map(a => ({ name: a.name, url: a.url })),
                  createdAt: msg.createdAt
                })
                if (results.length >= limit) break
              }
            } catch {
              // skip channel if no read permissions
            }
          }
        } else {
          return error('INVALID_ARGS', 'Provide either channelId or guildId')
        }

        return success({ count: results.length, messages: results })
      }

      case 'discord_get_user_messages': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const limit = Math.min(args.limit || 100, 500)
        const messages: any[] = []

        let targetChannels = Array.from(guild.channels.cache.values()).filter(c => c.isTextBased()) as TextChannel[]
        if (args.channelIds && Array.isArray(args.channelIds)) {
          targetChannels = targetChannels.filter(c => args.channelIds.includes(c.id))
        }

        for (const channel of targetChannels) {
          if (messages.length >= limit) break
          try {
            let lastId: string | undefined = undefined
            let fetchMore = true
            while (fetchMore && messages.length < limit) {
              const fetched = await channel.messages.fetch({ limit: 100, before: lastId })
              if (fetched.size === 0) break
              for (const msg of fetched.values()) {
                lastId = msg.id
                if (msg.author.id === args.userId) {
                  messages.push({
                    id: msg.id,
                    channelId: channel.id,
                    channelName: channel.name,
                    content: msg.content,
                    embeds: msg.embeds.map(e => e.toJSON()),
                    attachments: msg.attachments.map(a => ({ name: a.name, url: a.url })),
                    createdAt: msg.createdAt
                  })
                  if (messages.length >= limit) break
                }
              }
              if (fetched.size < 100) fetchMore = false
            }
          } catch {
            // skip channel if permission denied
          }
        }

        return success({ userId: args.userId, totalFound: messages.length, messages })
      }

      case 'discord_export_channel_transcript': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const limit = Math.min(args.limit || 100, 500)
        const transcript: any[] = []
        let lastId: string | undefined = undefined

        while (transcript.length < limit) {
          const fetchCount = Math.min(limit - transcript.length, 100)
          const fetched = await channel.messages.fetch({ limit: fetchCount, before: lastId })
          if (fetched.size === 0) break
          for (const msg of fetched.values()) {
            lastId = msg.id
            transcript.push({
              id: msg.id,
              author: { id: msg.author.id, username: msg.author.username, bot: msg.author.bot },
              content: msg.content,
              embeds: msg.embeds.map(e => e.toJSON()),
              attachments: msg.attachments.map(a => ({ name: a.name, url: a.url, contentType: a.contentType })),
              createdAt: msg.createdAt
            })
            if (transcript.length >= limit) break
          }
        }

        return success({ channelId: channel.id, channelName: channel.name, messageCount: transcript.length, transcript })
      }

      // ========== MEMBER MANAGEMENT ==========
      case 'discord_get_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        return success({
          id: member.id, username: member.user.username, displayName: member.displayName, nickname: member.nickname,
          avatar: member.displayAvatarURL(), roles: member.roles.cache.map(r => ({ id: r.id, name: r.name })),
          joinedAt: member.joinedAt, premiumSince: member.premiumSince
        })
      }

      case 'discord_search_members': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const members = await guild.members.search({ query: args.query, limit: args.limit || 10 })
        return success({ members: members.map(m => ({ id: m.id, user: m.user.username })) })
      }

      case 'discord_list_members': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const members = await guild.members.fetch({ limit: args.limit || 100 })
        return success({ members: members.map(m => ({ id: m.id, user: m.user.username })) })
      }

      case 'discord_kick_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.kick(args.reason)
        return success({ kicked: args.memberId })
      }

      case 'discord_ban_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.members.ban(args.memberId, { reason: args.reason, deleteMessageSeconds: args.deleteMessageDays ? args.deleteMessageDays * 86400 : undefined })
        return success({ banned: args.memberId })
      }

      case 'discord_unban_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.members.unban(args.userId, args.reason)
        return success({ unbanned: args.userId })
      }

      case 'discord_timeout_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.timeout(args.duration * 1000, args.reason)
        return success({ timeout: args.memberId })
      }

      case 'discord_remove_timeout': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.timeout(null, args.reason)
        return success({ removedTimeout: args.memberId })
      }

      case 'discord_add_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.roles.add(args.roleId, args.reason)
        return success({ added: args.roleId, to: args.memberId })
      }

      case 'discord_remove_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.roles.remove(args.roleId, args.reason)
        return success({ removed: args.roleId, from: args.memberId })
      }

      case 'discord_set_nickname': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.setNickname(args.nickname, args.reason)
        return success({ setNickname: args.memberId })
      }

      case 'discord_move_member_voice': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.voice.setChannel(args.channelId)
        return success({ moved: args.memberId })
      }

      case 'discord_disconnect_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.voice.disconnect()
        return success({ disconnected: args.memberId })
      }

      case 'discord_server_mute_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.voice.setMute(args.mute, args.reason)
        return success({ muted: args.memberId })
      }

      case 'discord_server_deafen_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        await member.voice.setDeaf(args.deaf, args.reason)
        return success({ deafened: args.memberId })
      }

      case 'discord_modify_voice_state': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.userId)
        if (!member || !member.voice.channel) return error('NOT_FOUND', 'Member not connected to a voice channel')
        const updates: any = {}
        if (args.mute !== undefined) updates.mute = args.mute
        if (args.deaf !== undefined) updates.deaf = args.deaf
        if (args.channelId) updates.channel = args.channelId
        if (args.suppress !== undefined) updates.suppress = args.suppress
        await member.voice.edit(updates)
        return success({ userId: member.id, voice: { mute: member.voice.serverMute, deaf: member.voice.serverDeaf } })
      }

      case 'discord_get_user_id_by_name': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const query = args.username.toLowerCase()
        let member = guild.members.cache.find(m =>
          m.user.username.toLowerCase() === query ||
          m.displayName.toLowerCase() === query ||
          (m.user.globalName && m.user.globalName.toLowerCase() === query)
        )
        if (!member) {
          const fetched = await guild.members.search({ query, limit: 1 })
          member = fetched.first()
        }
        if (!member) return error('NOT_FOUND', `User "${args.username}" not found in server`)
        return success({
          id: member.id,
          ping: `<@${member.id}>`,
          username: member.user.username,
          displayName: member.displayName,
          globalName: member.user.globalName
        })
      }

      case 'discord_get_user': {
        const user = await client.users.fetch(args.userId, { force: true })
        if (!user) return error('NOT_FOUND', 'User not found')
        return success({
          id: user.id,
          username: user.username,
          globalName: user.globalName,
          discriminator: user.discriminator,
          avatar: user.displayAvatarURL(),
          banner: user.bannerURL(),
          accentColor: user.accentColor,
          bot: user.bot,
          createdAt: user.createdAt
        })
      }

      case 'discord_get_user_profile': {
        const user = await client.users.fetch(args.userId, { force: true })
        if (!user) return error('NOT_FOUND', 'User not found')

        let memberData: any = null
        if (args.guildId) {
          const guild = client.guilds.cache.get(args.guildId)
          if (guild) {
            const member = await guild.members.fetch({ user: args.userId, withPresences: true }).catch(() => null)
            if (member) {
              memberData = {
                displayName: member.displayName,
                nickname: member.nickname,
                roles: member.roles.cache.map(r => ({ id: r.id, name: r.name })),
                joinedAt: member.joinedAt,
                presence: member.presence ? {
                  status: member.presence.status,
                  clientStatus: member.presence.clientStatus,
                  activities: member.presence.activities.map(a => ({
                    name: a.name,
                    type: a.type,
                    state: a.state,
                    details: a.details,
                    timestamps: a.timestamps,
                    url: a.url
                  }))
                } : null
              }
            }
          }
        }

        return success({
          id: user.id,
          username: user.username,
          globalName: user.globalName,
          discriminator: user.discriminator,
          avatar: user.displayAvatarURL(),
          banner: user.bannerURL(),
          accentColor: user.accentColor,
          bot: user.bot,
          createdAt: user.createdAt,
          serverProfile: memberData
        })
      }

      case 'discord_edit_bot_profile': {
        const updates: any = {}
        if (args.username && client.user) {
          await client.user.setUsername(args.username)
          updates.username = args.username
        }
        if (args.avatar && client.user) {
          await client.user.setAvatar(args.avatar)
          updates.avatar = 'Updated'
        }
        return success({ updated: updates })
      }

      // ========== ROLE MANAGEMENT ==========
      case 'discord_create_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.create({ name: args.name, color: args.color, hoist: args.hoist, mentionable: args.mentionable, reason: args.reason })
        return success({ id: role.id, name: role.name })
      }

      case 'discord_get_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.fetch(args.roleId)
        if (!role) return error('NOT_FOUND', 'Role not found')
        return success({
          id: role.id,
          name: role.name,
          color: role.hexColor,
          hoist: role.hoist,
          position: role.position,
          permissions: role.permissions.toArray(),
          mentionable: role.mentionable,
          managed: role.managed,
          icon: role.iconURL(),
          unicodeEmoji: role.unicodeEmoji,
          tags: role.tags
        })
      }

      case 'discord_edit_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.edit(args.roleId, args)
        return success({ edited: role.id })
      }

      case 'discord_delete_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = guild.roles.cache.get(args.roleId)
        if (!role) return error('NOT_FOUND', 'Role not found')
        await role.delete(args.reason)
        return success({ deleted: args.roleId })
      }

      case 'discord_modify_role_positions': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.roles.setPositions(args.rolePositions)
        return success({ updated: true, total: args.rolePositions.length })
      }

      case 'discord_get_member_permissions': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        if (!member) return error('NOT_FOUND', 'Member not found')
        if (args.channelId) {
          const channel = guild.channels.cache.get(args.channelId) as GuildChannel
          if (!channel) return error('NOT_FOUND', 'Channel not found')
          const permissions = channel.permissionsFor(member)
          return success({
            memberId: member.id,
            channelId: channel.id,
            permissions: permissions ? permissions.toArray() : []
          })
        }
        return success({
          memberId: member.id,
          permissions: member.permissions.toArray()
        })
      }

      case 'discord_list_permissions':
        return success({ permissions: ['ADMINISTRATOR', 'CREATE_INSTANT_INVITE', 'KICK_MEMBERS', 'BAN_MEMBERS', 'MANAGE_CHANNELS', 'MANAGE_GUILD', 'ADD_REACTIONS', 'VIEW_AUDIT_LOG', 'SEND_MESSAGES', 'MANAGE_MESSAGES', 'EMBED_LINKS', 'ATTACH_FILES', 'READ_MESSAGE_HISTORY', 'MENTION_EVERYONE', 'CONNECT', 'SPEAK', 'MUTE_MEMBERS', 'DEAFEN_MEMBERS', 'MOVE_MEMBERS', 'MANAGE_NICKNAMES', 'MANAGE_ROLES', 'MANAGE_WEBHOOKS', 'MANAGE_EMOJIS_AND_STICKERS'] })

      // ========== EMOJI & STICKER ==========
      case 'discord_create_emoji': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const emoji = await guild.emojis.create({ attachment: args.image, name: args.name, reason: args.reason })
        return success({ id: emoji.id, name: emoji.name })
      }

      case 'discord_delete_emoji': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.emojis.delete(args.emojiId, args.reason)
        return success({ deleted: args.emojiId })
      }

      case 'discord_get_emoji_details': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const emoji = await guild.emojis.fetch(args.emojiId)
        if (!emoji) return error('NOT_FOUND', 'Emoji not found')
        return success({
          id: emoji.id,
          name: emoji.name,
          animated: emoji.animated,
          available: emoji.available,
          managed: emoji.managed,
          requiresColons: emoji.requiresColons,
          url: emoji.url,
          roles: Array.from(emoji.roles.cache.keys()),
          author: emoji.author ? { id: emoji.author.id, username: emoji.author.username } : null,
          createdAt: emoji.createdAt
        })
      }

      case 'discord_edit_emoji': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const emoji = await guild.emojis.fetch(args.emojiId)
        if (!emoji) return error('NOT_FOUND', 'Emoji not found')
        const editData: any = {}
        if (args.name) editData.name = args.name
        if (args.roles) editData.roles = args.roles
        const updated = await emoji.edit(editData)
        return success({ id: updated.id, name: updated.name, roles: Array.from(updated.roles.cache.keys()) })
      }

      case 'discord_create_sticker': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const sticker = await guild.stickers.create({ file: args.file, name: args.name, tags: args.tags, description: args.description, reason: args.reason })
        return success({ id: sticker.id })
      }

      case 'discord_delete_sticker': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.stickers.delete(args.stickerId, args.reason)
        return success({ deleted: args.stickerId })
      }

      // ========== WEBHOOKS ==========
      case 'discord_create_webhook': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const webhook = await channel.createWebhook({ name: args.name, avatar: args.avatar, reason: args.reason })
        return success({ id: webhook.id, url: webhook.url })
      }

      case 'discord_get_webhook': {
        const webhook = await client.fetchWebhook(args.webhookId, args.token)
        if (!webhook) return error('NOT_FOUND', 'Webhook not found')
        return success({
          id: webhook.id,
          name: webhook.name,
          avatar: webhook.avatarURL(),
          channelId: webhook.channelId,
          guildId: webhook.guildId,
          url: webhook.url
        })
      }

      case 'discord_get_channel_webhooks': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel || !channel.fetchWebhooks) return error('NOT_FOUND', 'Channel does not support webhooks')
        const webhooks = await channel.fetchWebhooks()
        return success({
          webhooks: webhooks.map(w => ({
            id: w.id,
            name: w.name,
            channelId: w.channelId,
            url: w.url
          }))
        })
      }

      case 'discord_edit_webhook': {
        const webhook = await client.fetchWebhook(args.webhookId, args.token)
        if (!webhook) return error('NOT_FOUND', 'Webhook not found')
        const editData: any = {}
        if (args.name) editData.name = args.name
        if (args.avatar) editData.avatar = args.avatar
        if (args.channelId) editData.channel = args.channelId
        const updated = await webhook.edit(editData)
        return success({ id: updated.id, name: updated.name, channelId: updated.channelId })
      }

      case 'discord_delete_webhook': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const webhooks = await channel.fetchWebhooks()
        const webhook = webhooks.get(args.webhookId)
        if (webhook) await webhook.delete(args.reason)
        return success({ deleted: args.webhookId })
      }

      case 'discord_execute_webhook': {
        if (!args.webhookId || !args.token) return error('INVALID_ARGS', 'Missing webhookId or token')
        const wh = new WebhookClient({ id: args.webhookId, token: args.token })
        const msg = await wh.send({ content: args.content, username: args.username, avatarURL: args.avatarUrl, embeds: args.embeds })
        return success({ id: msg.id })
      }

      // ========== AUTO MODERATION ==========
      case 'discord_get_automod_rules': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const rules = await guild.autoModerationRules.fetch()
        return success({ rules: Array.from(rules.values()).map(r => ({ id: r.id, name: r.name })) })
      }

      case 'discord_get_automod_rule': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const rule = await guild.autoModerationRules.fetch(args.ruleId)
        if (!rule) return error('NOT_FOUND', 'AutoMod rule not found')
        return success({
          id: rule.id,
          name: rule.name,
          eventType: rule.eventType,
          triggerType: rule.triggerType,
          triggerMetadata: rule.triggerMetadata,
          actions: rule.actions,
          enabled: rule.enabled,
          exemptRoles: Array.from(rule.exemptRoles.keys()),
          exemptChannels: Array.from(rule.exemptChannels.keys())
        })
      }

      case 'discord_edit_automod_rule': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const rule = await guild.autoModerationRules.fetch(args.ruleId)
        if (!rule) return error('NOT_FOUND', 'AutoMod rule not found')
        const updated = await rule.edit(args)
        return success({ id: updated.id, name: updated.name, enabled: updated.enabled })
      }

      case 'discord_create_automod_rule': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const rule = await guild.autoModerationRules.create(args)
        return success({ id: rule.id })
      }

      case 'discord_delete_automod_rule': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.autoModerationRules.delete(args.ruleId)
        return success({ deleted: args.ruleId })
      }

      // ========== STAGE INSTANCES ==========
      case 'discord_get_stage_instance': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.guild) return error('NOT_FOUND', 'Stage channel not found')
        const stage = await (channel.guild as any).stageInstances?.fetch(args.channelId).catch(() => null)
        if (!stage) return error('NOT_FOUND', 'No active stage instance found')
        return success({
          id: stage.id,
          channelId: stage.channelId,
          guildId: stage.guildId,
          topic: stage.topic,
          privacyLevel: stage.privacyLevel
        })
      }

      case 'discord_create_stage_instance': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.guild) return error('NOT_FOUND', 'Stage channel not found')
        const stage = await (channel.guild as any).stageInstances?.create({
          channel: args.channelId,
          topic: args.topic,
          privacyLevel: args.privacyLevel || 2,
          sendStartNotification: args.sendStartNotification
        })
        return success({ id: stage.id, topic: stage.topic })
      }

      case 'discord_edit_stage_instance': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.guild) return error('NOT_FOUND', 'Stage channel not found')
        const stage = await (channel.guild as any).stageInstances?.fetch(args.channelId)
        if (!stage) return error('NOT_FOUND', 'Active stage instance not found')
        const updated = await stage.edit({ topic: args.topic, privacyLevel: args.privacyLevel })
        return success({ id: updated.id, topic: updated.topic })
      }

      case 'discord_delete_stage_instance': {
        const channel = client.channels.cache.get(args.channelId) as any
        if (!channel || !channel.guild) return error('NOT_FOUND', 'Stage channel not found')
        const stage = await (channel.guild as any).stageInstances?.fetch(args.channelId)
        if (!stage) return error('NOT_FOUND', 'Active stage instance not found')
        await stage.delete(args.reason)
        return success({ deleted: true, channelId: args.channelId })
      }

      // ========== SOUNDBOARD ==========
      case 'discord_list_soundboard_sounds': {
        try {
          const response = await client.rest.get(`/guilds/${args.guildId}/soundboard-sounds` as any)
          return success({ sounds: (response as any).items || response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_create_soundboard_sound': {
        try {
          const response = await client.rest.post(`/guilds/${args.guildId}/soundboard-sounds` as any, {
            body: {
              name: args.name,
              sound: args.sound,
              volume: args.volume,
              emoji_name: args.emojiName
            }
          })
          return success({ sound: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_delete_soundboard_sound': {
        try {
          await client.rest.delete(`/guilds/${args.guildId}/soundboard-sounds/${args.soundId}` as any)
          return success({ deleted: true, soundId: args.soundId })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_send_soundboard_sound': {
        try {
          await client.rest.post(`/channels/${args.channelId}/send-soundboard-sound` as any, {
            body: {
              sound_id: args.soundId,
              source_guild_id: args.sourceGuildId
            }
          })
          return success({ sent: true, channelId: args.channelId, soundId: args.soundId })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== SCHEDULED EVENTS ==========
      case 'discord_create_scheduled_event': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const event = await guild.scheduledEvents.create({
          name: args.name, scheduledStartTime: args.scheduledStartTime, scheduledEndTime: args.scheduledEndTime,
          privacyLevel: args.privacyLevel || 2, entityType: args.entityType || 3,
          description: args.description, entityMetadata: args.entityMetadata, channel: args.channelId
        } as any)
        return success({ id: event.id })
      }

      case 'discord_edit_scheduled_event': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const event = (await guild.scheduledEvents.fetch(args.eventId)) as any
        if (!event) return error('NOT_FOUND', 'Scheduled event not found')
        const editOptions: any = {}
        if (args.name) editOptions.name = args.name
        if (args.description !== undefined) editOptions.description = args.description
        if (args.scheduledStartTime) editOptions.scheduledStartTime = args.scheduledStartTime
        if (args.scheduledEndTime) editOptions.scheduledEndTime = args.scheduledEndTime
        if (args.status) editOptions.status = args.status
        if (args.channelId) editOptions.channel = args.channelId
        if (args.location) editOptions.entityMetadata = { location: args.location }
        const updated = await event.edit(editOptions)
        return success({ id: updated.id, name: updated.name, status: updated.status })
      }

      case 'discord_delete_scheduled_event': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.scheduledEvents.delete(args.eventId)
        return success({ deleted: args.eventId })
      }

      case 'discord_get_scheduled_events': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const events = await guild.scheduledEvents.fetch()
        return success({ events: Array.from(events.values()).map(e => ({ id: e.id, name: e.name })) })
      }

      case 'discord_get_scheduled_event_users': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const event = (await guild.scheduledEvents.fetch(args.eventId)) as any
        if (!event) return error('NOT_FOUND', 'Scheduled event not found')
        const subscribers = await event.fetchSubscribers({ limit: args.limit || 100, withMember: args.withMember })
        return success({
          eventId: event.id,
          users: subscribers.map((s: any) => ({
            userId: s.user.id,
            username: s.user.username,
            displayName: s.member?.displayName || s.user.username
          })),
          count: subscribers.size
        })
      }

      // ========== SLASH COMMANDS ==========
      case 'discord_create_global_command': {
        const cmd = await client.application?.commands.create(args)
        return success({ id: cmd?.id })
      }

      case 'discord_create_guild_command': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const cmd = await guild.commands.create(args)
        return success({ id: cmd.id })
      }

      case 'discord_delete_global_command': {
        await client.application?.commands.delete(args.commandId)
        return success({ deleted: args.commandId })
      }

      case 'discord_delete_guild_command': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        await guild.commands.delete(args.commandId)
        return success({ deleted: args.commandId })
      }

      case 'discord_get_global_commands': {
        const cmds = await client.application?.commands.fetch()
        return success({ commands: cmds ? Array.from(cmds.values()) : [] })
      }

      case 'discord_get_guild_commands': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const cmds = await guild.commands.fetch()
        return success({ commands: Array.from(cmds.values()) })
      }

      // ========== INTERACTION HANDLERS (stub) ==========
      case 'discord_register_button_handler':
        return success({ registered: args.customId, type: 'button' })

      case 'discord_register_select_handler':
        return success({ registered: args.customId, type: 'select' })

      case 'discord_unregister_handler':
        return success({ unregistered: args.customId })

      case 'discord_list_handlers':
        return success({ handlers: [] })

      // ========== RAW API CALL ==========
      case 'discord_api_call': {
        const method = args.method
        const endpoint = args.endpoint.startsWith('/') ? args.endpoint : `/${args.endpoint}`
        const guildMatch = endpoint.match(/^\/guilds\/(\d+)/)
        const channelMatch = endpoint.match(/^\/channels\/(\d+)/)
        if (!guildMatch && !channelMatch) {
          return error('FORBIDDEN', 'Only /guilds/:id/* and /channels/:id/* endpoints are allowed')
        }
        try {
          const response = await client.rest.request({ method, fullRoute: endpoint as any, body: args.body } as any)
          return success({ result: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== EMOJI.GG ==========
      case 'discord_search_emojigg': {
        try {
          const res = await fetch('https://emoji.gg/api/', { headers: { 'User-Agent': 'Mozilla/5.0' } })
          if (!res.ok) return error('EMOJIGG_ERROR', `API returned ${res.status}`)
          const text = await res.text()
          if (text.startsWith('<')) return error('EMOJIGG_ERROR', 'Cloudflare blocked')
          const data = JSON.parse(text)
          const results = data.filter((e: any) => e.title.toLowerCase().includes(args.query.toLowerCase())).slice(0, 15)
          return success({ emojis: results })
        } catch (e: any) {
          return error('EMOJIGG_ERROR', e.message)
        }
      }

      case 'discord_add_emojigg': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const emoji = await guild.emojis.create({ attachment: args.url, name: args.name })
        return success({ id: emoji.id, name: emoji.name, url: emoji.url })
      }

      // ========== DATABASE & LOGGING (requires database handlers) ==========
      case 'discord_get_logs': {
        if (!db?.getLogs) return error('NOT_CONFIGURED', 'Database handlers not configured')
        const logs = await db.getLogs(args)
        return success({ logs })
      }

      case 'discord_get_guild_config': {
        if (!db?.getGuildConfig) return error('NOT_CONFIGURED', 'Database handlers not configured')
        const config = await db.getGuildConfig(args.guildId)
        return success({ config: config || {} })
      }

      case 'discord_set_guild_config': {
        if (!db?.setGuildConfig) return error('NOT_CONFIGURED', 'Database handlers not configured')
        const config = await db.setGuildConfig(args.guildId, args)
        return success({ config })
      }

      case 'discord_get_db_stats': {
        if (!db?.getDbStats) return error('NOT_CONFIGURED', 'Database handlers not configured')
        const stats = await db.getDbStats()
        return success(stats)
      }

      case 'discord_create_scheduled_task': {
        if (!db?.createScheduledTask) return error('NOT_CONFIGURED', 'Database handlers not configured')
        const task = await db.createScheduledTask(args)
        return success({ id: task._id || task.id, task })
      }

      case 'discord_list_scheduled_tasks': {
        if (!db?.listScheduledTasks) return error('NOT_CONFIGURED', 'Database handlers not configured')
        const tasks = await db.listScheduledTasks(args)
        return success({ tasks })
      }

      case 'discord_cancel_scheduled_task': {
        if (!db?.cancelScheduledTask) return error('NOT_CONFIGURED', 'Database handlers not configured')
        const task = await db.cancelScheduledTask(args.taskId)
        return success({ task })
      }

      // ========== EXTENDED MESSAGES (10) ==========
      case 'discord_get_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const msg = await channel.messages.fetch(args.messageId)
        if (!msg) return error('NOT_FOUND', 'Message not found')
        return success({
          id: msg.id,
          channelId: msg.channelId,
          guildId: msg.guildId,
          content: msg.content,
          author: { id: msg.author.id, username: msg.author.username, bot: msg.author.bot },
          embeds: msg.embeds.map(e => e.toJSON()),
          attachments: msg.attachments.map(a => ({ id: a.id, name: a.name, url: a.url, size: a.size })),
          pinned: msg.pinned,
          tts: msg.tts,
          createdAt: msg.createdAt,
          editedAt: msg.editedAt
        })
      }

      case 'discord_reply_to_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const msg = await channel.send({
          content: args.content,
          embeds: args.embeds,
          reply: { messageReference: args.messageId, failIfNotExists: false },
          allowedMentions: { repliedUser: args.pingAuthor !== false }
        })
        return success({ id: msg.id, channelId: msg.channelId, repliedTo: args.messageId })
      }

      case 'discord_send_typing': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        await channel.sendTyping()
        return success({ channelId: args.channelId, typing: true })
      }

      case 'discord_send_attachment': {
        const channel = (client.channels.cache.get(args.channelId) || await client.channels.fetch(args.channelId).catch(() => null)) as any
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Channel is not a text channel or is inaccessible')
        const files = normalizeAttachments(args)
        if (files.length === 0) return error('NO_ATTACHMENT', 'No valid attachment file, URL, base64, or filePath provided')
        const msg = await channel.send({ content: args.content, files })
        return success({
          id: msg.id,
          channelId: msg.channelId,
          attachments: msg.attachments.map((a: any) => ({ id: a.id, name: a.name, url: a.url, size: a.size }))
        })
      }

      case 'discord_download_attachment': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const msg = await channel.messages.fetch(args.messageId)
        if (!msg) return error('NOT_FOUND', 'Message not found')
        const attachment = args.attachmentId ? msg.attachments.get(args.attachmentId) : msg.attachments.first()
        if (!attachment) return error('NOT_FOUND', 'Attachment not found on message')
        return success({
          id: attachment.id,
          name: attachment.name,
          url: attachment.url,
          proxyURL: attachment.proxyURL,
          size: attachment.size,
          contentType: attachment.contentType
        })
      }

      case 'discord_forward_message': {
        try {
          const response = await client.rest.post(`/channels/${args.toChannelId}/messages` as any, {
            body: {
              message_reference: {
                channel_id: args.fromChannelId,
                message_id: args.messageId,
                type: 1
              }
            }
          })
          return success({ forwarded: true, message: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_clear_all_reactions': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Not a text channel')
        const msg = await channel.messages.fetch(args.messageId)
        if (!msg) return error('NOT_FOUND', 'Message not found')
        await msg.reactions.removeAll()
        return success({ cleared: true, messageId: args.messageId })
      }

      case 'discord_end_poll': {
        try {
          const response = await client.rest.post(`/channels/${args.channelId}/polls/${args.messageId}/expire` as any)
          return success({ expired: true, poll: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_get_poll_voters': {
        try {
          const limit = Math.min(args.limit || 25, 100)
          const response = await client.rest.get(`/channels/${args.channelId}/polls/${args.messageId}/answers/${args.answerId}?limit=${limit}` as any)
          return success({ voters: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_create_announcement_follower': {
        try {
          const response = await client.rest.post(`/channels/${args.channelId}/followers` as any, {
            body: { webhook_channel_id: args.targetChannelId }
          })
          return success({ followed: true, data: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== EXTENDED THREADS & FORUMS (13) ==========
      case 'discord_get_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        return success({
          id: thread.id,
          name: thread.name,
          parentId: thread.parentId,
          guildId: thread.guildId,
          archived: thread.archived,
          locked: thread.locked,
          memberCount: thread.memberCount,
          messageCount: thread.messageCount,
          rateLimitPerUser: thread.rateLimitPerUser,
          createdAt: thread.createdAt
        })
      }

      case 'discord_list_archived_public_threads': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.threads) return error('NOT_FOUND', 'Channel does not support threads')
        const threads = await channel.threads.fetchArchived({ type: 'public', before: args.before, limit: args.limit })
        return success({ threads: threads.threads.map(t => ({ id: t.id, name: t.name, archivedAt: t.archivedAt })) })
      }

      case 'discord_list_archived_private_threads': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.threads) return error('NOT_FOUND', 'Channel does not support threads')
        const threads = await channel.threads.fetchArchived({ type: 'private', before: args.before, limit: args.limit })
        return success({ threads: threads.threads.map(t => ({ id: t.id, name: t.name, archivedAt: t.archivedAt })) })
      }

      case 'discord_list_joined_private_threads': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.threads) return error('NOT_FOUND', 'Channel does not support threads')
        const threads = await (channel.threads as any).fetchJoinedPrivateArchived?.({ limit: args.limit })
        return success({ threads: threads?.threads?.map((t: any) => ({ id: t.id, name: t.name })) || [] })
      }

      case 'discord_join_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.join()
        return success({ joined: true, threadId: thread.id })
      }

      case 'discord_leave_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.leave()
        return success({ left: true, threadId: thread.id })
      }

      case 'discord_add_thread_member': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.members.add(args.userId)
        return success({ added: true, threadId: thread.id, userId: args.userId })
      }

      case 'discord_remove_thread_member': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.members.remove(args.userId)
        return success({ removed: true, threadId: thread.id, userId: args.userId })
      }

      case 'discord_get_thread_member': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        const member = await thread.members.fetch(args.userId)
        return success({ member: { id: member.id, joinTimestamp: member.joinTimestamp, flags: member.flags } })
      }

      case 'discord_list_thread_members': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        const members = await thread.members.fetch()
        return success({ members: Array.from(members.values()).map((m: any) => ({ id: m.id, joinTimestamp: m.joinTimestamp })) })
      }

      case 'discord_archive_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.setArchived(true, args.reason)
        return success({ archived: true, threadId: thread.id })
      }

      case 'discord_unarchive_thread': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread not found')
        await thread.setArchived(false, args.reason)
        return success({ unarchived: true, threadId: thread.id })
      }

      case 'discord_modify_forum_post': {
        const thread = client.channels.cache.get(args.threadId) as any
        if (!thread || !thread.isThread()) return error('NOT_FOUND', 'Thread/Forum post not found')
        const edits: any = {}
        if (args.name) edits.name = args.name
        if (args.appliedTags) edits.appliedTags = args.appliedTags
        if (args.archived !== undefined) edits.archived = args.archived
        if (args.locked !== undefined) edits.locked = args.locked
        if (args.slowmode !== undefined) edits.rateLimitPerUser = args.slowmode
        if (args.pinned !== undefined && thread.setPinned) await thread.setPinned(args.pinned)
        const updated = await thread.edit(edits)
        return success({ id: updated.id, name: updated.name, appliedTags: updated.appliedTags })
      }

      // ========== EXTENDED MEMBERS & MODERATION (7) ==========
      case 'discord_bulk_ban_members': {
        try {
          const response = await client.rest.post(`/guilds/${args.guildId}/bulk-ban` as any, {
            body: {
              user_ids: args.userIds,
              delete_message_seconds: args.deleteMessageSeconds || 0
            },
            reason: args.reason
          })
          return success({ bulkBanned: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_get_current_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const me = await guild.members.fetchMe()
        return success({
          id: me.id,
          nickname: me.nickname,
          roles: me.roles.cache.map(r => ({ id: r.id, name: r.name })),
          permissions: me.permissions.toArray(),
          joinedAt: me.joinedAt
        })
      }

      case 'discord_edit_current_member': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const me = await guild.members.fetchMe()
        await me.setNickname(args.nickname || null)
        return success({ updated: true, nickname: args.nickname || null })
      }

      case 'discord_get_member_roles': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        return success({
          memberId: member.id,
          roles: member.roles.cache.map(r => ({
            id: r.id,
            name: r.name,
            color: r.hexColor,
            position: r.position,
            permissions: r.permissions.toArray()
          }))
        })
      }

      case 'discord_list_role_members': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const members = await guild.members.fetch()
        const roleMembers = members.filter(m => m.roles.cache.has(args.roleId))
        return success({
          roleId: args.roleId,
          count: roleMembers.size,
          members: roleMembers.map(m => ({ id: m.id, username: m.user.username, displayName: m.displayName }))
        })
      }

      case 'discord_get_member_avatar': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const member = await guild.members.fetch(args.memberId)
        return success({
          memberId: member.id,
          guildAvatar: member.avatarURL(),
          displayAvatar: member.displayAvatarURL(),
          userAvatar: member.user.displayAvatarURL(),
          displayColor: member.displayHexColor
        })
      }

      case 'discord_get_member_permissions_in_channel': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const channel = guild.channels.cache.get(args.channelId) as GuildChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const permissions = channel.permissionsFor(args.memberId)
        return success({
          memberId: args.memberId,
          channelId: args.channelId,
          permissions: permissions ? permissions.toArray() : []
        })
      }

      // ========== EXTENDED GUILD MANAGEMENT & SAFETY (9) ==========
      case 'discord_get_guild_preview': {
        const preview = await client.fetchGuildPreview(args.guildId)
        return success({
          id: preview.id,
          name: preview.name,
          icon: preview.iconURL(),
          splash: preview.splashURL(),
          approximateMemberCount: preview.approximateMemberCount,
          approximatePresenceCount: preview.approximatePresenceCount,
          description: preview.description,
          features: preview.features
        })
      }

      case 'discord_get_guild_regions': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const regions = await (guild as any).fetchVoiceRegions?.().catch(() => null) || await (client as any).fetchVoiceRegions?.().catch(() => null) || []
        const list = Array.isArray(regions) ? regions : Array.from((regions as any).values()).map((r: any) => ({ id: r.id, name: r.name, custom: r.custom, optimal: r.optimal }))
        return success({ regions: list })
      }

      case 'discord_get_guild_active_threads': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const active = await guild.channels.fetchActiveThreads()
        return success({
          threads: active.threads.map(t => ({ id: t.id, name: t.name, parentId: t.parentId })),
          membersCount: active.members.size
        })
      }

      case 'discord_edit_vanity_url': {
        try {
          const response = await client.rest.patch(`/guilds/${args.guildId}/vanity-url` as any, {
            body: { code: args.code }
          })
          return success({ vanity: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_get_guild_incidents': {
        try {
          const response = await client.rest.get(`/guilds/${args.guildId}/incident-actions` as any)
          return success({ incidents: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_edit_guild_incidents': {
        try {
          const response = await client.rest.put(`/guilds/${args.guildId}/incident-actions` as any, {
            body: {
              invites_disabled_until: args.invitesDisabledUntil,
              dms_disabled_until: args.dmsDisabledUntil
            }
          })
          return success({ incidents: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_get_member_safety_settings': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        return success({
          guildId: guild.id,
          verificationLevel: guild.verificationLevel,
          explicitContentFilter: guild.explicitContentFilter,
          mfaLevel: guild.mfaLevel
        })
      }

      case 'discord_get_mfa_level': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        return success({ guildId: guild.id, mfaLevel: guild.mfaLevel })
      }

      case 'discord_get_guild_nsfw_level': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        return success({ guildId: guild.id, nsfwLevel: guild.nsfwLevel })
      }

      // ========== NATIVE SERVER TEMPLATES (7) ==========
      case 'discord_get_template': {
        const template = await client.fetchGuildTemplate(args.code)
        return success({
          code: template.code,
          name: template.name,
          description: template.description,
          usageCount: template.usageCount,
          creator: template.creator ? { id: template.creator.id, username: template.creator.username } : null,
          createdAt: template.createdAt
        })
      }

      case 'discord_list_guild_templates': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const templates = await guild.fetchTemplates()
        return success({
          templates: Array.from(templates.values()).map(t => ({
            code: t.code,
            name: t.name,
            description: t.description,
            usageCount: t.usageCount,
            isDirty: (t as any).isDirty || false
          }))
        })
      }

      case 'discord_create_guild_template': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const template = await guild.createTemplate(args.name, args.description)
        return success({ code: template.code, name: template.name, description: template.description })
      }

      case 'discord_sync_guild_template': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const templates = await guild.fetchTemplates()
        const template = templates.get(args.code)
        if (!template) return error('NOT_FOUND', 'Template not found')
        const synced = await template.sync()
        return success({ code: synced.code, name: synced.name, isDirty: (synced as any).isDirty || false })
      }

      case 'discord_edit_guild_template': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const templates = await guild.fetchTemplates()
        const template = templates.get(args.code)
        if (!template) return error('NOT_FOUND', 'Template not found')
        const updated = await template.edit({ name: args.name, description: args.description })
        return success({ code: updated.code, name: updated.name, description: updated.description })
      }

      case 'discord_delete_guild_template': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const templates = await guild.fetchTemplates()
        const template = templates.get(args.code)
        if (!template) return error('NOT_FOUND', 'Template not found')
        await template.delete()
        return success({ deleted: true, code: args.code })
      }

      case 'discord_create_guild_from_template': {
        try {
          const response = await client.rest.post(`/guilds/templates/${args.code}` as any, {
            body: { name: args.name, icon: args.icon }
          })
          return success({ guild: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== EXTENDED ROLES (5) ==========
      case 'discord_modify_single_role_position': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.fetch(args.roleId)
        if (!role) return error('NOT_FOUND', 'Role not found')
        const updated = await role.setPosition(args.position)
        return success({ roleId: updated.id, position: updated.position })
      }

      case 'discord_get_role_members': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.fetch(args.roleId)
        if (!role) return error('NOT_FOUND', 'Role not found')
        return success({
          roleId: role.id,
          roleName: role.name,
          members: Array.from(role.members.values()).map(m => ({ id: m.id, username: m.user.username, displayName: m.displayName }))
        })
      }

      case 'discord_get_default_everyone_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const everyone = guild.roles.everyone
        return success({
          id: everyone.id,
          name: everyone.name,
          permissions: everyone.permissions.toArray(),
          position: everyone.position
        })
      }

      case 'discord_set_role_icon': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.fetch(args.roleId)
        if (!role) return error('NOT_FOUND', 'Role not found')
        const updated = await role.setIcon(args.icon)
        return success({ roleId: updated.id, icon: updated.iconURL() })
      }

      case 'discord_set_role_unicode_emoji': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.fetch(args.roleId)
        if (!role) return error('NOT_FOUND', 'Role not found')
        const updated = await role.setUnicodeEmoji(args.unicodeEmoji)
        return success({ roleId: updated.id, unicodeEmoji: updated.unicodeEmoji })
      }

      // ========== EXTENDED STICKERS, EMOJIS & SOUNDBOARD (5) ==========
      case 'discord_get_sticker': {
        const sticker = await client.fetchSticker(args.stickerId)
        return success({
          id: sticker.id,
          name: sticker.name,
          description: sticker.description,
          tags: sticker.tags,
          formatType: sticker.format,
          url: sticker.url
        })
      }

      case 'discord_edit_sticker': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const updated = await guild.stickers.edit(args.stickerId, {
          name: args.name,
          description: args.description,
          tags: args.tags
        })
        return success({ id: updated.id, name: updated.name })
      }

      case 'discord_get_soundboard_sound': {
        try {
          const response = await client.rest.get(`/guilds/${args.guildId}/soundboard-sounds/${args.soundId}` as any)
          return success({ sound: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_edit_soundboard_sound': {
        try {
          const response = await client.rest.patch(`/guilds/${args.guildId}/soundboard-sounds/${args.soundId}` as any, {
            body: {
              name: args.name,
              volume: args.volume,
              emoji_name: args.emojiName
            }
          })
          return success({ sound: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_list_default_soundboard_sounds': {
        try {
          const response = await client.rest.get('/soundboard-default-sounds' as any)
          return success({ defaultSounds: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== EXTENDED SCHEDULED EVENTS (1) ==========
      case 'discord_get_scheduled_event': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const event = await guild.scheduledEvents.fetch({ guildScheduledEvent: args.eventId, withUserCount: args.withUserCount })
        return success({
          id: event.id,
          name: event.name,
          description: event.description,
          channelId: event.channelId,
          entityType: event.entityType,
          status: event.status,
          userCount: event.userCount,
          scheduledStartTime: event.scheduledStartTimestamp,
          scheduledEndTime: event.scheduledEndTimestamp,
          creator: event.creator ? { id: event.creator.id, username: event.creator.username } : null
        })
      }

      // ========== EXTENDED WEBHOOKS (7) ==========
      case 'discord_execute_webhook_slack': {
        try {
          const response = await client.rest.post(`/webhooks/${args.webhookId}/${args.webhookToken}/slack` as any, {
            body: args.payload
          })
          return success({ executed: true, data: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_execute_webhook_github': {
        try {
          const response = await client.rest.post(`/webhooks/${args.webhookId}/${args.webhookToken}/github` as any, {
            body: args.payload
          })
          return success({ executed: true, data: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_get_webhook_message': {
        try {
          const path = `/webhooks/${args.webhookId}/${args.webhookToken}/messages/${args.messageId}${args.threadId ? `?thread_id=${args.threadId}` : ''}`
          const response = await client.rest.get(path as any)
          return success({ message: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_edit_webhook_message': {
        try {
          const path = `/webhooks/${args.webhookId}/${args.webhookToken}/messages/${args.messageId}${args.threadId ? `?thread_id=${args.threadId}` : ''}`
          const response = await client.rest.patch(path as any, {
            body: { content: args.content, embeds: args.embeds }
          })
          return success({ updated: true, message: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_delete_webhook_message': {
        try {
          const path = `/webhooks/${args.webhookId}/${args.webhookToken}/messages/${args.messageId}${args.threadId ? `?thread_id=${args.threadId}` : ''}`
          await client.rest.delete(path as any)
          return success({ deleted: true, messageId: args.messageId })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_execute_webhook_in_thread': {
        try {
          const path = `/webhooks/${args.webhookId}/${args.webhookToken}?wait=true${args.threadId ? `&thread_id=${args.threadId}` : ''}`
          const response = await client.rest.post(path as any, {
            body: {
              content: args.content,
              username: args.username,
              avatar_url: args.avatarUrl,
              thread_name: args.threadName
            }
          })
          return success({ executed: true, message: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_execute_webhook_wait': {
        try {
          const response = await client.rest.post(`/webhooks/${args.webhookId}/${args.webhookToken}?wait=true` as any, {
            body: {
              content: args.content,
              embeds: args.embeds,
              username: args.username,
              avatar_url: args.avatarUrl
            }
          })
          return success({ executed: true, message: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== EXTENDED SLASH COMMANDS (9) ==========
      case 'discord_get_global_command': {
        const cmd = (await client.application?.commands.fetch(args.commandId)) as any
        if (!cmd) return error('NOT_FOUND', 'Global command not found')
        return success({ id: cmd.id, name: cmd.name, description: cmd.description, options: cmd.options })
      }

      case 'discord_edit_global_command': {
        const updated = await client.application?.commands.edit(args.commandId, {
          name: args.name,
          description: args.description,
          options: args.options
        })
        return success({ id: updated?.id, name: updated?.name })
      }

      case 'discord_bulk_overwrite_global_commands': {
        const cmds = await client.application?.commands.set(args.commands)
        return success({ count: cmds?.size || 0, commands: cmds?.map(c => ({ id: c.id, name: c.name })) })
      }

      case 'discord_get_guild_command': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const cmd = (await guild.commands.fetch(args.commandId)) as any
        if (!cmd) return error('NOT_FOUND', 'Guild command not found')
        return success({ id: cmd.id, name: cmd.name, description: cmd.description, options: cmd.options })
      }

      case 'discord_edit_guild_command': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const updated = await guild.commands.edit(args.commandId, {
          name: args.name,
          description: args.description,
          options: args.options
        })
        return success({ id: updated.id, name: updated.name })
      }

      case 'discord_bulk_overwrite_guild_commands': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const cmds = await guild.commands.set(args.commands)
        return success({ count: cmds.size, commands: cmds.map(c => ({ id: c.id, name: c.name })) })
      }

      case 'discord_get_command_permissions': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const perms = await guild.commands.permissions.fetch({ command: args.commandId }).catch(() => null)
        return success({ permissions: perms })
      }

      case 'discord_edit_command_permissions': {
        try {
          const response = await client.rest.put(
            `/applications/${client.user?.id}/guilds/${args.guildId}/commands/${args.commandId}/permissions` as any,
            { body: { permissions: args.permissions } }
          )
          return success({ permissions: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_batch_edit_command_permissions': {
        try {
          const response = await client.rest.put(
            `/applications/${client.user?.id}/guilds/${args.guildId}/commands/permissions` as any,
            { body: args.commandPermissions }
          )
          return success({ permissions: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== EXTENDED INTERACTIONS (7) ==========
      case 'discord_delete_interaction_reply': {
        try {
          const appId = args.applicationId || client.user?.id
          await client.rest.delete(`/webhooks/${appId}/${args.interactionToken}/messages/@original` as any)
          return success({ deleted: true })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_send_interaction_followup': {
        try {
          const response = await client.rest.post(`/webhooks/${client.user?.id}/${args.interactionToken}` as any, {
            body: {
              content: args.content,
              embeds: args.embeds,
              flags: args.ephemeral ? 64 : 0
            }
          })
          return success({ followup: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_get_interaction_followup': {
        try {
          const response = await client.rest.get(`/webhooks/${client.user?.id}/${args.interactionToken}/messages/${args.messageId}` as any)
          return success({ message: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_edit_interaction_followup': {
        try {
          const response = await client.rest.patch(`/webhooks/${client.user?.id}/${args.interactionToken}/messages/${args.messageId}` as any, {
            body: {
              content: args.content,
              embeds: args.embeds
            }
          })
          return success({ message: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_delete_interaction_followup': {
        try {
          await client.rest.delete(`/webhooks/${client.user?.id}/${args.interactionToken}/messages/${args.messageId}` as any)
          return success({ deleted: true, messageId: args.messageId })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_reply_autocomplete': {
        try {
          await client.rest.post(`/interactions/${args.interactionId}/${args.interactionToken}/callback` as any, {
            body: {
              type: 8,
              data: { choices: args.choices }
            }
          })
          return success({ replied: true, choiceCount: args.choices.length })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_launch_activity': {
        try {
          const response = await client.rest.post(`/channels/${args.channelId}/invites` as any, {
            body: {
              target_type: 2,
              target_application_id: args.applicationId
            }
          })
          return success({ invite: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      // ========== GATEWAY EVENT SYSTEM (12) ==========
      case 'discord_subscribe_events': {
        const subs = eventManager.subscribe(args.events)
        return success({ activeSubscriptions: subs })
      }

      case 'discord_unsubscribe_events': {
        const subs = eventManager.unsubscribe(args.events)
        return success({ activeSubscriptions: subs })
      }

      case 'discord_list_event_subscriptions': {
        const subs = eventManager.listSubscriptions()
        return success({ activeSubscriptions: subs })
      }

      case 'discord_wait_for_event': {
        const event = await eventManager.waitForEvent(
          args.event,
          args.timeoutMs || 30000,
          (e) => (!args.channelId || e.channelId === args.channelId) && (!args.userId || e.userId === args.userId)
        )
        if (!event) return error('TIMEOUT', `Timeout waiting for event: ${args.event}`)
        return success({ event })
      }

      case 'discord_get_recent_events': {
        const events = eventManager.getRecentEvents(args)
        return success({ count: events.length, events })
      }

      case 'discord_register_message_handler': {
        const reg = eventManager.registerHandler({ eventType: 'messageCreate', channelId: args.channelId, action: args.action })
        return success({ handler: reg })
      }

      case 'discord_register_reaction_handler': {
        const reg = eventManager.registerHandler({ eventType: 'messageReactionAdd', channelId: args.channelId, action: args.action })
        return success({ handler: reg })
      }

      case 'discord_register_member_handler': {
        const reg = eventManager.registerHandler({ eventType: 'guildMemberAdd', guildId: args.guildId, action: args.action })
        return success({ handler: reg })
      }

      case 'discord_register_voice_handler': {
        const reg = eventManager.registerHandler({ eventType: 'voiceStateUpdate', guildId: args.guildId, action: args.action })
        return success({ handler: reg })
      }

      case 'discord_register_thread_handler': {
        const reg = eventManager.registerHandler({ eventType: 'threadCreate', guildId: args.guildId, action: args.action })
        return success({ handler: reg })
      }

      case 'discord_register_interaction_handler': {
        const reg = eventManager.registerHandler({ eventType: 'interactionCreate', guildId: args.guildId, action: args.action })
        return success({ handler: reg })
      }

      case 'discord_unregister_handler': {
        const removed = eventManager.unregisterHandler(args.handlerId)
        return success({ unregistered: removed, handlerId: args.handlerId })
      }

      // ========== LIVE VOICE & AUDIO CONNECTION (11) ==========
      case 'discord_join_voice_channel': {
        const state = await voiceManager.join(client, args.guildId, args.channelId, args.mute, args.deaf)
        return success({ state, message: `Connected to voice channel ${args.channelId}` })
      }

      case 'discord_leave_voice_channel': {
        const left = await voiceManager.leave(client, args.guildId)
        return success({ disconnected: left, guildId: args.guildId })
      }

      case 'discord_get_bot_voice_state': {
        const state = voiceManager.getState(args.guildId)
        return success({ voiceState: state || { status: 'disconnected' } })
      }

      case 'discord_play_audio': {
        try {
          const state = await voiceManager.playAudio(args.guildId, args.source, 'url', args.title)
          return success({ playback: state, message: `Now playing audio in voice channel` })
        } catch (e: any) {
          return error('PLAYBACK_ERROR', e.message)
        }
      }

      case 'discord_pause_audio': {
        const state = voiceManager.pauseAudio(args.guildId)
        if (!state) return error('NOT_PLAYING', 'No audio is currently playing in this guild')
        return success({ playback: state })
      }

      case 'discord_resume_audio': {
        const state = voiceManager.resumeAudio(args.guildId)
        if (!state) return error('NOT_PAUSED', 'No audio is currently paused in this guild')
        return success({ playback: state })
      }

      case 'discord_stop_audio': {
        const state = voiceManager.stopAudio(args.guildId)
        return success({ stopped: true, playback: state })
      }

      case 'discord_set_audio_volume': {
        const state = voiceManager.setVolume(args.guildId, args.volume)
        return success({ volume: state?.volume || args.volume })
      }

      case 'discord_play_audio_url': {
        try {
          const state = await voiceManager.playAudio(args.guildId, args.url, 'url', args.title)
          return success({ playback: state, message: `Now streaming audio URL` })
        } catch (e: any) {
          return error('PLAYBACK_ERROR', e.message)
        }
      }

      case 'discord_play_local_audio': {
        try {
          const src = args.base64 || args.filePath || args.source
          const type = args.base64 ? 'base64' : 'url'
          const state = await voiceManager.playAudio(args.guildId, src, type)
          return success({ playback: state, message: `Now streaming audio in voice channel` })
        } catch (e: any) {
          return error('PLAYBACK_ERROR', e.message)
        }
      }

      case 'discord_speak_tts': {
        try {
          const state = await voiceManager.playAudio(args.guildId, args.text, 'tts', `TTS: ${args.text.substring(0, 30)}`)
          return success({ playback: state, message: `Speaking text: "${args.text}"` })
        } catch (e: any) {
          return error('TTS_ERROR', e.message)
        }
      }

      case 'discord_start_voice_recording': {
        try {
          const recording = await voiceManager.startRecording(args.guildId, {
            userId: args.userId,
            excludedUserIds: args.excludedUserIds,
            multiTrack: args.multiTrack
          })
          return success({
            recording,
            message: `Started recording voice channel audio (ID: ${recording.id}, MultiTrack: ${recording.multiTrack !== false})`
          })
        } catch (e: any) {
          return error('RECORDING_ERROR', e.message)
        }
      }

      case 'discord_stop_voice_recording': {
        try {
          const recording = await voiceManager.stopRecording(args.guildId, {
            sendToChannelId: args.sendToChannelId || args.channelId,
            client
          })
          return success({
            recording,
            message: `Recording finalized in-memory (${recording.durationSeconds}s, ${recording.sizeBytes} bytes)${recording.attachmentUrl ? ` and sent to channel as ${recording.attachmentUrl}` : ''}`
          })
        } catch (e: any) {
          return error('RECORDING_ERROR', e.message)
        }
      }

      case 'discord_list_voice_recordings': {
        const recordings = voiceManager.listRecordings(args.guildId)
        return success({ recordings, count: recordings.length })
      }

      // ========== HIGH-LEVERAGE POWER PRIMITIVES (6) ==========
      case 'discord_resolve': {
        const query = args.query.trim()
        const guild = args.guildId ? client.guilds.cache.get(args.guildId) : null

        // 1. Channel URL parse: https://discord.com/channels/{guildId}/{channelId}/{messageId}
        const urlMatch = query.match(/discord(?:app)?\.com\/channels\/(\d+|@me)\/(\d+)(?:\/(\d+))?/)
        if (urlMatch) {
          const parsedGuildId = urlMatch[1] === '@me' ? null : urlMatch[1]
          const parsedChannelId = urlMatch[2]
          const parsedMessageId = urlMatch[3]
          return success({
            resolved: true,
            type: parsedMessageId ? 'message' : 'channel',
            guildId: parsedGuildId,
            channelId: parsedChannelId,
            messageId: parsedMessageId
          })
        }

        // 2. Mention formats
        const channelMention = query.match(/^<#(\d+)>$/)
        if (channelMention) {
          const ch = client.channels.cache.get(channelMention[1]) as any
          return success({ resolved: true, type: 'channel', id: channelMention[1], name: ch?.name, guildId: ch?.guildId })
        }

        const userMention = query.match(/^<@!?(\d+)>$/)
        if (userMention) {
          const u = client.users.cache.get(userMention[1])
          return success({ resolved: true, type: 'user', id: userMention[1], username: u?.username })
        }

        const roleMention = query.match(/^<@&(\d+)>$/)
        if (roleMention) {
          const r = guild?.roles.cache.get(roleMention[1])
          return success({ resolved: true, type: 'role', id: roleMention[1], name: r?.name, guildId: guild?.id })
        }

        const emojiMention = query.match(/^<(a)?:([a-zA-Z0-9_]+):(\d+)>$/)
        if (emojiMention) {
          return success({ resolved: true, type: 'emoji', id: emojiMention[3], name: emojiMention[2], animated: !!emojiMention[1] })
        }

        // 3. Raw snowflake ID check
        if (/^\d{17,20}$/.test(query)) {
          if (client.guilds.cache.has(query)) return success({ resolved: true, type: 'guild', id: query, name: client.guilds.cache.get(query)?.name })
          if (client.channels.cache.has(query)) {
            const ch = client.channels.cache.get(query) as any
            return success({ resolved: true, type: 'channel', id: query, name: ch.name, guildId: ch.guildId })
          }
          if (guild?.roles.cache.has(query)) {
            const r = guild.roles.cache.get(query)
            return success({ resolved: true, type: 'role', id: query, name: r?.name })
          }
          if (client.users.cache.has(query)) {
            const u = client.users.cache.get(query)
            return success({ resolved: true, type: 'user', id: query, username: u?.username })
          }
          return success({ resolved: true, type: 'id', id: query })
        }

        // 4. Name search in guild
        if (guild) {
          const cleanQuery = query.replace(/^#|@/, '').toLowerCase()
          const ch = guild.channels.cache.find(c => c.name.toLowerCase() === cleanQuery)
          if (ch) return success({ resolved: true, type: 'channel', id: ch.id, name: ch.name })

          const r = guild.roles.cache.find(r => r.name.toLowerCase() === cleanQuery)
          if (r) return success({ resolved: true, type: 'role', id: r.id, name: r.name })

          const m = guild.members.cache.find(m => m.user.username.toLowerCase() === cleanQuery || m.displayName.toLowerCase() === cleanQuery)
          if (m) return success({ resolved: true, type: 'member', id: m.id, username: m.user.username, displayName: m.displayName })

          const e = guild.emojis.cache.find(e => e.name?.toLowerCase() === cleanQuery)
          if (e) return success({ resolved: true, type: 'emoji', id: e.id, name: e.name })
        }

        return success({ resolved: false, query, message: 'Could not automatically resolve identifier' })
      }

      case 'discord_permission_check': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const me = await guild.members.fetchMe()

        const actionPermissionMap: Record<string, bigint> = {
          ban_member: 1n << 2n, // BanMembers
          kick_member: 1n << 1n, // KickMembers
          manage_roles: 1n << 28n, // ManageRoles
          manage_channels: 1n << 4n, // ManageChannels
          manage_webhooks: 1n << 29n, // ManageWebhooks
          mute_members: 1n << 22n, // MuteMembers
          deafen_members: 1n << 23n, // DeafenMembers
          move_members: 1n << 24n, // MoveMembers
          moderate_members: 1n << 40n, // ModerateMembers (timeout)
          send_messages: 1n << 11n,
          manage_messages: 1n << 13n
        }

        const requiredBit = actionPermissionMap[args.action.toLowerCase()]
        const channel = args.channelId ? (guild.channels.cache.get(args.channelId) as GuildChannel) : null
        const effectivePerms = channel ? channel.permissionsFor(me) : me.permissions

        const hasPerm = requiredBit ? (effectivePerms.bitfield & requiredBit) === requiredBit : true

        let hierarchyOk = true
        let hierarchyReason: string | undefined = undefined

        if (args.targetUserId) {
          if (args.targetUserId === guild.ownerId) {
            hierarchyOk = false
            hierarchyReason = 'Target user is the Server Owner'
          } else {
            const targetMember = await guild.members.fetch(args.targetUserId).catch(() => null)
            if (targetMember) {
              if (me.roles.highest.position <= targetMember.roles.highest.position) {
                hierarchyOk = false
                hierarchyReason = `Bot highest role (${me.roles.highest.name}, pos ${me.roles.highest.position}) is not higher than target highest role (${targetMember.roles.highest.name}, pos ${targetMember.roles.highest.position})`
              }
            }
          }
        }

        if (args.targetRoleId) {
          const targetRole = guild.roles.cache.get(args.targetRoleId)
          if (targetRole && me.roles.highest.position <= targetRole.position) {
            hierarchyOk = false
            hierarchyReason = `Bot highest role (${me.roles.highest.name}, pos ${me.roles.highest.position}) is not higher than target role (${targetRole.name}, pos ${targetRole.position})`
          }
        }

        const allowed = hasPerm && hierarchyOk
        return success({
          allowed,
          hasBotPermission: hasPerm,
          hierarchyOk,
          reason: hierarchyReason || (hasPerm ? 'Permitted' : `Bot lacks permission for ${args.action}`),
          botHighestRole: { id: me.roles.highest.id, name: me.roles.highest.name, position: me.roles.highest.position }
        })
      }

      case 'discord_batch': {
        const operations: any[] = args.operations || []
        const concurrency = Math.min(Math.max(args.concurrency || 3, 1), 10)
        const continueOnError = args.continueOnError !== false
        const results: any[] = []

        for (let i = 0; i < operations.length; i += concurrency) {
          const chunk = operations.slice(i, i + concurrency)
          const chunkResults = await Promise.all(
            chunk.map(async (op: any) => {
              try {
                const res = await handleToolCall(client, op.tool, op.args, db)
                return { id: op.id, tool: op.tool, success: res.success, data: (res as any).data, error: (res as any).error }
              } catch (e: any) {
                return { id: op.id, tool: op.tool, success: false, error: { message: e.message } }
              }
            })
          )
          results.push(...chunkResults)
          if (!continueOnError && chunkResults.some(r => !r.success)) {
            break
          }
        }

        const successCount = results.filter(r => r.success).length
        return success({
          total: operations.length,
          executed: results.length,
          successful: successCount,
          failed: results.length - successCount,
          results
        })
      }

      case 'discord_get_api_capabilities': {
        return success({
          apiVersion: '10',
          guildsCount: client.guilds.cache.size,
          userTag: client.user?.tag,
          intents: {
            bitfield: client.options.intents.bitfield.toString(),
            hasGuildMembersIntent: client.options.intents.has(1 << 1),
            hasGuildPresencesIntent: client.options.intents.has(1 << 8),
            hasMessageContentIntent: client.options.intents.has(1 << 15)
          },
          voiceReady: true,
          gatewayStatus: client.ws.status,
          pingMs: client.ws.ping
        })
      }

      case 'discord_asset_to_data_uri': {
        const url = args.url.trim()
        let buffer: Buffer
        let mimeType = 'image/png'

        if (url.startsWith('http://') || url.startsWith('https://')) {
          const res = await fetch(url)
          if (!res.ok) return error('FETCH_ERROR', `Failed to download asset: HTTP ${res.status}`)
          mimeType = res.headers.get('content-type') || 'image/png'
          buffer = Buffer.from(await res.arrayBuffer())
        } else {
          const fs = await import('fs/promises')
          const path = await import('path')
          buffer = await fs.readFile(url)
          const ext = path.extname(url).toLowerCase()
          if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg'
          else if (ext === '.gif') mimeType = 'image/gif'
          else if (ext === '.webp') mimeType = 'image/webp'
        }

        const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`
        return success({ dataUri, sizeBytes: buffer.length, mimeType })
      }

      case 'discord_add_guild_member': {
        try {
          const response = await client.rest.put(`/guilds/${args.guildId}/members/${args.userId}` as any, {
            body: {
              access_token: args.accessToken,
              nick: args.nickname,
              roles: args.roles,
              mute: args.mute,
              deaf: args.deaf
            }
          })
          return success({ added: true, member: response })
        } catch (e: any) {
          return error('REST_ERROR', e.message)
        }
      }

      case 'discord_api_call': {
        const method = (args.method || 'GET').toUpperCase()
        const endpoint = args.endpoint.startsWith('/') ? args.endpoint : `/${args.endpoint}`
        try {
          let res: any
          const options: any = {
            body: args.body,
            query: args.query ? new URLSearchParams(args.query) : undefined,
            reason: args.reason
          }
          if (method === 'GET') {
            res = await client.rest.get(endpoint as any, options)
          } else if (method === 'POST') {
            res = await client.rest.post(endpoint as any, options)
          } else if (method === 'PATCH') {
            res = await client.rest.patch(endpoint as any, options)
          } else if (method === 'PUT') {
            res = await client.rest.put(endpoint as any, options)
          } else if (method === 'DELETE') {
            res = await client.rest.delete(endpoint as any, options)
          }
          return success({ response: res })
        } catch (e: any) {
          const detail = e.status ? ` [HTTP ${e.status}]` : ''
          const retry = e.retryAfter ? ` [Retry-After: ${e.retryAfter}s]` : ''
          return error('REST_API_ERROR', `${e.message || 'REST API Error'}${detail}${retry}`)
        }
      }

      default:
        return error('UNKNOWN_TOOL', `Unknown tool: ${name}`)
    }
  } catch (err: any) {
    console.error(`Tool ${name} error:`, err)
    return error('DISCORD_ERROR', err.message || 'An error occurred')
  }
}
