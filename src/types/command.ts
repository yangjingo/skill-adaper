/**
 * Command result and error model used by command-level helpers.
 */

export type CommandOutputFormat = 'text' | 'json';

export type CommandErrorCode =
  | 'UNKNOWN'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CANCELLED'
  | 'IO_ERROR'
  | 'PARSE_ERROR'
  | 'INVALID_STATE'
  | 'UNSUPPORTED';

export interface CommandError {
  code: CommandErrorCode | (string & {});
  message: string;
  details?: unknown;
  cause?: unknown;
  exitCode?: number;
}

export interface CommandResultMeta {
  command?: string;
  durationMs?: number;
  timestamp?: string;
  [key: string]: unknown;
}

export interface CommandSuccess<T> {
  success: true;
  data: T;
  meta?: CommandResultMeta;
}

export interface CommandFailure {
  success: false;
  error: CommandError;
  meta?: CommandResultMeta;
}

export type CommandResult<T = unknown> = CommandSuccess<T> | CommandFailure;
