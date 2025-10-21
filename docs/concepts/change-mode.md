# Change Mode Format

Change Mode returns structured file edits instead of a conversational answer. It’s designed for safe, automated application of patches by tools. Edits are grouped per file and expressed as exact OLD/NEW blocks with a starting line number.

## Output Structure

Each edit uses this format:

```text
**FILE: path/to/file.ext:123**
OLD:
[exact code to replace]
NEW:
[new code to insert]
```

- FILE header includes the filename and the line number where OLD starts.
- OLD must be an exact, unique match in the file (including whitespace).
- NEW is the complete replacement for OLD.

## Example

```ts
**FILE: src/utils/logger.ts:10**
OLD:
export function log(msg: string) {
  console.log(msg)
}
NEW:
export function log(...args: unknown[]) {
  console.warn('[GMCPT]', ...args)
}
```

## Using with ask-codex

- Enable change mode:

```json
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor @src/utils/logger.ts for structured logging",
    "changeMode": true
  }
}
```

- The server parses, validates, and may return the first chunk with a cacheKey when there are many edits.
- Retrieve remaining chunks via `fetch-chunk`:

```json
{
  "name": "fetch-chunk",
  "arguments": { "cacheKey": "<key>", "chunkIndex": 2 }
}
```

## Best Practices

- Make OLD unique by including enough surrounding lines if needed.
- Keep edits minimal but complete (avoid partial lines).
- If a string repeats (e.g., `</div>`), add context above/below so OLD matches once.
- For large batches, iterate chunk by chunk and apply edits in order.
