import { Logger } from './logger.js';
import { parseChangeModeOutput, validateChangeModeEdits, ChangeModeEdit } from './changeModeParser.js';
import { formatChangeModeResponse, summarizeChangeModeEdits } from './changeModeTranslator.js';
import { chunkChangeModeEdits, EditChunk } from './changeModeChunker.js';
import { cacheChunks, getChunks } from './chunkCache.js';

export interface ProcessChangeModeOptions {
  chunkIndex?: number;
  cacheKey?: string;
  prompt?: string;
  autoRepair?: boolean; // Attempt to fix validation errors
}

/**
 * Process change mode output with enhanced validation and error recovery
 */
export async function processChangeModeOutput(
  rawResult: string,
  options: ProcessChangeModeOptions = {}
): Promise<string> {
  const { chunkIndex, cacheKey: chunkCacheKey, prompt, autoRepair = true } = options;
  
  // Validate chunk index
  if (chunkIndex !== undefined) {
    if (!Number.isInteger(chunkIndex) || chunkIndex < 1) {
      return `Invalid chunk index: ${chunkIndex}. Must be a positive integer starting from 1.`;
    }
    
    if (chunkIndex > 1 && !chunkCacheKey) {
      return `Chunk index ${chunkIndex} requested but no cache key provided. ` +
             `Please use the cache key from the initial response or start with chunk 1.`;
    }
  }
  // Check for cached chunks first
  if (chunkIndex && chunkCacheKey) {
    try {
      const cachedChunks = getChunks(chunkCacheKey);
      if (!cachedChunks || cachedChunks.length === 0) {
        return `Cache key '${chunkCacheKey}' not found or expired. Please regenerate the response.`;
      }
      
      if (chunkIndex > cachedChunks.length) {
        return `Chunk index ${chunkIndex} out of range. Available chunks: 1-${cachedChunks.length}`;
      }
      
      Logger.debug(`Using cached chunk ${chunkIndex} of ${cachedChunks.length}`);
      const chunk = cachedChunks[chunkIndex - 1];
      let result = formatChangeModeResponse(
        chunk.edits,
        { current: chunkIndex, total: cachedChunks.length, cacheKey: chunkCacheKey }
      );

      // Add summary for first chunk only
      if (chunkIndex === 1 && chunk.edits.length > 5) {
        const allEdits = cachedChunks.flatMap((c: EditChunk) => c.edits);
        result = summarizeChangeModeEdits(allEdits) + '\n\n' + result;
      }

      return result;
    } catch (error) {
      Logger.error('Error retrieving cached chunks:', error);
      return `Failed to retrieve cached chunks: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }

  // Normalize line endings before parsing
  const normalizedResult = rawResult.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  let edits: ChangeModeEdit[];
  try {
    edits = parseChangeModeOutput(normalizedResult);
  } catch (error) {
    Logger.error('Failed to parse change mode output:', error);
    const snippet = normalizedResult.substring(0, 500);
    return `Failed to parse change mode output: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
           `First 500 chars of output:\n${snippet}...`;
  }

  if (edits.length === 0) {
    // Log first part of raw result for debugging (without exposing full content)
    Logger.debug(`No edits found. First 200 chars: ${normalizedResult.substring(0, 200)}`);
    return `No edits found in response. Ensure the OLD/NEW format is used.\n\n+ ${normalizedResult}`;
  }

  // Validate edits with auto-repair
  let validation = validateChangeModeEdits(edits);
  if (!validation.valid && autoRepair) {
    Logger.debug('Attempting to auto-repair validation errors');
    
    // Try to fix common issues
    edits = edits.map(edit => {
      // Fix missing end lines by inferring from code
      if (edit.oldEndLine === 0 || edit.oldEndLine < edit.oldStartLine) {
        const oldLines = edit.oldCode.split('\n').length;
        edit.oldEndLine = edit.oldStartLine + oldLines - 1;
      }
      if (edit.newEndLine === 0 || edit.newEndLine < edit.newStartLine) {
        const newLines = edit.newCode.split('\n').length;
        edit.newEndLine = edit.newStartLine + newLines - 1;
      }
      return edit;
    });
    
    // Re-validate after repair
    validation = validateChangeModeEdits(edits);
  }
  
  if (!validation.valid) {
    return `Edit validation failed after auto-repair attempt:\n${validation.errors.join('\n')}\n\n` +
           `To debug, request the raw output or check the change mode format.`;
  }

  let chunks: EditChunk[];
  try {
    chunks = chunkChangeModeEdits(edits);
  } catch (error) {
    Logger.error('Failed to chunk edits:', error);
    // Fall back to single chunk
    chunks = [{
      edits,
      chunkIndex: 1,
      totalChunks: 1,
      hasMore: false,
      estimatedChars: JSON.stringify(edits).length
    }];
  }

  // Cache if multiple chunks and we have the original prompt
  let cacheKey: string | undefined;
  if (chunks.length > 1 && prompt) {
    try {
      cacheKey = cacheChunks(prompt, chunks);
      Logger.debug(`Cached ${chunks.length} chunks with key: ${cacheKey}`);
    } catch (error) {
      Logger.warn('Failed to cache chunks:', error);
      // Continue without caching
    }
  }

  // Return requested chunk or first chunk
  const requestedIndex = chunkIndex || 1;
  const returnChunkIndex = Math.min(Math.max(1, requestedIndex), chunks.length);
  const returnChunk = chunks[returnChunkIndex - 1];

  // Format the response
  let result = formatChangeModeResponse(
    returnChunk.edits,
    chunks.length > 1 ? { current: returnChunkIndex, total: chunks.length, cacheKey } : undefined
  );

  // Add summary if helpful (only for first chunk)
  if (returnChunkIndex === 1 && edits.length > 5) {
    result = summarizeChangeModeEdits(edits, chunks.length > 1) + '\n\n' + result;
  }

  Logger.debug(`ChangeMode: Parsed ${edits.length} edits, ${chunks.length} chunks, returning chunk ${returnChunkIndex}`);
  return result;
}

