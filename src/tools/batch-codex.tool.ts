import { z } from 'zod';
import { UnifiedTool } from './registry.js';
import { executeCodex } from '../utils/codexExecutor.js';
import { ERROR_MESSAGES, STATUS_MESSAGES, MODELS, SANDBOX_MODES } from '../constants.js';

// Define task type for batch operations
const batchTaskSchema = z.object({
  task: z.string().describe('Atomic task description'),
  target: z.string().optional().describe('Target files/directories (use @ syntax)'),
  priority: z.enum(['high', 'normal', 'low']).default('normal').describe('Task priority'),
});

const batchCodexArgsSchema = z.object({
  tasks: z.array(batchTaskSchema).min(1).describe('Array of atomic tasks to delegate to Codex'),
  model: z
    .string()
    .optional()
    .describe(`Model to use: ${Object.values(MODELS).join(', ')}`),
  sandbox: z
    .string()
    .default(SANDBOX_MODES.WORKSPACE_WRITE)
    .describe(`Sandbox mode: ${Object.values(SANDBOX_MODES).join(', ')}`),
  parallel: z.boolean().default(false).describe('Execute tasks in parallel (experimental)'),
  stopOnError: z.boolean().default(true).describe('Stop execution if any task fails'),
  timeout: z.number().optional().describe('Maximum execution time per task in milliseconds'),
  workingDir: z.string().optional().describe('Working directory for execution'),
  search: z
    .boolean()
    .optional()
    .describe('Enable web search for all tasks (activates web_search_request feature)'),
  oss: z.boolean().optional().describe('Use local Ollama server'),
  enableFeatures: z.array(z.string()).optional().describe('Enable feature flags'),
  disableFeatures: z.array(z.string()).optional().describe('Disable feature flags'),
});

export const batchCodexTool: UnifiedTool = {
  name: 'batch-codex',
  description:
    'Delegate multiple atomic tasks to Codex for batch processing. Ideal for repetitive operations, mass refactoring, and automated code transformations',
  zodSchema: batchCodexArgsSchema,
  prompt: {
    description: 'Execute multiple atomic Codex tasks in batch mode for efficient automation',
  },
  category: 'codex',
  execute: async (args, onProgress) => {
    const {
      tasks,
      model,
      sandbox,
      parallel,
      stopOnError,
      timeout,
      workingDir,
      search,
      oss,
      enableFeatures,
      disableFeatures,
    } = args;
    const taskList = tasks as Array<{
      task: string;
      target?: string;
      priority: string;
    }>;

    if (!taskList || taskList.length === 0) {
      throw new Error('No tasks provided for batch execution');
    }

    const results: Array<{
      task: string;
      status: 'success' | 'failed' | 'skipped';
      output?: string;
      error?: string;
    }> = [];
    let failedCount = 0;
    let successCount = 0;

    // Sort tasks by priority
    const sortedTasks = [...taskList].sort((a, b) => {
      const priorityOrder = { high: 0, normal: 1, low: 2 };
      return (
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    });

    if (onProgress) {
      onProgress(`🚀 Starting batch execution of ${sortedTasks.length} tasks...`);
    }

    // Execute tasks sequentially
    // TODO: Implement parallel execution when parallel flag is true
    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i];
      const taskPrompt = task.target ? `${task.task} in ${task.target}` : task.task;

      if (onProgress) {
        onProgress(`\n[${i + 1}/${sortedTasks.length}] Executing: ${taskPrompt}`);
      }

      // Skip remaining tasks if stopOnError is true and we have failures
      if (stopOnError && failedCount > 0) {
        results.push({
          task: taskPrompt,
          status: 'skipped',
          error: 'Skipped due to previous failure',
        });
        continue;
      }

      try {
        const result = await executeCodex(
          taskPrompt,
          {
            model: model as string,
            sandboxMode: sandbox as any,
            timeout: timeout as number,
            workingDir: workingDir as string,
            search: search as boolean,
            oss: oss as boolean,
            enableFeatures: enableFeatures as string[],
            disableFeatures: disableFeatures as string[],
          },
          undefined // No progress for individual tasks to keep output clean
        );

        results.push({
          task: taskPrompt,
          status: 'success',
          output: result.substring(0, 500), // Truncate for summary
        });
        successCount++;

        if (onProgress) {
          onProgress(`✅ Completed: ${task.task}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({
          task: taskPrompt,
          status: 'failed',
          error: errorMessage,
        });
        failedCount++;

        if (onProgress) {
          onProgress(`❌ Failed: ${task.task} - ${errorMessage}`);
        }
      }
    }

    // Generate summary report
    let report = `\n📊 **Batch Execution Summary**\n`;
    report += `\n- Total tasks: ${sortedTasks.length}`;
    report += `\n- Successful: ${successCount} ✅`;
    report += `\n- Failed: ${failedCount} ❌`;
    report += `\n- Skipped: ${sortedTasks.length - successCount - failedCount} ⏭️`;

    report += `\n\n**Task Results:**\n`;
    for (const result of results) {
      const icon = result.status === 'success' ? '✅' : result.status === 'failed' ? '❌' : '⏭️';
      report += `\n${icon} **${result.task}**`;
      if (result.status === 'success' && result.output) {
        report += `\n   Output: ${result.output.substring(0, 100)}...`;
      } else if (result.error) {
        report += `\n   Error: ${result.error}`;
      }
    }

    // If all tasks failed, throw an error
    if (failedCount === sortedTasks.length) {
      throw new Error(`All ${failedCount} tasks failed. See report above for details.`);
    }

    return report;
  },
};
