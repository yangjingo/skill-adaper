/**
 * Helpers for CLI evolve command to keep cli.ts focused on orchestration.
 */

import * as fs from 'fs';
import * as path from 'path';
import { EvolutionDatabase } from '../database';

export interface SkillLocation {
  content: string;
  dir: string;
  filePath: string;
  source: string;
}

export interface SkillStaticMetrics {
  sections: number;
  codeBlocks: number;
  links: number;
}

export function loadTrackedSkill(db: EvolutionDatabase, name: string): SkillLocation | null {
  let skillContent = '';
  let skillDir = '';
  let skillFilePath = '';
  let skillSource = '';

  const records = db.getRecords(name);
  if (records.length === 0) return null;

  const latestRecord = records[records.length - 1];
  if (!latestRecord.skillPath) return null;

  const skillPath = latestRecord.skillPath;
  if (!fs.existsSync(skillPath)) return null;

  const stat = fs.statSync(skillPath);
  if (stat.isFile()) {
    const ext = path.extname(skillPath).toLowerCase();
    if (ext !== '.md') return null;
    skillContent = fs.readFileSync(skillPath, 'utf-8');
    skillDir = path.dirname(skillPath);
    skillFilePath = skillPath;
  } else {
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    const skillMdAltPath = path.join(skillPath, 'skill.md');
    if (fs.existsSync(skillMdPath)) {
      skillContent = fs.readFileSync(skillMdPath, 'utf-8');
      skillDir = skillPath;
      skillFilePath = skillMdPath;
    } else if (fs.existsSync(skillMdAltPath)) {
      skillContent = fs.readFileSync(skillMdAltPath, 'utf-8');
      skillDir = skillPath;
      skillFilePath = skillMdAltPath;
    }
  }

  if (!skillContent) return null;
  skillSource = latestRecord.importSource || 'database';
  return { content: skillContent, dir: skillDir, filePath: skillFilePath, source: skillSource };
}

export function analyzeSkillStaticContent(skillContent: string): SkillStaticMetrics {
  return {
    sections: (skillContent.match(/^##\s/gm) || []).length,
    codeBlocks: Math.floor((skillContent.match(/```/g) || []).length / 2),
    links: (skillContent.match(/\[.*?\]\(.*?\)/g) || []).length,
  };
}

export function summarizeRecommendationPriorities(
  recommendations: Array<{ priority?: string }>
): { total: number; high: number; medium: number; low: number } {
  const summary = { total: recommendations.length, high: 0, medium: 0, low: 0 };
  for (const rec of recommendations) {
    if (rec.priority === 'high') summary.high++;
    else if (rec.priority === 'low') summary.low++;
    else summary.medium++;
  }
  return summary;
}

export function printEvolutionNextSteps(hasRecommendations: boolean): void {
  console.log('\n' + '═'.repeat(60));
  console.log('📌 Next Steps');
  console.log('═'.repeat(60) + '\n');

  if (hasRecommendations) {
    console.log('   sa evolve <skill> --apply    # Apply recommendations to skill');
    console.log('   sa evolve <skill> --verbose  # View detailed analysis');
  }
  console.log('   sa log <skill>               # View evolution history');
  console.log('   sa summary <skill>           # View evolution metrics');
  console.log('   sa export <skill>            # Export local skill package');
  console.log('');
}

export function printRecommendationSummaryTable(summary: {
  total: number;
  high: number;
  medium: number;
  low: number;
}): void {
  console.log('\n┌───────────────────────────────┬───────┐');
  console.log('│ Recommendation Summary        │ Count │');
  console.log('├───────────────────────────────┼───────┤');
  console.log(`│ High Priority                 │ ${String(summary.high).padStart(5)} │`);
  console.log(`│ Medium Priority               │ ${String(summary.medium).padStart(5)} │`);
  console.log(`│ Low Priority                  │ ${String(summary.low).padStart(5)} │`);
  console.log('├───────────────────────────────┼───────┤');
  console.log(`│ Total                         │ ${String(summary.total).padStart(5)} │`);
  console.log('└───────────────────────────────┴───────┘');
}

export interface EvolutionRuntimeStatus {
  configured: boolean;
  source?: string;
  model?: string;
  endpoint?: string;
  maskedApiKey?: string;
  aiReady: boolean;
}

export function printEvolutionRuntimeStatus(status: EvolutionRuntimeStatus, isVerbose: boolean): void {
  console.log('\n📋 SA Configuration');
  if (status.configured) {
    console.log(`   Provider: ${status.source || 'unknown'}`);
    console.log(`   Model: ${status.model || 'unknown'}`);
    console.log(`   Endpoint: ${status.endpoint || 'unknown'}`);
  } else {
    console.log('   Provider: Not configured');
    console.log('   Model: Not configured');
    console.log('   Endpoint: Not configured');
  }
  if (isVerbose) {
    console.log(`   API Key: ${status.maskedApiKey || '⚠️ Not set'}`);
  }
  console.log(`   Connection: ${status.aiReady ? '✅ AI engine ready' : '⚠️ Rule-based fallback'}`);
}
