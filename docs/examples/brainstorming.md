# Brainstorming Examples

This guide provides practical examples of using the brainstorm tool for various creative and problem-solving scenarios.

## Software Development

### Feature Ideation

Generate innovative features for your application:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "innovative features for a code editor that would delight developers",
    "methodology": "divergent",
    "domain": "software",
    "ideaCount": 20,
    "includeAnalysis": true
  }
}
```

### Architecture Decisions

Explore architectural options:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "ways to scale our API to handle 10x traffic",
    "methodology": "scamper",
    "domain": "software",
    "constraints": "budget $5000/month, current stack is Node.js + PostgreSQL",
    "existingContext": "Current setup: 2 servers, 1 database, handling 1000 req/sec",
    "ideaCount": 15
  }
}
```

### Performance Optimization

Find creative performance improvements:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "reduce React app bundle size by 50%",
    "methodology": "convergent",
    "domain": "software",
    "existingContext": "Current bundle: 2.5MB, already using code splitting",
    "constraints": "cannot remove existing features, 1 week timeline",
    "includeAnalysis": true
  }
}
```

## Product Development

### User Experience Improvements

Enhance user satisfaction:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "improve onboarding experience for developer tools",
    "methodology": "design-thinking",
    "domain": "product",
    "existingContext": "Current onboarding: 5 steps, 40% completion rate",
    "ideaCount": 12,
    "includeAnalysis": true
  }
}
```

### Competitive Differentiation

Stand out from competitors:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "unique selling points for our CI/CD platform",
    "methodology": "lateral",
    "domain": "product,marketing",
    "existingContext": "Competitors: GitHub Actions, CircleCI, Jenkins",
    "constraints": "must be implementable with current team of 5",
    "ideaCount": 15
  }
}
```

### MVP Features

Define minimum viable product:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "essential features for project management tool MVP",
    "methodology": "convergent",
    "domain": "product",
    "constraints": "3-month development timeline, $50k budget",
    "ideaCount": 10,
    "includeAnalysis": true
  }
}
```

## Problem Solving

### Bug Prevention

Proactive quality improvements:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "prevent production bugs before they happen",
    "methodology": "scamper",
    "domain": "software",
    "existingContext": "Average 5 bugs/week reaching production",
    "constraints": "cannot slow down deployment frequency",
    "ideaCount": 20
  }
}
```

### Technical Debt Reduction

Strategic debt management:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "tackle technical debt without stopping feature development",
    "methodology": "convergent",
    "domain": "software,business",
    "existingContext": "30% of time spent on maintenance, legacy codebase",
    "constraints": "team of 8, quarterly release cycle",
    "includeAnalysis": true
  }
}
```

### Crisis Management

Handle urgent situations:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "recover from data breach incident",
    "methodology": "convergent",
    "domain": "security,business",
    "constraints": "24 hours to respond, limited PR budget",
    "ideaCount": 10,
    "includeAnalysis": true
  }
}
```

## Team & Process

### Workflow Optimization

Improve team efficiency:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "reduce code review turnaround time from 3 days to 1 day",
    "methodology": "scamper",
    "domain": "process",
    "existingContext": "Team of 10, 20 PRs/day, async across timezones",
    "ideaCount": 15
  }
}
```

### Remote Collaboration

Enhance distributed team work:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "improve remote pair programming experience",
    "methodology": "design-thinking",
    "domain": "process,software",
    "constraints": "team across 5 timezones, varying internet speeds",
    "ideaCount": 12
  }
}
```

### Knowledge Sharing

Build learning culture:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "encourage knowledge sharing in engineering team",
    "methodology": "divergent",
    "domain": "culture,process",
    "existingContext": "Monthly tech talks, internal wiki exists but rarely updated",
    "ideaCount": 20
  }
}
```

## Business Strategy

### Revenue Generation

Find new income streams:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "monetize open-source developer tool",
    "methodology": "lateral",
    "domain": "business",
    "constraints": "must keep core features free, maintain community trust",
    "ideaCount": 15,
    "includeAnalysis": true
  }
}
```

### Cost Reduction

Optimize expenses:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "reduce AWS costs by 40% without impacting performance",
    "methodology": "convergent",
    "domain": "infrastructure,business",
    "existingContext": "Current: $50k/month, 80% on compute, 20% on storage",
    "ideaCount": 12
  }
}
```

### Market Expansion

Grow your reach:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "expand developer tool into enterprise market",
    "methodology": "scamper",
    "domain": "business,marketing",
    "existingContext": "Strong in startup segment, no enterprise customers",
    "constraints": "limited enterprise sales experience",
    "ideaCount": 15
  }
}
```

## Creative Solutions

### Unconventional Approaches

Think outside the box:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "use game design principles to make testing fun",
    "methodology": "lateral",
    "domain": "software,gaming",
    "ideaCount": 20
  }
}
```

### Cross-Industry Innovation

Apply ideas from other fields:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "apply restaurant industry practices to software deployment",
    "methodology": "lateral",
    "domain": "software,hospitality",
    "ideaCount": 15
  }
}
```

### Future-Proofing

Prepare for tomorrow:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "prepare codebase for AI-assisted development future",
    "methodology": "divergent",
    "domain": "software,ai",
    "constraints": "5-year horizon, current team skills",
    "ideaCount": 25
  }
}
```

## Methodology Comparison

### Same Problem, Different Approaches

See how different methodologies yield different results:

```javascript
// Divergent: Generate many ideas
const divergent = {
  name: 'brainstorm',
  arguments: {
    prompt: 'improve API documentation',
    methodology: 'divergent',
    ideaCount: 25,
  },
};

// Convergent: Refine and focus
const convergent = {
  name: 'brainstorm',
  arguments: {
    prompt: 'improve API documentation',
    methodology: 'convergent',
    existingContext: 'Have auto-generation, versioning, examples',
    ideaCount: 8,
  },
};

// SCAMPER: Systematic exploration
const scamper = {
  name: 'brainstorm',
  arguments: {
    prompt: 'improve API documentation',
    methodology: 'scamper',
    ideaCount: 15,
  },
};

// Design Thinking: User-centered
const designThinking = {
  name: 'brainstorm',
  arguments: {
    prompt: 'improve API documentation',
    methodology: 'design-thinking',
    ideaCount: 12,
  },
};

// Lateral: Unexpected connections
const lateral = {
  name: 'brainstorm',
  arguments: {
    prompt: 'improve API documentation',
    methodology: 'lateral',
    ideaCount: 10,
  },
};
```

## Advanced Patterns

### Iterative Brainstorming

Build on previous sessions:

```javascript
// Session 1: Broad exploration
let session1 = await mcp.call('brainstorm', {
  prompt: 'ways to improve developer productivity',
  methodology: 'divergent',
  ideaCount: 30,
});

// Session 2: Deep dive on top ideas
let session2 = await mcp.call('brainstorm', {
  prompt: 'expand on top 5 productivity ideas',
  methodology: 'scamper',
  existingContext: session1,
  ideaCount: 25,
});

// Session 3: Implementation planning
let session3 = await mcp.call('brainstorm', {
  prompt: 'create implementation roadmap',
  methodology: 'convergent',
  existingContext: session2,
  constraints: 'Q1 timeline, team of 4',
  includeAnalysis: true,
});
```

### Constraint-Based Innovation

Use limitations as creative catalysts:

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "build real-time collaboration with only 1 server",
    "methodology": "lateral",
    "constraints": "1 server, 100ms latency max, 1000 concurrent users",
    "domain": "software",
    "ideaCount": 15
  }
}
```

### Comparative Analysis

Generate and compare alternatives:

```javascript
// Option A: Microservices
const microservices = await mcp.call('brainstorm', {
  prompt: 'benefits of microservices architecture for our platform',
  methodology: 'convergent',
  domain: 'software',
  ideaCount: 10,
});

// Option B: Modular Monolith
const monolith = await mcp.call('brainstorm', {
  prompt: 'benefits of modular monolith for our platform',
  methodology: 'convergent',
  domain: 'software',
  ideaCount: 10,
});

// Synthesis
const decision = await mcp.call('brainstorm', {
  prompt: 'synthesize architecture decision',
  existingContext: `Microservices: ${microservices}\nMonolith: ${monolith}`,
  methodology: 'convergent',
  ideaCount: 5,
});
```

## Tips for Better Results

### 1. Provide Rich Context

```javascript
// Good: Specific context
{
  "prompt": "reduce build time",
  "existingContext": "Current: 15 min, webpack, 50k LOC, 200 dependencies",
  "constraints": "cannot change build tool"
}

// Less effective: Vague
{
  "prompt": "make builds faster"
}
```

### 2. Use Appropriate Methodology

- **New ideas:** `divergent`
- **Refining solutions:** `convergent`
- **Systematic exploration:** `scamper`
- **User problems:** `design-thinking`
- **Creative breakthrough:** `lateral`

### 3. Iterate and Refine

Start broad, then narrow focus based on promising ideas.

### 4. Combine with Analysis

Use `includeAnalysis: true` for feasibility and impact assessment.

### 5. Set Realistic Counts

- Quick session: 5-10 ideas
- Thorough exploration: 15-25 ideas
- Exhaustive analysis: 30+ ideas

## Related Resources

- [Brainstorm Tool API](../api/tools/brainstorm.md)
- [Basic Usage](./basic-usage.md)
- [Advanced Usage](./advanced-usage.md)
- [FAQ](../resources/faq.md)
