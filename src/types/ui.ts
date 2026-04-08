export type CommandResultStatus = 'success' | 'failure';

export interface CommandResult {
  status: CommandResultStatus;
  title?: string;
  summary?: string;
  details?: string;
  data?: unknown;
  nextSteps?: readonly string[];
  error?: string | Error | unknown;
}

export interface ResultViewOptions {
  maxDataDepth?: number;
  maxDataEntries?: number;
  maxNextSteps?: number;
}

export interface RenderCommandResultOptions extends ResultViewOptions {
  stdout?: NodeJS.WriteStream;
  stderr?: NodeJS.WriteStream;
  preferInk?: boolean;
}

export interface RenderCommandResultOutcome {
  mode: 'ink' | 'text';
  text: string;
  usedInk: boolean;
}
