import { executeCommand, executeCommandDetailed, RetryOptions } from './commandExecutor.js';
import { Logger } from './logger.js';
import { CLI } from '../constants.js';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { resolveWorkingDirectory } from './workingDirResolver.js';

// Type-safe enums
export enum ApprovalPolicy {
  Never = 'never',
  OnRequest = 'on-request',
  OnFailure = 'on-failure',
  Untrusted = 'untrusted',
}

export enum SandboxMode {
  ReadOnly = 'read-only',
  WorkspaceWrite = 'workspace-write',
  DangerFullAccess = 'danger-full-access',
}

export interface CodexExecOptions {
  readonly model?: string;
  readonly fullAuto?: boolean;
  readonly approvalPolicy?: ApprovalPolicy;
  readonly sandboxMode?: SandboxMode;
  readonly approval?: string;
  readonly yolo?: boolean;
  readonly cd?: string;
  readonly workingDir?: string;
  readonly timeoutMs?: number;
  readonly timeout?: number;
  readonly maxOutputBytes?: number;
  readonly retry?: RetryOptions;
  readonly useStdinForLongPrompts?: boolean; // Use stdin for prompts > 100KB
  readonly image?: string | string[];
  readonly config?: string | Record<string, any>;
  readonly profile?: string;
  readonly useExec?: boolean;
  readonly search?: boolean; // Enable web search
  readonly oss?: boolean; // Use local Ollama server
  readonly enableFeatures?: string[]; // Enable feature flags
  readonly disableFeatures?: string[]; // Disable feature flags
}

/**
 * Execute Codex CLI with enhanced error handling and memory efficiency
 */
export async function executeCodexCLI(
  prompt: string,
  options?: CodexExecOptions,
  onProgress?: (newOutput: string) => void
): Promise<string> {
  const args: string[] = [];

  // Validate options
  if (options?.approvalPolicy && options?.yolo) {
    throw new Error('Cannot use both yolo and approvalPolicy');
  }
  if (options?.sandboxMode && options?.yolo) {
    throw new Error('Cannot use both yolo and sandboxMode');
  }

  // Build command arguments
  if (options?.yolo) {
    args.push(CLI.FLAGS.YOLO);
  } else if (options?.fullAuto) {
    args.push(CLI.FLAGS.FULL_AUTO);
  } else {
    if (options?.approvalPolicy) {
      args.push(CLI.FLAGS.ASK_FOR_APPROVAL, options.approvalPolicy);
    }
    // Note: --search requires network access, so if search is enabled and no explicit sandbox mode
    // is set, we need to ensure network is not blocked
    if (options?.sandboxMode) {
      args.push(CLI.FLAGS.SANDBOX_MODE, options.sandboxMode);
    } else if (options?.search || options?.oss) {
      // Auto-enable workspace-write for search/oss if no sandbox specified
      Logger.debug(
        'Search/OSS enabled: auto-setting sandbox to workspace-write for network access'
      );
      args.push(CLI.FLAGS.SANDBOX_MODE, 'workspace-write');
    }
  }

  if (options?.model) {
    args.push(CLI.FLAGS.MODEL, options.model);
  }

  // Resolve working directory using intelligent fallback chain
  const resolvedWorkingDir = resolveWorkingDirectory({
    workingDir: options?.cd,
    prompt: prompt,
  });

  if (resolvedWorkingDir) {
    args.push(CLI.FLAGS.CD, resolvedWorkingDir);
    Logger.debug(`Resolved working directory: ${resolvedWorkingDir}`);
  }

  // OSS (Ollama) mode
  if (options?.oss) {
    args.push(CLI.FLAGS.OSS);
  }

  // Enable features (including web search)
  const enableFeatures = [...(options?.enableFeatures || [])];

  // Add web_search_request feature if search is requested
  if (options?.search && !enableFeatures.includes('web_search_request')) {
    enableFeatures.push('web_search_request');
  }

  // Add all features to args
  for (const feature of enableFeatures) {
    args.push(CLI.FLAGS.ENABLE, feature);
  }

  // Disable features
  if (options?.disableFeatures && Array.isArray(options.disableFeatures)) {
    for (const feature of options.disableFeatures) {
      args.push(CLI.FLAGS.DISABLE, feature);
    }
  }

  // Non-interactive run
  args.push('exec');

  // Add conciseness instruction
  const concisePrompt = `Please provide a focused, concise response without unnecessary elaboration. ${prompt}`;

  // Check if prompt is too long for command line (OS dependent, ~100KB is safe)
  const promptSizeBytes = Buffer.byteLength(concisePrompt, 'utf8');
  const useStdin = options?.useStdinForLongPrompts !== false && promptSizeBytes > 100 * 1024;

  let tempFile: string | undefined;

  try {
    if (useStdin) {
      // Write prompt to temp file and pass via stdin redirect
      tempFile = join(tmpdir(), `codex-prompt-${randomBytes(8).toString('hex')}.txt`);
      writeFileSync(tempFile, concisePrompt, 'utf8');
      args.push(`< ${tempFile}`);
      Logger.debug(`Using temp file for large prompt (${promptSizeBytes} bytes)`);
    } else {
      args.push(concisePrompt);
    }

    // Use detailed execution for better error handling
    const result = await executeCommandDetailed(CLI.COMMANDS.CODEX, args, {
      onProgress,
      timeoutMs: options?.timeoutMs,
      maxOutputBytes: options?.maxOutputBytes,
      retry: options?.retry,
    });

    if (!result.ok) {
      // Try to salvage partial output if available
      if (result.partialStdout && result.partialStdout.length > 1000) {
        Logger.warn('Command failed but partial output available, attempting to use it');
        return result.partialStdout;
      }

      const errorMessage = result.stderr || 'Unknown error';
      throw new Error(
        result.timedOut
          ? `Codex CLI timed out after ${options?.timeoutMs || 600000}ms`
          : `Codex CLI failed with exit code ${result.code}: ${errorMessage}`
      );
    }

    return result.stdout;
  } catch (error) {
    Logger.error('Codex CLI execution failed:', error);
    throw error;
  } finally {
    // Clean up temp file
    if (tempFile) {
      try {
        unlinkSync(tempFile);
      } catch (e) {
        Logger.debug('Failed to delete temp file:', e);
      }
    }
  }
}

/**
 * High-level executeCodex function with comprehensive options support
 */
export async function executeCodex(
  prompt: string,
  options?: CodexExecOptions & { [key: string]: any },
  onProgress?: (newOutput: string) => void
): Promise<string> {
  const args: string[] = [];

  // Model selection
  if (options?.model) {
    args.push(CLI.FLAGS.MODEL, options.model);
  }

  // Safety controls
  if (options?.yolo) {
    args.push(CLI.FLAGS.YOLO);
  } else if (options?.fullAuto) {
    args.push(CLI.FLAGS.FULL_AUTO);
  } else {
    // Approval policy
    if (options?.approval || options?.approvalPolicy) {
      const approvalValue = options.approval || options.approvalPolicy;
      if (approvalValue) {
        args.push(CLI.FLAGS.APPROVAL, approvalValue);
      }
    }
    // Sandbox mode
    if (options?.sandboxMode) {
      args.push(CLI.FLAGS.SANDBOX_MODE, options.sandboxMode);
    } else if (options?.search || options?.oss) {
      // Auto-enable workspace-write for search/oss if no sandbox specified
      Logger.debug(
        'Search/OSS enabled: auto-setting sandbox to workspace-write for network access'
      );
      args.push(CLI.FLAGS.SANDBOX_MODE, 'workspace-write');
    }
  }

  // Resolve working directory using intelligent fallback chain
  const resolvedWorkingDir = resolveWorkingDirectory({
    workingDir: options?.workingDir || options?.cd,
    prompt: prompt,
  });

  if (resolvedWorkingDir) {
    args.push(CLI.FLAGS.WORKING_DIR, resolvedWorkingDir);
    Logger.debug(`Resolved working directory for executeCodex: ${resolvedWorkingDir}`);
  }

  // Configuration
  if (options?.config) {
    if (typeof options.config === 'string') {
      args.push(CLI.FLAGS.CONFIG, options.config);
    } else {
      // Convert object to key=value pairs
      const configStr = Object.entries(options.config)
        .map(([k, v]) => `${k}=${v}`)
        .join(',');
      args.push(CLI.FLAGS.CONFIG, configStr);
    }
  }

  // Profile
  if (options?.profile) {
    args.push(CLI.FLAGS.PROFILE, options.profile);
  }

  // Images
  if (options?.image) {
    const images = Array.isArray(options.image) ? options.image : [options.image];
    for (const img of images) {
      args.push(CLI.FLAGS.IMAGE, img);
    }
  }

  // OSS (Ollama) mode
  if (options?.oss) {
    args.push(CLI.FLAGS.OSS);
  }

  // Enable features (including web search)
  const enableFeatures = [...(options?.enableFeatures || [])];

  // Add web_search_request feature if search is requested
  if (options?.search && !enableFeatures.includes('web_search_request')) {
    enableFeatures.push('web_search_request');
  }

  // Add all features to args
  for (const feature of enableFeatures) {
    args.push(CLI.FLAGS.ENABLE, feature);
  }

  // Disable features
  if (options?.disableFeatures && Array.isArray(options.disableFeatures)) {
    for (const feature of options.disableFeatures) {
      args.push(CLI.FLAGS.DISABLE, feature);
    }
  }

  // Use exec mode for non-interactive execution
  if (options?.useExec !== false) {
    // Default to true for non-interactive execution
    args.push('exec');
  }

  // Add the prompt
  args.push(prompt);

  try {
    const timeoutMs = options?.timeout || options?.timeoutMs || 600000; // 10 minutes default

    const result = await executeCommandDetailed(CLI.COMMANDS.CODEX, args, {
      onProgress,
      timeoutMs,
      maxOutputBytes: options?.maxOutputBytes,
      retry: options?.retry,
    });

    if (!result.ok) {
      // Enhanced error handling with specific messages
      const errorMessage = result.stderr || 'Unknown error';

      if (errorMessage.includes('command not found') || errorMessage.includes('not found')) {
        throw new Error('Codex CLI not found. Install with: npm install -g @openai/codex');
      }

      if (errorMessage.includes('authentication') || errorMessage.includes('unauthorized')) {
        throw new Error('Authentication failed. Run "codex login" or set OPENAI_API_KEY');
      }

      if (errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please wait and try again');
      }

      if (errorMessage.includes('permission') || errorMessage.includes('sandbox')) {
        throw new Error(
          `Permission denied. Try adjusting sandbox mode or approval policy: ${errorMessage}`
        );
      }

      throw new Error(`Codex CLI failed: ${errorMessage}`);
    }

    return result.stdout;
  } catch (error) {
    Logger.error('Codex execution failed:', error);
    throw error;
  }
}
