import { z } from 'zod';
import { UnifiedTool } from './registry.js';
import { Logger } from '../utils/logger.js';
import { executeCodexCLI } from '../utils/codexExecutor.js';

function buildBrainstormPrompt(config: {
  prompt: string;
  methodology: string;
  domain?: string;
  constraints?: string;
  existingContext?: string;
  ideaCount: number;
  includeAnalysis: boolean;
}): string {
  const { prompt, methodology, domain, constraints, existingContext, ideaCount, includeAnalysis } = config;
  
  // Select methodology framework
  let frameworkInstructions = getMethodologyInstructions(methodology, domain);
  
  let enhancedPrompt = `# BRAINSTORMING SESSION

## Challenge: ${prompt}

## Framework
${frameworkInstructions}

## Context
${domain ? `Domain: ${domain}` : ''}
${constraints ? `Constraints: ${constraints}` : ''}
${existingContext ? `Background: ${existingContext}` : ''}

## Requirements
Generate ${ideaCount} actionable ideas. Keep descriptions concise (2-3 sentences max).

${includeAnalysis ? `## Analysis
Rate each: Feasibility (1-5), Impact (1-5), Innovation (1-5)` : ''}

## Format
### Idea [N]: [Name]
Description: [2-3 sentences]
${includeAnalysis ? 'Ratings: F:[1-5] I:[1-5] N:[1-5]' : ''}

Begin:`;

  return enhancedPrompt;
}

/**
 * Returns methodology-specific instructions for structured brainstorming
 */
function getMethodologyInstructions(methodology: string, domain?: string): string {
  const methodologies: Record<string, string> = {
    'divergent': `**Divergent Thinking Approach:**
- Generate maximum quantity of ideas without self-censoring
- Build on wild or seemingly impractical ideas
- Combine unrelated concepts for unexpected solutions
- Use "Yes, and..." thinking to expand each concept
- Postpone evaluation until all ideas are generated`,

    'convergent': `**Convergent Thinking Approach:**
- Focus on refining and improving existing concepts
- Synthesize related ideas into stronger solutions
- Apply critical evaluation criteria
- Prioritize based on feasibility and impact
- Develop implementation pathways for top ideas`,

    'scamper': `**SCAMPER Creative Triggers:**
- **Substitute:** What can be substituted or replaced?
- **Combine:** What can be combined or merged?
- **Adapt:** What can be adapted from other domains?
- **Modify:** What can be magnified, minimized, or altered?
- **Put to other use:** How else can this be used?
- **Eliminate:** What can be removed or simplified?
- **Reverse:** What can be rearranged or reversed?`,

    'design-thinking': `**Human-Centered Design Thinking:**
- **Empathize:** Consider user needs, pain points, and contexts
- **Define:** Frame problems from user perspective
- **Ideate:** Generate user-focused solutions
- **Consider Journey:** Think through complete user experience
- **Prototype Mindset:** Focus on testable, iterative concepts`,

    'lateral': `**Lateral Thinking Approach:**
- Make unexpected connections between unrelated fields
- Challenge fundamental assumptions
- Use random word association to trigger new directions
- Apply metaphors and analogies from other domains
- Reverse conventional thinking patterns`,

    'auto': `**AI-Optimized Approach:**
${domain ? `Given the ${domain} domain, I'll apply the most effective combination of:` : 'I\'ll intelligently combine multiple methodologies:'}
- Divergent exploration with domain-specific knowledge
- SCAMPER triggers and lateral thinking
- Human-centered perspective for practical value`
  };

  return methodologies[methodology] || methodologies['auto'];
}

const brainstormArgsSchema = z.object({
  prompt: z.string().min(1).describe("Primary brainstorming challenge or question to explore"),
  model: z.string().optional().describe("AI model: 'gpt-5' (400K context, best for complex ideation), 'o3' (200K, deep creative reasoning), 'o4-mini' (200K, quick brainstorming). Default: gpt-5"),
  approvalPolicy: z.enum(['never','on-request','on-failure','untrusted']).optional().describe("When to ask for approval: 'never' (fastest), 'on-request' (model decides), 'on-failure' (on errors), 'untrusted' (always ask)."),
  sandboxMode: z.enum(['read-only','workspace-write','danger-full-access']).optional().describe("File system access: 'read-only' (safest), 'workspace-write' (can modify project files), 'danger-full-access' (unrestricted - use with caution!)."),
  fullAuto: z.boolean().optional().describe("Full automation: workspace-write sandbox + on-failure approval. Safe for trusted operations."),
  yolo: z.boolean().optional().describe("DANGEROUS: Bypass ALL safety measures. No sandbox, no approvals. Use only in isolated environments!"),
  cd: z.string().optional().describe("Working directory for Codex (--cd)."),
  methodology: z.enum(['divergent', 'convergent', 'scamper', 'design-thinking', 'lateral', 'auto']).default('auto').describe("Brainstorming framework: 'divergent' (generate many ideas), 'convergent' (refine existing), 'scamper' (systematic triggers), 'design-thinking' (human-centered), 'lateral' (unexpected connections), 'auto' (AI selects best)"),
  domain: z.string().optional().describe("Domain context for specialized brainstorming (e.g., 'software', 'business', 'creative', 'research', 'product', 'marketing')"),
  constraints: z.string().optional().describe("Known limitations, requirements, or boundaries (budget, time, technical, legal, etc.)"),
  existingContext: z.string().optional().describe("Background information, previous attempts, or current state to build upon"),
  ideaCount: z.number().int().positive().default(12).describe("Number of ideas to generate. More ideas = broader exploration. Default: 12, recommended: 5-30"),
  includeAnalysis: z.boolean().default(true).describe("Include feasibility, impact, and implementation analysis for generated ideas"),
});

export const brainstormTool: UnifiedTool = {
  name: "brainstorm",
  description: "Generate novel ideas with dynamic context gathering. --> Creative frameworks (SCAMPER, Design Thinking, etc.), domain context integration, idea clustering, feasibility analysis, and iterative refinement.",
  zodSchema: brainstormArgsSchema,
  prompt: {
    description: "Generate structured brainstorming prompt with methodology-driven ideation, domain context integration, and analytical evaluation framework",
  },
  category: 'utility',
  execute: async (args, onProgress) => {
    const {
      prompt,
      model,
      approvalPolicy,
      sandboxMode,
      fullAuto,
      yolo,
      cd,
      methodology = 'auto',
      domain,
      constraints,
      existingContext,
      ideaCount = 12,
      includeAnalysis = true
    } = args;

    if (!prompt?.trim()) {
      throw new Error("You must provide a valid brainstorming challenge or question to explore");
    }

    let enhancedPrompt = buildBrainstormPrompt({
      prompt: prompt.trim() as string,
      methodology: methodology as string,
      domain: domain as string | undefined,
      constraints: constraints as string | undefined,
      existingContext: existingContext as string | undefined,
      ideaCount: ideaCount as number,
      includeAnalysis: includeAnalysis as boolean
    });

    Logger.debug(`Brainstorm: Using methodology '${methodology}' for domain '${domain || 'general'}'`);
    
    // Report progress to user
    onProgress?.(`Generating ${ideaCount} ideas via ${methodology} methodology...`);
    
    // Execute with Codex (non-interactive)
    return await executeCodexCLI(
      enhancedPrompt,
      {
        model: model as string | undefined,
        fullAuto: Boolean(fullAuto),
        approvalPolicy: approvalPolicy as any,
        sandboxMode: sandboxMode as any,
        yolo: Boolean(yolo),
        cd: cd as string | undefined,
      },
      onProgress
    );
  }
};
