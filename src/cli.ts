#!/usr/bin/env node

import { Command } from 'commander';

import { VERSION } from './index';
import {
  registerImportCommand,
  registerEvolveCommand,
  registerSummaryCommand,
  registerInfoCommand,
  registerShareCommand,
  registerExportCommand,
  registerLogCommand,
  registerConfigCommand,
  registerListCommand,
} from './commands';
import { registerScanCommand } from './core/security/scan-command';
import { registerInitCommand } from './commands/init-command';

function normalizeCliArgs(argv: string[]): string[] {
  return argv.map(arg => (arg === '-pr' ? '--pr' : arg));
}

function printWelcome(): void {
  console.log('');
  console.log('Skill-Adapter: Evolve or Die (Adaptāre aut Morī)');
  console.log('');
  console.log('Quick Start:');
  console.log('  sa list            List all skills');
  console.log('  sa info <skill>    View skill details');
  console.log('  sa evolve <skill>  Find and adapt skill');
  console.log('  sa import <src>    Import or discover skills');
  console.log('');
  console.log('Use `sa --help` to explore the full command set.');
  console.log('');
}

const program = new Command();
program.showHelpAfterError();
program.showSuggestionAfterError();
program
  .name('sa')
  .description('Skill-Adapter: Evolve or Die (Adaptāre aut Morī)')
  .version(VERSION);

registerInitCommand(program);
registerImportCommand(program);
registerInfoCommand(program);
registerEvolveCommand(program);
registerShareCommand(program);
registerExportCommand(program);
registerLogCommand(program);
registerSummaryCommand(program);
registerScanCommand(program);
registerConfigCommand(program);
registerListCommand(program);

if (process.argv.length === 2) {
  printWelcome();
}

program.parse(normalizeCliArgs(process.argv));
