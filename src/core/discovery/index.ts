/**
 * Skill Discovery Module - Main entry point
 *
 * Provides skill discovery, insight extraction, and recommendation functionality
 */

export { PlatformFetcher, platformFetcher } from './fetcher';
export { SkillAnalyzer, skillAnalyzer } from './analyzer';
export { RecommendationEngine, recommendationEngine } from './recommender';
export { SkillsStore, skillsStore } from './skills-store';
export type { SkillInfo } from './skills-store';

// Re-export types
export * from '../../types/discovery';
