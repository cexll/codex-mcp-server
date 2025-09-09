# Sandbox Modes and Approval Policies

The Codex MCP Tool respects and forwards all of Codex CLI's security and approval settings, allowing you to control how the AI interacts with your filesystem and executes commands. This ensures safe operation while maintaining flexibility for different use cases.

## Overview

Codex provides two primary security mechanisms:
1. **Sandbox Modes**: Control filesystem access levels
2. **Approval Policies**: Determine when human confirmation is required

These can be combined to create the perfect balance of automation and safety for your workflow.

## Sandbox Modes

### Read-Only Mode
The most restrictive mode, perfect for analysis without risk.

```bash
codex --sandbox read-only "analyze @src/**"
```

**Capabilities:**
- ✅ Read any files
- ✅ Analyze code
- ✅ Generate reports
- ❌ Cannot write files
- ❌ Cannot execute commands
- ❌ Cannot modify anything

**Use Cases:**
- Code reviews
- Security audits
- Architecture analysis
- Documentation generation (output only)

### Workspace-Write Mode
Balanced mode allowing modifications within the working directory.

```bash
codex --sandbox workspace-write "refactor @src/**"
```

**Capabilities:**
- ✅ Read any files
- ✅ Write files in working directory
- ✅ Execute safe commands
- ✅ Create new files in workspace
- ❌ Cannot write outside workspace
- ❌ Cannot access system files

**Use Cases:**
- Refactoring code
- Adding features
- Fixing bugs
- Generating tests
- Updating documentation

### Danger-Full-Access Mode
Unrestricted access - use with extreme caution.

```bash
codex --sandbox danger-full-access "system-wide optimization"
```

**Capabilities:**
- ✅ Full filesystem read/write
- ✅ Execute any commands
- ✅ Modify system files
- ⚠️ No restrictions

**Use Cases:**
- System administration tasks
- Cross-project operations
- Development environment setup
- Should only be used in isolated environments

## Approval Policies

### Never Mode
Never ask for approval, execute everything automatically.

```bash
codex --ask-for-approval never "automated task"
```

**Behavior:**
- Executes all operations without prompting
- Fastest workflow
- Requires trust in the model
- Best combined with sandbox restrictions

### On-Request Mode
The model decides when to ask for approval.

```bash
codex --ask-for-approval on-request "complex refactoring"
```

**Behavior:**
- Model requests approval for risky operations
- Balances automation with safety
- Good for semi-automated workflows
- Adapts to task complexity

### On-Failure Mode
Only ask for approval when commands fail.

```bash
codex --ask-for-approval on-failure "fix and retry"
```

**Behavior:**
- Runs commands automatically
- Prompts only when errors occur
- Allows escalation for problem-solving
- Efficient for stable environments

### Untrusted Mode
Ask for approval on any potentially risky operation.

```bash
codex --ask-for-approval untrusted "careful operation"
```

**Behavior:**
- Only trusted commands run automatically
- Prompts for anything potentially risky
- Maximum safety
- Good for production environments

## Common Combinations

### Full-Auto Mode
The `--full-auto` flag combines workspace-write sandbox with on-failure approval.

```bash
codex --full-auto "implement new feature"
```

Equivalent to:
```bash
codex --sandbox workspace-write --ask-for-approval on-failure
```

**Perfect for:**
- Feature development
- Bug fixes
- Automated refactoring
- Test generation

### YOLO Mode (Use with Extreme Caution!)
The `--dangerously-bypass-approvals-and-sandbox` flag removes all restrictions.

```bash
codex --dangerously-bypass-approvals-and-sandbox "unrestricted operation"
```

**⚠️ WARNING:** 
- No safety checks
- No approval prompts
- Full system access
- Only use in isolated/containerized environments

## Using with MCP Tools

### ask-codex Tool
```javascript
// Safe analysis
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze @src for issues",
    "sandboxMode": "read-only"
  }
}

// Automated fixes with approval
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "fix all linting errors",
    "fullAuto": true  // Enables workspace-write + on-failure
  }
}

// Explicit configuration
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "update dependencies",
    "sandboxMode": "workspace-write",
    "approvalPolicy": "on-request"
  }
}

// Unrestricted (dangerous!)
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "system maintenance",
    "yolo": true  // ⚠️ Bypasses all safety
  }
}
```

### brainstorm Tool
```javascript
// Safe brainstorming (read-only by default)
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "optimization ideas",
    "domain": "performance"
  }
}

// With implementation capability
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "new features",
    "fullAuto": true,  // Can create example implementations
    "methodology": "design-thinking"
  }
}
```

## Security Best Practices

### 1. Start Restrictive, Expand as Needed
```bash
# Initial exploration
codex --sandbox read-only "understand the codebase"

# Confident about changes
codex --sandbox workspace-write "implement improvements"

# Only when absolutely necessary
codex --sandbox danger-full-access "cross-project updates"
```

### 2. Use Approval Policies Wisely
```javascript
// Development environment
{ "approvalPolicy": "on-failure" }  // Efficient iteration

// Staging environment
{ "approvalPolicy": "on-request" }  // Model discretion

// Production environment
{ "approvalPolicy": "untrusted" }  // Maximum safety
```

### 3. Combine Restrictions
```bash
# Safe exploration
codex --sandbox read-only --ask-for-approval never

# Controlled automation
codex --sandbox workspace-write --ask-for-approval on-request

# Emergency fixes
codex --full-auto --model o3
```

### 4. Set Working Directory
Always specify the working directory to limit scope:
```bash
codex --cd /path/to/project --sandbox workspace-write "make changes"
```

Or with MCP:
```javascript
{
  "prompt": "refactor code",
  "cd": "/path/to/project",
  "sandboxMode": "workspace-write"
}
```

## Environment-Specific Configurations

### Development
```toml
# ~/.codex/config.toml
[profiles.dev]
sandbox = "workspace-write"
ask_for_approval = "on-failure"
model = "o4-mini"
```

### CI/CD Pipeline
```yaml
# .github/workflows/codex.yml
- name: Run Codex Analysis
  run: |
    codex --sandbox read-only \
          --ask-for-approval never \
          "analyze and report"
```

### Production Hotfix
```bash
# Careful mode with human oversight
codex --sandbox workspace-write \
      --ask-for-approval untrusted \
      --model gpt-5 \
      "fix critical bug in @src/payment.ts"
```

### Docker Container
```dockerfile
# Isolated environment allows more freedom
RUN codex --full-auto "optimize container"
```

## Comparison Table

| Mode | File Read | File Write | Command Execution | Approval | Use Case |
|------|-----------|------------|-------------------|----------|----------|
| `read-only` + `never` | ✅ | ❌ | ❌ | Never | Analysis only |
| `workspace-write` + `on-failure` | ✅ | Workspace only | ✅ | On errors | Development |
| `workspace-write` + `untrusted` | ✅ | Workspace only | ✅ | Often | Production |
| `danger-full-access` + `never` | ✅ | ✅ | ✅ | Never | Isolated only |
| `--full-auto` | ✅ | Workspace only | ✅ | On errors | Quick fixes |
| `--yolo` | ✅ | ✅ | ✅ | Never | ⚠️ Dangerous |

## Troubleshooting

### "Permission Denied" Errors
**Problem:** Sandbox mode is too restrictive
```bash
# Solution: Upgrade sandbox mode
codex --sandbox workspace-write "try again"
```

### "Approval Required" Prompts
**Problem:** Approval policy is too strict
```bash
# Solution: Adjust policy
codex --ask-for-approval on-failure "continue"
```

### "Cannot Write Outside Workspace"
**Problem:** Trying to modify files outside working directory
```bash
# Solution 1: Change working directory
codex --cd /target/directory --sandbox workspace-write

# Solution 2: Use full access (carefully!)
codex --sandbox danger-full-access "cross-directory operation"
```

### No Output/Changes
**Problem:** Read-only mode prevents modifications
```bash
# Solution: Enable writing
codex --sandbox workspace-write "generate files"
```

## Advanced Patterns

### Progressive Enhancement
```bash
# Step 1: Analyze safely
codex --sandbox read-only "identify issues"

# Step 2: Test fixes in sandbox
codex --sandbox workspace-write --ask-for-approval on-request "fix issues"

# Step 3: Apply approved changes
codex --full-auto "apply all fixes"
```

### Conditional Escalation
```javascript
// Try safe mode first
let result = await askCodex({
  prompt: "fix bug",
  sandboxMode: "workspace-write"
});

// Escalate if needed
if (result.includes("permission denied")) {
  result = await askCodex({
    prompt: "fix bug with elevated permissions",
    sandboxMode: "danger-full-access",
    approvalPolicy: "on-request"
  });
}
```

### Batch Operations
```bash
# Safe batch analysis
for file in src/**/*.ts; do
  codex --sandbox read-only "analyze @$file"
done

# Controlled batch updates
codex --full-auto "update all files matching @src/**/*.test.ts"
```

## Configuration Precedence

Order of precedence (highest to lowest):
1. Command-line flags
2. MCP tool arguments
3. Environment variables
4. Profile configuration
5. Default configuration

Example:
```bash
# This flag overrides everything
codex --sandbox read-only "analyze"  # Always read-only

# Even if config says:
# sandbox = "workspace-write"
```

## See Also

- [How It Works](./how-it-works.md) - Understanding the security architecture
- [Model Selection](./models.md) - Model-specific security considerations
- [File Analysis](./file-analysis.md) - Safe file handling patterns
- [Codex CLI Documentation](../codex-cli-getting-started.md) - Detailed CLI security options