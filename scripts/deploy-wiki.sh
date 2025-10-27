#!/bin/bash
# Script to deploy documentation to GitHub Wiki
# Adapted for Codex MCP Tool project

set -e

echo "🚀 Deploying Wiki to GitHub..."

# Configuration
REPO_OWNER="x51xxx"
REPO_NAME="codex-mcp-tool"
WIKI_REPO="https://github.com/${REPO_OWNER}/${REPO_NAME}.wiki.git"
TEMP_DIR=".wiki-temp"

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is required but not installed."
    echo "Install with: brew install gh (macOS) or see https://cli.github.com/"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "docs" ]; then
    echo "❌ Not in the project root directory. Please run from the root of codex-mcp-tool."
    exit 1
fi

# Clean up any existing temp directory
rm -rf "$TEMP_DIR"

# Clone the wiki repository
echo "📥 Cloning wiki repository..."
git clone "$WIKI_REPO" "$TEMP_DIR" 2>/dev/null || {
    echo "⚠️  Wiki doesn't exist yet. Creating initial wiki through GitHub..."

    # Try to create initial wiki page through API
    gh api "repos/${REPO_OWNER}/${REPO_NAME}/wiki/pages" \
        --method POST \
        -f title="Home" \
        -f body="# Codex MCP Tool Wiki\n\nInitializing wiki..." 2>/dev/null || {
        echo "⚠️  Could not create wiki. Please enable wiki in repository settings first."
        echo "Go to: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings"
        echo "Then scroll down to 'Features' and check 'Wikis'"
        exit 1
    }

    # Try cloning again
    sleep 2
    git clone "$WIKI_REPO" "$TEMP_DIR" || {
        echo "❌ Failed to clone wiki repository"
        exit 1
    }
}

cd "$TEMP_DIR"

echo "📄 Creating wiki pages from documentation..."

# Home page - combine README and main index
cat > Home.md << 'EOF'
# Codex MCP Tool Wiki

Welcome to the Codex MCP Tool wiki! This tool bridges OpenAI's Codex CLI with MCP-compatible clients.

## Quick Links

- [Getting Started](Getting-Started)
- [Installation Guide](Installation)
- [API Reference](API-Reference)
- [Examples](Examples)
- [Troubleshooting](Troubleshooting)

## About

Codex MCP Tool is a Model Context Protocol (MCP) server that enables seamless integration between OpenAI's Codex CLI and MCP clients like Claude Desktop and Claude Code.

### Key Features

- 🚀 Non-interactive execution of Codex commands
- 📁 File reference support with @ syntax
- 🔒 Multiple sandbox modes for security
- 🤖 Access to latest OpenAI models (GPT-5, o3, o4-mini)
- 🎯 Specialized tools for different tasks
- 📊 Real-time progress tracking

## Tools Available

- **ask-codex**: Execute Codex commands with file references
- **brainstorm**: Generate ideas with structured methodologies
- **ping**: Test connectivity
- **help**: Show Codex CLI help
- **fetch-chunk**: Handle large responses
- **timeout-test**: Test long-running operations

## Support

- [GitHub Issues](https://github.com/x51xxx/codex-mcp-tool/issues)
- [Documentation](https://x51xxx.github.io/codex-mcp-tool/)
- [NPM Package](https://www.npmjs.com/package/@cexll/codex-mcp-server)
EOF

# Getting Started page
cat > Getting-Started.md << 'EOF'
# Getting Started with Codex MCP Tool

## Prerequisites

Before installing, ensure you have:

1. **Node.js** v18.0.0 or higher
2. **Codex CLI** installed and authenticated
3. An MCP-compatible client (Claude Desktop/Code)

## Quick Start

### For Claude Code (Recommended)

```bash
claude mcp add codex-cli -- npx -y @cexll/codex-mcp-server
```

### For Claude Desktop

Add to your configuration file:

```json
{
  "mcpServers": {
    "codex-cli": {
      "command": "npx",
      "args": ["-y", "@cexll/codex-mcp-server"]
    }
  }
}
```

Configuration file locations:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

## Verify Installation

Test the connection:
```
/codex-cli:ping (MCP) "Hello from Codex!"
```

## First Commands

Try these examples:
- `ask codex to explain @README.md`
- `use codex to analyze @src/`
- `brainstorm optimization ideas for my code`

See [Examples](Examples) for more usage patterns.
EOF

# Installation page
if [ -f "../docs/getting-started.md" ]; then
    cp ../docs/getting-started.md Installation.md
else
    echo "# Installation Guide" > Installation.md
    echo "See [Getting Started](Getting-Started) for installation instructions." >> Installation.md
fi

# API Reference
cat > API-Reference.md << 'EOF'
# API Reference

## Tools

### ask-codex

Execute Codex CLI commands with file references.

**Parameters:**
- `prompt` (string, required): The command or question
- `model` (string, optional): Model to use (gpt-5, o3, o4-mini)
- `sandbox` (boolean, optional): Enable full-auto mode
- `fullAuto` (boolean, optional): Alternative to sandbox
- `approvalPolicy` (string, optional): never, on-request, on-failure, untrusted
- `sandboxMode` (string, optional): read-only, workspace-write, danger-full-access
- `changeMode` (boolean, optional): Return structured edits
- `cd` (string, optional): Working directory

### brainstorm

Generate ideas with structured methodologies.

**Parameters:**
- `prompt` (string, required): The brainstorming challenge
- `model` (string, optional): Model to use
- `methodology` (string, optional): divergent, convergent, scamper, design-thinking, lateral, auto
- `domain` (string, optional): Domain context
- `constraints` (string, optional): Limitations or requirements
- `ideaCount` (number, optional): Number of ideas to generate
- `includeAnalysis` (boolean, optional): Include feasibility analysis

### ping

Test connectivity to the MCP server.

**Parameters:**
- `message` (string, optional): Message to echo back

### help

Display Codex CLI help information.

**Parameters:** None

### fetch-chunk

Retrieve cached chunks from changeMode responses.

**Parameters:**
- `cacheKey` (string, required): Cache key from initial response
- `chunkIndex` (number, required): Chunk number to retrieve

## Models

See [Model Selection](Model-Selection) for detailed model information.
EOF

# Examples page
cat > Examples.md << 'EOF'
# Examples

## Basic Usage

### File Analysis
```javascript
// Analyze a single file
"analyze @src/main.ts and explain what it does"

// Multiple files
"compare @src/server.ts @src/client.ts"

// Directory analysis
"review @src/**/*.ts for code quality"
```

### Code Generation
```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "create unit tests for @src/utils/",
    "model": "gpt-5"
  }
}
```

### Brainstorming
```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "ways to improve API performance",
    "methodology": "scamper",
    "domain": "backend",
    "ideaCount": 10
  }
}
```

## Advanced Usage

### With Sandbox Modes
```javascript
// Read-only analysis
{
  "prompt": "security audit @src/",
  "sandboxMode": "read-only"
}

// Allow writing in workspace
{
  "prompt": "refactor @src/legacy/",
  "sandboxMode": "workspace-write",
  "approvalPolicy": "on-request"
}
```

### Change Mode for Structured Edits
```javascript
{
  "prompt": "update all console.log to use winston",
  "changeMode": true
}
```

## Common Patterns

- **Code Review**: `"review @feature/new-api/ for best practices"`
- **Bug Investigation**: `"find the bug in @src/payment.ts"`
- **Documentation**: `"generate API docs for @src/api/"`
- **Refactoring**: `"modernize @src/legacy/ to TypeScript"`
- **Security**: `"check @src/ for OWASP top 10 vulnerabilities"`
EOF

# Troubleshooting page
cat > Troubleshooting.md << 'EOF'
# Troubleshooting

## Common Issues

### "Command not found: codex"
- Ensure Codex CLI is installed
- Verify with: `codex --version`
- Check PATH environment variable

### "MCP server not responding"
1. Check configuration file syntax
2. Restart your MCP client
3. Run diagnostics: `claude code --> /doctor`
4. Verify npm package: `npm list -g @cexll/codex-mcp-server`

### "Permission denied" errors
- Check sandbox mode settings
- Try: `"sandboxMode": "workspace-write"`
- Ensure proper file permissions

### "Model not available"
- Verify Codex CLI authentication
- Check available models: `codex --list-models`
- Try fallback model: `"model": "o4-mini"`

### Timeout errors
- Break large tasks into smaller ones
- Increase timeout parameter
- Use progress callbacks

## Debug Mode

Enable detailed logging:
```bash
DEBUG=codex-mcp:* npm start
```

## Getting Help

1. Check [GitHub Issues](https://github.com/x51xxx/codex-mcp-tool/issues)
2. Review [Documentation](https://x51xxx.github.io/codex-mcp-tool/)
3. Ask in [Discussions](https://github.com/x51xxx/codex-mcp-tool/discussions)
EOF

# Model Selection page
if [ -f "../docs/concepts/models.md" ]; then
    cp ../docs/concepts/models.md Model-Selection.md
fi

# Create sidebar for navigation
cat > _Sidebar.md << 'EOF'
## 🏠 Navigation

**Getting Started**
* [[Home]]
* [[Getting Started|Getting-Started]]
* [[Installation]]
* [[Examples]]

**Reference**
* [[API Reference|API-Reference]]
* [[Model Selection|Model-Selection]]
* [[Troubleshooting]]

**Links**
* [📦 NPM Package](https://www.npmjs.com/package/@cexll/codex-mcp-server)
* [🐙 GitHub Repo](https://github.com/x51xxx/codex-mcp-tool)
* [📋 Issues](https://github.com/x51xxx/codex-mcp-tool/issues)
* [📖 Docs](https://x51xxx.github.io/codex-mcp-tool/)
EOF

# Create footer
cat > _Footer.md << 'EOF'
---
📄 [MIT License](https://github.com/x51xxx/codex-mcp-tool/blob/main/LICENSE) |
🔧 [Contribute](https://github.com/x51xxx/codex-mcp-tool) |
📦 [NPM](https://www.npmjs.com/package/@cexll/codex-mcp-server) |
⭐ [Star on GitHub](https://github.com/x51xxx/codex-mcp-tool)
EOF

# Commit and push
echo "💾 Committing changes..."
git add -A
git commit -m "📚 Update wiki documentation

- Updated all wiki pages for Codex MCP Tool
- Added API reference and examples
- Created navigation sidebar
- Added troubleshooting guide
- Updated links and references" || echo "No changes to commit"

echo "📤 Pushing to GitHub..."
git push origin master 2>/dev/null || git push origin main 2>/dev/null || {
    echo "⚠️  Could not push to wiki. You may need to manually push changes."
    echo "Try: cd $TEMP_DIR && git push"
}

cd ..
rm -rf "$TEMP_DIR"

echo "✅ Wiki deployment complete!"
echo "🔗 View at: https://github.com/${REPO_OWNER}/${REPO_NAME}/wiki"
echo ""
echo "📝 Note: It may take a few seconds for changes to appear on GitHub."
echo "   If wiki doesn't exist, enable it in repository settings first."
