# fetch-chunk Tool

Retrieve cached chunks from large changeMode responses.

## Overview

The `fetch-chunk` tool handles pagination for large structured edit responses. When a changeMode request returns more data than can be sent in a single response, it's split into chunks that can be retrieved sequentially.

## Syntax

```javascript
{
  "name": "fetch-chunk",
  "arguments": {
    "cacheKey": "string",     // Required
    "chunkIndex": "number"    // Required
  }
}
```

## Parameters

### cacheKey (required)
- **Type:** `string`
- **Description:** The cache key provided in the initial changeMode response
- **Example:** `"a3f2c8d1"`
- **Source:** Returned from initial `ask-codex` call with `changeMode: true`

### chunkIndex (required)
- **Type:** `number`
- **Minimum:** `1` (1-based indexing)
- **Description:** Which chunk to retrieve
- **Example:** `2` for the second chunk

## How Chunking Works

### 1. Initial Request

Large refactoring request:
```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor all components to use TypeScript",
    "changeMode": true
  }
}
```

### 2. Initial Response

```javascript
{
  "status": "partial",
  "cacheKey": "refactor-2024-abc123",
  "totalChunks": 5,
  "currentChunk": 1,
  "content": "... first chunk of edits ...",
  "hasMore": true
}
```

### 3. Fetch Remaining Chunks

```javascript
// Get chunk 2
{
  "name": "fetch-chunk",
  "arguments": {
    "cacheKey": "refactor-2024-abc123",
    "chunkIndex": 2
  }
}

// Get chunk 3
{
  "name": "fetch-chunk",
  "arguments": {
    "cacheKey": "refactor-2024-abc123",
    "chunkIndex": 3
  }
}
// Continue until all chunks retrieved
```

## Examples

### Complete Refactoring Flow

```javascript
// Step 1: Start refactoring
const initial = {
  "name": "ask-codex",
  "arguments": {
    "prompt": "convert @src/**/*.js to TypeScript",
    "changeMode": true,
    "model": "gpt-5"
  }
};
// Returns: { cacheKey: "ts-convert-xyz", totalChunks: 8, ... }

// Step 2: Retrieve all chunks
for (let i = 2; i <= 8; i++) {
  const chunk = {
    "name": "fetch-chunk",
    "arguments": {
      "cacheKey": "ts-convert-xyz",
      "chunkIndex": i
    }
  };
  // Process each chunk
}
```

### Handling Large Codebase Analysis

```javascript
// Initial analysis
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "add comprehensive JSDoc to @src/",
    "changeMode": true
  }
}
// Returns: { cacheKey: "jsdoc-abc", totalChunks: 12, ... }

// Fetch specific chunk
{
  "name": "fetch-chunk",
  "arguments": {
    "cacheKey": "jsdoc-abc",
    "chunkIndex": 5
  }
}
```

## Response Format

The fetch-chunk tool returns formatted text (not JSON) containing the edits for the requested chunk:

### Successful Chunk Retrieval

```
[CHANGEMODE OUTPUT - Chunk 2 of 5]

This chunk contains 8 complete edits that can be applied independently.

Edit 1 of 8:
FILE: src/components/Button.tsx:15
OLD:
class Button extends React.Component {
  render() { return <button>{this.props.label}</button>; }
}
NEW:
const Button: React.FC<{label: string}> = ({label}) => {
  return <button>{label}</button>;
};

[Additional edits...]

Next Step:
To fetch the next chunk, use:
fetch-chunk cacheKey=abc12345 chunkIndex=3
```

### Final Chunk

```
[CHANGEMODE OUTPUT - Chunk 5 of 5]

This is the final chunk containing 3 edits.

[Edit details...]

All edits have been provided. Total: 42 modifications across 5 chunks.
```

### Error Response

```
Error: Cache key not found or expired
The chunks for this operation are no longer available.
Please re-run the original request to generate new chunks.
```

## Cache Management

### Cache Duration
- Chunks are cached for **10 minutes** after creation
- Cache persists until TTL expires (not auto-cleared after retrieval)
- Cache cleared on server restart

### Cache Key Format
- Format: First 8 characters of SHA-256 hash of the prompt
- Example: `a3f2c8d1`
- Deterministic based on prompt content

### Cache Limits
- Maximum 50 cache files system-wide
- Automatic cleanup of expired caches (10-minute TTL)
- Cache stored in temporary directory

## Best Practices

### 1. Sequential Retrieval

Retrieve chunks in order:
```javascript
// Good: Sequential
for (let i = 2; i <= totalChunks; i++) {
  await fetchChunk(cacheKey, i);
}

// Avoid: Random access
await fetchChunk(cacheKey, 5);  // May miss context
```

### 2. Handle Expiration

```javascript
try {
  const chunk = await fetchChunk(cacheKey, index);
} catch (error) {
  if (error.includes('expired')) {
    // Re-run original request
    const fresh = await askCodex(originalPrompt);
  }
}
```

### 3. Process Incrementally

Apply changes as chunks arrive:
```javascript
// Process each chunk immediately
const processChunk = (chunk) => {
  applyEdits(chunk.content);
  if (chunk.hasMore) {
    fetchNext();
  }
};
```

## Common Scenarios

### Large File Refactoring

```javascript
// Refactor large file
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "split @src/monolith.ts into modules",
    "changeMode": true
  }
}
// Expect multiple chunks for file splits
```

### Codebase-wide Changes

```javascript
// Update imports across codebase
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "update all imports to use path aliases",
    "changeMode": true
  }
}
// May return 10+ chunks for large codebases
```

### Documentation Generation

```javascript
// Generate docs for entire API
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "document all endpoints in @src/api/",
    "changeMode": true
  }
}
// Chunks split by file or module
```

## Error Handling

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cache key not found` | Key expired or invalid | Re-run original request |
| `Invalid chunk index` | Index out of range | Check totalChunks value |
| `Cache expired` | 10-minute timeout | Re-run original request |
| `Chunk already retrieved` | Duplicate request | Continue to next chunk |

### Recovery Strategy

```javascript
const safeChunkFetch = async (cacheKey, index, originalRequest) => {
  try {
    return await fetchChunk(cacheKey, index);
  } catch (error) {
    console.log('Cache miss, restarting...');
    return await askCodex(originalRequest);
  }
};
```

## Performance Tips

### 1. Chunk Size Optimization
- Average chunk: ~50KB of edit data
- Large files split across multiple chunks
- Small edits may fit in single response

### 2. Parallel Processing
```javascript
// Process while fetching
const pipeline = async (cacheKey, total) => {
  const fetcher = fetchAllChunks(cacheKey, total);
  const processor = processChunks(fetcher);
  await Promise.all([fetcher, processor]);
};
```

### 3. Memory Management
- Clear processed chunks from memory
- Stream to file for very large operations
- Monitor memory usage for long sessions

## Related Tools

- [ask-codex](./ask-codex.md) - Initial changeMode requests
- [timeout-test](./timeout-test.md) - Test long operations

## See Also

- [How It Works](../../concepts/how-it-works.md)
- [Advanced Usage](../../examples/advanced-usage.md)
- [API Reference](../tools/ask-codex.md)