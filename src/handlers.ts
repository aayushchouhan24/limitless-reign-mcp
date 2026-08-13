import {
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  WebhookClient,
  type Client,
  type TextChannel,
  type GuildChannel
} from 'discord.js'
import type { ToolResult, DatabaseHandlers } from './types'

function success(data: any): ToolResult {
  return { success: true, data }
}

function error(code: string, message: string): ToolResult {
  return { success: false, error: { code, message } }
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
  if (args?.threadId) {
    const channel = client.channels.cache.get(args.threadId) as GuildChannel | undefined
    return channel?.guildId || null
  }

  const botCommands = ['discord_get_bot_info', 'discord_get_gateway_info', 'discord_set_presence', 'discord_set_activity', 'discord_list_guilds', 'discord_disconnect']
  if (botCommands.includes(name)) return null

  return null
}

export async function handleToolCall(client: Client, name: string, args: any, db?: DatabaseHandlers): Promise<ToolResult> {
  try {
    switch (name) {
      // ========== BOT STATUS ==========
      case 'discord_get_bot_info': {
        const user = client.user!
        return success({
          id: user.id, username: user.username, discriminator: user.discriminator,
          avatar: user.displayAvatarURL(), guilds: client.guilds.cache.size, uptime: client.uptime
        })
      }

      case 'discord_get_gateway_info':
        return success({ ping: client.ws.ping, status: client.ws.status, shards: client.ws.shards.size })

      case 'discord_set_presence': {
        client.user?.setPresence({ status: args.status })
        return success({ status: args.status })
      }

      case 'discord_set_activity': {
        const typeMap: Record<string, number> = { playing: 0, streaming: 1, listening: 2, watching: 3, competing: 5 }
        client.user?.setActivity(args.name, { type: typeMap[args.type] || 0, url: args.url })
        return success({ type: args.type, name: args.name })
      }

      case 'discord_disconnect':
        client.destroy()
        return success({ disconnected: true })

      // ========== GUILD MANAGEMENT ==========
      case 'discord_list_guilds': {
        const guilds = client.guilds.cache.map(g => ({
          id: g.id, name: g.name, memberCount: g.memberCount, icon: g.iconURL()
        }))
        return success({ guilds, total: guilds.length })
      }

      case 'discord_get_guild': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        return success({
          id: guild.id, name: guild.name, description: guild.description, memberCount: guild.memberCount,
          icon: guild.iconURL(), banner: guild.bannerURL(), features: guild.features,
          verificationLevel: guild.verificationLevel, premiumTier: guild.premiumTier,
          premiumSubscriptionCount: guild.premiumSubscriptionCount, ownerId: guild.ownerId, createdAt: guild.createdAt
        })
      }

      case 'discord_edit_guild': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const updated = await guild.edit(args)
        return success({ id: updated.id, name: updated.name })
      }

      case 'discord_get_guild_channels': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const channels = guild.channels.cache.map(ch => ({
          id: ch.id, name: ch.name, type: ch.type, parentId: ch.parentId, position: 'position' in ch ? ch.position : 0
        }))
        return success({ channels })
      }

      case 'discord_get_guild_roles': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const roles = guild.roles.cache.map(r => ({
          id: r.id, name: r.name, color: r.hexColor, hoist: r.hoist, position: r.position, permissions: r.permissions.toArray()
        }))
        return success({ roles })
      }

      case 'discord_get_guild_emojis': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const emojis = guild.emojis.cache.map(e => ({ id: e.id, name: e.name, url: e.url }))
        return success({ emojis })
      }

      case 'discord_get_guild_stickers': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const stickers = guild.stickers.cache.map(s => ({ id: s.id, name: s.name, url: s.url }))
        return success({ stickers })
      }

      case 'discord_get_guild_invites': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const invites = await guild.invites.fetch()
        return success({ invites: invites.map(i => ({ code: i.code, uses: i.uses, maxUses: i.maxUses })) })
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

      case 'discord_set_channel_permissions': {
        const channel = client.channels.cache.get(args.channelId) as GuildChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        await channel.permissionOverwrites.edit(args.targetId, {
          ...(args.allow || []).reduce((acc: any, p: string) => ({...acc, [p]: true}), {}),
          ...(args.deny || []).reduce((acc: any, p: string) => ({...acc, [p]: false}), {})
        }, { reason: args.reason })
        return success({ channelId: channel.id, targetId: args.targetId })
      }

      case 'discord_create_invite': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel) return error('NOT_FOUND', 'Channel not found')
        const invite = await channel.createInvite({ maxAge: args.maxAge, maxUses: args.maxUses, temporary: args.temporary, unique: args.unique } as any)
        return success({ code: invite.code, url: invite.url })
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

      // ========== MESSAGE OPERATIONS ==========
      case 'discord_send_message': {
        const channel = client.channels.cache.get(args.channelId) as TextChannel
        if (!channel?.isTextBased()) return error('INVALID_CHANNEL', 'Channel is not a text channel')
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
        if (args.replyTo) opts.reply = { messageReference: args.replyTo }
        if (args.tts) opts.tts = true
        const msg = await channel.send(opts)
        return success({ id: msg.id, channelId: msg.channelId })
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

      // ========== ROLE MANAGEMENT ==========
      case 'discord_create_role': {
        const guild = client.guilds.cache.get(args.guildId)
        if (!guild) return error('NOT_FOUND', 'Guild not found')
        const role = await guild.roles.create({ name: args.name, color: args.color, hoist: args.hoist, mentionable: args.mentionable, reason: args.reason })
        return success({ id: role.id, name: role.name })
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

      default:
        return error('UNKNOWN_TOOL', `Unknown tool: ${name}`)
    }
  } catch (err: any) {
    console.error(`Tool ${name} error:`, err)
    return error('DISCORD_ERROR', err.message || 'An error occurred')
  }
}
