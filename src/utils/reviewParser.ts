import { Logger } from './logger.js';

export interface ReviewFinding {
  title: string;
  body: string;
  confidence_score: number;
  priority?: number; // 0=P0, 1=P1, 2=P2, 3=P3
  code_location?: {
    absolute_file_path: string;
    line_range: {
      start: number;
      end: number;
    };
  };
}

export interface ReviewOutput {
  findings: ReviewFinding[];
  overall_correctness: 'patch is correct' | 'patch is incorrect';
  overall_explanation: string;
  overall_confidence_score: number;
}

/**
 * Parse review output from Codex response
 */
export function parseReviewOutput(response: string): ReviewOutput | null {
  try {
    // Try to extract JSON from the response
    // Look for JSON object pattern
    const jsonMatch = response.match(/\{[\s\S]*"findings"[\s\S]*\}/);
    if (!jsonMatch) {
      Logger.warn('No JSON review output found in response');
      return null;
    }

    const reviewData = JSON.parse(jsonMatch[0]) as ReviewOutput;

    // Validate structure
    if (!Array.isArray(reviewData.findings)) {
      Logger.warn('Invalid review output structure: missing findings array');
      return null;
    }

    return reviewData;
  } catch (error) {
    Logger.error('Failed to parse review output:', error);
    Logger.debug('Raw response:', response.substring(0, 500));
    return null;
  }
}

/**
 * Format review findings for display
 */
export function formatReviewFindings(review: ReviewOutput): string {
  const lines: string[] = [];

  // Overall verdict
  const verdict = review.overall_correctness === 'patch is correct' ? '✅' : '❌';
  lines.push(`## Review Result: ${verdict} ${review.overall_correctness.toUpperCase()}`);
  lines.push('');
  lines.push(`**Overall Assessment:** ${review.overall_explanation}`);
  lines.push(`**Confidence:** ${(review.overall_confidence_score * 100).toFixed(0)}%`);
  lines.push('');

  // Findings
  if (review.findings.length === 0) {
    lines.push('### No Issues Found');
    lines.push('The code changes look good with no issues detected.');
  } else {
    lines.push(`### Issues Found (${review.findings.length})`);
    lines.push('');

    // Sort findings by priority
    const sortedFindings = [...review.findings].sort((a, b) => {
      const priorityA = a.priority ?? 999;
      const priorityB = b.priority ?? 999;
      return priorityA - priorityB;
    });

    sortedFindings.forEach((finding, index) => {
      const priorityTag = getPriorityTag(finding.priority);
      const confidence = `(${(finding.confidence_score * 100).toFixed(0)}% confidence)`;

      lines.push(`#### ${index + 1}. ${priorityTag} ${finding.title} ${confidence}`);
      lines.push('');
      lines.push(finding.body);

      if (finding.code_location) {
        const location = `📍 \`${finding.code_location.absolute_file_path}:${finding.code_location.line_range.start}-${finding.code_location.line_range.end}\``;
        lines.push('');
        lines.push(location);
      }

      lines.push('');
    });
  }

  return lines.join('\n');
}

/**
 * Get priority tag for display
 */
function getPriorityTag(priority?: number): string {
  switch (priority) {
    case 0:
      return '[P0 🔴]'; // Blocking
    case 1:
      return '[P1 🟠]'; // Urgent
    case 2:
      return '[P2 🟡]'; // Normal
    case 3:
      return '[P3 🔵]'; // Low
    default:
      return '';
  }
}
