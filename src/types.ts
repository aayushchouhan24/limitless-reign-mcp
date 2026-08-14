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

// Custom Tool execution context
export interface CustomToolContext {
  client: Client
  apiKey?: string
  database?: DatabaseHandlers
  server: any
  rawArgs: any
}

// Custom Tool handler function signature
export type CustomToolHandler = (
  args: any,
  context: CustomToolContext
) => Promise<ToolResult | any> | ToolResult | any

// Custom / External tool definition
export interface CustomTool {
  name: string
  description: string
  inputSchema?: {
    type?: string
    properties?: Record<string, any>
    required?: string[]
    [key: string]: any
  }
  handler: CustomToolHandler
  /** Optional guild ID extractor for permissions check */
  extractGuildId?: (args: any, client: Client) => string | null
  /** Whether this tool requires apiKey validation (default: true) */
  requiresAuth?: boolean
  /** Tool category/grouping for OpenAPI schemas or logging */
  category?: string
}

// Configuration for HTTP / REST API tools
export interface HttpToolConfig {
  name: string
  description: string
  url: string | ((args: any) => string)
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string> | ((args: any, context: CustomToolContext) => Record<string, string> | Promise<Record<string, string>>)
  inputSchema?: {
    type?: string
    properties?: Record<string, any>
    required?: string[]
    [key: string]: any
  }
  body?: (args: any) => any
  transformResponse?: (data: any, response: Response) => any | Promise<any>
  extractGuildId?: (args: any, client: Client) => string | null
  requiresAuth?: boolean
  category?: string
}

// Configuration for proxying an external MCP server
export interface ExternalMCPServerConfig {
  /** Base URL or SSE endpoint of the external MCP server */
  url: string
  /** Optional prefix for remote tool names to prevent conflicts (e.g., 'github_' or 'ext_') */
  prefix?: string
  /** Optional headers to forward or authenticate with the external MCP server */
  headers?: Record<string, string> | (() => Record<string, string> | Promise<Record<string, string>>)
  /** Optional filter to only include specific tools from the remote server */
  filterTools?: (toolName: string) => boolean
  /** Request timeout in ms (default: 30000) */
  timeoutMs?: number
  /** Whether remote tools should require local auth (default: true) */
  requiresAuth?: boolean
}

// MCP Plugin interface
export type MCPPlugin = (server: any) => void | Promise<void>

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

  // Optional: list of initial custom / external tools
  customTools?: (CustomTool | ToolDefinition & { handler: CustomToolHandler })[]

  // Optional: external MCP servers to proxy
  externalServers?: ExternalMCPServerConfig[]

  // Optional: plugins to register on initialization
  plugins?: MCPPlugin[]

  // Server info customization
  serverName?: string
  serverVersion?: string
  serverDescription?: string
}

