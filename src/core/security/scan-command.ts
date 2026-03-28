/**
 * scan command module.
 *
 * Keeps CLI registration thin and moves scan-specific execution, repair logic,
 * and output copy into a dedicated module.
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import ora from 'ora';
import { EvolutionDatabase } from '../database';
import { platformFetcher, skillsStore } from '../discovery';
import { findClaudeCodeSkillsPath, findOpenClawSkillsPath, getClaudeCodePlugins } from '../discovery/paths';
import { saAgentEvolutionEngine } from '../evolution';
import { securityEvaluator, SecurityScanResult } from './index';
import { scanCommandPrompts as P } from './scan-command-prompts';

interface ScanCommandOptions {
  format: string;
  repair: boolean;
  apply: boolean;
}

function getAutoRepairTargetPath(targetPath: string): string {
  const parsed = path.parse(targetPath);
  return path.join(parsed.dir, `${parsed.name}.repaired${parsed.ext || '.md'}`);
}

function countHighSeverityFindings(result: SecurityScanResult): number {
  const sensitiveHigh = result.sensitiveInfoFindings.filter(f => f.severity === 'high').length;
  const dangerousHigh = result.dangerousOperationFindings.filter(f => f.severity === 'high').length;
  const permissionHigh = result.permissionIssues.filter(f => f.severity === 'high').length;
  return sensitiveHigh + dangerousHigh + permissionHigh;
}

function buildRepairedContent(content: string, result: SecurityScanResult): { content: string; linesPatched: number } {
  const highRiskLines = new Set<number>();

  for (const finding of result.sensitiveInfoFindings) {
    if (finding.severity === 'high' && finding.location.line && finding.location.line > 0) {
      highRiskLines.add(finding.location.line);
    }
  }

  for (const finding of result.dangerousOperationFindings) {
    if (finding.severity === 'high' && finding.location.line && finding.location.line > 0) {
      highRiskLines.add(finding.location.line);
    }
  }

  if (highRiskLines.size === 0) {
    return { content, linesPatched: 0 };
  }

  const useCrLf = content.includes('\r\n');
  const eol = useCrLf ? '\r\n' : '\n';
  const lines = content.split(/\r?\n/);

  for (const lineNo of highRiskLines) {
    const idx = lineNo - 1;
    if (idx >= 0 && idx < lines.length) {
      lines[idx] = '# [SA-REPAIR] risky content removed';
    }
  }

  return { content: lines.join(eol), linesPatched: highRiskLines.size };
}

function resolveRepairSourceFile(skillOrFile: string, skillPath: string): string | null {
  if (!skillPath) {
    return fs.existsSync(skillOrFile) && fs.statSync(skillOrFile).isFile() ? skillOrFile : null;
  }

  if (!fs.existsSync(skillPath)) {
    return null;
  }

  const stat = fs.statSync(skillPath);
  if (stat.isFile()) {
    return skillPath;
  }

  if (stat.isDirectory()) {
    const candidates = [
      path.join(skillPath, 'SKILL.md'),
      path.join(skillPath, 'skill.md'),
      path.join(skillPath, 'README.md')
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
  }

  return null;
}

function isSeparatorLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (trimmed.length <= 3) {
    const separatorChars = '─—–-_=/\\|*#.~┌┐└┘├┤┬┴┼│';
    if ([...trimmed].every(c => separatorChars.includes(c) || /\s/.test(c))) {
      return true;
    }
  }
  if (/^[─—–\-_=*#.~\s│┌┐└┘├┤┬┴┼]+$/.test(trimmed)) return true;
  if (/^(.)\1{1,}$/.test(trimmed)) {
    const char = trimmed[0];
    if (/[─—–\-_=*#.~│┌┐└┘├┤┬┴┼]/.test(char)) return true;
  }
  return false;
}

async function printScannableSkills(): Promise<void> {
  const db = new EvolutionDatabase();

  console.log(`${P.scanBanner}\n`);

  const records = db.getAllRecords();
  const importedSkills = [...new Set(records.map(r => r.skillName))];

  const openClawPath = findOpenClawSkillsPath();
  let openClawSkills: string[] = [];
  if (openClawPath && fs.existsSync(openClawPath)) {
    openClawSkills = fs.readdirSync(openClawPath).filter(f =>
      fs.statSync(path.join(openClawPath, f)).isDirectory()
    );
  }

  const claudeCodePath = findClaudeCodeSkillsPath();
  let claudeCodeCommands: string[] = [];
  let claudeCodeSkills: string[] = [];
  if (claudeCodePath && fs.existsSync(claudeCodePath)) {
    const commandsPath = path.join(claudeCodePath, 'commands');
    if (fs.existsSync(commandsPath)) {
      claudeCodeCommands = fs.readdirSync(commandsPath)
        .filter(f => f.endsWith('.md'))
        .map(f => f.replace('.md', ''));
    }
    const skillsPath = path.join(claudeCodePath, 'skills');
    if (fs.existsSync(skillsPath)) {
      claudeCodeSkills = fs.readdirSync(skillsPath).filter(f =>
        fs.statSync(path.join(skillsPath, f)).isDirectory()
      );
    }
    const plugins = getClaudeCodePlugins();
    for (const plugin of plugins) {
      const pluginSkillsPath = path.join(plugin.path, 'skills');
      if (fs.existsSync(pluginSkillsPath)) {
        const pluginSkills = fs.readdirSync(pluginSkillsPath).filter(f =>
          fs.statSync(path.join(pluginSkillsPath, f)).isDirectory()
        );
        claudeCodeSkills = [...claudeCodeSkills, ...pluginSkills];
      }
    }
    claudeCodeSkills = [...new Set(claudeCodeSkills)];
  }

  if (importedSkills.length === 0 && openClawSkills.length === 0 &&
      claudeCodeCommands.length === 0 && claudeCodeSkills.length === 0) {
    console.log('No skills found to scan.\n');
    console.log(P.nextSteps);
    console.log(P.importFirstHint);
    return;
  }

  if (importedSkills.length > 0) {
    console.log('── Imported Skills ──');
    for (const skill of importedSkills) {
      const skillRecords = db.getRecords(skill);
      const latest = skillRecords[skillRecords.length - 1];
      console.log(`  📦 ${skill} (v${latest.version})`);
    }
    console.log('');
  }

  if (openClawSkills.length > 0 && openClawPath) {
    console.log('── OpenClaw Local Skills ──');
    for (const skill of openClawSkills) {
      const skillMdPath = path.join(openClawPath, skill, 'SKILL.md');
      const hasPrompt = fs.existsSync(skillMdPath);
      console.log(`  📦 ${skill} ${hasPrompt ? '' : '(no SKILL.md)'}`);
    }
    console.log('');
  }

  if (claudeCodeCommands.length > 0) {
    console.log('── Claude Code Commands ──');
    for (const cmd of claudeCodeCommands) {
      console.log(`  📦 ${cmd}`);
    }
    console.log('');
  }

  if (claudeCodeSkills.length > 0) {
    console.log('── Claude Code Skills ──');
    for (const skill of claudeCodeSkills) {
      console.log(`  📦 ${skill}`);
    }
    console.log('');
  }

  const installedSkills = await skillsStore.list();
  if (installedSkills.length > 0) {
    console.log('── skills.sh (Official CLI) ──');
    for (const skill of installedSkills) {
      console.log(`  📦 ${skill.name}${skill.version ? ` (v${skill.version})` : ''}`);
    }
    console.log('');
  }

  const totalSkills = importedSkills.length + openClawSkills.length +
                      claudeCodeCommands.length + claudeCodeSkills.length + installedSkills.length;

  if (totalSkills === 0) {
    console.log('No skills found to scan.\n');
    console.log(P.nextSteps);
    console.log(P.importFirstHint);
    console.log(P.installOfficialHint);
    return;
  }

  console.log(P.nextSteps);
  console.log(P.viewScannableHint);
  console.log(P.viewFileHint);
  console.log(`\n${P.examplesHeader}`);
  console.log(P.exampleScanSkill);
  console.log(P.exampleScanFile);
  console.log(P.exampleScanJson);
  console.log(P.exampleRepair);
}

async function scanFileTarget(target: string, options: ScanCommandOptions): Promise<void> {
  console.log(`${P.scanFilePrefix(target)}\n`);

  try {
    const result = securityEvaluator.scanFile(target);
    const report = securityEvaluator.generateReport(result, options.format as 'text' | 'json' | 'markdown');
    console.log(report);

    if (options.repair && !result.passed) {
      const repairSourcePath = resolveRepairSourceFile(target, target);
      if (!repairSourcePath) {
        console.log(`\n${P.autoRepairSkipped}`);
      } else {
        const originalContent = fs.readFileSync(repairSourcePath, 'utf-8');
        const repaired = buildRepairedContent(originalContent, result);
        if (repaired.linesPatched > 0) {
          const outputPath = options.apply ? repairSourcePath : getAutoRepairTargetPath(repairSourcePath);
          try {
            fs.writeFileSync(outputPath, repaired.content, 'utf-8');
            const rescanned = securityEvaluator.scanFile(outputPath);
            const beforeHigh = countHighSeverityFindings(result);
            const afterHigh = countHighSeverityFindings(rescanned);

            console.log(`\n${P.autoRepairTitle}`);
            console.log(`   Patched lines: ${repaired.linesPatched}`);
            console.log(`   High severity: ${beforeHigh} -> ${afterHigh}`);
            console.log(`   Repaired file: ${outputPath}`);
            console.log(P.repairMode(options.apply));
            console.log(`   Rescan status: ${rescanned.passed ? '✅ PASSED' : '⚠️ STILL HAS RISKS'}`);
          } catch (repairError) {
            console.log('\n⚠️ Auto repair failed: cannot write repaired file.');
            console.log(`   ${repairError instanceof Error ? repairError.message : String(repairError)}`);
          }
        } else {
          console.log(`\n${P.autoRepairNoPatch}`);
        }
      }
    }

    console.log(`\n${P.nextSteps}`);
    console.log(P.importHint(target));
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    console.log(`\n${P.suggestions}`);
    console.log(P.viewScannableHint);
  }
}

async function scanSkillTarget(skillName: string, options: ScanCommandOptions): Promise<void> {
  console.log(`${P.scanSkillPrefix(skillName)}\n`);

  const db = new EvolutionDatabase();
  let skillContent = '';
  let skillPath = '';
  let skillSource = '';

  const records = db.getRecords(skillName);
  if (records.length > 0) {
    const latest = records[records.length - 1];
    skillSource = latest.importSource || 'unknown';

    if (latest.importSource?.startsWith('OpenClaw:') || latest.importSource?.toLowerCase() === 'openclaw') {
      const originalDir = latest.importSource.split(':')[1] || skillName;
      const openClawPath = findOpenClawSkillsPath();
      if (openClawPath) {
        skillPath = path.join(openClawPath, originalDir);
        const skillMdPath = path.join(skillPath, 'SKILL.md');
        if (fs.existsSync(skillMdPath)) {
          skillContent = fs.readFileSync(skillMdPath, 'utf-8');
        }
      }
    }
  }

  if (!skillContent) {
    const openClawPath = findOpenClawSkillsPath();
    if (openClawPath) {
      skillPath = path.join(openClawPath, skillName);
      const skillMdPath = path.join(skillPath, 'SKILL.md');
      if (fs.existsSync(skillMdPath)) {
        skillContent = fs.readFileSync(skillMdPath, 'utf-8');
        skillSource = 'OpenClaw (local)';
      }
    }
  }

  if (!skillContent) {
    const claudeCodePath = findClaudeCodeSkillsPath();
    if (claudeCodePath) {
      const cmdPath = path.join(claudeCodePath, 'commands', `${skillName}.md`);
      if (fs.existsSync(cmdPath)) {
        skillContent = fs.readFileSync(cmdPath, 'utf-8');
        skillPath = cmdPath;
        skillSource = 'Claude Code Command';
      }

      if (!skillContent) {
        const skillDir = path.join(claudeCodePath, 'skills', skillName);
        if (fs.existsSync(skillDir)) {
          const skillMdPath = path.join(skillDir, 'skill.md');
          if (fs.existsSync(skillMdPath)) {
            skillContent = fs.readFileSync(skillMdPath, 'utf-8');
            skillPath = skillDir;
            skillSource = 'Claude Code Skill';
          }
        }
      }
    }
  }

  if (!skillContent) {
    const installedContent = await skillsStore.getSkillContent(skillName);
    if (installedContent) {
      skillContent = installedContent;
      skillPath = skillsStore.getSkillPath(skillName) || '';
      skillSource = 'skills.sh (installed)';
    }
  }

  if (!skillContent) {
    console.log('   Fetching skill content from remote...\n');
    try {
      const searchResults = await platformFetcher.search(skillName, { limit: 1 });
      if (searchResults.length > 0) {
        const found = searchResults[0];
        skillContent = await platformFetcher.fetchSkillContent(found);
        skillSource = 'skills.sh';
      }
    } catch {
      // Ignore fetch errors
    }
  }

  if (!skillContent) {
    if (records.length > 0) {
      const latest = records[records.length - 1];
      console.log(P.cannotFetchContent);
      console.log(`\n   Skill: ${skillName}`);
      console.log(`   Version: ${latest.version}`);
      console.log(`   Source: ${latest.importSource || 'unknown'}`);
      console.log(`\n${P.remoteInstallTip}`);
      console.log(`\n${P.nextSteps}`);
      console.log(P.viewScannableHint);
      if (latest.importSource?.includes('skills.sh')) {
        console.log(`   npx skills add <owner/repo> --skill <name>  # Install via official CLI`);
      }
      console.log(P.remoteOpenClawTip);
    } else {
      console.log(P.fileNotFound(skillName));
      console.log(`\n${P.nextSteps}`);
      console.log(P.viewScannableHint);
      console.log(`   sa import ${skillName}   # Import skill first`);
    }
    return;
  }

  const useAI = saAgentEvolutionEngine.isAvailable();
  let result;

  if (useAI) {
    const modelInfo = securityEvaluator.getModelInfo();
    console.log('─'.repeat(60));
    console.log(P.scanAnalysisTitle);
    console.log('─'.repeat(60) + '\n');
    console.log(`• Model: ${modelInfo.modelId}`);

    const spinnerEnabled = process.stdout.isTTY;
    const scanSpinner = spinnerEnabled ? ora(P.scanConnecting).start() : null;
    let thinkingStarted = false;
    let lineBuffer = '';
    let analysisFailed = false;
    let spinnerClosed = false;

    const closeSpinner = (status: 'succeed' | 'fail' | 'warn', text: string) => {
      if (!spinnerClosed && scanSpinner) {
        if (status === 'succeed') scanSpinner.succeed(text);
        else if (status === 'fail') scanSpinner.fail(text);
        else scanSpinner.warn(text);
        spinnerClosed = true;
      }
    };

    result = await securityEvaluator.scanWithAI(skillContent, skillName, { useAI: true }, {
      onProgress: (msg) => {
        if (msg.includes('SA Agent analysis failed')) {
          analysisFailed = true;
          if (spinnerEnabled) {
            closeSpinner('fail', msg);
          } else {
            console.log(`• ${msg}`);
          }
          return;
        }
        if (spinnerEnabled && scanSpinner && !spinnerClosed) {
          scanSpinner.text = msg;
        } else if (!thinkingStarted) {
          console.log(`• ${msg}`);
        }
      },
      onThinking: (text) => {
        if (!thinkingStarted) {
          if (spinnerEnabled && scanSpinner) {
            scanSpinner.text = P.scanConnected;
          } else {
            console.log(`• ${P.scanConnected}`);
          }
          console.log(`\n💭 SA Agent Thinking (streaming):\n`);
          console.log('─'.repeat(60));
          thinkingStarted = true;
        }

        lineBuffer += text;
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop() || '';
        const filteredLines = lines.filter(line => !isSeparatorLine(line));
        const cleanLines = filteredLines.filter(line => !line.trim().startsWith('DEBUG lines:'));
        if (cleanLines.length > 0) {
          process.stdout.write(cleanLines.join('\n') + '\n');
        }
      },
      onContent: () => {
        // Content output handled after analysis
      },
    });

    if (lineBuffer.trim() && !isSeparatorLine(lineBuffer) && !lineBuffer.trim().startsWith('DEBUG lines:')) {
      process.stdout.write(lineBuffer + '\n');
    }
    if (thinkingStarted) {
      console.log('\n' + '─'.repeat(60));
    }
    if (analysisFailed) {
      if (!spinnerClosed && spinnerEnabled) {
        closeSpinner('warn', 'SA Agent deep analysis unavailable');
      }
      console.log(`\n${P.scanFallback}\n`);
    } else {
      if (!spinnerClosed && spinnerEnabled) {
        closeSpinner('succeed', P.scanComplete);
      }
      console.log(`\n✅ ${P.scanComplete}\n`);
    }
  } else {
    result = securityEvaluator.scan(skillContent, skillName);
  }

  const report = securityEvaluator.generateReport(result, options.format as 'text' | 'json' | 'markdown');
  console.log(report);

  if (skillPath) {
    console.log(`\n📁 Skill path: ${skillPath}`);
  }
  if (skillSource) {
    console.log(`📥 Source: ${skillSource}`);
  }

  if (options.repair && !result.passed) {
    const repairSourcePath = resolveRepairSourceFile(skillName, skillPath);
    if (!repairSourcePath) {
      console.log(`\n${P.autoRepairSkipped}`);
    } else {
      const originalContent = fs.readFileSync(repairSourcePath, 'utf-8');
      const repaired = buildRepairedContent(originalContent, result);
      if (repaired.linesPatched > 0) {
        const outputPath = options.apply ? repairSourcePath : getAutoRepairTargetPath(repairSourcePath);
        try {
          fs.writeFileSync(outputPath, repaired.content, 'utf-8');
          const rescanned = securityEvaluator.scanFile(outputPath);
          const beforeHigh = countHighSeverityFindings(result);
          const afterHigh = countHighSeverityFindings(rescanned);

          console.log(`\n${P.autoRepairTitle}`);
          console.log(`   Patched lines: ${repaired.linesPatched}`);
          console.log(`   High severity: ${beforeHigh} -> ${afterHigh}`);
          console.log(`   Repaired file: ${outputPath}`);
          console.log(P.repairMode(options.apply));
          console.log(`   Rescan status: ${rescanned.passed ? '✅ PASSED' : '⚠️ STILL HAS RISKS'}`);
        } catch (repairError) {
          console.log('\n⚠️ Auto repair failed: cannot write repaired file.');
          console.log(`   ${repairError instanceof Error ? repairError.message : String(repairError)}`);
        }
      } else {
        console.log(`\n${P.autoRepairNoPatch}`);
      }
    }
  }

  console.log(`\n${P.nextSteps}`);
  if (result.passed) {
    console.log(`   sa info ${skillName}      # View skill details`);
    console.log(`   sa evolve ${skillName}    # Analyze and optimize`);
  } else {
    console.log(P.scanJsonHint(skillName));
    console.log(P.scanRepairHint(skillName));
    if (skillPath || skillSource) {
      console.log(P.viewInfoHint(skillName));
    }
    if (skillPath) {
      console.log(P.fixSkillHint);
    } else {
      console.log(P.patchPromptHint);
    }
  }
}

/**
 * Register sa scan command.
 */
export function registerScanCommand(program: Command): void {
  program
    .command('scan [skillOrFile]')
    .description('Scan for security issues')
    .option('-f, --format <format>', 'Output format (text, json)', 'text')
    .option('--repair', 'Generate a repaired copy and rescan (text mode only)', false)
    .option('--apply', 'Write repaired content back to the original file', false)
    .action(async (skillOrFile: string | undefined, options: ScanCommandOptions) => {
      if (!skillOrFile) {
        await printScannableSkills();
        return;
      }

      if (options.repair && options.format !== 'text') {
        console.log(P.repairTextModeWarning);
        options.format = 'text';
      }

      if (options.apply && !options.repair) {
        console.log(P.applyWithoutRepairWarning);
      }

      const isFilePath = skillOrFile.includes('/') || skillOrFile.includes('\\') ||
                         skillOrFile.endsWith('.json') || skillOrFile.endsWith('.md') ||
                         fs.existsSync(skillOrFile);

      if (isFilePath) {
        await scanFileTarget(skillOrFile, options);
      } else {
        await scanSkillTarget(skillOrFile, options);
      }
    });
}
