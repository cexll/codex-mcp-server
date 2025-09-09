import { z } from 'zod';
import { UnifiedTool } from './registry.js';
import { executeCodexCLI } from '../utils/codexExecutor.js';
import { processChangeModeOutput } from '../utils/changeModeRunner.js';
import { STATUS_MESSAGES } from '../constants.js';

const askCodexArgsSchema = z.object({
  prompt: z.string().min(1).describe("Task or question. Use @ to include files (e.g., '@largefile.ts explain')."),
  model: z.string().optional().describe("AI model: 'gpt-5' (400K context, best for large codebases), 'o3' (200K, deep reasoning), 'o4-mini' (200K, fast & cheap for simple tasks). Default: gpt-5"),
  sandbox: z.boolean().default(false).describe("Quick automation mode: enables workspace-write + on-failure approval. Alias for fullAuto."),
  fullAuto: z.boolean().optional().describe("Full automation: workspace-write sandbox + on-failure approval. Safe for trusted operations."),
  approvalPolicy: z.enum(['never','on-request','on-failure','untrusted']).optional().describe("When to ask for approval: 'never' (fastest), 'on-request' (model decides), 'on-failure' (on errors), 'untrusted' (always ask)."),
  sandboxMode: z.enum(['read-only','workspace-write','danger-full-access']).optional().describe("File system access: 'read-only' (safest), 'workspace-write' (can modify project files), 'danger-full-access' (unrestricted - use with caution!)."),
  yolo: z.boolean().optional().describe("DANGEROUS: Bypass ALL safety measures. No sandbox, no approvals. Use only in isolated environments!"),
  cd: z.string().optional().describe("Working directory for Codex (--cd)."),
  changeMode: z.boolean().default(false).describe("Return structured OLD/NEW code edits instead of conversational response. Perfect for refactoring and migrations."),
  chunkIndex: z.preprocess(
    (val) => {
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const parsed = parseInt(val, 10);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    },
    z.number().min(1).optional()
  ).describe("Which chunk to return (1-based)"),
  chunkCacheKey: z.string().optional().describe("Optional cache key for continuation"),
});

export const askCodexTool: UnifiedTool = {
  name: 'ask-codex',
  description: "Execute Codex CLI commands with file analysis (@syntax), model selection (gpt-5/o3/o4-mini), and safety controls. Supports changeMode for structured code edits.",
  zodSchema: askCodexArgsSchema,
  prompt: {
    description: "Execute Codex CLI with a prompt. Supports changeMode for structured edit suggestions.",
  },
  category: 'utility',
  execute: async (args, onProgress) => {
    const { prompt, model, sandbox, fullAuto, approvalPolicy, sandboxMode, yolo, cd, changeMode, chunkIndex, chunkCacheKey } = args;

    if (changeMode && chunkIndex && chunkCacheKey) {
      return processChangeModeOutput('', {
        chunkIndex: chunkIndex as number,
        cacheKey: chunkCacheKey as string,
        prompt: prompt as string
      });
    }

    const result = await executeCodexCLI(
      prompt as string,
      {
        model: model as string | undefined,
        fullAuto: Boolean(fullAuto ?? sandbox),
        approvalPolicy: approvalPolicy as any,
        sandboxMode: sandboxMode as any,
        yolo: Boolean(yolo),
        cd: cd as string | undefined,
      },
      onProgress
    );

    if (changeMode) {
      return processChangeModeOutput(result, {
        chunkIndex: args.chunkIndex as number | undefined,
        prompt: prompt as string
      });
    }
    return `${STATUS_MESSAGES.CODEX_RESPONSE}\n${result}`;
  }
};
