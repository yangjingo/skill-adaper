import { Command } from 'commander';

import { configManager, UserPreferences } from '../core/config-manager';

export function registerConfigCommand(program: Command): void {
  program
    .command('config [action] [key] [value]')
    .description('Manage user preferences')
    .action((action?: string, key?: string, value?: string) => {
    const prefs = configManager.getPreferences();

    if (!action || action === 'list') {
      // Show all config
      console.log('\n📋 Skill-Adapter Configuration\n');
      console.log('Preferences:');
      console.log(`  autoEvolve    ${prefs.autoEvolve}`);
      console.log(`  outputLevel   ${prefs.outputLevel}`);
      console.log(`  backupEnabled ${prefs.backupEnabled}`);
      console.log('');
      console.log('Recent Skills:');
      const recent = configManager.getRecentSkills();
      if (recent.length > 0) {
        recent.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
      } else {
        console.log('  (No recent skills)');
      }
      console.log('');
      console.log(`📁 Config file: ~/.skill-adapter/config.json`);
      console.log('');
      return;
    }

    if (action === 'get' && key) {
      const validKeys: (keyof UserPreferences)[] = ['autoEvolve', 'outputLevel', 'backupEnabled'];
      if (!validKeys.includes(key as keyof UserPreferences)) {
        console.log(`❌ Unknown config: ${key}`);
        console.log(`   Valid options: ${validKeys.join(', ')}`);
        return;
      }
      const val = configManager.get(key as keyof UserPreferences);
      console.log(`${key} = ${val}`);
      return;
    }

    if (action === 'set' && key && value !== undefined) {
      const validKeys: (keyof UserPreferences)[] = ['autoEvolve', 'outputLevel', 'backupEnabled'];

      if (!validKeys.includes(key as keyof UserPreferences)) {
        console.log(`❌ Unknown config: ${key}`);
        console.log(`   Valid options: ${validKeys.join(', ')}`);
        return;
      }

      // Validate values
      if (key === 'autoEvolve') {
        const validValues = ['always', 'ask', 'preview'];
        if (!validValues.includes(value)) {
          console.log(`❌ autoEvolve valid values: ${validValues.join(', ')}`);
          return;
        }
      } else if (key === 'outputLevel') {
        const validValues = ['simple', 'verbose', 'debug'];
        if (!validValues.includes(value)) {
          console.log(`❌ outputLevel valid values: ${validValues.join(', ')}`);
          return;
        }
      } else if (key === 'backupEnabled') {
        const validValues = ['true', 'false'];
        if (!validValues.includes(value)) {
          console.log(`❌ backupEnabled valid values: true, false`);
          return;
        }
        value = value === 'true' ? 'true' : 'false';
      }

      // Set the value
      if (key === 'autoEvolve') {
        configManager.set('autoEvolve', value as 'always' | 'ask' | 'preview');
      } else if (key === 'outputLevel') {
        configManager.set('outputLevel', value as 'simple' | 'verbose' | 'debug');
      } else if (key === 'backupEnabled') {
        configManager.set('backupEnabled', value === 'true');
      }

      console.log(`✅ Set ${key} = ${value}`);
      return;
    }

    if (action === 'reset') {
      configManager.reset();
      console.log('✅ Configuration reset to defaults');
      console.log('');
      console.log('Default config:');
      console.log(`  autoEvolve    = ask`);
      console.log(`  outputLevel   = simple`);
      console.log(`  backupEnabled = true`);
      return;
    }

    // Show help
    console.log('\n📋 sa config usage:\n');
    console.log('  sa config                View all config');
    console.log('  sa config list           View all config');
    console.log('  sa config get <key>      Get single config');
    console.log('  sa config set <key> <value>  Set config');
    console.log('  sa config reset          Reset to defaults');
    console.log('');
    console.log('Options:');
    console.log('  autoEvolve    always | ask | preview  Auto-evolution strategy');
    console.log('  outputLevel   simple | verbose | debug  Output verbosity');
    console.log('  backupEnabled true | false  Auto backup');
    console.log('');
  });

}

