import type { Client, VoiceBasedChannel } from 'discord.js'
import { AttachmentBuilder } from 'discord.js'
import {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  EndBehaviorType,
  type VoiceConnection,
  type AudioPlayer,
  type AudioResource
} from '@discordjs/voice'
import { PassThrough, Readable } from 'stream'

export interface BotVoiceConnectionState {
  guildId: string
  channelId: string
  status: 'connected' | 'connecting' | 'disconnected'
  isPlaying: boolean
  isPaused: boolean
  volume: number
  selfMute: boolean
  selfDeaf: boolean
  isRecording: boolean
  activeRecordingId?: string
  currentAudio?: {
    type: 'url' | 'base64' | 'tts' | 'youtube'
    source: string
    title?: string
    startedAt: string
  }
}

export interface BotVoiceRecordingTrack {
  userId?: string
  name: string
  sizeBytes: number
  base64: string
  dataUri: string
}

export interface BotVoiceRecording {
  id: string
  guildId: string
  channelId: string
  userId?: string
  excludedUserIds?: string[]
  multiTrack?: boolean
  startTime: string
  endTime?: string
  status: 'recording' | 'completed' | 'failed'
  durationSeconds?: number
  sizeBytes?: number
  base64?: string
  dataUri?: string
  sentMessageId?: string
  attachmentUrl?: string
  tracks?: BotVoiceRecordingTrack[]
}

interface GuildVoiceSession {
  connection: VoiceConnection
  player: AudioPlayer
  resource?: AudioResource
  state: BotVoiceConnectionState
  liveStreamRelay: PassThrough
  activeRecording?: {
    recording: BotVoiceRecording
    masterChunks: Buffer[]
    userChunks: Map<string, Buffer[]>
    startTimeMs: number
    subscribedStreams: Map<string, Readable>
  }
}

class VoiceManager {
  private sessions: Map<string, GuildVoiceSession> = new Map()
  private recordingsHistory: BotVoiceRecording[] = []

  async join(client: Client, guildId: string, channelId: string, selfMute = false, selfDeaf = false): Promise<BotVoiceConnectionState> {
    const guild = client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId).catch(() => null)
    if (!guild) {
      throw new Error(`Guild ${guildId} not found or inaccessible by bot`)
    }

    const channel = (guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(() => null)) as VoiceBasedChannel | null
    if (!channel || !channel.isVoiceBased()) {
      throw new Error(`Voice channel ${channelId} not found in guild ${guildId}`)
    }

    // Connect via @discordjs/voice WebRTC
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator as any,
      selfMute,
      selfDeaf
    })

    const player = createAudioPlayer()
    connection.subscribe(player)

    const liveStreamRelay = new PassThrough()

    const state: BotVoiceConnectionState = {
      guildId,
      channelId,
      status: 'connected',
      isPlaying: false,
      isPaused: false,
      volume: 100,
      selfMute,
      selfDeaf,
      isRecording: false
    }

    const session: GuildVoiceSession = {
      connection,
      player,
      state,
      liveStreamRelay
    }

    player.on(AudioPlayerStatus.Idle, () => {
      state.isPlaying = false
      state.isPaused = false
      state.currentAudio = undefined
    })

    player.on('error', (err) => {
      console.error(`Audio player error in guild ${guildId}:`, err)
      state.isPlaying = false
      state.isPaused = false
    })

    // Listen to incoming user voice streams and buffer in-memory
    connection.receiver.speaking.on('start', (userId) => {
      try {
        const userStream = connection.receiver.subscribe(userId, {
          end: {
            behavior: EndBehaviorType.AfterSilence,
            duration: 1000
          }
        })

        userStream.on('data', (chunk: Buffer) => {
          liveStreamRelay.write(chunk)

          const recSession = session.activeRecording
          if (recSession) {
            const { recording, masterChunks, userChunks } = recSession

            // Specific user filter
            if (recording.userId && recording.userId !== userId) {
              return
            }

            // Exclusion filter
            if (recording.excludedUserIds && recording.excludedUserIds.includes(userId)) {
              return
            }

            // Master in-memory stream buffer
            masterChunks.push(chunk)

            // Multi-track in-memory buffer
            if (recording.multiTrack) {
              let uList = userChunks.get(userId)
              if (!uList) {
                uList = []
                userChunks.set(userId, uList)
              }
              uList.push(chunk)
            }
          }
        })
      } catch (err) {
        console.error(`Voice receiver error for user ${userId}:`, err)
      }
    })

    this.sessions.set(guildId, session)

    // Wait up to 5s for connection to become ready
    try {
      await entersState(connection, VoiceConnectionStatus.Ready, 5_000)
    } catch {
      // Fallback: connection continues in background
    }

    return state
  }

  async leave(client: Client, guildId: string): Promise<boolean> {
    const session = this.sessions.get(guildId)
    if (session) {
      if (session.activeRecording) {
        await this.stopRecording(guildId).catch(() => null)
      }
      session.player.stop()
      session.connection.destroy()
      session.liveStreamRelay.end()
      this.sessions.delete(guildId)
      return true
    }

    const existingConn = getVoiceConnection(guildId)
    if (existingConn) {
      existingConn.destroy()
      return true
    }

    return false
  }

  getState(guildId: string): BotVoiceConnectionState | null {
    const session = this.sessions.get(guildId)
    return session?.state || null
  }

  getLiveAudioStream(guildId: string): PassThrough | null {
    const session = this.sessions.get(guildId)
    return session?.liveStreamRelay || null
  }

  async startRecording(
    guildId: string,
    options: { userId?: string; excludedUserIds?: string[]; multiTrack?: boolean } = {}
  ): Promise<BotVoiceRecording> {
    const session = this.sessions.get(guildId)
    if (!session) {
      throw new Error(`Bot is not in a voice channel in guild ${guildId}. Join a voice channel first.`)
    }

    if (session.activeRecording) {
      throw new Error(`A recording is already in progress for guild ${guildId}`)
    }

    const recordingId = `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    const startTimeMs = Date.now()

    const recording: BotVoiceRecording = {
      id: recordingId,
      guildId,
      channelId: session.state.channelId,
      userId: options.userId,
      excludedUserIds: options.excludedUserIds,
      multiTrack: options.multiTrack ?? true,
      startTime: new Date().toISOString(),
      status: 'recording',
      tracks: []
    }

    session.activeRecording = {
      recording,
      masterChunks: [],
      userChunks: new Map(),
      startTimeMs,
      subscribedStreams: new Map()
    }

    session.state.isRecording = true
    session.state.activeRecordingId = recordingId

    return recording
  }

  async stopRecording(
    guildId: string,
    options: { sendToChannelId?: string; client?: Client } = {}
  ): Promise<BotVoiceRecording> {
    const session = this.sessions.get(guildId)
    if (!session || !session.activeRecording) {
      throw new Error(`No active recording found for guild ${guildId}`)
    }

    const { recording, masterChunks, userChunks, startTimeMs } = session.activeRecording
    const durationSeconds = Math.round((Date.now() - startTimeMs) / 1000)

    const masterBuffer = Buffer.concat(masterChunks)
    const masterBase64 = masterBuffer.toString('base64')
    const masterDataUri = `data:audio/ogg;codecs=opus;base64,${masterBase64}`

    const tracks: BotVoiceRecordingTrack[] = [
      {
        name: 'Master Combined Track (All Speakers)',
        sizeBytes: masterBuffer.length,
        base64: masterBase64,
        dataUri: masterDataUri
      }
    ]

    for (const [userId, chunks] of userChunks.entries()) {
      const uBuf = Buffer.concat(chunks)
      const uBase64 = uBuf.toString('base64')
      tracks.push({
        userId,
        name: `Speaker Track (User ${userId})`,
        sizeBytes: uBuf.length,
        base64: uBase64,
        dataUri: `data:audio/ogg;codecs=opus;base64,${uBase64}`
      })
    }

    recording.endTime = new Date().toISOString()
    recording.status = 'completed'
    recording.durationSeconds = durationSeconds
    recording.sizeBytes = masterBuffer.length
    recording.base64 = masterBase64
    recording.dataUri = masterDataUri
    recording.tracks = tracks

    // If channel upload requested, upload in-memory buffer directly as a Discord message attachment
    if (options.sendToChannelId && options.client) {
      try {
        const channel = (options.client.channels.cache.get(options.sendToChannelId) || await options.client.channels.fetch(options.sendToChannelId).catch(() => null)) as any
        if (channel?.isTextBased()) {
          const attachment = new AttachmentBuilder(masterBuffer, { name: `${recording.id}_recording.opus` })
          const msg = await channel.send({
            content: `🎙️ **Voice Recording (${durationSeconds}s, ${(masterBuffer.length / 1024).toFixed(1)} KB)**`,
            files: [attachment]
          })
          recording.sentMessageId = msg.id
          recording.attachmentUrl = msg.attachments.first()?.url
        }
      } catch (uploadErr) {
        console.error('Failed to post recording attachment to Discord channel:', uploadErr)
      }
    }

    session.activeRecording = undefined
    session.state.isRecording = false
    session.state.activeRecordingId = undefined

    this.recordingsHistory.unshift(recording)
    // Keep max 20 in history
    if (this.recordingsHistory.length > 20) this.recordingsHistory.pop()

    return recording
  }

  listRecordings(guildId?: string): BotVoiceRecording[] {
    if (guildId) {
      return this.recordingsHistory.filter(r => r.guildId === guildId)
    }
    return this.recordingsHistory
  }

  async playAudio(guildId: string, source: string, type: 'url' | 'base64' | 'tts' | 'youtube' = 'url', title?: string): Promise<BotVoiceConnectionState> {
    const session = this.sessions.get(guildId)
    if (!session) {
      throw new Error(`Bot is not connected to a voice channel in guild ${guildId}. Use discord_join_voice_channel first.`)
    }

    let resource: AudioResource

    if (type === 'youtube' || source.includes('youtube.com') || source.includes('youtu.be')) {
      try {
        const play = await import('play-dl')
        const stream = await play.stream(source)
        resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true })
      } catch (e: any) {
        resource = createAudioResource(source, { inlineVolume: true })
      }
    } else if (type === 'base64' || source.startsWith('data:') || source.length > 500) {
      const raw = source.includes(',') ? source.split(',')[1] : source
      const buffer = Buffer.from(raw, 'base64')
      const stream = Readable.from(buffer)
      resource = createAudioResource(stream, { inlineVolume: true })
    } else if (type === 'tts') {
      const encoded = encodeURIComponent(source)
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=${source.length}&client=tw-ob&q=${encoded}&tl=en`
      resource = createAudioResource(ttsUrl, { inlineVolume: true })
    } else {
      // Direct Web Audio/Video URL stream (mp3, wav, ogg, aac, mp4 stream)
      resource = createAudioResource(source, { inlineVolume: true })
    }

    if (resource.volume) {
      resource.volume.setVolume(session.state.volume / 100)
    }

    session.resource = resource
    session.player.play(resource)

    session.state.isPlaying = true
    session.state.isPaused = false
    session.state.currentAudio = {
      type,
      source: source.startsWith('data:') ? '[Base64 Stream]' : source,
      title: title || source.startsWith('data:') ? 'In-Memory Audio' : source,
      startedAt: new Date().toISOString()
    }

    return session.state
  }

  pauseAudio(guildId: string): BotVoiceConnectionState | null {
    const session = this.sessions.get(guildId)
    if (!session || !session.state.isPlaying) return null
    session.player.pause()
    session.state.isPaused = true
    return session.state
  }

  resumeAudio(guildId: string): BotVoiceConnectionState | null {
    const session = this.sessions.get(guildId)
    if (!session || !session.state.isPaused) return null
    session.player.unpause()
    session.state.isPaused = false
    return session.state
  }

  stopAudio(guildId: string): BotVoiceConnectionState | null {
    const session = this.sessions.get(guildId)
    if (!session) return null
    session.player.stop()
    session.state.isPlaying = false
    session.state.isPaused = false
    session.state.currentAudio = undefined
    return session.state
  }

  setVolume(guildId: string, volume: number): BotVoiceConnectionState | null {
    const session = this.sessions.get(guildId)
    if (!session) return null
    const clamped = Math.max(0, Math.min(200, volume))
    session.state.volume = clamped
    if (session.resource?.volume) {
      session.resource.volume.setVolume(clamped / 100)
    }
    return session.state
  }
}

export const voiceManager = new VoiceManager()




