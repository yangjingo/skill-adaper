import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import ora from 'ora';

import { EvolutionDatabase } from '../core/database';
import { securityEvaluator } from '../core/security';
import { skillExporter } from '../core/sharing';
import { platformFetcher } from '../core/discovery';
import { findClaudeCodeSkillsPath, findOpenClawSkillsPath } from '../core/discovery/paths';
import { RemoteSkill } from '../types/discovery';

const COMMUNITY_SKILLS_FEED_URL = 'https://github.com/leow3lab/ascend-skills';
const COMMUNITY_CURATED_SKILLS_URL = 'https://github.com/leow3lab/awesome-ascend-skills';

const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  skillsShBg: '\x1b[46m\x1b[30m',
};

interface ImportCommandOptions {
  name?: string;
  scan: boolean;
  limit: string;
}

function formatSource(platform: string): string {
  if (platform === 'skills-sh' || platform === 'skills.sh') {
    return `${COLORS.bold}${COLORS.skillsShBg} skills.sh ${COLORS.reset}`;
  }
  return platform;
}

function parseSkillsShUrl(source: string): { pageUrl: string; githubRepo?: string; skill?: string } | null {
  const trimmed = source.trim();
  if (!/^https?:\/\/skills\.sh\//i.test(trimmed)) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length >= 3) {
      return {
        pageUrl: `https://skills.sh/${segments[0]}/${segments[1]}/${segments[2]}`,
        githubRepo: `${segments[0]}/${segments[1]}`,
        skill: segments[2]
      };
    }

    if (segments.length === 2) {
      return {
        pageUrl: `https://skills.sh/${segments[0]}/${segments[1]}`,
        skill: segments[1]
      };
    }
  } catch {
    return null;
  }

  return null;
}

function buildManualInstallHint(repoRef: string, skillName?: string): string {
  const parts = [`npx skills add ${repoRef}`];
  if (skillName) {
    parts.push(`--skill ${skillName}`);
  }
  return parts.join(' ');
}

function printCommunityLinks(mode: 'radar' | 'targets'): void {
  if (mode === 'radar') {
    console.log('\n?? Community Radar:');
    console.log(`   Shared skills feed: ${COMMUNITY_SKILLS_FEED_URL}`);
    console.log(`   Curated list:       ${COMMUNITY_CURATED_SKILLS_URL}`);
    console.log('\n? Your turn: polish one skill and share it with: sa share <skill-name>');
    return;
  }

  console.log('\n?? Community Targets:');
  console.log(`   ${COMMUNITY_SKILLS_FEED_URL}`);
  console.log(`   ${COMMUNITY_CURATED_SKILLS_URL}`);
}

async function handleImportDiscoverMode(limitText: string): Promise<void> {
  console.log('?? Discovering hot skills from skills.sh...\n');

  try {
    const limit = parseInt(limitText, 10);
    const results = await platformFetcher.fetchHot('skills-sh', limit);
    if (results.length > 0) {
      console.log('Rank | Downloads | Skill');
      console.log('-'.repeat(50));
      for (const entry of results) {
        console.log(`#${entry.rank.toString().padEnd(4)} | ${entry.skill.stats.downloads.toString().padEnd(9)} | ${entry.skill.name}`);
      }
    } else {
      console.log('  (No data available)');
    }

    console.log('\n?? Next Steps:');
    console.log('   sa import <skill>            # Install a skill');
    console.log('   sa import <owner/repo>       # Install from skills.sh');
  } catch (error) {
    console.error(`? Failed to fetch skills: ${error}`);
  }
}

function resolveImportSource(source: string): { source: string; isLocalPath: boolean; isOpenClawSkill: boolean } {
  let resolvedSource = source;
  let isLocalPath = fs.existsSync(resolvedSource);

  const isOpenClawSkill = (() => {
    const openClawPath = findOpenClawSkillsPath();
    if (openClawPath) {
      const localSkillDir = path.join(openClawPath, resolvedSource);
      return fs.existsSync(localSkillDir) && fs.statSync(localSkillDir).isDirectory();
    }
    return false;
  })();

  if (!isLocalPath) {
    const claudeCodePath = findClaudeCodeSkillsPath();
    if (claudeCodePath) {
      const localClaudeSkillDir = path.join(claudeCodePath, 'skills', resolvedSource);
      const hasSkillMd = fs.existsSync(path.join(localClaudeSkillDir, 'skill.md'));
      const hasSkillMdUpper = fs.existsSync(path.join(localClaudeSkillDir, 'SKILL.md'));
      if (fs.existsSync(localClaudeSkillDir) && fs.statSync(localClaudeSkillDir).isDirectory() && (hasSkillMd || hasSkillMdUpper)) {
        console.log('?? Found local Claude Code skill\n');
        resolvedSource = localClaudeSkillDir;
        isLocalPath = true;
      }
    }
  }

  return { source: resolvedSource, isLocalPath, isOpenClawSkill };
}

async function handleImportRecommendOnly(source: string): Promise<void> {
  const query = source.startsWith('http://') || source.startsWith('https://')
    ? (source.split('/').filter(Boolean).pop() || source)
    : source;
  const searchUrl = `https://skills.sh/?q=${encodeURIComponent(query)}`;

  console.log('?? Searching on skills.sh...\n');
  console.log(`   ${searchUrl}\n`);

  const [searchResults, hotResults] = await Promise.all([
    platformFetcher.search(query, { limit: 5 }).catch(() => [] as RemoteSkill[]),
    platformFetcher.fetchHot('skills-sh', 5).catch(() => [] as Array<{ rank: number; skill: RemoteSkill }>)
  ]);

  if (searchResults.length > 0) {
    console.log('?? Recommendations:');
    for (const [idx, result] of searchResults.entries()) {
      console.log(`  ${idx + 1}. ${result.name} (${result.stats.downloads} downloads)`);
      if (result.url) {
        console.log(`     ${result.url}`);
      }
    }
  } else {
    console.log('?? Recommendations: none');
  }

  if (hotResults.length > 0) {
    console.log('\n?? Trending:');
    for (const entry of hotResults) {
      console.log(`  #${entry.rank} ${entry.skill.name} (${entry.skill.stats.downloads} downloads)`);
    }
  }

  console.log('\n?? This command no longer auto-downloads remote skills.');
  console.log('   Install manually if needed: npx skills add <repo> --skill <name>');
  printCommunityLinks('radar');
}

export function registerImportCommand(program: Command): void {  program
    .command('import [source]')
    .description('Import or discover skills')
    .option('-n, --name <name>', 'Rename skill on import')
    .option('--no-scan', 'Skip security scan')
    .option('-l, --limit <number>', 'Limit results when discovering', '10')
    .action(async (source: string | undefined, options: ImportCommandOptions) => {
      if (!source) {
        await handleImportDiscoverMode(options.limit);
        return;
      }
  
      console.log(`?? Getting skill from: ${source}\n`);
      const resolved = resolveImportSource(source);
      source = resolved.source;
  
      if (!resolved.isLocalPath && !resolved.isOpenClawSkill) {
        await handleImportRecommendOnly(source);
        return;
      }
  
      const db = new EvolutionDatabase();
  
      try {
        // Detect source type
        let skillPackage = null;
        let sourceType = 'unknown';
        let skillPath = '';  // Track where skill files are located
        let contentFetchWarning = '';
  
        if (source.startsWith('http://') || source.startsWith('https://')) {
          sourceType = 'url';
  
          if (source.includes('skills.sh') || source.includes('localhost:3000')) {
            sourceType = 'registry';
            console.log('🔍 Detected: Registry URL');
  
            const registrySkill = parseSkillsShUrl(source);
            if (registrySkill?.githubRepo && registrySkill.skill) {
              const commandRepo = `https://github.com/${registrySkill.githubRepo}`;
              console.log(`   Command: ${buildManualInstallHint(commandRepo, registrySkill.skill)}`);
            }
  
            // Extract skill name from URL
            const name = options.name || registrySkill?.skill || source.split('/').pop()?.replace(/\.git$/, '') || 'imported-skill';
            const registryUrl = new URL(source).origin;
  
            // Download from registry (ZIP format)
            const downloadUrl = `${registryUrl}/api/skills/${name}/download`;
            console.log(`📦 Downloading from registry...`);
  
            const response = await fetch(downloadUrl);
            if (!response.ok) {
              throw new Error(`Download failed: ${response.statusText}`);
            }
  
            // For now, use mock data since we can't easily extract ZIP in Node
            skillPackage = {
              id: `skill_${Date.now()}`,
              manifest: { name, version: '1.0.0', description: '', author: 'unknown', license: 'MIT', keywords: [], compatibility: { platforms: ['claude-code'] } },
              content: { systemPrompt: `# ${name}\n\nSkill imported from ${source}` },
              metadata: { createdAt: new Date(), updatedAt: new Date() }
            };
          } else {
            console.log('🔍 Detected: Remote URL');
            skillPackage = await skillExporter.importFromUrl(source, { rename: options.name, validateSecurity: options.scan });
          }
        } else if (fs.existsSync(source)) {
          sourceType = 'file';
          console.log('🔍 Detected: Local file');
  
          const stat = fs.statSync(source);
          if (stat.isDirectory()) {
            // Directory - check for skill.json or SKILL.md (OpenClaw format)
            skillPath = source;  // Store the directory path
            const skillJsonPath = path.join(source, 'skill.json');
            const skillMdPath = path.join(source, 'skill.md');
            const openClawMdPath = path.join(source, 'SKILL.md');
  
            if (fs.existsSync(skillJsonPath)) {
              // Standard format
              const manifest = JSON.parse(fs.readFileSync(skillJsonPath, 'utf-8'));
              const systemPrompt = fs.existsSync(skillMdPath)
                ? fs.readFileSync(skillMdPath, 'utf-8')
                : `# ${manifest.name}\n\nImported from directory`;
  
              skillPackage = {
                id: `skill_${Date.now()}`,
                manifest,
                content: { systemPrompt },
                metadata: { createdAt: new Date(), updatedAt: new Date() }
              };
            } else if (fs.existsSync(skillMdPath)) {
              // Claude Code format (skill.md without skill.json)
              const skillName = options.name || path.basename(source);
              const systemPrompt = fs.readFileSync(skillMdPath, 'utf-8');
  
              skillPackage = {
                id: `skill_${Date.now()}`,
                manifest: {
                  name: skillName,
                  version: '1.0.0',
                  description: `Claude Code skill: ${skillName}`,
                  author: 'claude-code',
                  license: 'MIT',
                  keywords: [],
                  main: 'skill.md',
                  compatibility: { platforms: ['claude-code'] }
                },
                content: { systemPrompt },
                metadata: { createdAt: new Date(), updatedAt: new Date() }
              };
              console.log('🔍 Detected: Claude Code skill format');
            } else if (fs.existsSync(openClawMdPath)) {
              // OpenClaw format
              const skillName = options.name || path.basename(source);
              const systemPrompt = fs.readFileSync(openClawMdPath, 'utf-8');
  
              skillPackage = {
                id: `skill_${Date.now()}`,
                manifest: {
                  name: skillName,
                  version: '1.0.0',
                  description: `OpenClaw skill: ${skillName}`,
                  author: 'openclaw',
                  license: 'MIT',
                  keywords: [],
                  main: 'SKILL.md',
                  compatibility: { platforms: ['openclaw', 'claude-code'] }
                },
                content: { systemPrompt },
                metadata: { createdAt: new Date(), updatedAt: new Date() }
              };
              console.log('🔍 Detected: OpenClaw skill format');
            }
          } else {
            skillPackage = skillExporter.importFromFile(source, { rename: options.name, validateSecurity: options.scan });
          }
        } else {
          // Assume it's a skill name - check local first, then search remote
          sourceType = 'registry-name';
  
          // First, check if it's a local OpenClaw skill
          const openClawPath = findOpenClawSkillsPath();
          if (openClawPath) {
            const localSkillDir = path.join(openClawPath, source);
            if (fs.existsSync(localSkillDir) && fs.statSync(localSkillDir).isDirectory()) {
              console.log('🔍 Found local OpenClaw skill\n');
              skillPath = localSkillDir;  // Store the skill directory path
              const skillMdPath = path.join(localSkillDir, 'SKILL.md');
  
              let systemPrompt = '';
              if (fs.existsSync(skillMdPath)) {
                systemPrompt = fs.readFileSync(skillMdPath, 'utf-8');
              }
  
              const skillName = options.name || source;
              skillPackage = {
                id: `skill_${Date.now()}`,
                manifest: {
                  name: skillName,
                  version: '1.0.0',
                  description: `OpenClaw skill: ${source}`,
                  author: 'openclaw',
                  license: 'MIT',
                  keywords: [],
                  compatibility: { platforms: ['openclaw', 'claude-code'] }
                },
                content: { systemPrompt },
                metadata: { createdAt: new Date(), updatedAt: new Date() }
              };
              sourceType = 'openclaw';
            }
          }
  
          // If not found locally, search remote platforms
          if (!skillPackage) {
            console.log('🔍 Searching from skills.sh...\n');
  
            const loadRemoteContent = async (found: RemoteSkill): Promise<{ content: string; fetched: boolean }> => {
            const contentSpinner = ora(`Fetching content for ${found.name}...`).start();
            const content = await platformFetcher.fetchSkillContent(found);
            if (content) {
              contentSpinner.succeed(`Fetched content for ${found.name}`);
              return { content, fetched: true };
            }
            contentSpinner.warn(`Could not fetch content for ${found.name}; using fallback description`);
            console.log(`   Repro: sa import ${source}`);
            return { content: '', fetched: false };
            };
  
            // Search from both platforms
            const searchResults = await platformFetcher.search(source, { limit: 5 });
  
            if (searchResults.length === 0) {
              // Fallback to registry download
              const registryUrl = 'http://localhost:3000';
              const downloadUrl = `${registryUrl}/api/skills/${source}/download`;
              console.log(`📦 No results found, trying local registry...`);
  
              try {
                const response = await fetch(downloadUrl);
                if (response.ok) {
                  skillPackage = {
                    id: `skill_${Date.now()}`,
                    manifest: { name: source, version: '1.0.0', description: '', author: 'unknown', license: 'MIT', keywords: [], compatibility: { platforms: ['claude-code'] } },
                    content: { systemPrompt: `# ${source}\n\nSkill imported from registry` },
                    metadata: { createdAt: new Date(), updatedAt: new Date() }
                  };
                  sourceType = 'local-registry';
                }
              } catch {
                console.log('⚠ Could not find skill in any registry');
              }
            } else if (searchResults.length === 1) {
              // Single result - use it directly
              const found = searchResults[0];
              console.log(`📥 Found: ${found.name} from ${formatSource(found.platform)}`);
              console.log(`   ${found.description}\n`);
  
              // Fetch skill content
              const contentResult = await loadRemoteContent(found);
              skillPackage = {
                id: `skill_${Date.now()}`,
                manifest: {
                  name: found.name,
                  version: '1.0.0',
                  description: found.description,
                  author: found.owner,
                  license: 'MIT',
                  keywords: found.tags,
                  compatibility: { platforms: ['claude-code'] }
                },
                content: { systemPrompt: contentResult.content || `# ${found.name}\n\n${found.description}` },
                metadata: { createdAt: new Date(), updatedAt: new Date(), source: found.platform }
              };
              sourceType = found.platform;
              if (!contentResult.fetched) {
                contentFetchWarning = `   ⚠ Using fallback content for ${found.name}`;
              }
            } else {
              // Multiple results - show all with platform source
              console.log(`📋 Found ${searchResults.length} matching skills:\n`);
              searchResults.forEach((s, i) => {
                console.log(`  ${i + 1}. ${s.name} from ${formatSource(s.platform)} - ${s.stats.downloads} downloads`);
                console.log(`     ${s.description}`);
              });
              console.log('');
  
              // Use the first result (most popular)
              const found = searchResults[0];
              console.log(`📦 Importing: ${found.name} from ${formatSource(found.platform)}\n`);
  
              const contentResult = await loadRemoteContent(found);
              skillPackage = {
                id: `skill_${Date.now()}`,
                manifest: {
                  name: found.name,
                  version: '1.0.0',
                  description: found.description,
                  author: found.owner,
                  license: 'MIT',
                  keywords: found.tags,
                  compatibility: { platforms: ['claude-code'] }
                },
                content: { systemPrompt: contentResult.content || `# ${found.name}\n\n${found.description}` },
                metadata: { createdAt: new Date(), updatedAt: new Date(), source: found.platform }
              };
              sourceType = found.platform;
              if (!contentResult.fetched) {
                contentFetchWarning = `   ⚠ Using fallback content for ${found.name}`;
              }
            }
          }
        }
  
        if (!skillPackage) {
          throw new Error('Could not load skill from source');
        }
  
        // Security scan (unless disabled)
        if (options.scan) {
          console.log('\n🔒 Running security scan...');
          const scanResult = securityEvaluator.scan(
            skillPackage.content.systemPrompt,
            skillPackage.manifest.name
          );
  
          if (!scanResult.passed) {
            console.log('⚠ Security issues detected:');
            console.log(`  Risk Level: ${scanResult.riskAssessment.overallRisk}`);
            console.log(`  Issues: ${scanResult.sensitiveInfoFindings.length + scanResult.dangerousOperationFindings.length}`);
            console.log('\n  Run `sa scan <file>` for details.\n');
          } else {
            console.log('  ✅ Security scan passed\n');
          }
        }
  
        // Save to database
        const existingRecords = db.getRecords(skillPackage.manifest.name);
        if (existingRecords.length > 0) {
          console.log(`⚠ Skill "${skillPackage.manifest.name}" already exists. Use --name to import with different name.`);
          return;
        }
  
        // Determine source label
        const getSourceLabel = (type: string, originalSource?: string): string => {
          if (type === 'skills-sh') return 'skills.sh';
          if (type === 'openclaw') return `OpenClaw:${originalSource || ''}`;
          if (type === 'local-registry') return 'local registry';
          if (type === 'file') return 'local file';
          if (type === 'url') return 'URL';
          return type;
        };
  
        db.addRecord({
          id: EvolutionDatabase.generateId(),
          skillName: skillPackage.manifest.name,
          version: skillPackage.manifest.version,
          timestamp: new Date(),
          telemetryData: JSON.stringify([]),
          patches: JSON.stringify(skillPackage.content.patches || []),
          importSource: getSourceLabel(sourceType, source),
          skillPath: skillPath || undefined
        });
  
        const sourceLabel = getSourceLabel(sourceType, source).split(':')[0];
        console.log(`\n✅ Installed successfully!`);
        console.log(`   Skill: ${skillPackage.manifest.name} (v${skillPackage.manifest.version})`);
        console.log(`   Source: ${sourceLabel}`);
        if (contentFetchWarning) {
          console.log(contentFetchWarning);
        }
  
        console.log('\n📌 Next Steps:');
        console.log(`   sa info ${skillPackage.manifest.name}       # View skill details`);
        console.log(`   sa evolve ${skillPackage.manifest.name}     # Analyze and optimize`);
        console.log(`   sa log ${skillPackage.manifest.name}        # View version history`);
  
      } catch (error) {
        console.error(`❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  }
