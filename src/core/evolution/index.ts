/**
 * Evolution Module - SA Agent-powered skill evolution
 */

export { SAAgentEvolutionEngine, saAgentEvolutionEngine, SAAgentRecommendation, EvolutionResult } from './engine';
export { buildEvolutionPrompt, buildSummaryPrompt, isChineseContent } from './prompts';
export { modelConfigLoader } from '../model-config-loader';