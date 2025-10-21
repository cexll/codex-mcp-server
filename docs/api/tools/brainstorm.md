# brainstorm Tool

Generate innovative ideas using structured creative methodologies and domain-specific context.

## Overview

The `brainstorm` tool leverages AI models to generate creative solutions using various brainstorming frameworks. It provides structured idea generation with optional feasibility analysis and domain-specific optimization.

## Syntax

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "string",           // Required
    "model": "string",            // Optional
    "methodology": "string",      // Optional
    "domain": "string",          // Optional
    "constraints": "string",     // Optional
    "existingContext": "string", // Optional
    "ideaCount": "number",       // Optional
    "includeAnalysis": "boolean", // Optional
    "approvalPolicy": "string",  // Optional
    "sandboxMode": "string",     // Optional
    "fullAuto": "boolean",       // Optional
    "cd": "string",             // Optional
    "yolo": "boolean"           // Optional
  }
}
```

## Parameters

### Core Parameters

#### prompt (required)

- **Type:** `string`
- **Description:** The brainstorming challenge or question to explore
- **Example:** `"ways to improve API performance"`

#### model (optional)

- **Type:** `string`
- **Default:** Codex default model
- **Options:** `"gpt-5"`, `"o3"`, `"o4-mini"`
- **Recommendation:** Use GPT-5 for creative tasks

#### methodology (optional)

- **Type:** `string`
- **Default:** `"auto"`
- **Options:**
  - `"divergent"` - Generate many diverse ideas
  - `"convergent"` - Refine and focus existing ideas
  - `"scamper"` - Systematic creative triggers
  - `"design-thinking"` - Human-centered approach
  - `"lateral"` - Unexpected connections
  - `"auto"` - AI selects best method

### Context Parameters

#### domain (optional)

- **Type:** `string`
- **Description:** Domain context for specialized brainstorming
- **Examples:** `"software"`, `"business"`, `"creative"`, `"research"`, `"product"`, `"marketing"`

#### constraints (optional)

- **Type:** `string`
- **Description:** Known limitations, requirements, or boundaries
- **Example:** `"budget under $10k, must work with existing infrastructure"`

#### existingContext (optional)

- **Type:** `string`
- **Description:** Background information or previous attempts
- **Example:** `"We tried caching but it didn't help enough"`

### Output Parameters

#### ideaCount (optional)

- **Type:** `number`
- **Default:** `12`
- **Range:** 1-50
- **Description:** Target number of ideas to generate

#### includeAnalysis (optional)

- **Type:** `boolean`
- **Default:** `true`
- **Description:** Include feasibility, impact, and implementation analysis

### Execution Parameters

#### approvalPolicy (optional)

- **Type:** `string`
- **Options:** `"never"`, `"on-request"`, `"on-failure"`, `"untrusted"`
- **Description:** When approval is required

#### sandboxMode (optional)

- **Type:** `string`
- **Options:** `"read-only"`, `"workspace-write"`, `"danger-full-access"`
- **Description:** File system access level

#### fullAuto (optional)

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Enable full automation

#### cd (optional)

- **Type:** `string`
- **Description:** Working directory

#### yolo (optional)

- **Type:** `boolean`
- **Default:** `false`
- **Description:** Bypass all safety measures

## Methodologies Explained

### Divergent Thinking

Generates a wide variety of ideas without immediate judgment:

```javascript
{
  "prompt": "ways to reduce server costs",
  "methodology": "divergent",
  "ideaCount": 20
}
```

### Convergent Thinking

Refines and combines existing ideas:

```javascript
{
  "prompt": "optimize our top 3 solutions",
  "methodology": "convergent",
  "existingContext": "1. Caching 2. CDN 3. Code splitting"
}
```

### SCAMPER Method

Systematic approach using triggers:

- **S**ubstitute - What can be substituted?
- **C**ombine - What can be combined?
- **A**dapt - What can be adapted?
- **M**odify/Magnify - What can be emphasized?
- **P**ut to other uses - Alternative applications?
- **E**liminate - What can be removed?
- **R**everse/Rearrange - What can be reordered?

```javascript
{
  "prompt": "improve user onboarding",
  "methodology": "scamper"
}
```

### Design Thinking

Human-centered problem solving:

```javascript
{
  "prompt": "improve developer experience",
  "methodology": "design-thinking",
  "domain": "software"
}
```

### Lateral Thinking

Creates unexpected connections:

```javascript
{
  "prompt": "innovative data storage solutions",
  "methodology": "lateral"
}
```

## Examples

### Basic Brainstorming

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "ways to improve code review process"
  }
}
```

### Domain-Specific with Constraints

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "reduce AWS costs",
    "domain": "cloud-infrastructure",
    "constraints": "maintain 99.9% uptime, no service degradation",
    "ideaCount": 15,
    "includeAnalysis": true
  }
}
```

### Product Feature Ideation

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "new features for code editor",
    "methodology": "design-thinking",
    "domain": "product",
    "existingContext": "Current features: syntax highlighting, autocomplete, Git integration",
    "ideaCount": 10
  }
}
```

### Technical Problem Solving

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "optimize database query performance",
    "methodology": "convergent",
    "domain": "software",
    "constraints": "Cannot change database engine, limited to current schema",
    "existingContext": "Tried indexing and query optimization",
    "includeAnalysis": true
  }
}
```

### Marketing Campaign Ideas

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "launch strategy for developer tool",
    "methodology": "scamper",
    "domain": "marketing",
    "constraints": "Limited budget, B2B focus",
    "ideaCount": 20
  }
}
```

## Output Format

### With Analysis Enabled

```markdown
## Brainstorming Results: [Topic]

### Methodology: Design Thinking

### Domain: Software Development

---

### Idea 1: Automated Code Review Bot

**Description:** AI-powered bot that provides initial code review
**Feasibility:** High - Existing APIs available
**Impact:** Medium-High - Saves 30% review time
**Implementation:** 2-3 weeks with existing tools
**Challenges:** Initial setup, false positive handling

### Idea 2: Pair Programming Scheduler

**Description:** Smart calendar integration for pair sessions
**Feasibility:** Medium - Requires calendar API integration
**Impact:** Medium - Improves collaboration
**Implementation:** 1-2 weeks
**Challenges:** Time zone handling, availability conflicts

[... more ideas ...]

### Summary

- Total ideas generated: 10
- High feasibility: 4
- High impact: 3
- Quick wins: Ideas 1, 5, 7
- Long-term investments: Ideas 3, 8
```

### Without Analysis

```markdown
## Brainstorming Results: [Topic]

1. **Automated Code Review Bot** - AI-powered initial reviews
2. **Pair Programming Scheduler** - Smart calendar for pair sessions
3. **Review Metrics Dashboard** - Track review efficiency
4. **Code Review Templates** - Standardized review checklists
5. **Async Review Mode** - Time-shifted review process
   [... more ideas ...]
```

## Advanced Usage

### Iterative Refinement

```javascript
// Round 1: Generate ideas
{
  "prompt": "ways to improve API performance",
  "methodology": "divergent",
  "ideaCount": 20
}

// Round 2: Refine top ideas
{
  "prompt": "refine and combine the top 5 performance ideas",
  "methodology": "convergent",
  "existingContext": "[previous results]"
}
```

### Multi-Domain Exploration

```javascript
{
  "prompt": "cross-functional solutions for slow deployments",
  "domain": "software,business,operations",
  "methodology": "lateral",
  "ideaCount": 15
}
```

### Competitive Analysis

```javascript
{
  "prompt": "differentiation strategies vs competitors",
  "domain": "product",
  "existingContext": "Competitors offer similar features at lower price",
  "methodology": "scamper",
  "constraints": "Cannot compete on price alone"
}
```

## Best Practices

### 1. Be Specific

```javascript
// Good: Specific problem
'ways to reduce API response time from 2s to 200ms';

// Less effective: Vague
'make API faster';
```

### 2. Provide Context

```javascript
{
  "prompt": "improve user retention",
  "existingContext": "Current retention: 60%, churn mainly in first week",
  "constraints": "No additional budget for incentives"
}
```

### 3. Choose Appropriate Methodology

- **New ideas:** Use `divergent`
- **Refining solutions:** Use `convergent`
- **Systematic exploration:** Use `scamper`
- **User-focused:** Use `design-thinking`
- **Creative breakthrough:** Use `lateral`

### 4. Iterate on Results

Start broad, then narrow:

1. Generate many ideas (divergent)
2. Analyze and filter
3. Refine top candidates (convergent)
4. Develop implementation plans

### 5. Set Realistic Counts

- **Quick session:** 5-10 ideas
- **Thorough exploration:** 15-25 ideas
- **Exhaustive analysis:** 30-50 ideas

## Common Use Cases

### Software Development

- Architecture decisions
- Performance optimization
- Feature prioritization
- Technical debt reduction
- Testing strategies

### Product Management

- Feature ideation
- User experience improvements
- Competitive differentiation
- Roadmap planning
- MVP definition

### Business Strategy

- Cost reduction
- Revenue generation
- Process optimization
- Market expansion
- Risk mitigation

### Team & Process

- Workflow improvements
- Communication enhancement
- Onboarding optimization
- Knowledge sharing
- Culture building

## Tips for Better Results

### 1. Frame Problems as Opportunities

Instead of: "Fix slow database"
Try: "Opportunities to enhance database performance"

### 2. Include Stakeholder Perspectives

```javascript
{
  "prompt": "improve deployment process",
  "existingContext": "Developers want speed, ops wants stability, business wants features"
}
```

### 3. Consider Multiple Timeframes

```javascript
{
  "prompt": "scaling strategies",
  "constraints": "Quick wins for next month, long-term for next year"
}
```

### 4. Combine with Other Tools

```javascript
// First: Analyze current state
{ "name": "ask-codex", "arguments": { "prompt": "analyze @src/ performance" } }

// Then: Brainstorm improvements
{ "name": "brainstorm", "arguments": {
  "prompt": "optimize identified bottlenecks",
  "existingContext": "[analysis results]"
}}
```

## Related Tools

- [ask-codex](./ask-codex.md) - Execute analysis before brainstorming
- [fetch-chunk](./fetch-chunk.md) - Handle large brainstorming results
- [ping](./ping.md) - Test connectivity
- [help](./help.md) - Show available options

## See Also

- [Getting Started](../../getting-started.md)
- [Brainstorming Examples](../../examples/brainstorming.md)
- [FAQ](../../resources/faq.md)
- [Troubleshooting](../../resources/troubleshooting.md)
