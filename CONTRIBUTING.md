# Contributing to Codex MCP Tool

Thank you for your interest in contributing to Codex MCP Tool! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/x51xxx/codex-mcp-tool/issues) to avoid duplicates
2. Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
3. Include:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (Node.js version, OS, Codex CLI version)
   - Error messages and logs

### Suggesting Features

1. Check [existing feature requests](https://github.com/x51xxx/codex-mcp-tool/issues?q=is%3Aissue+label%3Aenhancement)
2. Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
3. Explain the problem your feature solves
4. Provide use cases and examples

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Test your changes thoroughly
5. Submit a pull request using our [PR template](.github/pull_request_template.md)

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Codex CLI installed and authenticated
- TypeScript knowledge

### Local Development

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/codex-mcp-tool.git
cd codex-mcp-tool

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
npm start

# Development mode (build + run)
npm run dev
```

### Testing with MCP Clients

#### Claude Code
```bash
# Build and link local development version
npm run build
npm link

# Add to Claude Code
claude mcp add codex-dev --npm-package @trishchuk/codex-mcp-tool
```

#### Claude Desktop
Add to your configuration:
```json
{
  "mcpServers": {
    "codex-dev": {
      "command": "node",
      "args": ["/path/to/your/codex-mcp-tool/dist/index.js"]
    }
  }
}
```

## Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Define types for all function parameters and returns
- Use Zod schemas for runtime validation in all tools
- Follow ESM module conventions (use `.js` extensions in imports)
- Use 2-space indentation, single quotes preferred
- File naming: kebab-case (e.g., `fetch-chunk.tool.ts`)
- Never commit secrets or API keys

### Tool Development Guidelines

- All tools must implement the `UnifiedTool` interface
- Use descriptive zod schema validation with `.describe()`
- Include optional progress callbacks for long-running operations
- Handle errors gracefully and return meaningful messages
- Follow the naming pattern: `toolName.tool.ts`
- Export tools as `export const toolNameTool: UnifiedTool`

### File Structure

```
src/
├── tools/                    # Tool implementations
│   ├── *.tool.ts            # Individual tools
│   ├── registry.ts          # Tool registry types
│   └── index.ts             # Tool registration
├── utils/                    # Utility functions
│   ├── codexExecutor.ts     # Codex CLI executor
│   ├── changeModeRunner.ts  # Change mode processor
│   ├── changeModeParser.ts  # Parse OLD/NEW blocks
│   ├── changeModeChunker.ts # Split large responses
│   ├── chunkCache.ts        # Cache management
│   └── logger.ts            # Logging utilities
├── constants.ts              # Project constants
└── index.ts                 # Main MCP server
```

### Adding a New Tool

1. Create `src/tools/your-tool.tool.ts`:
```typescript
import { z } from 'zod';
import { UnifiedTool } from './registry.js';

const yourToolArgsSchema = z.object({
  param: z.string().describe('Parameter description')
});

export const yourTool: UnifiedTool = {
  name: 'your-tool',
  description: 'Tool description',
  zodSchema: yourToolArgsSchema,
  prompt: {
    description: 'Tool prompt description',
    arguments: [
      {
        name: 'param',
        description: 'Parameter description',
        required: true
      }
    ]
  },
  category: 'utility', // or 'simple'
  execute: async (args, onProgress) => {
    // Implementation
    onProgress?.('Processing...');
    return 'Tool result';
  }
};
```

2. Register in `src/tools/index.ts`:
```typescript
import { yourTool } from './your-tool.tool.js';

toolRegistry.push(yourTool);
```

3. Add documentation in `docs/api/tools/your-tool.md`

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

Examples:
```
feat: add support for GPT-5 model
fix: handle timeout errors in ask-codex tool
docs: update installation instructions for Windows
```

## Testing

### Running Tests

```bash
# Type checking
npm run lint

# Build verification
npm run build

# Run tests (when available)
npm test
```

### Manual Testing Checklist

Before submitting a PR, test:
- [ ] All tools work correctly with their documented parameters
- [ ] ask-codex tool handles file references (@filename syntax)
- [ ] changeMode returns structured OLD/NEW blocks
- [ ] fetch-chunk retrieves cached chunks correctly
- [ ] timeout-test shows progress notifications
- [ ] Error handling functions properly
- [ ] Progress notifications appear for long operations (25-second intervals)
- [ ] Documentation builds successfully (`npm run docs:build`)
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Tools follow the UnifiedTool interface
- [ ] Cache keys are generated consistently

## Documentation

### Updating Documentation

Documentation uses VitePress:

```bash
# Start docs dev server
npm run docs:dev

# Build documentation
npm run docs:build

# Preview built docs
npm run docs:preview
```

### Documentation Structure

```
docs/
├── index.md              # Homepage
├── getting-started.md    # Installation & setup
├── api/
│   └── tools/           # Tool-specific documentation
│       ├── ask-codex.md
│       ├── brainstorm.md
│       ├── fetch-chunk.md
│       └── *.md
├── concepts/            # Conceptual guides
│   ├── change-mode.md   # Change mode format
│   ├── how-it-works.md  # Architecture
│   └── *.md
├── examples/            # Usage examples
│   ├── basic-usage.md
│   ├── advanced-usage.md
│   └── *.md
└── resources/           # Additional resources
    ├── faq.md
    └── troubleshooting.md
```

### Documentation Standards

- Keep tool docs updated with their zod schemas
- Include practical examples for all features
- Link between related documentation pages
- Use consistent parameter formatting:
  ```markdown
  ### paramName (required/optional)
  - **Type:** `string`
  - **Description:** What this parameter does
  - **Example:** `"example-value"`
  ```

## Release Process

Releases are automated via GitHub Actions:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit: `git commit -m "chore: release v1.2.3"`
4. Tag: `git tag v1.2.3`
5. Push: `git push origin main --tags`

The CI/CD pipeline will:
- Run tests and linting
- Build the project
- Publish to npm as `@trishchuk/codex-mcp-tool`
- Create GitHub release

## Getting Help

- Check [documentation](https://x51xxx.github.io/codex-mcp-tool/)
- Ask in [GitHub Discussions](https://github.com/x51xxx/codex-mcp-tool/discussions)
- Join our community chat (if available)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.