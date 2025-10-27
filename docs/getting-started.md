## Getting Started

<div align="center">⇣ Find your setup ↴</div>

<ClientGrid>
  <div class="client-card client-card--recommended claude-code-card">
    <h3><span class="snowflake">❋</span> Claude Code</h3>
    <div class="client-badge">Power Users</div>
    <p>One-command setup</p>
    <a href="#claude-code-recommended" class="client-button">Get Started →</a>
  </div>

  <div class="client-card">
    <h3>🖥️ <br>Claude Desktop</h3>
    <div class="client-badge">Everyday users</div>
    <p>JSON configuration</p>
    <a href="#claude-desktop" class="client-button">Setup Guide →</a>
  </div>

  <div class="client-card">
    <h3>📂 Other Clients</h3>
    <div class="client-badge">40+ Options</div>
    <p>Warp, Copilot, and More</p>
    <a href="#other-mcp-clients" class="client-button">More →</a>
  </div>
</ClientGrid>

## Client Setup

## Prerequisites

Before installing, ensure you have:

- **[Node.js](https://nodejs.org/)** v16.0.0 or higher
- **[Codex CLI](https://github.com/openai/codex)** installed and authenticated on your system
- **[Claude Desktop](https://claude.ai/download)** or **[Claude Code](https://www.anthropic.com/claude-code)** with MCP support

## Claude Code (Recommended)

::: warning 💡 @cexll/codex-mcp-server is tested extensively with Claude Code
:::
Claude Code offers the smoothest experience.

```bash
# install for Claude Code
claude mcp add codex-cli -- npx -y @cexll/codex-mcp-server

# Start Claude Code - it's automatically configured!
claude
```

## Claude Desktop

---

#### Configuration File Locations

<ConfigModal>

_Where are my Claude Desktop Config Files?:_

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/claude/claude_desktop_config.json`

</ConfigModal>

---

For Claude Desktop users, add this to your configuration file:

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

::: warning
You must restart Claude Desktop **_completely_** for changes to take effect.
:::

## Other MCP Clients

Codex MCP Tool works with 40+ MCP clients! Here are the common configuration patterns:

### STDIO Transport (Most Common)

```json
{
  "transport": {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@cexll/codex-mcp-server"]
  }
}
```

### Popular Clients

<details>
<summary><strong>Warp</strong> - Modern terminal with AI features</summary>

**Configuration Location:** Terminal Settings → AI Settings → MCP Configuration

```json
{
  "codex-cli": {
    "command": "npx",
    "args": ["-y", "@cexll/codex-mcp-server"],
    "env": {},
    "working_directory": null,
    "start_on_launch": true
  }
}
```

**Features:** Terminal-native MCP integration, AI-powered command suggestions

</details>

### Generic Setup Steps

1. **Install Prerequisites**: Ensure [Codex CLI](https://github.com/openai/codex) is installed
2. **Add Server Config**: Use the STDIO transport pattern above
3. **Restart Client**: Most clients require restart after config changes
4. **Test Connection**: Try `/codex-cli:ping` or natural language commands

## Verify Your Setup

Once configured, test that everything is working:

### 1. Basic Connectivity Test

Type in Claude:

```
/codex-cli:ping (MCP) "Hello from Codex MCP!"
```

### 2. Test File Analysis

```
/codex-cli:ask-codex (MCP) @README.md summarize this file
```

### 3. Test Sandbox Mode

```
/codex-cli:ask-codex (MCP) --sandbox create a simple Bash hello world script
```

## Quick Command Reference

Once installed, you can use natural language or slash commands:

### Natural Language Examples

- "use codex to explain index.html"
- "understand the massive project using codex"
- "ask codex to analyze @src/main.ts and explain what it does"
- "use codex to look for vulnerabilities and suggest fixes"

### Slash Commands in Claude Code

Type `/codex-cli` and these commands will appear:

- `/codex-cli:analyze` - Analyze files or ask questions
- `/codex-cli:sandbox` - Safe code execution with full-auto mode
- `/codex-cli:help` - Show help information
- `/codex-cli:ping` - Test connectivity

## Need a Different Client?

Don't see your MCP client listed? Codex MCP Tool uses standard MCP protocol and works with any compatible client.

::: tip Find More MCP Clients

- **Official List**: [modelcontextprotocol.io/clients](https://modelcontextprotocol.io/clients)
- **Configuration Help**: Most clients follow the STDIO transport pattern above
- **Community**: Join discussions on GitHub for client-specific tips
  :::

## Common Issues

### "Command not found: codex"

Make sure you've installed the Codex CLI:

```bash
# Check if Codex is installed
which codex

# If not, install it following the official instructions
# Visit: https://github.com/openai/codex
```

### "MCP server not responding"

0. Run `claude code --> /doctor` for diagnostics
1. Check your configuration file path
2. Ensure JSON syntax is correct
3. Restart your MCP client completely
4. Verify Codex CLI works: `codex --version`

### Client-Specific Issues

- **Claude Desktop**: Must restart completely after config changes
- **Other Clients**: Check their specific documentation for MCP setup

## Next Steps

Now that you're set up:

- Learn about file analysis with @ syntax
- Explore sandbox mode for safe code execution with approval policies
- Check out [Codex CLI usage guide](./codex-cli-getting-started) for advanced features
- Join the community for support

::: info Need Help?
If you run into issues, [open an issue](https://github.com/x51xxx/codex-mcp-tool/issues) on GitHub.
:::
