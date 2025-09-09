# Basic Usage Examples

This guide provides practical examples of using Codex MCP Tool for common development tasks.

## Getting Started

### Test Connection

First, verify the tool is working:

```javascript
// Simple ping test
{
  "name": "ping",
  "arguments": {
    "prompt": "Hello from Codex!"
  }
}

// Check available commands
{
  "name": "help",
  "arguments": {}
}
```

## File Analysis

### Analyze a Single File

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "explain what this code does @src/main.ts"
  }
}
```

### Review Multiple Files

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "compare the implementations in @src/old-api.ts and @src/new-api.ts"
  }
}
```

### Analyze Directory Structure

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "describe the architecture of @src/ and how components interact"
  }
}
```

## Code Generation

### Generate Unit Tests

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "create comprehensive unit tests for @src/utils/calculator.ts",
    "model": "gpt-5",
    "sandboxMode": "workspace-write"
  }
}
```

### Create Documentation

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "generate JSDoc comments for all functions in @src/api/",
    "changeMode": true
  }
}
```

### Implement Features

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "add error handling and retry logic to @src/services/api-client.ts",
    "model": "gpt-5",
    "sandboxMode": "workspace-write",
    "approvalPolicy": "on-request"
  }
}
```

## Code Review

### Security Audit

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "audit @src/ for OWASP top 10 vulnerabilities and security best practices",
    "model": "gpt-5",
    "sandboxMode": "read-only"
  }
}
```

### Performance Review

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "identify performance bottlenecks in @src/api/ and suggest optimizations",
    "sandboxMode": "read-only"
  }
}
```

### Code Quality Check

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "review @src/components/ for React best practices and anti-patterns",
    "model": "o3"
  }
}
```

## Refactoring

### Modernize Code

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor @src/legacy.js to use modern ES6+ syntax and async/await",
    "changeMode": true,
    "sandboxMode": "workspace-write"
  }
}
```

### Extract Components

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "extract reusable components from @src/pages/dashboard.tsx",
    "changeMode": true,
    "model": "gpt-5"
  }
}
```

### Optimize Imports

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "organize and optimize imports in @src/**/*.ts using path aliases",
    "changeMode": true,
    "fullAuto": true
  }
}
```

## Brainstorming

### Feature Ideas

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "innovative features for a code editor",
    "methodology": "divergent",
    "domain": "product",
    "ideaCount": 15
  }
}
```

### Problem Solving

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "ways to reduce build time from 5 minutes to under 1 minute",
    "methodology": "scamper",
    "constraints": "cannot change build tool, limited to current tech stack",
    "includeAnalysis": true
  }
}
```

### Architecture Decisions

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "microservices vs monolith for our e-commerce platform",
    "domain": "software",
    "existingContext": "Team of 5, expecting 10x growth, current monolith is 100k LOC",
    "methodology": "convergent"
  }
}
```

## Debugging

### Find Bugs

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "find the bug causing null pointer exception in @src/auth/login.ts",
    "model": "o3"
  }
}
```

### Trace Execution

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "trace the execution flow when user clicks submit in @src/forms/contact.tsx"
  }
}
```

### Analyze Error

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "explain this error and how to fix it: [paste error message]. Related files: @src/api/handler.ts"
  }
}
```

## Documentation

### API Documentation

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "generate OpenAPI/Swagger documentation for @src/api/routes/",
    "sandboxMode": "workspace-write"
  }
}
```

### README Generation

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "create a comprehensive README.md based on @package.json @src/",
    "model": "gpt-5"
  }
}
```

### Code Comments

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "add explanatory comments to complex logic in @src/algorithms/",
    "changeMode": true
  }
}
```

## Migration Tasks

### Framework Migration

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "migrate @src/components/ from React class components to functional components with hooks",
    "changeMode": true,
    "model": "gpt-5",
    "approvalPolicy": "on-request"
  }
}
```

### Library Updates

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "update @src/ to use the new v5 API from library X (breaking changes in @CHANGELOG.md)",
    "changeMode": true,
    "sandboxMode": "workspace-write"
  }
}
```

### TypeScript Migration

```javascript
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "convert @src/utils/*.js to TypeScript with proper type definitions",
    "changeMode": true,
    "model": "gpt-5"
  }
}
```

## Working with Large Codebases

### Chunked Analysis

```javascript
// Analyze in parts
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze @src/modules/auth/",
    "model": "o4-mini"
  }
}

// Then continue with next module
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze @src/modules/payments/",
    "model": "o4-mini"
  }
}
```

### Progressive Refactoring

```javascript
// Start with critical paths
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor critical performance paths in @src/core/",
    "changeMode": true,
    "sandboxMode": "workspace-write"
  }
}
```

### Handling Large Responses

```javascript
// Initial request
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor all components in @src/components/",
    "changeMode": true
  }
}
// Returns: { cacheKey: "abc123", totalChunks: 5 }

// Get remaining chunks
{
  "name": "fetch-chunk",
  "arguments": {
    "cacheKey": "abc123",
    "chunkIndex": 2
  }
}
```

## Common Patterns

### Pre-Analysis Pattern

Always analyze before modifying:

```javascript
// Step 1: Understand current state
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze current implementation of @src/auth/",
    "sandboxMode": "read-only"
  }
}

// Step 2: Plan improvements
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "improvements for authentication system",
    "existingContext": "[analysis results]"
  }
}

// Step 3: Implement changes
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "implement the top 3 improvements",
    "changeMode": true,
    "sandboxMode": "workspace-write"
  }
}
```

### Safe Refactoring Pattern

```javascript
// Use incremental approach
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "refactor @src/utils/helper.ts - start with pure functions only",
    "changeMode": true,
    "approvalPolicy": "on-request"
  }
}
```

### Review-First Pattern

```javascript
// Review for issues
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "review @src/ for bugs, security issues, and performance problems",
    "sandboxMode": "read-only"
  }
}

// Then fix identified issues
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "fix the critical issues identified in the review",
    "changeMode": true,
    "approvalPolicy": "on-failure"
  }
}
```

## Tips for Effective Usage

### 1. Start Small
Begin with single files or small directories before processing entire codebases.

### 2. Use Appropriate Models
- **o4-mini**: Quick analysis, simple tasks
- **o3**: Complex reasoning, detailed reviews
- **gpt-5**: Large refactoring, comprehensive generation

### 3. Leverage Change Mode
For any code modifications, use `changeMode: true` to get structured edits.

### 4. Set Clear Boundaries
Use sandbox modes to control what the tool can access and modify.

### 5. Provide Context
Include relevant background information for better results.

## Next Steps

- [Advanced Usage](./advanced-usage.md)
- [Brainstorming Examples](./brainstorming.md)
- [API Reference](../api/tools/ask-codex.md)
- [Troubleshooting](../resources/troubleshooting.md)