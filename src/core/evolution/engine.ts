/**
 * SA Agent Evolution Engine - SA Agent-powered skill evolution
 */

import Anthropic from '@anthropic-ai/sdk';
import { modelConfigLoader } from '../model-config-loader';
import { buildEvolutionPrompt, buildSummaryPrompt } from './prompts';

/**
 * SA Agent-generated recommendation
 */
export interface SAAgentRecommendation {
  type: 'env_adaptation' | 'style_injection' | 'error_avoidance' | 'best_practice';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestedContent: string;
  confidence: number;
}

/**
 * SA Agent response structure
 */
interface SAAgentResponse {
  recommendations: SAAgentRecommendation[];
}

/**
 * Evolution result
 */
export interface EvolutionResult {
  skillName: string;
  oldVersion: string;
  newVersion: string;
  recommendations: SAAgentRecommendation[];
  appliedRecommendations: SAAgentRecommendation[];
  skippedRecommendations: SAAgentRecommendation[];
  summary: string;
}

/**
 * Stream callback for real-time output
 */
export interface StreamCallbacks {
  onThinking?: (text: string) => void;
  onContent?: (text: string) => void;
  onComplete?: () => void;
}

/**
 * SA Agent Evolution Engine
 */
export class SAAgentEvolutionEngine {
  private client: Anthropic | null = null;
  private modelId: string = 'claude-sonnet-4-6';

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const result = modelConfigLoader.load();
    if (result.success && result.config) {
      this.client = new Anthropic({
        apiKey: result.config.apiKey,
        baseURL: result.config.baseUrl,
      });
      this.modelId = result.config.modelId;
    }
  }

  /**
   * Check if SA Agent is available
   */
  isAvailable(): boolean {
    return this.client !== null;
  }

  /**
   * Get model info
   */
  getModelInfo(): { modelId: string; available: boolean } {
    return {
      modelId: this.modelId,
      available: this.client !== null,
    };
  }

  /**
   * Generate evolution recommendations using SA Agent with streaming
   */
  async generateRecommendations(
    context: {
      skillName: string;
      skillContent: string;
      soulPreferences?: { communicationStyle?: string; boundaries?: string[] };
      memoryRules?: Array<{ category: string; rule: string }>;
      workspaceInfo?: { languages?: string[]; frameworks?: string[]; packageManager?: string };
    },
    callbacks?: StreamCallbacks
  ): Promise<SAAgentRecommendation[]> {
    if (!this.client) {
      throw new Error('SA Agent model not configured. Run `sa config` to set up model.');
    }

    const prompt = buildEvolutionPrompt(context);

    try {
      // Use streaming API for real-time output
      const stream = this.client.messages.stream({
        model: this.modelId,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      });

      let fullText = '';
      let thinkingText = '';

      // Process stream events using async iteration
      for await (const event of await stream) {
        if (event.type === 'content_block_delta') {
          const delta = event.delta as any;
          if (delta.type === 'thinking_delta' && delta.thinking) {
            thinkingText += delta.thinking;
            callbacks?.onThinking?.(delta.thinking);
          } else if (delta.type === 'text_delta' && delta.text) {
            fullText += delta.text;
            callbacks?.onContent?.(delta.text);
          }
        }
      }

      callbacks?.onComplete?.();

      // Debug: log fullText if parsing might fail
      const recommendations = this.parseRecommendations(fullText);
      if (recommendations.length === 0 && fullText) {
        console.log('[DEBUG] fullText length:', fullText.length);
        console.log('[DEBUG] fullText preview:', fullText.slice(0, 300));
      }

      return recommendations;
    } catch (error: any) {
      throw new Error(`SA Agent request failed: ${error.message}`);
    }
  }

  /**
   * Generate evolution recommendations (non-streaming, for compatibility)
   */
  async generateRecommendationsSync(context: {
    skillName: string;
    skillContent: string;
    soulPreferences?: { communicationStyle?: string; boundaries?: string[] };
    memoryRules?: Array<{ category: string; rule: string }>;
    workspaceInfo?: { languages?: string[]; frameworks?: string[]; packageManager?: string };
  }): Promise<SAAgentRecommendation[]> {
    if (!this.client) {
      throw new Error('SA Agent model not configured.');
    }

    const prompt = buildEvolutionPrompt(context);
    const response = await this.client.messages.create({
      model: this.modelId,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const textBlock = response.content.find(block => block.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '';
    return this.parseRecommendations(text);
  }

  /**
   * Parse SA Agent response to recommendations
   */
  private parseRecommendations(text: string): SAAgentRecommendation[] {
    // Extract JSON from response
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]) as SAAgentResponse;
        return parsed.recommendations || [];
      } catch {}
    }

    // Try direct JSON parse
    try {
      const parsed = JSON.parse(text) as SAAgentResponse;
      return parsed.recommendations || [];
    } catch {
      const objectMatch = text.match(/\{[\s\S]*"recommendations"[\s\S]*\}/);
      if (objectMatch) {
        try {
          const parsed = JSON.parse(objectMatch[0]) as SAAgentResponse;
          return parsed.recommendations || [];
        } catch {}
      }
      return [];
    }
  }

  /**
   * Generate evolution summary using SA Agent
   */
  async generateSummary(context: {
    skillName: string;
    oldVersion: string;
    newVersion: string;
    appliedChanges: Array<{ title: string; description: string }>;
  }): Promise<string> {
    if (!this.client) {
      return `${context.skillName} evolved from ${context.oldVersion} to ${context.newVersion}`;
    }

    const prompt = buildSummaryPrompt(context);

    try {
      const response = await this.client.messages.create({
        model: this.modelId,
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      });

      const textBlock = response.content.find(block => block.type === 'text');
      return textBlock && 'text' in textBlock ? textBlock.text.trim() : '';
    } catch {
      return `${context.skillName} evolved from ${context.oldVersion} to ${context.newVersion}`;
    }
  }

  /**
   * Get quick suggestion for a skill (one-line hint)
   * Used before full evolution to show user what could be improved
   */
  async getQuickSuggestion(skillContent: string): Promise<string> {
    if (!this.client) {
      return 'Consider adding more examples and error handling';
    }

    const prompt = `Analyze this skill content briefly. Give ONE concise suggestion (max 60 chars) for improvement.

Skill content (first 2000 chars):
${skillContent.slice(0, 2000)}

Reply format: Just the suggestion, no explanation. Example: "Add error handling examples" or "Include TypeScript types"`;

    try {
      const response = await this.client.messages.create({
        model: this.modelId,
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }],
      });

      const textBlock = response.content.find(block => block.type === 'text');
      if (textBlock && 'text' in textBlock) {
        return textBlock.text.trim().slice(0, 80);
      }
      return 'Consider adding more examples';
    } catch {
      return 'Consider adding more examples';
    }
  }
}

// Singleton
export const saAgentEvolutionEngine = new SAAgentEvolutionEngine();