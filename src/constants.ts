

// Logging
export const LOG_PREFIX = "[CODEX-MCP]";

// Error messages
export const ERROR_MESSAGES = {
  TOOL_NOT_FOUND: "not found in registry",
  NO_PROMPT_PROVIDED: "Please provide a prompt for analysis. Use @ syntax to include files (e.g., '@largefile.js explain what this does') or ask general questions",
} as const;

// Status messages
export const STATUS_MESSAGES = {
  SANDBOX_EXECUTING: "🔒 Executing CLI command in sandbox/auto mode...",
  CODEX_RESPONSE: "Codex response:",
  // Timeout prevention messages
  PROCESSING_START: "🔍 Starting analysis (may take 5-15 minutes for large codebases)",
  PROCESSING_CONTINUE: "⏳ Still processing...",
  PROCESSING_COMPLETE: "✅ Analysis completed successfully",
} as const;

// Models: pass-through via Codex CLI

// MCP Protocol Constants
export const PROTOCOL = {
  // Message roles
  ROLES: {
    USER: "user",
    ASSISTANT: "assistant",
  },
  // Content types
  CONTENT_TYPES: {
    TEXT: "text",
  },
  // Status codes
  STATUS: {
    SUCCESS: "success",
    ERROR: "error",
    FAILED: "failed",
    REPORT: "report",
  },
  // Notification methods
  NOTIFICATIONS: {
    PROGRESS: "notifications/progress",
  },
  // Timeout prevention
  KEEPALIVE_INTERVAL: 25000, // 25 seconds
} as const;


// CLI Constants
export const CLI = {
  // Command names
  COMMANDS: {
    CODEX: "codex",
    ECHO: "echo",
  },
  // Command flags
  FLAGS: {
    MODEL: "-m",
    SANDBOX: "-s", // legacy flag. For Codex prefer FULL_AUTO or SANDBOX/APPROVAL flags.
    FULL_AUTO: "--full-auto",
    ASK_FOR_APPROVAL: "--ask-for-approval",
    SANDBOX_MODE: "--sandbox",
    YOLO: "--dangerously-bypass-approvals-and-sandbox",
    CD: "--cd",
    SKIP_GIT_REPO_CHECK: "--skip-git-repo-check",
    PROMPT: "-p",
    HELP: "-help",
  },
  // Default values
  DEFAULTS: {
    MODEL: "default", // Fallback model used when no specific model is provided
    BOOLEAN_TRUE: "true",
    BOOLEAN_FALSE: "false",
  },
} as const;


// (merged PromptArguments and ToolArguments)
export interface ToolArguments {
  prompt?: string;
  model?: string;
  sandbox?: boolean | string;
  // Codex approvals/sandbox controls
  approvalPolicy?: 'never' | 'on-request' | 'on-failure' | 'untrusted';
  sandboxMode?: 'read-only' | 'workspace-write' | 'danger-full-access';
  fullAuto?: boolean | string; // convenience alias for --full-auto
  yolo?: boolean | string; // --dangerously-bypass-approvals-and-sandbox
  cd?: string; // --cd path
  changeMode?: boolean | string;
  chunkIndex?: number | string; // Which chunk to return (1-based)
  chunkCacheKey?: string; // Optional cache key for continuation
  message?: string; // For Ping tool -- Un-used.
  
  // --> new tool
  methodology?: string; // Brainstorming framework to use
  domain?: string; // Domain context for specialized brainstorming
  constraints?: string; // Known limitations or requirements
  existingContext?: string; // Background information to build upon
  ideaCount?: number; // Target number of ideas to generate
  includeAnalysis?: boolean; // Include feasibility and impact analysis
  
  [key: string]: string | boolean | number | undefined; // Allow additional properties
}
