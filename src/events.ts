import { Client } from 'discord.js'

export interface StoredDiscordEvent {
  id: string
  event: string
  guildId?: string
  channelId?: string
  userId?: string
  timestamp: string
  data: any
}

export interface EventHandlerRegistration {
  id: string
  eventType: string
  guildId?: string
  channelId?: string
  action: 'log' | 'collect' | 'forward'
  createdAt: string
}

class EventManager {
  private recentEvents: StoredDiscordEvent[] = []
  private maxBufferSize: number = 200
  private subscriptions: Set<string> = new Set()
  private handlers: Map<string, EventHandlerRegistration> = new Map()
  private waitingPromises: {
    event: string
    filter?: (e: any) => boolean
    resolve: (e: any) => void
    timer: NodeJS.Timeout
  }[] = []
  private isInitialized = false

  init(client: Client) {
    if (this.isInitialized) return
    this.isInitialized = true

    const recordEvent = (event: string, data: any, guildId?: string, channelId?: string, userId?: string) => {
      const stored: StoredDiscordEvent = {
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        event,
        guildId,
        channelId,
        userId,
        timestamp: new Date().toISOString(),
        data
      }

      this.recentEvents.unshift(stored)
      if (this.recentEvents.length > this.maxBufferSize) {
        this.recentEvents.pop()
      }

      // Check waiters
      for (let i = this.waitingPromises.length - 1; i >= 0; i--) {
        const waiter = this.waitingPromises[i]
        if (waiter.event === event || waiter.event === '*') {
          if (!waiter.filter || waiter.filter(stored)) {
            clearTimeout(waiter.timer)
            waiter.resolve(stored)
            this.waitingPromises.splice(i, 1)
          }
        }
      }
    }

    client.on('messageCreate', (msg) => {
      recordEvent('messageCreate', {
        id: msg.id,
        content: msg.content,
        author: { id: msg.author.id, username: msg.author.username, bot: msg.author.bot },
        channelId: msg.channelId,
        guildId: msg.guildId,
        createdAt: msg.createdAt
      }, msg.guildId || undefined, msg.channelId, msg.author.id)
    })

    client.on('messageUpdate', (oldMsg, newMsg) => {
      recordEvent('messageUpdate', {
        id: newMsg.id,
        channelId: newMsg.channelId,
        guildId: newMsg.guildId,
        oldContent: (oldMsg as any)?.content,
        newContent: (newMsg as any)?.content
      }, newMsg.guildId || undefined, newMsg.channelId)
    })

    client.on('messageDelete', (msg) => {
      recordEvent('messageDelete', {
        id: msg.id,
        channelId: msg.channelId,
        guildId: msg.guildId
      }, msg.guildId || undefined, msg.channelId)
    })

    client.on('messageReactionAdd', (reaction, user) => {
      recordEvent('messageReactionAdd', {
        messageId: reaction.message.id,
        channelId: reaction.message.channelId,
        guildId: reaction.message.guildId,
        emoji: reaction.emoji.name,
        userId: user.id
      }, reaction.message.guildId || undefined, reaction.message.channelId, user.id)
    })

    client.on('messageReactionRemove', (reaction, user) => {
      recordEvent('messageReactionRemove', {
        messageId: reaction.message.id,
        channelId: reaction.message.channelId,
        guildId: reaction.message.guildId,
        emoji: reaction.emoji.name,
        userId: user.id
      }, reaction.message.guildId || undefined, reaction.message.channelId, user.id)
    })

    client.on('guildMemberAdd', (member) => {
      recordEvent('guildMemberAdd', {
        guildId: member.guild.id,
        userId: member.id,
        username: member.user.username
      }, member.guild.id, undefined, member.id)
    })

    client.on('guildMemberRemove', (member) => {
      recordEvent('guildMemberRemove', {
        guildId: member.guild.id,
        userId: member.id,
        username: (member as any)?.user?.username
      }, member.guild.id, undefined, member.id)
    })

    client.on('voiceStateUpdate', (oldState, newState) => {
      recordEvent('voiceStateUpdate', {
        guildId: newState.guild.id,
        userId: newState.id,
        oldChannelId: oldState.channelId,
        newChannelId: newState.channelId,
        mute: newState.mute,
        deaf: newState.deaf,
        streaming: newState.streaming
      }, newState.guild.id, newState.channelId || oldState.channelId || undefined, newState.id)
    })

    client.on('threadCreate', (thread) => {
      recordEvent('threadCreate', {
        id: thread.id,
        name: thread.name,
        guildId: thread.guildId,
        parentId: thread.parentId
      }, thread.guildId, thread.id)
    })

    client.on('interactionCreate', (interaction) => {
      recordEvent('interactionCreate', {
        id: interaction.id,
        type: interaction.type,
        user: { id: interaction.user.id, username: interaction.user.username },
        guildId: interaction.guildId,
        channelId: interaction.channelId
      }, interaction.guildId || undefined, interaction.channelId || undefined, interaction.user.id)
    })
  }

  subscribe(events: string[]): string[] {
    events.forEach(e => this.subscriptions.add(e))
    return Array.from(this.subscriptions)
  }

  unsubscribe(events: string[]): string[] {
    events.forEach(e => this.subscriptions.delete(e))
    return Array.from(this.subscriptions)
  }

  listSubscriptions(): string[] {
    return Array.from(this.subscriptions)
  }

  getRecentEvents(options: { event?: string; guildId?: string; channelId?: string; userId?: string; limit?: number }): StoredDiscordEvent[] {
    const limit = Math.min(options.limit || 50, 100)
    return this.recentEvents
      .filter(e => {
        if (options.event && e.event !== options.event) return false
        if (options.guildId && e.guildId !== options.guildId) return false
        if (options.channelId && e.channelId !== options.channelId) return false
        if (options.userId && e.userId !== options.userId) return false
        return true
      })
      .slice(0, limit)
  }

  waitForEvent(event: string, timeoutMs: number = 30000, filter?: (e: any) => boolean): Promise<StoredDiscordEvent | null> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        const idx = this.waitingPromises.findIndex(w => w.timer === timer)
        if (idx !== -1) this.waitingPromises.splice(idx, 1)
        resolve(null)
      }, timeoutMs)

      this.waitingPromises.push({
        event,
        filter,
        resolve,
        timer
      })
    })
  }

  registerHandler(registration: Omit<EventHandlerRegistration, 'id' | 'createdAt'>): EventHandlerRegistration {
    const id = `handler_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    const full: EventHandlerRegistration = {
      id,
      ...registration,
      createdAt: new Date().toISOString()
    }
    this.handlers.set(id, full)
    return full
  }

  unregisterHandler(id: string): boolean {
    return this.handlers.delete(id)
  }

  listHandlers(): EventHandlerRegistration[] {
    return Array.from(this.handlers.values())
  }
}

export const eventManager = new EventManager()
