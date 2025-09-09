# Installation

Multiple ways to install the Codex MCP Tool, depending on your needs.

## Prerequisites

- Node.js v18.0.0 or higher
- Claude Desktop or Claude Code with MCP support
- Codex CLI installed and authenticated
  - Follow the [Codex CLI installation guide](https://codex.openai.com/docs/getting-started)
  - Run `codex login` to authenticate

## Method 1: NPX (Recommended)

No installation needed - runs directly:

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "codex-cli": {
      "command": "npx",
      "args": ["-y", "@trishchuk/codex-mcp-tool"]
    }
  }
}
```

### Claude Code Configuration
```bash
claude mcp add codex-cli --npm-package @trishchuk/codex-mcp-tool
```

## Method 2: Global Installation

### Install globally
```bash
npm install -g @trishchuk/codex-mcp-tool
```

### Claude Desktop Configuration
```json
{
  "mcpServers": {
    "codex-cli": {
      "command": "codex-mcp"
    }
  }
}
```

### Claude Code Configuration
```bash
claude mcp add codex-cli --command codex-mcp
```

## Method 3: Local Development

For development or local testing:

```bash
# Clone the repository
git clone https://github.com/x51xxx/codex-mcp-tool.git
cd codex-mcp-tool

# Install dependencies
npm install

# Build the project
npm run build

# Test locally
node dist/index.js
```

### Claude Desktop Configuration (Local)
```json
{
  "mcpServers": {
    "codex-dev": {
      "command": "node",
      "args": ["/path/to/codex-mcp-tool/dist/index.js"]
    }
  }
}
```

## Verification

Test your installation by running a simple tool:

```json
{
  "name": "ping",
  "arguments": {
    "prompt": "Hello Codex!"
  }
}
```

Expected response: `"Hello Codex!"`

## Troubleshooting

Common issues:
- **Node.js version**: Ensure you have Node.js ≥18.0.0 (`node --version`)
- **Codex CLI not found**: Install and authenticate Codex CLI first
- **Permission errors**: Try running with appropriate permissions
- **MCP connection issues**: Restart your Claude client after configuration changes

For more help, see the [FAQ](faq) or [Troubleshooting Guide](resources/troubleshooting).

## Support

Need help with installation or setup? I'm here to assist:

### 🤝 Get Help
- **GitHub Issues**: [Report bugs or request features](https://github.com/x51xxx/codex-mcp-tool/issues)
- **GitHub Discussions**: [Ask questions and share ideas](https://github.com/x51xxx/codex-mcp-tool/discussions)
- **Email**: [taras@trishchuk.com](mailto:taras@trishchuk.com) for direct support

### 📖 Documentation
- **[Getting Started Guide](getting-started)** - Complete setup and configuration
- **[API Documentation](api/tools/ask-codex)** - Detailed tool reference
- **[Examples](examples/basic-usage)** - Practical usage patterns

### 🚀 Contributing
Interested in contributing? Check out our [Contributing Guide](https://github.com/x51xxx/codex-mcp-tool/blob/main/CONTRIBUTING.md) or reach out directly!

---

**Developed by [Taras Trishchuk](https://github.com/x51xxx)** | Licensed under MIT
