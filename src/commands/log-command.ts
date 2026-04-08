import { Command } from 'commander';

import { EvolutionDatabase } from '../core/database';

export function registerLogCommand(program: Command): void {
  program
    .command('log [skillName]')
  .description('View version history')
  .option('-n, --number <count>', 'Number of versions to show', '10')
  .option('--oneline', 'Show one line per version', false)
  .option('--stat', 'Show change statistics', false)
  .action((skillName: string | undefined, options: { number: string; oneline: boolean; stat: boolean }) => {
    const db = new EvolutionDatabase();

    if (skillName) {
      // Show history for specific skill
      const records = db.getRecords(skillName);
      if (records.length === 0) {
        console.log(`Skill "${skillName}" not found.`);
        return;
      }

      console.log(`📜 Version History: ${skillName}\n`);

      // Sort by timestamp descending (newest first)
      const sorted = [...records].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, parseInt(options.number));

      for (const record of sorted) {
        const date = new Date(record.timestamp);
        const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

        if (options.oneline) {
          console.log(`${record.version} - ${dateStr}`);
        } else {
          console.log('─'.repeat(50));
          console.log(`📦 Version: ${record.version}`);
          console.log(`📅 Date:    ${dateStr}`);
          console.log(`🆔 ID:      ${record.id}`);

          // Parse patches to show changes
          try {
            const patches = JSON.parse(record.patches || '[]');
            if (patches.length > 0) {
              console.log(`📝 Changes:`);
              for (const patch of patches) {
                // Support both old format (type/description) and new format (category/action)
                const type = patch.type || patch.category || 'evolution';
                const desc = patch.description || patch.action || patch.suggestion || 'N/A';
                const statusIcon = patch.status === 'applied' ? '✅' :
                                   patch.status === 'added' ? '➕' :
                                   patch.status === 'skipped' ? 'ℹ️' : '•';
                console.log(`   ${statusIcon} [${type}] ${desc}`);
                // Show details
                if (patch.details && patch.details.length > 0) {
                  for (const detail of patch.details) {
                    console.log(`      → ${detail}`);
                  }
                }
              }
            }

            // Show telemetry data if stat option
            if (options.stat) {
              const telemetry = JSON.parse(record.telemetryData || '{}');
              if (Object.keys(telemetry).length > 0) {
                console.log(`📊 Metrics:`);
                if (telemetry.optimizationsCount !== undefined) {
                  console.log(`   Optimizations: ${telemetry.optimizationsCount}`);
                }
                if (telemetry.appliedCount !== undefined) {
                  console.log(`   Applied: ${telemetry.appliedCount}`);
                }
                if (telemetry.skippedCount !== undefined) {
                  console.log(`   Skipped: ${telemetry.skippedCount}`);
                }
                if (telemetry.soulLoaded) {
                  console.log(`   SOUL.md: loaded`);
                }
                if (telemetry.memoryLoaded) {
                  console.log(`   MEMORY.md: loaded`);
                }
                if (telemetry.workspaceAnalysis) {
                  const ws = telemetry.workspaceAnalysis;
                  console.log(`   Workspace: ${ws.languages?.join(', ') || 'N/A'}, ${ws.packageManager || 'N/A'}`);
                }
                // Legacy metrics
                if (telemetry.tokenReduction) {
                  console.log(`   Token reduction: ${telemetry.tokenReduction.toFixed(1)}%`);
                }
                if (telemetry.callReduction) {
                  console.log(`   Call reduction: ${telemetry.callReduction.toFixed(1)}%`);
                }
              }
            }
          } catch {
            // Ignore parse errors
          }

          if (record.importSource) {
            console.log(`📥 Source:  ${record.importSource}`);
          }
          console.log('');
        }
      }

      console.log(`Total ${records.length} version(s)`);

      console.log('\n📌 Next Steps:');
      console.log(`   sa summary ${skillName}      # View evolution metrics`);

    } else {
      // Show history for all skills
      const records = db.getAllRecords();
      if (records.length === 0) {
        console.log('No skills installed yet.');
        return;
      }

      const skillNames = [...new Set(records.map(r => r.skillName))];
      console.log('📜 Version History (All Skills)\n');

      for (const name of skillNames) {
        const skillRecords = db.getRecords(name);
        const versions = skillRecords.map(r => r.version);
        const latest = db.getLatestVersion(name);

        console.log(`📦 ${name}`);
        console.log(`   Versions: ${versions.join(' → ')}`);
        console.log(`   Latest:   v${latest}`);
        console.log(`   Total:    ${skillRecords.length} evolution(s)`);
        console.log('');
      }

      console.log('\n📌 Next Steps:');
      console.log('   sa summary <skill-name>    # View evolution metrics');
      console.log('   sa log <skill-name>        # View specific skill history');
      console.log('   sa evolve <skill-name>     # Analyze and optimize skill');
    }
  });

}


