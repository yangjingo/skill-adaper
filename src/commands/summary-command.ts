import { Command } from 'commander';

import { EvolutionDatabase } from '../core/database';
import { renderCommandResultWithInk } from '../ui';
import { buildSummaryCommandView } from './view-model';
import { failure, renderCommandResult, success } from './result';

export function registerSummaryCommand(program: Command): void {
  program
    .command('summary <skillName>')
    .description('View evolution metrics comparison')
    .option('--json', 'Render summary as JSON', false)
    .action(async (skillName: string, options: { json: boolean }) => {
      const db = new EvolutionDatabase();
      const records = db.getRecords(skillName);
      const view = buildSummaryCommandView(skillName, records);

      if (options.json) {
        if (view.status === 'failure') {
          console.log(
            renderCommandResult(
              failure({ code: 'NOT_FOUND', message: view.error || `No evolution records found for "${skillName}"` }),
              'json'
            )
          );
          return;
        }

        console.log(
          renderCommandResult(
            success(
              {
                skillName,
                recordsCount: records.length,
                summary: view.summary,
                data: view.data,
              },
              { command: `summary ${skillName}` }
            ),
            'json'
          )
        );
        return;
      }

      await renderCommandResultWithInk(view);
    });
}
