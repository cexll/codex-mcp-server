---
layout: home

hero:
  name: 'Codex MCP Tool'
  text: 'Connect the Codex CLI to the MCP Ecosystem'
  tagline: "Leverage OpenAI's Codex models in any client that supports the standardized MCP protocol—<span style='color: #FFFFFF; background-color: #D97706; padding: 2px 8px; border-radius: 6px; font-size: 14px; font-weight: 600; margin-left: 4px; display: inline-block; vertical-align: middle;'>built for Claude Code</span>"
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Leave a Star ⭐
      link: https://github.com/x51xxx/codex-mcp-tool

features:
  - icon: 📂
    title: Natural File Analysis
    details: |
      <span class="diff-line diff-delete">@filename integration lets you</span><br>
      <span class="diff-line diff-add">analyze any codebase with ease.</span>
  - icon: 🤖
    title: Native Codex Integration
    details: Direct access to GPT-5 and other OpenAI models through Codex CLI.
  - icon: 🤝
    title: Claude's coding partner
    details: Let Claude use Codex naturally for complex code analysis and generation.
  - icon: 🔌
    title: MCP Standards
    details: |
      <span style="color: #3b82f6;">Built on MCP protocol.</span><br><span style="color: #ef4444;">Tested with MCP standard.</span><br><span style="color: #22c55e;"><em>Benchmarked</em> with <span style="color: #f97316;">Claude Code</span>.</span>
  - icon: 🔐
    title: Secure by Design
    details: Uses your existing Codex CLI authentication. No extra keys needed.
  - icon: 🚦
    title: Advanced Controls
    details: Full support for sandbox modes, approval policies, and model selection.
---

<div class="explore-hint" style="text-align: center; margin: 32px 0 48px; position: relative;">
  <div class="explore-dots" style="display: inline-flex; align-items: center; gap: 4px;">
    <span class="dot" style="font-size: 11px; letter-spacing: 0.5px; color: var(--vp-c-text-3); opacity: 0.8; transition: all 0.3s ease;">•</span>
    <span class="dot" style="font-size: 11px; letter-spacing: 0.5px; color: var(--vp-c-text-3); opacity: 0.8; transition: all 0.3s ease; transition-delay: 0.1s;">•</span>
    <span class="dot" style="font-size: 11px; letter-spacing: 0.5px; color: var(--vp-c-text-3); opacity: 0.8; transition: all 0.3s ease; transition-delay: 0.2s;">•</span>
  </div>
  <p class="explore-text" style="font-size: 13px; color: var(--vp-c-text-3); margin-top: 8px; opacity: 0.7; transition: all 0.3s ease;">
    And much more to explore
  </p>
</div>

<div style="margin-top: 48px;">

## What is Codex MCP Tool?

</div>

Codex MCP Tool is a Model Context Protocol (MCP) server that bridges the gap between OpenAI's powerful Codex CLI and the growing ecosystem of MCP-compatible clients. It allows AI assistants like Claude to leverage Codex's advanced code analysis and generation capabilities through a standardized protocol.

### Key Features

- **🚀 Non-Interactive Execution**: Runs `codex exec` commands programmatically
- **📁 File Reference Support**: Use `@` syntax to include files in your prompts
- **🔒 Sandbox Modes**: Choose from read-only, workspace-write, or full access
- **✅ Approval Policies**: Control when human approval is needed
- **🎯 Model Selection**: Choose between GPT-5 and other available models
- **📊 Progress Tracking**: Real-time updates for long-running operations
- **🔄 Change Mode**: Structured edit suggestions with OLD/NEW format

### Use Cases

- **Code Analysis**: Understand complex codebases with deep AI insights
- **Security Reviews**: Find vulnerabilities and get remediation suggestions
- **Code Generation**: Create new features with context-aware code generation
- **Refactoring**: Modernize legacy code with intelligent suggestions
- **Documentation**: Generate comprehensive docs from your codebase
- **Testing**: Create unit tests that actually understand your code

<div style="margin-top: 48px;">

## Quick Start

</div>

### For Claude Code Users

```bash
# One-command installation
claude mcp add codex-cli -- npx -y codex-mcp-tool codex-mcp

# Verify installation
/mcp
```

### For Claude Desktop Users

Add to your configuration file:

```json
{
  "mcpServers": {
    "codex-cli": {
      "command": "npx",
      "args": ["-y", "codex-mcp-tool", "codex-mcp"]
    }
  }
}
```

For detailed installation and setup instructions, see our [Getting Started Guide](/getting-started).

### Example Commands

Once installed, you can use natural language or slash commands:

```
// Natural language
"use codex to analyze @src/main.ts and explain what it does"
"ask codex to find security vulnerabilities in this codebase"
"have codex refactor this function to use modern JavaScript"

// Slash commands (Claude Code)
/codex-cli:analyze @README.md summarize this file
/codex-cli:sandbox create a Python data processing script
```

<div style="margin-top: 48px;">

## Documentation

</div>

- [Getting Started](/getting-started) - Installation and setup guide
- [Codex CLI Usage](/codex-cli-getting-started) - Learn about the underlying Codex CLI
- [Configuration](/config) - Advanced configuration options
- [Sandbox Modes](/sandbox) - Understanding execution environments
- [Authentication](/authentication) - Setting up Codex CLI authentication

<div style="margin-top: 48px;">

## Community & Support

</div>

- **GitHub**: [x51xxx/codex-mcp-tool](https://github.com/x51xxx/codex-mcp-tool)
- **Issues**: [Report bugs or request features](https://github.com/x51xxx/codex-mcp-tool/issues)
- **Discussions**: [Join the conversation](https://github.com/x51xxx/codex-mcp-tool/discussions)

## Acknowledgments

This project was inspired by the excellent work from [jamubc/gemini-mcp-tool](https://github.com/jamubc/gemini-mcp-tool). Special thanks to [@jamubc](https://github.com/jamubc) for the original MCP server architecture and implementation patterns.

<div style="margin-top: 48px;">

## License

</div>

This project is licensed under the MIT License. See the [LICENSE](https://github.com/x51xxx/codex-mcp-tool/blob/main/LICENSE) file for details.

**Disclaimer:** This is an unofficial, third-party tool and is not affiliated with, endorsed, or sponsored by OpenAI.
