import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import { EvolutionDatabase } from '../core/database';

export function registerListCommand(program: Command): void {
  program
    .command('list')
    .description('List all skills from all platforms')
    .option('-p, --platform <platform>', 'Platform to show (imported, openclaw, claudecode, all)', 'all')
    .action((options: { platform: string }) => {
    // Delegate to info command logic
    console.log('\n📋 Skill List\n');

    const db = new EvolutionDatabase();
    const allSkillNames = db.getAllSkillNames();

    // Get skills from OpenClaw directory
    const openclawDir = path.join(os.homedir(), '.openclaw', 'skills');
    const openclawSkills: { name: string; path: string }[] = [];
    if (fs.existsSync(openclawDir)) {
      try {
        const dirs = fs.readdirSync(openclawDir, { withFileTypes: true });
        for (const dir of dirs) {
          if (dir.isDirectory() && !dir.name.startsWith('.')) {
            const skillMdPath = path.join(openclawDir, dir.name, 'SKILL.md');
            if (fs.existsSync(skillMdPath)) {
              openclawSkills.push({ name: dir.name, path: path.join(openclawDir, dir.name) });
            }
          }
        }
      } catch {
        // Ignore errors
      }
    }

    // Get skills from Claude Code
    const claudeCodeSkills: { name: string; path: string }[] = [];
    const claudeDir = path.join(os.homedir(), '.claude');
    const skillsDir = path.join(claudeDir, 'skills');

    if (fs.existsSync(skillsDir)) {
      try {
        const dirs = fs.readdirSync(skillsDir, { withFileTypes: true });
        for (const dir of dirs) {
          if (dir.isDirectory() && !dir.name.startsWith('.')) {
            const skillMdPath = path.join(skillsDir, dir.name, 'SKILL.md');
            const skillMdAltPath = path.join(skillsDir, dir.name, 'skill.md');
            if (fs.existsSync(skillMdPath) || fs.existsSync(skillMdAltPath)) {
              claudeCodeSkills.push({ name: dir.name, path: path.join(skillsDir, dir.name) });
            }
          }
        }
      } catch {
        // Ignore errors
      }
    }

    // Display results
    if (allSkillNames.length > 0) {
      console.log('📦 Imported Skills (Database):');
      for (const name of allSkillNames) {
        console.log(`   • ${name}`);
      }
      console.log('');
    }

    if (openclawSkills.length > 0 && (options.platform === 'all' || options.platform === 'openclaw')) {
      console.log('🔧 OpenClaw Skills:');
      for (const skill of openclawSkills) {
        console.log(`   • ${skill.name}`);
      }
      console.log('');
    }

    if (claudeCodeSkills.length > 0 && (options.platform === 'all' || options.platform === 'claudecode')) {
      console.log('🤖 Claude Code Skills:');
      for (const skill of claudeCodeSkills) {
        console.log(`   • ${skill.name}`);
      }
      console.log('');
    }

    const total = allSkillNames.length + openclawSkills.length + claudeCodeSkills.length;
    if (total === 0) {
      console.log('No skills found. Run `sa import` to discover skills.');
    } else {
      console.log(`Total: ${total} skill(s)`);
    }

    console.log('\n📌 Next Steps:');
    console.log('   sa show <skill>    # View skill details');
    console.log('   sa evolve <skill>  # Run evolution analysis');
  });

}

