import { z } from 'zod';
import { UnifiedTool } from './registry.js';
import { executeCommandDetailed } from '../utils/commandExecutor.js';
import { CLI } from '../constants.js';
import { Logger } from '../utils/logger.js';

const reviewCodexArgsSchema = z.object({
  uncommitted: z
    .boolean()
    .optional()
    .describe('Review staged, unstaged, and untracked changes'),
  commit: z
    .string()
    .optional()
    .describe('Review the changes introduced by a specific commit SHA'),
  base: z
    .string()
    .optional()
    .describe('Review changes against the given base branch'),
  title: z
    .string()
    .optional()
    .describe('Optional commit title to display in the review summary'),
  prompt: z
    .string()
    .optional()
    .describe('Custom review instructions'),
  config: z
    .string()
    .optional()
    .describe("Configuration override as 'key=value' string"),
  enableFeatures: z
    .array(z.string())
    .optional()
    .describe('Enable feature flags'),
  disableFeatures: z
    .array(z.string())
    .optional()
    .describe('Disable feature flags'),
  workingDir: z
    .string()
    .optional()
    .describe('Working directory (must be a git repository)'),
  timeout: z
    .number()
    .optional()
    .describe('Maximum execution time in milliseconds'),
  debug: z
    .boolean()
    .optional()
    .describe('Return raw output for debugging'),
});

export const reviewCodexTool: UnifiedTool = {
  name: 'review',
  description:
    'Run Codex code review on git changes. Supports reviewing uncommitted changes, specific commits, or branch comparisons.',
  zodSchema: reviewCodexArgsSchema,
  prompt: {
    description: 'Run code review with Codex CLI',
  },
  category: 'utility',
  execute: async (args, onProgress) => {
    const {
      uncommitted,
      commit,
      base,
      title,
      prompt,
      config,
      enableFeatures,
      disableFeatures,
      workingDir,
      timeout,
      debug,
    } = args;

    // Validate: at least one review target must be specified
    if (!uncommitted && !commit && !base) {
      return `❌ **Review Target Required**

Please specify what to review:
- \`uncommitted: true\` - Review staged, unstaged, and untracked changes
- \`commit: "<SHA>"\` - Review a specific commit
- \`base: "<branch>"\` - Review changes against a base branch

**Examples:**
\`\`\`json
{ "uncommitted": true }
{ "commit": "abc1234" }
{ "base": "main" }
\`\`\``;
    }

    const cmdArgs: string[] = ['review'];
    const cwd = (workingDir as string) || process.cwd();

    // Review target options
    if (uncommitted) {
      cmdArgs.push('--uncommitted');
    }
    if (commit) {
      cmdArgs.push('--commit', commit as string);
    }
    if (base) {
      cmdArgs.push('--base', base as string);
    }

    // Optional title
    if (title) {
      cmdArgs.push('--title', title as string);
    }

    // Config override
    if (config && typeof config === 'string') {
      cmdArgs.push('-c', config);
    }

    // Feature flags
    if (enableFeatures && Array.isArray(enableFeatures)) {
      for (const feature of enableFeatures) {
        cmdArgs.push('--enable', feature);
      }
    }
    if (disableFeatures && Array.isArray(disableFeatures)) {
      for (const feature of disableFeatures) {
        cmdArgs.push('--disable', feature);
      }
    }

    // Custom prompt (must be last)
    if (prompt) {
      cmdArgs.push(prompt);
    }

    try {
      const timeoutMs = timeout || 600000; // 10 minutes default

      Logger.debug(`Executing codex review in ${cwd}`);
      Logger.debug(`Args: ${cmdArgs.join(' ')}`);

      const result = await executeCommandDetailed(CLI.COMMANDS.CODEX, cmdArgs, {
        onProgress,
        timeoutMs,
        cwd,
      });

      // Debug mode: return raw output
      if (debug) {
        return `**Debug Output:**

ok: ${result.ok}
code: ${result.code}
stdout length: ${result.stdout?.length || 0}
stderr: ${result.stderr || '(empty)'}

Raw stdout:
${result.stdout || '(empty)'}`;
      }

      // Codex outputs to stderr, check both stdout and stderr
      const output = result.stdout || result.stderr || '';

      if (output) {
        return formatReviewOutput(output);
      }

      // Handle errors
      if (!result.ok) {
        const errorMessage = result.stderr || `Exit code: ${result.code}`;
        return `❌ **Review Failed**

${errorMessage}

**Debug Info:**
- Working directory: ${cwd}
- Command: codex ${cmdArgs.join(' ')}`;
      }

      return `ℹ️ **Review Complete**

No issues found or no output generated.

**Debug Info:**
- Working directory: ${cwd}
- Command: codex ${cmdArgs.join(' ')}`;
    } catch (error) {
      Logger.error('Codex review failed:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `❌ **Review Error**: ${errorMessage}`;
    }
  },
};

function formatReviewOutput(output: string): string {
  if (!output || output.trim() === '') {
    return 'ℹ️ **Review Complete** - No issues found.';
  }

  // Extract the main review content from codex output
  const lines = output.split('\n');
  const reviewContent: string[] = [];
  let inThinking = false;
  let thinkingContent: string[] = [];

  for (const line of lines) {
    // Skip metadata lines
    if (
      line.startsWith('OpenAI Codex') ||
      line.startsWith('--------') ||
      line.startsWith('workdir:') ||
      line.startsWith('model:') ||
      line.startsWith('provider:') ||
      line.startsWith('approval:') ||
      line.startsWith('sandbox:') ||
      line.startsWith('reasoning') ||
      line.startsWith('session id:') ||
      line.startsWith('user') ||
      line.startsWith('mcp startup:')
    ) {
      continue;
    }

    // Track thinking blocks
    if (line.startsWith('thinking')) {
      inThinking = true;
      const thinkingText = line.replace(/^thinking\s*/, '').trim();
      if (thinkingText) {
        thinkingContent.push(thinkingText);
      }
      continue;
    }

    // Track exec blocks (command execution)
    if (line.startsWith('exec')) {
      inThinking = false;
      continue;
    }

    // Track codex output (final review)
    if (line.startsWith('codex')) {
      inThinking = false;
      const codexText = line.replace(/^codex\s*/, '').trim();
      if (codexText) {
        reviewContent.push(codexText);
      }
      continue;
    }

    // Collect content
    if (inThinking) {
      thinkingContent.push(line);
    } else if (line.trim()) {
      reviewContent.push(line);
    }
  }

  // Build formatted output
  let formatted = '## 📋 Code Review Results\n\n';

  if (reviewContent.length > 0) {
    formatted += reviewContent.join('\n');
  } else if (thinkingContent.length > 0) {
    // Fallback to thinking content if no explicit review output
    formatted += '### Analysis\n\n';
    formatted += thinkingContent.join('\n');
  } else {
    formatted += 'No specific issues identified.';
  }

  return formatted;
}
