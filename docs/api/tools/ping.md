# ping Tool

Test connectivity and echo messages through the MCP server.

## Overview

The `ping` tool provides a simple way to verify that the Codex MCP Tool is properly installed and functioning. It echoes back the provided message, confirming the communication pipeline is working.

## Syntax

```javascript
{
  "name": "ping",
  "arguments": {
    "prompt": "string"  // Optional
  }
}
```

## Parameters

### prompt (optional)

- **Type:** `string`
- **Default:** `""` (empty string)
- **Description:** Message to echo back
- **Example:** `"Hello from Codex!"`

## Examples

### Basic Connectivity Test

```javascript
{
  "name": "ping",
  "arguments": {}
}
// Returns: "Pong!"
```

### Echo Custom Message

```javascript
{
  "name": "ping",
  "arguments": {
    "prompt": "Testing MCP connection"
  }
}
// Returns: "Pong! Testing MCP connection"
```

### Verify Installation

```javascript
{
  "name": "ping",
  "arguments": {
    "prompt": "Codex MCP Tool v1.0.0"
  }
}
// Returns: "Pong! Codex MCP Tool v1.0.0"
```

## Use Cases

### Initial Setup Verification

After installing Codex MCP Tool, use ping to verify:

```bash
# In Claude Code
/codex-cli:ping "Installation successful"

# In Claude Desktop (via conversation)
"Test the codex connection with ping"
```

### Debugging Connection Issues

When troubleshooting:

1. **First test ping:**

```javascript
{ "name": "ping", "arguments": {} }
```

2. **If ping works, test Codex CLI:**

```javascript
{ "name": "help", "arguments": {} }
```

3. **If ping fails:**

- Check MCP server configuration
- Restart Claude client
- Verify npm package installation

### Health Checks

Use in automated scripts:

```javascript
// Health check script
const checkHealth = async () => {
  try {
    const response = await mcp.call('ping', { prompt: 'health-check' });
    return response.includes('Pong');
  } catch (error) {
    console.error('MCP server not responding');
    return false;
  }
};
```

## Response Format

### Success Response

```
Pong! [your message]
```

### Error Response

If the MCP server is not running:

```
Error: MCP server not responding
```

## Troubleshooting

### No Response

If ping doesn't respond:

1. **Check configuration:**

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

2. **Verify installation:**

```bash
npm list -g @trishchuk/codex-mcp-tool
```

3. **Restart client:**

- Claude Desktop: Quit and restart
- Claude Code: Run `/restart`

### Delayed Response

Normal ping should respond instantly. If delayed:

- Check system resources
- Verify Node.js version >= 18.0.0
- Check for conflicting processes

## Related Tools

- [help](./help.md) - Show Codex CLI help
- [ask-codex](./ask-codex.md) - Execute Codex commands
- [timeout-test](./timeout-test.md) - Test long operations

## See Also

- [Getting Started](../../getting-started.md)
- [Troubleshooting](../../resources/troubleshooting.md)
- [FAQ](../../resources/faq.md)
