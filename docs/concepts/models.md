# Model Selection

The Codex MCP Tool provides access to OpenAI's latest models through the Codex CLI, including GPT-5, o3, and o4-mini. Each model offers different capabilities, performance characteristics, and pricing, allowing you to choose the best fit for your specific task.

## Available Models (2025)

### GPT-5 Series

OpenAI's most advanced general-purpose models, delivering frontier-level reasoning and multimodal capabilities.

| Model          | Context Window | Max Output  | Best For                                                | Pricing                       |
| -------------- | -------------- | ----------- | ------------------------------------------------------- | ----------------------------- |
| **GPT-5**      | 400K tokens    | 128K tokens | Complex reasoning, large codebases, multimodal analysis | $1.25/1M input, $10/1M output |
| **GPT-5-mini** | 128K tokens    | 32K tokens  | Balanced performance and cost                           | Lower cost variant            |
| **GPT-5-nano** | 64K tokens     | 16K tokens  | Quick tasks, simple queries                             | Most cost-effective           |

**Key Features:**

- Multimodal support (text + images)
- 45% fewer factual errors than GPT-4o
- Superior coding performance (74.9% on SWE-bench)
- Excellent tool use and instruction following

### O-Series (Reasoning Models)

Models trained to think longer before responding, optimized for complex reasoning tasks.

| Model       | Context Window | Max Output  | Best For                                      | Special Features         |
| ----------- | -------------- | ----------- | --------------------------------------------- | ------------------------ |
| **o3**      | 200K tokens    | 100K tokens | Deep reasoning, complex architecture analysis | 20% fewer errors than o1 |
| **o4-mini** | 200K tokens    | 100K tokens | Fast, cost-efficient reasoning                | 99.5% on AIME 2025       |

**Key Features:**

- Extended deliberation for complex problems
- Agentic tool use capabilities
- Web search integration
- Python interpreter access

### Specialized Models

| Model       | Purpose              | Context   | Notes                               |
| ----------- | -------------------- | --------- | ----------------------------------- |
| **codex-1** | Software engineering | Optimized | Based on o3, specialized for coding |
| **GPT-4.1** | Legacy support       | 1M tokens | Previous generation, stable         |

## How to Select a Model

### Using Codex CLI Directly

```bash
# Specify model with --model flag
codex --model gpt-5 "analyze @src/**/*.ts for performance issues"
codex --model o3 "design a microservices architecture for @requirements.md"
codex --model o4-mini "quick review of @utils.js"
```

### Using MCP Tool (ask-codex)

```javascript
// Natural language
"use gpt-5 to analyze the entire codebase architecture"
"ask o3 to solve this complex algorithm problem"
"quick check with o4-mini on this function"

// Direct tool invocation
{
  "name": "ask-codex",
  "arguments": {
    "prompt": "analyze @src/core for optimization opportunities",
    "model": "gpt-5"
  }
}
```

### Using Brainstorm Tool

```javascript
{
  "name": "brainstorm",
  "arguments": {
    "prompt": "innovative features for our app",
    "model": "o3",  // Use o3 for creative reasoning
    "methodology": "lateral"
  }
}
```

## Reasoning Effort Levels

For o-series models, you can control the reasoning depth:

```javascript
// Minimal effort - fastest response
{
  "model": "o3",
  "reasoning_effort": "minimal"
}

// Medium effort (default)
{
  "model": "o3",
  "reasoning_effort": "medium"
}

// Maximum effort - deepest reasoning
{
  "model": "o3",
  "reasoning_effort": "maximum"
}
```

Higher effort levels:

- Take longer to process
- Generate more reasoning tokens
- Provide more thorough analysis
- Cost more due to increased token usage

## Model Selection Guidelines

### By Task Type

#### Code Review & Analysis

- **Quick review**: o4-mini (fast, efficient)
- **Comprehensive review**: GPT-5 (balanced)
- **Security audit**: o3 (deep reasoning)

#### Architecture & Design

- **System design**: o3 (complex reasoning)
- **API design**: GPT-5 (practical balance)
- **Quick prototypes**: o4-mini (speed)

#### Bug Investigation

- **Complex bugs**: o3 (step-by-step reasoning)
- **Performance issues**: GPT-5 (multimodal analysis)
- **Simple fixes**: o4-mini (quick turnaround)

#### Documentation

- **API docs**: GPT-5 (comprehensive)
- **Quick comments**: o4-mini (efficient)
- **Architecture docs**: o3 (thorough understanding)

#### Refactoring

- **Large-scale**: GPT-5 (handles large context)
- **Algorithm optimization**: o3 (reasoning depth)
- **Simple cleanup**: o4-mini (cost-effective)

### By Context Size

```javascript
// Small files (<10K tokens)
{ "model": "o4-mini" }  // Most efficient

// Medium projects (<100K tokens)
{ "model": "gpt-5" }  // Good balance

// Large codebases (>100K tokens)
{ "model": "gpt-5" }  // 400K context window

// Massive monorepos
{ "model": "gpt-4.1" }  // 1M token context
```

## Cost Optimization Strategies

### 1. Start Small, Scale Up

```bash
# Initial exploration
codex --model o4-mini "@src quick overview"

# Detailed analysis if needed
codex --model gpt-5 "@src comprehensive analysis"

# Deep dive for critical issues
codex --model o3 "@src/critical solve complex bug"
```

### 2. Use Cached Inputs

GPT-5 offers cached input pricing ($0.125/1M vs $1.25/1M):

```javascript
// Reuse identical prompts for efficiency
const basePrompt = '@src/utils analyze for patterns';
// Multiple variations with same base get cached pricing
```

### 3. Match Model to Task Complexity

```javascript
// Simple tasks - use mini models
{ "prompt": "add comments", "model": "o4-mini" }

// Medium complexity - balanced models
{ "prompt": "refactor module", "model": "gpt-5" }

// High complexity - premium models
{ "prompt": "redesign architecture", "model": "o3" }
```

## Performance Characteristics

### Response Times

- **o4-mini**: Fastest responses, optimized for speed
- **GPT-5**: Balanced latency, good for most tasks
- **o3**: Longer processing for reasoning tasks
- **GPT-4.1**: Variable based on context size

### Accuracy Benchmarks

```
Mathematical Reasoning (AIME 2025):
- o4-mini: 99.5% (with Python)
- GPT-5: 94.6% (without tools)
- o3: 96.2% (with reasoning)

Coding (SWE-bench Verified):
- GPT-5: 74.9%
- o3: 71.3%
- o4-mini: 68.7%

Multimodal Understanding (MMMU):
- GPT-5: 84.2%
- o3: 81.5%
- o4-mini: Not optimized
```

## Setting Default Models

### Environment Variable

```bash
# Set default model for all operations
export CODEX_DEFAULT_MODEL=gpt-5
```

### Configuration File

In your Codex config (`~/.codex/config.toml`):

```toml
[defaults]
model = "gpt-5"
reasoning_effort = "medium"
```

### Per-Session Override

```bash
# Override for current session
codex --profile high-performance
# Uses profile with o3 model configuration
```

## Model-Specific Features

### GPT-5 Exclusive

- Native vision capabilities for images
- Extended 400K context window
- Cached input pricing
- Optimized for agentic coding products

### O-Series Exclusive

- Step-by-step reasoning traces
- Agentic tool combination
- Web search integration
- Python interpreter access

### O4-mini Advantages

- Fastest response times
- Most cost-effective
- Excellent for repetitive tasks
- Strong performance on structured data

## Migration Guide

### From GPT-4 to GPT-5

```javascript
// Old
{ "model": "gpt-4", "max_tokens": 4000 }

// New - larger default limits
{ "model": "gpt-5" }  // 128K output by default
```

### From Older O-Models

```javascript
// Old
{ "model": "o1-preview" }

// New - improved reasoning
{ "model": "o3" }
```

## Troubleshooting

### Model Not Available

```bash
# Check available models
codex --list-models

# Fallback chain
try "gpt-5" -> fallback "o3" -> fallback "o4-mini"
```

### Context Too Large

```javascript
// Split large contexts
if (tokens > 400000) {
  // Use chunking strategy
  splitIntoChunks(content, 350000);
}
```

### Slow Responses

```javascript
// Switch to faster model
{
  "model": "o4-mini",
  "reasoning_effort": "minimal"
}
```

## Future Models

OpenAI continues to develop new models. Check for updates:

```bash
# Get latest model information
codex --help models

# Check API documentation
codex --version
```

## Best Practices

1. **Start with o4-mini** for initial exploration
2. **Use GPT-5** for production workloads
3. **Reserve o3** for complex reasoning tasks
4. **Consider context limits** when selecting models
5. **Monitor costs** and optimize model selection
6. **Cache prompts** when using GPT-5 repeatedly
7. **Use reasoning_effort** wisely for o-series models

## See Also

- [How It Works](./how-it-works.md) - Understanding model integration
- [File Analysis](./file-analysis.md) - Optimizing file references for models
- [Sandbox Modes](./sandbox.md) - Security with different models
- [API Pricing](https://openai.com/api/pricing/) - Latest pricing information
