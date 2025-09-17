import { z } from 'zod';
import { UnifiedTool } from './registry.js';
import { executeCodexCLI } from '../utils/codexExecutor.js';
import { processChangeModeOutput } from '../utils/changeModeRunner.js';
import { STATUS_MESSAGES } from '../constants.js';

const askCodexArgsSchema = z.object({
  prompt: z.string().min(1).describe("Task/question. Use @ for files (e.g., '@file.ts explain')"),
  model: z.string().optional().describe("Model: gpt-5-codex (default), gpt-5, o3, o4-mini, codex-1, codex-mini-latest, gpt-4.1"),
  sandbox: z.boolean().default(false).describe("Quick automation (alias for fullAuto)"),
  fullAuto: z.boolean().optional().describe("Full automation mode"),
  approvalPolicy: z.enum(['never','on-request','on-failure','untrusted']).optional().describe("Approval: never, on-request, on-failure, untrusted"),
  sandboxMode: z.enum(['read-only','workspace-write','danger-full-access']).optional().describe("Access: read-only, workspace-write, danger-full-access"),
  yolo: z.boolean().optional().describe("⚠️ Bypass all safety (dangerous)"),
  cd: z.string().optional().describe("Working directory"),
  changeMode: z.boolean().default(false).describe("Return structured OLD/NEW edits for refactoring"),
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
  ).describe("Chunk index (1-based)"),
  chunkCacheKey: z.string().optional().describe("Cache key for continuation"),
});

export const askCodexTool: UnifiedTool = {
  name: 'ask-codex',
  description: "Execute Codex CLI with file analysis (@syntax), model selection, and safety controls. Supports changeMode.",
  zodSchema: askCodexArgsSchema,
  prompt: {
    description: "Execute Codex CLI with optional changeMode",
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
