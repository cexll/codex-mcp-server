# timeout-test Tool

Test timeout prevention and long-running operations handling.

## Overview

The `timeout-test` tool simulates long-running operations to test the MCP server's timeout prevention mechanisms and progress notification system. It's primarily used for debugging and verifying that the server maintains connection during extended operations.

## Syntax

```javascript
{
  "name": "timeout-test",
  "arguments": {
    "duration": "number"  // Required
  }
}
```

## Parameters

### duration (required)

- **Type:** `number`
- **Minimum:** `10` (milliseconds)
- **Description:** How long the operation should run in milliseconds
- **Example:** `30000` for 30 seconds
- **Note:** No enforced maximum, but very long durations may cause client timeouts

## Examples

### Quick Test (10 seconds)

```javascript
{
  "name": "timeout-test",
  "arguments": {
    "duration": 10000
  }
}
```

### Extended Test (2 minutes)

```javascript
{
  "name": "timeout-test",
  "arguments": {
    "duration": 120000
  }
}
```

### Long Duration Test

```javascript
{
  "name": "timeout-test",
  "arguments": {
    "duration": 600000  // 10 minutes - may cause client timeout
  }
}
```

## Progress Notifications

The server sends MCP progress notifications every 25 seconds to prevent client timeouts. The tool itself reports step completions approximately every 5 seconds:

```
Starting timeout test for 120000ms...
Step 1 completed
Step 2 completed
[... steps continue every ~5 seconds ...]
Step 24 completed
Timeout test completed successfully after 120000ms!
```

Note: The actual progress updates depend on the MCP client's support for progress notifications.

## Use Cases

### Testing MCP Connection Stability

Verify the server maintains connection:

```javascript
// Test 1-minute operation
{
  "name": "timeout-test",
  "arguments": {
    "duration": 60000
  }
}
// Should complete without disconnection
```

### Debugging Timeout Issues

When operations fail due to timeouts:

1. **Test with timeout-test first:**

```javascript
{
  "name": "timeout-test",
  "arguments": {
    "duration": 45000  // Match expected operation time
  }
}
```

2. **If timeout-test works, issue is with specific tool**
3. **If timeout-test fails, issue is with MCP connection**

### Simulating Long Operations

Before running long tasks:

```javascript
// Simulate expected duration
{
  "name": "timeout-test",
  "arguments": {
    "duration": 180000  // 3 minutes
  }
}

// If successful, run actual task
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze entire codebase @src/",
    "model": "gpt-5"
  }
}
```

## Response Format

### Success Response

```javascript
{
  "status": "success",
  "message": "Timeout test completed successfully!",
  "duration": 60000,
  "elapsed": 60023,  // Actual time taken
  "progressUpdates": 2  // Number of progress notifications sent
}
```

### Error Response

```javascript
{
  "error": "Duration must be between 10ms and 600000ms",
  "provided": 1000000,
  "maximum": 600000
}
```

## Technical Details

### Progress System

- Updates sent every **25 seconds**
- Prevents MCP timeout (typically 30-60 seconds)
- Uses Node.js timers and async/await

### Implementation

```javascript
// Simplified implementation
async function timeoutTest(duration, progress) {
  const interval = 25000; // 25 seconds
  let elapsed = 0;

  progress(`Starting test for ${duration}ms...`);

  while (elapsed < duration) {
    await sleep(Math.min(interval, duration - elapsed));
    elapsed += interval;
    if (elapsed < duration) {
      progress(`Still running... ${elapsed}ms elapsed`);
    }
  }

  return `Test completed successfully!`;
}
```

## Troubleshooting

### Test Fails Before Duration

**Possible causes:**

1. MCP client timeout settings too low
2. Network interruption
3. Server resource constraints

**Solutions:**

```javascript
// Start with shorter duration
{ "duration": 5000 }  // 5 seconds

// Gradually increase
{ "duration": 30000 }  // 30 seconds
{ "duration": 60000 }  // 1 minute
```

### No Progress Updates

**If no progress messages appear:**

- Check MCP client supports progress notifications
- Verify server logging is enabled
- Try shorter duration to see if it completes

### Connection Drops

**If connection drops during test:**

1. Check client timeout settings
2. Verify network stability
3. Monitor server resource usage
4. Check for proxy/firewall interference

## Best Practices

### 1. Test Before Long Operations

```javascript
// Before running hour-long analysis
{ "name": "timeout-test", "arguments": { "duration": 300000 } }

// If successful, proceed with confidence
{ "name": "ask-codex", "arguments": {
  "prompt": "comprehensive security audit @/**/*",
  "model": "gpt-5"
}}
```

### 2. Incremental Testing

Start small and increase:

```javascript
// Test sequence
{ "duration": 10000 }   // 10 seconds
{ "duration": 60000 }   // 1 minute
{ "duration": 300000 }  // 5 minutes
```

### 3. Monitor Resource Usage

During long tests, monitor:

- CPU usage
- Memory consumption
- Network stability
- Disk I/O

## Integration Examples

### With CI/CD

```yaml
# GitHub Actions example
- name: Test MCP timeout handling
  run: |
    npx @cexll/codex-mcp-server << EOF
    {
      "method": "tools/call",
      "params": {
        "name": "timeout-test",
        "arguments": { "duration": 120000 }
      }
    }
    EOF
```

### Health Check Script

```javascript
const healthCheck = async () => {
  // Quick connectivity test
  await mcp.call('ping', {});

  // Timeout handling test
  await mcp.call('timeout-test', { duration: 30000 });

  // Ready for long operations
  console.log('System healthy');
};
```

## Related Tools

- [ping](./ping.md) - Quick connectivity test
- [ask-codex](./ask-codex.md) - Actual long operations
- [fetch-chunk](./fetch-chunk.md) - Handle large responses

## See Also

- [Troubleshooting](../../resources/troubleshooting.md)
- [Advanced Usage](../../examples/advanced-usage.md)
- [FAQ](../../resources/faq.md)
