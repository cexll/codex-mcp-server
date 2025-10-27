# Troubleshooting Guide

This guide helps you resolve common issues with Codex MCP Tool.

## Quick Diagnostics

Run these commands to check your setup:

```bash
# Check Codex CLI installation
codex --version

# Check Node.js version
node --version

# Check npm installation
npm list -g @cexll/codex-mcp-server

# Test MCP connection (in Claude)
/codex-cli:ping "test"
```

## Common Issues

### Installation Issues

#### "Command not found: codex"

**Problem:** Codex CLI is not installed or not in PATH.

**Solution:**

```bash
# Install Codex CLI
curl -sSL https://codex.openai.com/install | bash

# Or via npm
npm install -g codex-cli

# Verify installation
codex --version
```

#### "Cannot find module '@cexll/codex-mcp-server'"

**Problem:** The MCP tool is not installed correctly.

**Solution:**

```bash
# For Claude Code
claude mcp add codex-cli -- npx -y @cexll/codex-mcp-server

# For global installation
npm install -g @cexll/codex-mcp-server

# Verify installation
npm list -g @cexll/codex-mcp-server
```

### Connection Issues

#### "MCP server not responding"

**Problem:** The MCP server fails to start or connect.

**Solutions:**

1. **Check configuration syntax:**

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

2. **Restart your MCP client:**

- Claude Desktop: Quit and restart the application
- Claude Code: Run `/restart` command

3. **Check server logs:**

```bash
# Enable debug mode
DEBUG=codex-mcp:* npx @cexll/codex-mcp-server
```

#### "Authentication failed"

**Problem:** Codex CLI is not authenticated.

**Solution:**

```bash
# Authenticate Codex CLI
codex auth login

# Verify authentication
codex auth status

# If needed, set API key
export OPENAI_API_KEY="your-api-key"
```

### Tool Execution Issues

#### "Permission denied" errors

**Problem:** Insufficient permissions for file operations.

**Solutions:**

1. **Adjust sandbox mode:**

```javascript
{
  "prompt": "analyze @src/",
  "sandboxMode": "workspace-write"  // Allow writes in workspace
}
```

2. **Check file permissions:**

```bash
# Check file permissions
ls -la /path/to/file

# Fix permissions if needed
chmod 644 file.txt
```

#### "Model not available"

**Problem:** Requested model is not accessible.

**Solutions:**

1. **Check available models:**

```bash
codex models list
```

2. **Use fallback model:**

```javascript
{
  "prompt": "your prompt",
  "model": "o4-mini"  // Use available model
}
```

#### "Timeout exceeded"

**Problem:** Operation takes too long to complete.

**Solutions:**

1. **Break down large tasks:**

```javascript
// Instead of analyzing entire codebase
'analyze @src/';

// Analyze specific directories
'analyze @src/utils/';
'analyze @src/components/';
```

2. **Increase timeout (if configurable):**

```javascript
{
  "prompt": "complex task",
  "timeout": 300000  // 5 minutes
}
```

### File Reference Issues

#### "File not found" with @ syntax

**Problem:** File references not resolving correctly.

**Solutions:**

1. **Use correct path format:**

```javascript
// Correct formats
'@src/main.ts'; // Single file
'@src/*.ts'; // Glob pattern
'@src/**/*.ts'; // Recursive glob

// Incorrect formats
'@/src/main.ts'; // Don't use leading slash
'@~/src/main.ts'; // Don't use home directory shortcut
```

2. **Check working directory:**

```bash
# Verify current directory
pwd

# Run from project root
cd /path/to/project
```

### Change Mode Issues

#### "Failed to parse changeMode response"

**Problem:** Structured edits not parsing correctly.

**Solution:**

```javascript
// Ensure changeMode is enabled
{
  "prompt": "refactor code",
  "changeMode": true
}

// Handle chunks for large responses
{
  "cacheKey": "response-key",
  "chunkIndex": 1
}
```

## Platform-Specific Issues

### macOS

#### "xcrun: error: invalid active developer path"

**Solution:**

```bash
xcode-select --install
```

#### "EACCES: permission denied"

**Solution:**

```bash
# Fix npm permissions
sudo npm install -g @cexll/codex-mcp-server --unsafe-perm
```

### Windows

#### "EPERM: operation not permitted"

**Solutions:**

1. Run as Administrator
2. Disable Windows Defender temporarily
3. Use Windows Terminal instead of CMD

#### Path issues with spaces

**Solution:**

```javascript
// Use quotes for paths with spaces
"@\"C:/Program Files/project/src/main.ts\"";
```

### Linux

#### "ENOSPC: System limit for number of file watchers reached"

**Solution:**

```bash
# Increase file watchers limit
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## Debug Mode

Enable detailed logging for troubleshooting:

### Environment Variables

```bash
# Enable all debug output
DEBUG=* npx @cexll/codex-mcp-server

# Enable specific modules
DEBUG=codex-mcp:* npx @cexll/codex-mcp-server
DEBUG=codex-mcp:executor npx @cexll/codex-mcp-server
DEBUG=codex-mcp:parser npx @cexll/codex-mcp-server
```

### Logging Levels

```javascript
// In your configuration
{
  "logging": {
    "level": "debug",  // debug, info, warn, error
    "file": "/tmp/codex-mcp.log"
  }
}
```

## Performance Optimization

### Slow Response Times

1. **Use faster models:**

```javascript
{
  "model": "o4-mini"  // Faster than GPT-5
}
```

2. **Optimize file references:**

```javascript
// Be specific about files
'@src/utils/helper.ts'; // Better
'@src/**/*'; // Slower
```

3. **Enable caching:**

```javascript
{
  "cache": true,
  "cacheDir": ".codex-cache"
}
```

### Memory Issues

1. **Process files in batches:**

```javascript
// Process directory by directory
'analyze @src/module1/';
'analyze @src/module2/';
```

2. **Clear cache periodically:**

```bash
rm -rf .codex-cache
```

## Getting Help

### Gather Diagnostic Information

When reporting issues, include:

```bash
# System information
uname -a
node --version
npm --version
codex --version

# Package information
npm list -g @cexll/codex-mcp-server

# Error logs
cat ~/.codex/logs/error.log

# MCP client version
claude --version  # For Claude Code
```

### Support Channels

1. **GitHub Issues:** [Report bugs](https://github.com/x51xxx/codex-mcp-tool/issues)
2. **Discussions:** [Ask questions](https://github.com/x51xxx/codex-mcp-tool/discussions)
3. **Documentation:** [Read docs](https://x51xxx.github.io/codex-mcp-tool/)

### Creating Bug Reports

Include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages and logs
- Tool and command used

## FAQ

### Can I use multiple models in one session?

Yes, specify different models per request:

```javascript
// First request
{ "prompt": "quick task", "model": "o4-mini" }

// Second request
{ "prompt": "complex analysis", "model": "gpt-5" }
```

### How do I handle large codebases?

1. Use specific file patterns
2. Process in chunks
3. Enable changeMode for structured edits
4. Use progress callbacks

### Can I customize timeout settings?

Currently managed internally, but you can:

- Break down large tasks
- Use background processing
- Implement retry logic

### Is offline mode supported?

No, Codex CLI requires internet connection to OpenAI API.

## Related Resources

- [Installation Guide](../getting-started.md)
- [API Reference](../api/tools/ask-codex.md)
- [Configuration Guide](../config.md)
- [Examples](../examples/basic-usage.md)
