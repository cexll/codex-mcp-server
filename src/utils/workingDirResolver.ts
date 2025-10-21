import { existsSync, statSync } from 'fs';
import { dirname, resolve, isAbsolute } from 'path';
import { Logger } from './logger.js';

/**
 * Project marker files that indicate the root of a project directory
 */
const PROJECT_MARKERS = [
  'package.json', // Node.js/JavaScript
  '.git', // Git repository
  'pyproject.toml', // Python
  'Cargo.toml', // Rust
  'go.mod', // Go
  'pom.xml', // Java (Maven)
  'build.gradle', // Java (Gradle)
  'composer.json', // PHP
] as const;

/**
 * Maximum levels to walk up the directory tree when searching for project root
 */
const MAX_WALK_UP_LEVELS = 10;

/**
 * Find the project root directory by walking up the directory tree
 * looking for common project marker files.
 *
 * @param startPath - The directory or file path to start searching from
 * @returns The project root directory, or the starting directory if no markers found
 */
export function findProjectRoot(startPath: string): string {
  try {
    // Ensure we start from a directory, not a file
    let currentDir = ensureDirectory(startPath);
    if (!currentDir) {
      Logger.debug(`findProjectRoot: Invalid start path: ${startPath}`);
      return startPath;
    }

    // Walk up the directory tree looking for project markers
    let levelsWalked = 0;
    while (levelsWalked < MAX_WALK_UP_LEVELS) {
      Logger.debug(`Checking for project markers in: ${currentDir}`);

      // Check if any project marker exists in current directory
      for (const marker of PROJECT_MARKERS) {
        const markerPath = resolve(currentDir, marker);
        if (existsSync(markerPath)) {
          Logger.debug(`Found project root at: ${currentDir} (marker: ${marker})`);
          return currentDir;
        }
      }

      // Move up one directory
      const parentDir = dirname(currentDir);

      // Stop if we've reached the root directory
      if (parentDir === currentDir) {
        Logger.debug(`Reached filesystem root, using: ${currentDir}`);
        break;
      }

      currentDir = parentDir;
      levelsWalked++;
    }

    // If no markers found, return the starting directory
    Logger.debug(`No project markers found, using start directory: ${currentDir}`);
    return ensureDirectory(startPath) || startPath;
  } catch (error) {
    Logger.debug(`Error in findProjectRoot: ${error}`);
    return startPath;
  }
}

/**
 * Ensures that the provided path points to a directory.
 * If the path is a file, returns its parent directory.
 * If the path doesn't exist or is invalid, returns undefined.
 *
 * @param path - The file or directory path
 * @returns The directory path, or undefined if invalid
 */
export function ensureDirectory(path?: string): string | undefined {
  if (!path) {
    return undefined;
  }

  try {
    // Check if path exists
    if (!existsSync(path)) {
      Logger.debug(`Path does not exist: ${path}`);
      return undefined;
    }

    // Get file stats
    const stats = statSync(path);

    // If it's a directory, return as-is
    if (stats.isDirectory()) {
      return path;
    }

    // If it's a file, return its parent directory
    if (stats.isFile()) {
      const parentDir = dirname(path);
      Logger.debug(`Path is a file, using parent directory: ${parentDir}`);
      return parentDir;
    }

    // If it's neither file nor directory (symlink, etc.), try to resolve
    Logger.debug(`Path is neither file nor directory: ${path}`);
    return undefined;
  } catch (error) {
    Logger.debug(`Error in ensureDirectory: ${error}`);
    return undefined;
  }
}

/**
 * Extract absolute file paths from @path syntax in the prompt.
 * Supports both quoted and unquoted paths.
 *
 * Examples:
 * - @/absolute/path/to/file.ts
 * - @"/path with spaces/file.ts"
 * - @'/path with spaces/file.ts'
 *
 * @param prompt - The user prompt that may contain @path references
 * @returns Array of absolute paths found in the prompt
 */
export function extractPathFromAtSyntax(prompt: string): string[] {
  const paths: string[] = [];

  // Pattern 1: Quoted paths with @ prefix: @"path" or @'path'
  const quotedPathRegex = /@["']([^"']+)["']/g;
  let match;

  while ((match = quotedPathRegex.exec(prompt)) !== null) {
    const path = match[1];
    if (isAbsolute(path)) {
      paths.push(path);
    }
  }

  // Pattern 2: Unquoted paths with @ prefix: @/path (no spaces)
  const unquotedPathRegex = /@(\/[^\s"']+)/g;

  while ((match = unquotedPathRegex.exec(prompt)) !== null) {
    const path = match[1];
    if (isAbsolute(path)) {
      paths.push(path);
    }
  }

  Logger.debug(`Extracted ${paths.length} paths from @syntax: ${paths.join(', ')}`);
  return paths;
}

/**
 * Resolve the working directory using a fallback chain with multiple strategies.
 *
 * Priority order (highest to lowest):
 * 1. Explicit workingDir parameter
 * 2. Environment variables: CODEX_MCP_CWD > PWD > INIT_CWD
 * 3. Automatic inference from @path syntax in prompt
 * 4. process.cwd() as last resort
 *
 * @param options - Resolution options
 * @returns The resolved working directory path
 */
export function resolveWorkingDirectory(options?: {
  workingDir?: string;
  prompt?: string;
}): string | undefined {
  const { workingDir, prompt } = options || {};

  // Priority 1: Explicit workingDir parameter
  if (workingDir) {
    const validDir = ensureDirectory(workingDir);
    if (validDir) {
      Logger.debug(`Using explicit working directory: ${validDir}`);
      return validDir;
    } else {
      Logger.warn(`Explicit workingDir is invalid: ${workingDir}`);
    }
  }

  // Priority 2: Environment variables
  const envVars = ['CODEX_MCP_CWD', 'PWD', 'INIT_CWD'] as const;
  for (const envVar of envVars) {
    const envValue = process.env[envVar];
    if (envValue) {
      const validDir = ensureDirectory(envValue);
      if (validDir) {
        Logger.debug(`Using environment variable ${envVar}: ${validDir}`);
        return validDir;
      } else {
        Logger.debug(`Environment variable ${envVar} is invalid: ${envValue}`);
      }
    }
  }

  // Priority 3: Automatic inference from @path syntax
  if (prompt) {
    const paths = extractPathFromAtSyntax(prompt);

    for (const path of paths) {
      if (existsSync(path)) {
        // Find the project root for this path
        const projectRoot = findProjectRoot(path);
        if (projectRoot) {
          Logger.debug(`Inferred working directory from @path syntax: ${projectRoot}`);
          return projectRoot;
        }
      }
    }
  }

  // Priority 4: process.cwd() as fallback
  const cwd = process.cwd();
  Logger.debug(`Using process.cwd() as working directory: ${cwd}`);
  return cwd;
}
