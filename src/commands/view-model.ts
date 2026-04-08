import type { CommandResult } from '../types/ui';
import type { EvolutionRecord } from '../core/database';
import { renderEvolutionSummary } from '../core/summary';

export interface InitCommandViewInput {
  saved: boolean;
  configPath: string;
  config: {
    skillsRepo: string;
    registryUrl: string;
    defaultPlatform: string;
  };
  model: {
    configured: boolean;
    source?: string;
    model?: string;
    endpoint?: string;
    apiKeyMasked?: string;
  };
}

function formatConfigDetails(input: InitCommandViewInput): string {
  const lines: string[] = [
    `Skills Repo: ${input.config.skillsRepo}`,
    `Registry: ${input.config.registryUrl}`,
    `Platform: ${input.config.defaultPlatform}`,
    `Config File: ${input.configPath}`,
    '',
    'AI Model:',
  ];

  if (input.model.configured) {
    lines.push(`  Status: ✅ Configured`);
    if (input.model.source) lines.push(`  Provider: ${input.model.source}`);
    if (input.model.model) lines.push(`  Model: ${input.model.model}`);
    if (input.model.endpoint) lines.push(`  Endpoint: ${input.model.endpoint}`);
    lines.push(`  API Key: ${input.model.apiKeyMasked || '****'}`);
  } else {
    lines.push('  Status: ⚠️  Not configured');
    lines.push('  Run `sa init` to see setup guide.');
  }

  return lines.join('\n');
}

export function buildInitCommandView(input: InitCommandViewInput): CommandResult {
  const summary = input.saved ? 'Configuration saved' : 'Current configuration';
  const details = formatConfigDetails(input);

  return {
    status: 'success',
    title: 'Skill-Adapter Configuration',
    summary,
    details,
    data: {
      config: input.config,
      model: input.model,
      saved: input.saved,
    },
    nextSteps: input.model.configured
      ? [
          'sa config --help',
          'sa evolve <skill-name>',
          'sa summary <skill-name>',
        ]
      : [
          'sa init --show',
          'Configure Anthropic credentials in ~/.claude/settings.json',
          'Set ANTHROPIC_AUTH_TOKEN and ANTHROPIC_DEFAULT_SONNET_MODEL',
        ],
  };
}

export function buildSummaryCommandView(skillName: string, records: EvolutionRecord[]): CommandResult {
  const rendered = renderEvolutionSummary(skillName, records);

  if (rendered.status === 'not-found') {
    return {
      status: 'failure',
      title: `Evolution Summary: ${skillName}`,
      error: `No evolution records found for "${skillName}"`,
      details: 'Run evolution analysis first.',
      nextSteps: [`sa evolve ${skillName}`],
    };
  }

  const sorted = [...records].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  const baseline = sorted[0];
  const latest = sorted[sorted.length - 1];
  const nextStepsIndex = rendered.lines.findIndex((line) => line === 'Next Steps:');
  const detailsLines = nextStepsIndex >= 0
    ? rendered.lines.slice(2, nextStepsIndex)
    : rendered.lines.slice(2);

  return {
    status: 'success',
    title: `Evolution Summary: ${skillName}`,
    summary: `${records.length} evolution(s) from v${baseline.version} to v${latest.version}`,
    details: detailsLines.join('\n'),
    data: {
      skillName,
      recordsCount: records.length,
      baselineVersion: baseline.version,
      latestVersion: latest.version,
    },
    nextSteps: [
      `sa log ${skillName}`,
      `sa share ${skillName}`,
      `sa export ${skillName}`,
    ],
  };
}
