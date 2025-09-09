# File Analysis with @ Syntax

The Codex MCP Tool supports powerful file referencing through the `@` syntax, allowing you to quickly include files and directories in your prompts. This feature works seamlessly with both the Codex CLI and our MCP server implementation.

## Overview

The `@` syntax enables you to reference files directly in your prompts without manually copying content. When you type `@`, Codex provides an interactive file picker, and the selected path is automatically inserted into your prompt.

## Basic Usage

### With Codex CLI
```bash
codex "explain @src/index.ts"
codex exec "analyze @README.md and suggest improvements"
```

### With MCP Tool (ask-codex)
```javascript
// Natural language in Claude
"analyze @src/utils/logger.ts and suggest performance improvements"

// Direct tool invocation
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "review @src/server.ts for security vulnerabilities"
  }
}
```

## Advanced Patterns

### Multiple Files
Reference multiple files in a single prompt:
```bash
codex "compare @src/server.ts @src/client.ts and explain their interaction"
```

### Directories and Glob Patterns
Analyze entire directories or use patterns:
```bash
# Entire directory
codex "summarize the architecture of @src/"

# All TypeScript files
codex "find potential bugs in @src/**/*.ts"

# Specific file types in directory
codex "review all tests in @tests/**/*.test.js"
```

### Current Directory
Reference the current working directory:
```bash
codex "analyze @. and create a project overview"
```

## Best Practices

### 1. Be Specific with Context
Combine file references with clear instructions:
```bash
# Good: Specific task with context
codex "@src/auth/login.ts explain the authentication flow and identify security risks"

# Better: Multiple related files for complete context
codex "@src/auth/*.ts @src/middleware/auth.js review the entire auth system"
```

### 2. Use Structured Queries
Break complex analyses into focused questions:
```bash
# Architecture review
codex "@src/**/*.ts identify the 3 most critical refactoring opportunities"

# Performance audit
codex "@src/database/*.js find N+1 queries and suggest optimizations"

# Security assessment
codex "@src/api/**/*.ts check for OWASP top 10 vulnerabilities"
```

### 3. Leverage Pattern Matching
Use glob patterns effectively:
- `*.ts` - All TypeScript files in current directory
- `**/*.test.js` - All test files recursively
- `src/**/index.ts` - All index files under src
- `{src,lib}/**/*.js` - JavaScript files in src or lib

### 4. Handle Large Codebases
For large projects, focus your queries:
```bash
# Step 1: Overview
codex "@src/**/index.ts summarize the module structure"

# Step 2: Deep dive into specific areas
codex "@src/core/**/*.ts analyze the core business logic"

# Step 3: Targeted improvements
codex "@src/api/users.ts optimize database queries"
```

## Working with Different File Types

### Code Files
```bash
# JavaScript/TypeScript
codex "@src/**/*.{js,ts} identify unused exports"

# Python
codex "@app/**/*.py check PEP 8 compliance"

# Go
codex "@pkg/**/*.go review error handling patterns"
```

### Configuration Files
```bash
# Package dependencies
codex "@package.json @package-lock.json audit dependencies for vulnerabilities"

# Docker setup
codex "@Dockerfile @docker-compose.yml optimize container configuration"

# CI/CD
codex "@.github/workflows/*.yml improve CI pipeline efficiency"
```

### Documentation
```bash
# Markdown files
codex "@docs/**/*.md check for broken links and outdated information"

# API docs
codex "@api-docs/*.yaml validate OpenAPI specifications"
```

## Integration with MCP Features

### With Sandbox Mode
Enable full-auto mode for file operations:
```javascript
{
  "prompt": "@src/**/*.ts add JSDoc comments to all exported functions",
  "fullAuto": true
}
```

### With Model Selection
Use specific models for different tasks:
```javascript
{
  "prompt": "@src/algorithm.ts optimize this complex algorithm",
  "model": "gpt-5"  // Use GPT-5 for complex reasoning
}
```

### With Change Mode
Get structured edits:
```javascript
{
  "prompt": "@src/components/*.tsx convert class components to hooks",
  "changeMode": true
}
```

## Tips and Tricks

### Path Resolution
- Paths are resolved relative to Codex's working directory
- Use `--cd` flag to change the working directory:
  ```bash
  codex --cd /path/to/project "analyze @src/"
  ```

### Performance Optimization
1. **Start broad, then narrow**: Begin with directory overviews, then focus on specific files
2. **Use appropriate models**: GPT-5 for complex analysis, o4-mini for quick reviews
3. **Batch related files**: Include all relevant context in one prompt rather than multiple queries

### Common Patterns
```bash
# Find TODOs and FIXMEs
codex "@src/**/*.{js,ts} list all TODO and FIXME comments with priority"

# Generate tests
codex "@src/utils/*.ts generate comprehensive unit tests"

# Documentation
codex "@src/api/**/*.ts generate API documentation in OpenAPI format"

# Refactoring
codex "@src/legacy/*.js modernize to ES6+ syntax"

# Dependencies
codex "@package.json identify unused dependencies"
```

## Troubleshooting

### File Not Found
- Verify the path exists: `ls <path>`
- Check working directory: `pwd`
- Ensure correct relative path from working directory

### Large File Handling
- For files over 100KB, consider splitting the analysis
- Use specific line ranges when possible
- Focus on relevant sections rather than entire files

### Pattern Matching Issues
- Test glob patterns with `ls` first: `ls src/**/*.ts`
- Escape special characters when needed
- Use quotes for complex patterns

## Examples by Use Case

### Code Review
```bash
codex "@feature/new-api/**/*.ts perform a thorough code review focusing on:
- Code quality and best practices
- Performance considerations
- Security vulnerabilities
- Test coverage"
```

### Refactoring
```bash
codex "@src/old-module/*.js refactor to:
- Use TypeScript
- Apply SOLID principles
- Add proper error handling
- Include unit tests"
```

### Documentation Generation
```bash
codex "@src/**/*.ts generate:
- README with setup instructions
- API documentation
- Architecture diagram in Mermaid format
- Usage examples"
```

### Bug Investigation
```bash
codex "@src/payment/*.ts @logs/error.log investigate the payment processing bug:
- Analyze error patterns
- Identify root cause
- Suggest fixes with tests"
```

## See Also

- [How It Works](./how-it-works.md) - Understanding the MCP architecture
- [Model Selection](./models.md) - Choosing the right model for your task
- [Sandbox Modes](./sandbox.md) - Security and approval configurations