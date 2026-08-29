export interface BotVoiceConnectionState {
  guildId: string
  channelId: string
  status: 'connected' | 'connecting' | 'disconnected'
  isPlaying: boolean
  isPaused: boolean
  volume: number
  currentAudio?: {
    type: 'url' | 'local' | 'tts'
    source: string
    title?: string
    startedAt: string
  }
}

class VoiceManager {
  private connections: Map<string, BotVoiceConnectionState> = new Map()

  join(guildId: string, channelId: string): BotVoiceConnectionState {
    const state: BotVoiceConnectionState = {
      guildId,
      channelId,
      status: 'connected',
      isPlaying: false,
      isPaused: false,
      volume: 100
    }
    this.connections.set(guildId, state)
    return state
  }

  leave(guildId: string): boolean {
    return this.connections.delete(guildId)
  }

  getState(guildId: string): BotVoiceConnectionState | null {
    return this.connections.get(guildId) || null
  }

  playAudio(guildId: string, source: string, type: 'url' | 'local' | 'tts' = 'url', title?: string): BotVoiceConnectionState | null {
    const state = this.connections.get(guildId)
    if (!state) return null
    state.isPlaying = true
    state.isPaused = false
    state.currentAudio = {
      type,
      source,
      title: title || source,
      startedAt: new Date().toISOString()
    }
    return state
  }

  pauseAudio(guildId: string): BotVoiceConnectionState | null {
    const state = this.connections.get(guildId)
    if (!state || !state.isPlaying) return null
    state.isPaused = true
    return state
  }

  resumeAudio(guildId: string): BotVoiceConnectionState | null {
    const state = this.connections.get(guildId)
    if (!state || !state.isPaused) return null
    state.isPaused = false
    return state
  }

  stopAudio(guildId: string): BotVoiceConnectionState | null {
    const state = this.connections.get(guildId)
    if (!state) return null
    state.isPlaying = false
    state.isPaused = false
    state.currentAudio = undefined
    return state
  }

  setVolume(guildId: string, volume: number): BotVoiceConnectionState | null {
    const state = this.connections.get(guildId)
    if (!state) return null
    state.volume = Math.max(0, Math.min(200, volume))
    return state
  }
}

export const voiceManager = new VoiceManager()
