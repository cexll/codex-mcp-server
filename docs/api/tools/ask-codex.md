# ask-codex Tool

The primary tool for executing Codex CLI commands with file references and advanced options.

## Overview

The `ask-codex` tool provides non-interactive execution of Codex commands, supporting file references, multiple models, sandbox modes, and structured output formats.

## Syntax

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "string",          // Required
    "model": "string",           // Optional
    "sandbox": "boolean",        // Optional
    "fullAuto": "boolean",       // Optional
    "approvalPolicy": "string",  // Optional
    "sandboxMode": "string",     // Optional
    "changeMode": "boolean",     // Optional
    "cd": "string",             // Optional
    "yolo": "boolean"           // Optional
  }
}
```

## Parameters

### prompt (required)
- **Type:** `string`
- **Description:** The command or question to execute
- **Supports:** File references with @ syntax
- **Example:** `"explain @src/main.ts"`

### model (optional)
- **Type:** `string`
- **Default:** Codex CLI default (usually gpt-5)
- **Options:** `"gpt-5"`, `"o3"`, `"o4-mini"`
- **Example:** `"model": "o4-mini"`

### sandbox (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Alias for fullAuto mode
- **Effect:** Enables workspace-write + on-failure approval

### fullAuto (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable full automation mode
- **Effect:** Sets workspace-write sandbox and on-failure approval

### approvalPolicy (optional)
- **Type:** `string`
- **Options:** `"never"`, `"on-request"`, `"on-failure"`, `"untrusted"`
- **Default:** Codex CLI default
- **Description:** Controls when approval is required

### sandboxMode (optional)
- **Type:** `string`
- **Options:** `"read-only"`, `"workspace-write"`, `"danger-full-access"`
- **Default:** Codex CLI default
- **Description:** Controls file system access level

### changeMode (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Return structured OLD/NEW edits instead of conversational response
- **Use Case:** Direct code modifications
- **See:** [Change Mode Format](../../concepts/change-mode.md) for detailed documentation

### chunkIndex (optional)
- **Type:** `number` or `string`
- **Description:** Retrieve a specific chunk from cached changeMode results
- **Minimum:** `1` (1-based indexing)
- **Example:** `2` for the second chunk
- **Note:** Must be used with `chunkCacheKey`

### chunkCacheKey (optional)
- **Type:** `string`
- **Description:** Cache key for retrieving chunks from previous changeMode response
- **Example:** `"a3f2c8d1"`
- **Note:** Alternative to using the `fetch-chunk` tool

### cd (optional)
- **Type:** `string`
- **Description:** Working directory for Codex execution
- **Example:** `"/path/to/project"`

### yolo (optional)
- **Type:** `boolean`
- **Default:** `false`
- **Description:** Bypass all approvals and sandbox (use with extreme caution)
- **Warning:** Allows unrestricted file system access

## File References

### @ Syntax

Include files in your prompts using the @ symbol:

```javascript
// Single file
"analyze @src/main.ts"

// Multiple files
"compare @src/old.ts @src/new.ts"

// Glob patterns
"review @src/*.ts"
"analyze @src/**/*.ts"

// Entire directory
"document @src/"
```

### Path Resolution

- Paths are resolved relative to the working directory
- Use quotes for paths with spaces: `@"My Documents/file.ts"`
- Supports standard glob patterns

## Examples

### Basic Analysis

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "explain the architecture of @src/"
  }
}
```

### Code Generation

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "create unit tests for @src/utils/calculator.ts",
    "model": "gpt-5",
    "sandboxMode": "workspace-write"
  }
}
```

### Refactoring with Change Mode

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor @src/legacy.js to use modern ES6+ syntax",
    "changeMode": true,
    "approvalPolicy": "on-request"
  }
}
```

### Security Audit

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "audit @src/ for security vulnerabilities",
    "model": "gpt-5",
    "sandboxMode": "read-only"
  }
}
```

### Full Automation

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "update all console.log to use winston logger",
    "fullAuto": true,
    "changeMode": true
  }
}
```

## Change Mode Output

When `changeMode: true`, the response format changes:

### Standard Response
```
Here's the refactored code with modern syntax...
[conversational explanation]
```

### Change Mode Response
```
OLD:
<<<
function oldStyle() {
  var x = 1;
}
>>>

NEW:
<<<
const modernStyle = () => {
  const x = 1;
};
>>>
```

## Handling Large Responses

For large changeMode responses, use chunking:

```javascript
// Initial request
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor entire codebase",
    "changeMode": true
  }
}
// Returns: { cacheKey: "abc123", totalChunks: 5, ... }

// Fetch subsequent chunks
{
  "name": "fetch-chunk",
  "arguments": {
    "cacheKey": "abc123",
    "chunkIndex": 2
  }
}
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Model not available` | Model access denied | Use different model or check API access |
| `File not found` | Invalid @ reference | Verify file path and working directory |
| `Permission denied` | Sandbox restriction | Adjust sandboxMode parameter |
| `Timeout exceeded` | Long operation | Break into smaller tasks |
| `Authentication failed` | Invalid Codex auth | Run `codex auth login` |

### Error Response Format

```javascript
{
  "error": "Permission denied",
  "details": "Cannot write to /etc/passwd in read-only mode",
  "suggestion": "Use sandboxMode: 'workspace-write' for write access"
}
```

## Best Practices

### 1. Start with Read-Only

Begin with analysis before modification:
```javascript
// First: analyze
{ "prompt": "analyze @src/", "sandboxMode": "read-only" }

// Then: modify
{ "prompt": "refactor @src/", "sandboxMode": "workspace-write" }
```

### 2. Use Specific File References

Be precise to improve performance:
```javascript
// Good: specific files
"analyze @src/auth/login.ts @src/auth/logout.ts"

// Avoid: entire codebase
"analyze @**/*"
```

### 3. Choose Appropriate Models

Match model to task complexity:
- **o4-mini**: Quick tasks, simple queries
- **o3**: Complex reasoning, detailed analysis
- **gpt-5**: Large context, comprehensive refactoring

### 4. Enable Change Mode for Edits

For code modifications:
```javascript
{
  "prompt": "update imports to use aliases",
  "changeMode": true  // Get structured edits
}
```

### 5. Set Working Directory

For consistent file resolution:
```javascript
{
  "prompt": "analyze @src/",
  "cd": "/Users/name/project"
}
```

## Integration Tips

### With Claude Desktop

```javascript
// In conversation
"Use codex to analyze my React components"

// Claude will invoke:
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze @src/components/*.tsx for React best practices"
  }
}
```

### With Claude Code

```bash
# Direct command
/codex-cli:ask-codex analyze @src/

# With options
/codex-cli:ask-codex --model o4-mini review @src/api/
```

### In Automation Scripts

```javascript
// Node.js integration
const { execSync } = require('child_process');

const result = execSync('npx @trishchuk/codex-mcp-tool', {
  input: JSON.stringify({
    method: 'tools/call',
    params: {
      name: 'ask-codex',
      arguments: {
        prompt: 'analyze @src/',
        model: 'o4-mini'
      }
    }
  })
});
```

## Related Tools

- [brainstorm](./brainstorm.md) - Idea generation
- [fetch-chunk](./fetch-chunk.md) - Handle large responses
- [ping](./ping.md) - Test connectivity
- [help](./help.md) - Show Codex CLI help

## See Also

- [File Analysis Guide](../../concepts/file-analysis.md)
- [Sandbox Modes](../../concepts/sandbox.md)
- [Model Selection](../../concepts/models.md)
- [Examples](../../examples/basic-usage.md)