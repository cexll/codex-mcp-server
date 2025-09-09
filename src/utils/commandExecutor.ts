import { spawn } from "child_process";
import { Logger } from "./logger.js";

export interface CommandResult {
  ok: boolean;
  code: number | null;
  signal?: NodeJS.Signals;
  stdout: string;
  stderr: string;
  timedOut: boolean;
  partialStdout?: string;
}

export interface RetryOptions {
  attempts: number;
  backoffMs: number;
  retryOn: ('timeout' | 'exit_nonzero' | 'spawn_error')[];
}

export interface ExecuteOptions {
  onProgress?: (newOutput: string) => void;
  timeoutMs?: number;
  maxOutputBytes?: number;
  retry?: RetryOptions;
}

/**
 * Execute a command with streaming output and structured error handling
 */
export async function executeCommandDetailed(
  command: string,
  args: string[],
  options: ExecuteOptions = {}
): Promise<CommandResult> {
  const { 
    onProgress, 
    timeoutMs = 600000,
    maxOutputBytes = 50 * 1024 * 1024, // 50MB default
    retry
  } = options;

  let attempt = 0;
  const maxAttempts = retry?.attempts || 1;

  while (attempt < maxAttempts) {
    attempt++;
    const result = await executeOnce(command, args, { onProgress, timeoutMs, maxOutputBytes });
    
    if (result.ok) {
      return result;
    }

    const shouldRetry = retry && (
      (result.timedOut && retry.retryOn.includes('timeout')) ||
      (result.code !== 0 && result.code !== null && retry.retryOn.includes('exit_nonzero')) ||
      (result.code === null && !result.signal && retry.retryOn.includes('spawn_error'))
    );

    if (!shouldRetry || attempt >= maxAttempts) {
      return result;
    }

    // Exponential backoff
    const delay = retry.backoffMs * Math.pow(2, attempt - 1);
    Logger.warn(`Retrying command after ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  // This should never be reached
  throw new Error('Unexpected retry loop exit');
}

async function executeOnce(
  command: string,
  args: string[],
  { onProgress, timeoutMs, maxOutputBytes }: Omit<ExecuteOptions, 'retry'>
): Promise<CommandResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    Logger.commandExecution(command, args, startTime);

    const childProcess = spawn(command, args, {
      env: process.env,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const stdoutChunks: Buffer[] = [];
    const stderrChunks: Buffer[] = [];
    let totalStdoutBytes = 0;
    let isResolved = false;
    let outputExceeded = false;
    
    // Set up timeout with SIGKILL fallback
    const timeoutId = setTimeout(() => {
      if (!isResolved) {
        childProcess.kill('SIGTERM');
        Logger.warn(`Process timeout after ${timeoutMs}ms, sending SIGTERM`);
        
        // Give process 5 seconds to terminate gracefully
        setTimeout(() => {
          if (!isResolved) {
            childProcess.kill('SIGKILL');
            Logger.error(`Process did not terminate, sending SIGKILL`);
          }
        }, 5000);
      }
    }, timeoutMs || 600000);
    
    childProcess.stdout.on("data", (data: Buffer) => {
      // Check output size limit
      if (maxOutputBytes && totalStdoutBytes + data.length > maxOutputBytes) {
        if (!outputExceeded) {
          outputExceeded = true;
          Logger.warn(`Output exceeded ${maxOutputBytes} bytes, stopping collection`);
          childProcess.kill('SIGTERM');
        }
        return;
      }

      stdoutChunks.push(data);
      totalStdoutBytes += data.length;
      
      // Stream progress without buffering
      if (onProgress) {
        onProgress(data.toString('utf8'));
      }
    });


    // Capture stderr for error reporting
    childProcess.stderr.on("data", (data: Buffer) => {
      stderrChunks.push(data);
    });
    childProcess.on("error", (error) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        Logger.error(`Process error:`, error);
        
        // Check for common errors
        const errorMessage = error.message;
        if ((error as any).code === 'ENOENT') {
          resolve({
            ok: false,
            code: null,
            stdout: '',
            stderr: `Command '${command}' not found. Is it installed and in PATH?`,
            timedOut: false
          });
        } else {
          resolve({
            ok: false,
            code: null,
            stdout: Buffer.concat(stdoutChunks).toString('utf8'),
            stderr: errorMessage,
            timedOut: false
          });
        }
      }
    });
    childProcess.on("close", (code, signal) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        
        const stdout = Buffer.concat(stdoutChunks).toString('utf8');
        const stderr = Buffer.concat(stderrChunks).toString('utf8');
        const timedOut = signal === 'SIGTERM' || signal === 'SIGKILL';
        
        Logger.commandComplete(startTime, code, stdout.length);
        
        resolve({
          ok: code === 0 && !outputExceeded,
          code,
          signal: signal || undefined,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          timedOut,
          partialStdout: outputExceeded ? stdout : undefined
        });
      }
    });
  });
}

/**
 * Backward compatible wrapper that returns stdout string
 */
export async function executeCommand(
  command: string,
  args: string[],
  onProgress?: (newOutput: string) => void,
  timeoutMs: number = 600000
): Promise<string> {
  const result = await executeCommandDetailed(command, args, { onProgress, timeoutMs });
  
  if (!result.ok) {
    const errorMessage = result.stderr || 'Unknown error';
    throw new Error(
      result.timedOut 
        ? `Command timed out after ${timeoutMs}ms`
        : `Command failed with exit code ${result.code}: ${errorMessage}`
    );
  }
  
  return result.stdout;
}
