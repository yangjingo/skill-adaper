import { Command } from 'commander';

import { EvolutionDatabase } from '../core/database';
import { securityEvaluator } from '../core/security';
import { skillExporter, shareByPr, DEFAULT_PR_REPO } from '../core/sharing';
import { promptYesNo, printCommunityLinks } from './common';

export function registerShareCommand(program: Command): void {
  program
    .command('share [skillName]')
    .description('Create PR for a local skill')
    .option('--pr', 'Create Pull Request (kept for compatibility)', false)
    .option('--fork-pr', 'Create PR via your GitHub fork (for non-owner flow)', false)
    .option('--repo <url>', 'Target git repository URL', DEFAULT_PR_REPO)
    .option('--branch <name>', 'Branch name for PR', '')
    .option('--gh <path>', 'Path to GitHub CLI binary', process.env.GH_CLI_PATH || 'gh')
    .option('--yes', 'Skip security confirmation', false)
    .action(async (skillName: string | undefined, options: { pr: boolean; forkPr: boolean; repo: string; branch: string; gh: string; yes: boolean }) => {
    const db = new EvolutionDatabase();

    // No skill specified - list all skills
    if (!skillName) {
      console.log('Select a skill to share as PR:\n');
      const records = db.getAllRecords();
      if (records.length === 0) {
        console.log('No skills installed yet.');
        console.log('Use `sa import <source>` to import a skill.');
        return;
      }

      const skillNames = [...new Set(records.map(r => r.skillName))];
      for (const name of skillNames) {
        const version = db.getLatestVersion(name);
        console.log(`  - ${name} (v${version})`);
      }
      console.log('\nNext Steps:');
      console.log('   sa share <skill-name>      # Create PR');
      console.log('   sa export <skill-name>     # Export local package');
      printCommunityLinks('targets');
      return;
    }

    console.log(`Sharing skill by PR: ${skillName}\n`);

    const records = db.getRecords(skillName);

    if (records.length === 0) {
      console.log(`Skill "${skillName}" not found.`);
      return;
    }

    // Security scan
    console.log('🔒 Running security scan...');
    const latestRecord = records[records.length - 1];

    // Create skill package
    const skillPackage = skillExporter.createPackage(
      skillName,
      { systemPrompt: `# ${skillName}\n\nSkill content` },
      { version: latestRecord.version }
    );

    const scanResult = securityEvaluator.scan(
      skillPackage.content.systemPrompt,
      skillName
    );

    if (!scanResult.passed) {
      console.log('⚠ Security issues detected:');
      console.log(`  Risk: ${scanResult.riskAssessment.overallRisk}`);
      console.log(`  Issues: ${scanResult.sensitiveInfoFindings.length + scanResult.dangerousOperationFindings.length}`);

      if (!options.yes) {
        console.log('\n  Use --yes to proceed anyway.');
        return;
      }
    } else {
      console.log('  ✅ Security scan passed');
    }

    skillPackage.metadata.securityScan = scanResult;
    const shareOk = await shareByPr({
      skillName,
      version: latestRecord.version,
      skillPackage,
      repo: options.repo,
      branch: options.branch,
      ghBinary: options.gh,
      forkPr: options.forkPr,
      promptYesNo
    });
    if (!shareOk) {
      process.exitCode = 1;
    } else {
      console.log('\n🌟 Nice share. More places to discover & submit:');
      printCommunityLinks('radar');
    }
  });
}

