import { z } from 'zod';
import { UnifiedTool } from './registry.js';
import { executeCodexCLI, executeCodex } from '../utils/codexExecutor.js';
import { processChangeModeOutput } from '../utils/changeModeRunner.js';
import { formatCodexResponseForMCP } from '../utils/outputParser.js';
import { MODELS, APPROVAL_POLICIES, ERROR_MESSAGES } from '../constants.js';

const askCodexArgsSchema = z.object({
  prompt: z
    .string()
    .min(1)
    .describe("Task or question. Use @ to include files (e.g., '@largefile.ts explain')."),
  model: z
    .string()
    .optional()
    .describe(`Model: ${Object.values(MODELS).join(', ')}. Default: gpt-5-codex`),
  sandbox: z
    .boolean()
    .default(false)
    .describe(
      'Quick automation mode: enables workspace-write + on-failure approval. Alias for fullAuto.'
    ),
  fullAuto: z.boolean().optional().describe('Full automation mode'),
  approvalPolicy: z
    .enum(['never', 'on-request', 'on-failure', 'untrusted'])
    .optional()
    .describe('Approval: never, on-request, on-failure, untrusted'),
  approval: z
    .string()
    .optional()
    .describe(`Approval policy: ${Object.values(APPROVAL_POLICIES).join(', ')}`),
  sandboxMode: z
    .enum(['read-only', 'workspace-write', 'danger-full-access'])
    .optional()
    .describe('Access: read-only, workspace-write, danger-full-access'),
  yolo: z.boolean().optional().describe('⚠️ Bypass all safety (dangerous)'),
  cd: z.string().optional().describe('Working directory'),
  workingDir: z.string().optional().describe('Working directory for execution'),
  changeMode: z
    .boolean()
    .default(false)
    .describe('Return structured OLD/NEW edits for refactoring'),
  chunkIndex: z
    .preprocess(val => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    }, z.number().min(1).optional())
    .describe('Chunk index (1-based)'),
  chunkCacheKey: z.string().optional().describe('Cache key for continuation'),
  image: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('Optional image file path(s) to include with the prompt'),
  config: z
    .union([z.string(), z.record(z.any())])
    .optional()
    .describe("Configuration overrides as 'key=value' string or object"),
  profile: z.string().optional().describe('Configuration profile to use from ~/.codex/config.toml'),
  timeout: z.number().optional().describe('Maximum execution time in milliseconds (optional)'),
  includeThinking: z
    .boolean()
    .default(true)
    .describe('Include reasoning/thinking section in response'),
  includeMetadata: z.boolean().default(true).describe('Include configuration metadata in response'),
  search: z
    .boolean()
    .optional()
    .describe(
      'Enable web search by activating web_search_request feature flag. Requires network access - automatically sets sandbox to workspace-write if not specified.'
    ),
  oss: z
    .boolean()
    .optional()
    .describe(
      'Use local Ollama server (convenience for -c model_provider=oss). Requires Ollama running locally. Automatically sets sandbox to workspace-write if not specified.'
    ),
  enableFeatures: z
    .array(z.string())
    .optional()
    .describe('Enable feature flags (repeatable). Equivalent to -c features.<name>=true'),
  disableFeatures: z
    .array(z.string())
    .optional()
    .describe('Disable feature flags (repeatable). Equivalent to -c features.<name>=false'),
});

export const askCodexTool: UnifiedTool = {
  name: 'ask-codex',
  description:
    'Execute Codex CLI with file analysis (@syntax), model selection, and safety controls. Supports changeMode.',
  zodSchema: askCodexArgsSchema,
  prompt: {
    description: 'Execute Codex CLI with optional changeMode',
  },
  category: 'utility',
  execute: async (args, onProgress) => {
    const {
      prompt,
      model,
      sandbox,
      fullAuto,
      approvalPolicy,
      approval,
      sandboxMode,
      yolo,
      cd,
      workingDir,
      changeMode,
      chunkIndex,
      chunkCacheKey,
      image,
      config,
      profile,
      timeout,
      includeThinking,
      includeMetadata,
      search,
      oss,
      enableFeatures,
      disableFeatures,
    } = args;

    if (!prompt?.trim()) {
      throw new Error(ERROR_MESSAGES.NO_PROMPT_PROVIDED);
    }

    if (changeMode && chunkIndex && chunkCacheKey) {
      return processChangeModeOutput('', {
        chunkIndex: chunkIndex as number,
        cacheKey: chunkCacheKey as string,
        prompt: prompt as string,
      });
    }

    try {
      // Use enhanced executeCodex for better feature support
      const result = await executeCodex(
        prompt as string,
        {
          model: model as string,
          fullAuto: Boolean(fullAuto ?? sandbox),
          approvalPolicy: approvalPolicy as any,
          approval: approval as string,
          sandboxMode: sandboxMode as any,
          yolo: Boolean(yolo),
          cd: cd as string,
          workingDir: workingDir as string,
          image,
          config,
          profile: profile as string,
          timeout: timeout as number,
          search: search as boolean,
          oss: oss as boolean,
          enableFeatures: enableFeatures as string[],
          disableFeatures: disableFeatures as string[],
        },
        onProgress
      );

      if (changeMode) {
        return processChangeModeOutput(result, {
          chunkIndex: args.chunkIndex as number | undefined,
          prompt: prompt as string,
        });
      }

      // Format response with enhanced output parsing
      return formatCodexResponseForMCP(
        result,
        includeThinking as boolean,
        includeMetadata as boolean
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      // Enhanced error handling with helpful context
      if (errorMessage.includes('not found') || errorMessage.includes('command not found')) {
        return `❌ **Codex CLI Not Found**: ${ERROR_MESSAGES.CODEX_NOT_FOUND}

**Quick Fix:**
\`\`\`bash
npm install -g @openai/codex
\`\`\`

**Verification:** Run \`codex --version\` to confirm installation.`;
      }

      if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
        return `❌ **Authentication Failed**: ${ERROR_MESSAGES.AUTHENTICATION_FAILED}

**Setup Options:**
1. **API Key:** \`export OPENAI_API_KEY=your-key\`
2. **Login:** \`codex login\` (requires ChatGPT subscription)

**Troubleshooting:** Verify key has Codex access in OpenAI dashboard.`;
      }

      if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        return `❌ **Usage Limit Reached**: ${ERROR_MESSAGES.QUOTA_EXCEEDED}

**Solutions:**
1. Wait and retry - rate limits reset periodically
2. Check quota in OpenAI dashboard`;
      }

      if (errorMessage.includes('timeout')) {
        return `❌ **Request Timeout**: Operation took longer than expected

**Solutions:**
1. Increase timeout: Add \`timeout: 300000\` (5 minutes)
2. Simplify request: Break complex queries into smaller parts`;
      }

      if (errorMessage.includes('sandbox') || errorMessage.includes('permission')) {
        return `❌ **Permission Error**: ${ERROR_MESSAGES.SANDBOX_VIOLATION}

**Solutions:**
1. Relax sandbox: Use \`sandboxMode: "workspace-write"\`
2. Adjust approval: Try \`approval: "on-request"\``;
      }

      // Generic error with context
      return `❌ **Codex Execution Error**: ${errorMessage}

**Debug Steps:**
1. Verify Codex CLI: \`codex --version\`
2. Check authentication: \`codex login\`
3. Try simpler query first`;
    }
  },
};
