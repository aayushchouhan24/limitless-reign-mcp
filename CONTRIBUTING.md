# Contributing to limitless-reign-mcp

First off, thanks for taking the time to contribute!

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When creating a bug report, include:**

- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior vs actual behavior
- Your environment (Node.js version, discord.js version, OS)
- Code samples if applicable

### Suggesting Features

Feature suggestions are welcome! Please:

- Use a clear and descriptive title
- Explain why this feature would be useful
- Provide examples of how it would work

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests if applicable
3. Ensure the build passes (`npm run build`)
4. Make sure your code follows the existing style
5. Write a clear PR description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/limitless-reign-mcp.git
cd limitless-reign-mcp

# Install dependencies
npm install

# Build
npm run build

# Watch mode for development
npm run dev
```

## Project Structure

```
src/
├── index.ts      # Main exports and framework adapters
├── server.ts     # DiscordMCPServer class
├── tools.ts      # Tool definitions (116 tools)
├── handlers.ts   # Tool handlers
└── types.ts      # TypeScript interfaces
```

## Adding a New Tool

1. Add the tool definition in `src/tools.ts`:

```typescript
{
  name: 'discord_your_tool',
  description: 'What the tool does',
  inputSchema: {
    type: 'object',
    properties: {
      param1: { type: 'string', description: 'Description' }
    },
    required: ['param1']
  }
}
```

2. Add the handler in `src/handlers.ts`:

```typescript
case 'discord_your_tool': {
  const { param1 } = args
  // Implementation
  return success({ result: 'data' })
}
```

3. Update the README tool reference table
4. Update the CHANGELOG

## Code Style

- Use TypeScript
- Use async/await over raw promises
- Use descriptive variable names
- Keep functions focused and small
- Add JSDoc comments for public APIs

## Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues and PRs when relevant

## Questions?

Feel free to open an issue with the "question" label.
