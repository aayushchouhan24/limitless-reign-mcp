import type { Client } from 'discord.js'

export interface ValidateResult {
  valid: boolean
  error?: string
  userId?: string
}

export interface ToolResult {
  success: boolean
  data?: any
  error?: { code: string; message: string }
}

export interface ToolDefinition {
  name: string
  description: string
  inputSchema: {
    type: string
    properties: Record<string, any>
    required: string[]
  }
}

// Database handlers - optional, user provides these
export interface DatabaseHandlers {
  getLogs?: (args: { guildId?: string; tool?: string; limit?: number; success?: boolean }) => Promise<any>
  getGuildConfig?: (guildId: string) => Promise<any>
  setGuildConfig?: (guildId: string, config: any) => Promise<any>
  getDbStats?: () => Promise<any>
  createScheduledTask?: (task: any) => Promise<any>
  listScheduledTasks?: (args: { guildId?: string; status?: string }) => Promise<any>
  cancelScheduledTask?: (taskId: string) => Promise<any>
}

export interface AllowedGuild {
  id: string
  name?: string
  icon?: string | null
}

export interface MCPServerOptions {
  // Discord client
  client: Client

  // Auth middleware - called for every request
  validateAccess: (apiKey: string, guildId: string | null) => Promise<ValidateResult>

  // Optional: get list of guilds the API key can access
  getAllowedGuilds?: (apiKey: string) => Promise<AllowedGuild[]>

  // Optional: log all tool calls
  onToolCall?: (tool: string, args: any, result: any, apiKey: string) => void

  // Optional: database handlers for persistence features
  database?: DatabaseHandlers

  // Server info customization
  serverName?: string
  serverVersion?: string
  serverDescription?: string
}
