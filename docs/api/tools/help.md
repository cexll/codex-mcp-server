# help Tool

Display Codex CLI help information and available commands.

## Overview

The `help` tool provides access to Codex CLI's built-in help system, showing available commands, options, and usage information.

## Syntax

```javascript
{
  "name": "help",
  "arguments": {}
}
```

## Parameters

This tool accepts no parameters.

## Examples

### Basic Help

```javascript
{
  "name": "help",
  "arguments": {}
}
```

Returns comprehensive Codex CLI help including:
- Available commands
- Global options
- Model information
- Configuration options

## Output Format

```
Codex CLI - AI-powered code assistant

USAGE:
  codex [OPTIONS] <COMMAND>

COMMANDS:
  exec      Execute a task or answer a question
  auth      Manage authentication
  models    List available models
  config    Manage configuration
  ...

GLOBAL OPTIONS:
  --model <MODEL>           Specify AI model
  --sandbox <MODE>          Set sandbox mode
  --approval <POLICY>       Set approval policy
  --help                    Show help
  --version                Show version
  ...

EXAMPLES:
  codex exec "explain this code"
  codex exec "refactor @file.ts"
  codex --model gpt-5 exec "complex task"
```

## Use Cases

### Learning Available Options

Discover what Codex CLI can do:

```javascript
// Get full help
{ "name": "help", "arguments": {} }

// Then use specific features
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "use the feature I just learned about",
    "model": "gpt-5"
  }
}
```

### Troubleshooting Commands

When unsure about syntax:

1. Check help first:
```javascript
{ "name": "help", "arguments": {} }
```

2. Use correct syntax:
```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "task",
    "sandboxMode": "workspace-write"  // Correct parameter from help
  }
}
```

### Discovering Models

Help output includes available models:
- GPT-5 (400K context)
- o3 (200K context)
- o4-mini (200K context, fast)

## Integration with Other Tools

### Workflow Example

```javascript
// 1. Check available options
{ "name": "help", "arguments": {} }

// 2. Test connection
{ "name": "ping", "arguments": { "prompt": "ready" } }

// 3. Execute task with learned options
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze @src/",
    "model": "o4-mini",
    "sandboxMode": "read-only"
  }
}
```

## Common Information from Help

### Sandbox Modes
- `read-only` - Only read files
- `workspace-write` - Read and write in workspace
- `danger-full-access` - Full system access

### Approval Policies
- `never` - No approvals needed
- `on-request` - Approve each action
- `on-failure` - Approve on errors
- `untrusted` - Always require approval

### File Reference Syntax
- `@file.ts` - Include single file
- `@dir/` - Include directory
- `@**/*.ts` - Glob pattern

## Tips

### When to Use Help

1. **First time using:** Check available features
2. **Forgot syntax:** Review command options
3. **New updates:** See if new features added
4. **Troubleshooting:** Verify correct usage

### Interpreting Help Output

Focus on:
- **COMMANDS** section for available operations
- **OPTIONS** section for parameters
- **EXAMPLES** section for usage patterns

## Error Handling

### If Help Fails

```javascript
// If help doesn't work, try:
{ "name": "ping", "arguments": {} }  // Test basic connectivity

// If ping works but help doesn't:
// - Codex CLI may not be installed
// - Run: codex --version in terminal
```

## Related Tools

- [ping](./ping.md) - Test connectivity
- [ask-codex](./ask-codex.md) - Execute commands
- [brainstorm](./brainstorm.md) - Generate ideas

## See Also

- [Getting Started](../../getting-started.md)
- [Codex CLI Basics](../../codex-cli-getting-started.md)
- [Configuration](../../config.md)
- [FAQ](../../resources/faq.md)