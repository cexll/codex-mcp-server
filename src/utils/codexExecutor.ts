import { executeCommand, executeCommandDetailed, RetryOptions } from './commandExecutor.js';
import { Logger } from './logger.js';
import { CLI } from '../constants.js';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { randomBytes } from 'crypto';

// Type-safe enums
export enum ApprovalPolicy {
  Never = 'never',
  OnRequest = 'on-request',
  OnFailure = 'on-failure',
  Untrusted = 'untrusted'
}

export enum SandboxMode {
  ReadOnly = 'read-only',
  WorkspaceWrite = 'workspace-write',
  DangerFullAccess = 'danger-full-access'
}

export interface CodexExecOptions {
  readonly model?: string;
  readonly fullAuto?: boolean;
  readonly approvalPolicy?: ApprovalPolicy;
  readonly sandboxMode?: SandboxMode;
  readonly yolo?: boolean;
  readonly cd?: string;
  readonly timeoutMs?: number;
  readonly maxOutputBytes?: number;
  readonly retry?: RetryOptions;
  readonly useStdinForLongPrompts?: boolean; // Use stdin for prompts > 100KB
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
    if (options?.sandboxMode) {
      args.push(CLI.FLAGS.SANDBOX_MODE, options.sandboxMode);
    }
  }

  if (options?.model) {
    args.push(CLI.FLAGS.MODEL, options.model);
  }

  if (options?.cd) {
    args.push(CLI.FLAGS.CD, options.cd);
  }

  args.push(CLI.FLAGS.SKIP_GIT_REPO_CHECK);

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
    const result = await executeCommandDetailed(
      CLI.COMMANDS.CODEX, 
      args, 
      {
        onProgress,
        timeoutMs: options?.timeoutMs,
        maxOutputBytes: options?.maxOutputBytes,
        retry: options?.retry
      }
    );
    
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
