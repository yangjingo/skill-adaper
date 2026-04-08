import type { CommandResult, ResultViewOptions } from '../types/ui';

export interface ReactLike {
  createElement: (...args: unknown[]) => unknown;
}

export interface InkRuntime {
  React: ReactLike;
  Box: unknown;
  Text: unknown;
}

export interface ResultViewModel {
  header: string;
  summary?: string;
  details?: string;
  error?: string;
  dataLines: string[];
  nextStepLines: string[];
}

export interface ResultViewProps extends ResultViewOptions {
  result: CommandResult;
  runtime?: InkRuntime | null;
}

const DEFAULT_MAX_DATA_DEPTH = 2;
const DEFAULT_MAX_DATA_ENTRIES = 6;
const DEFAULT_MAX_NEXT_STEPS = 5;

export function buildResultViewModel(result: CommandResult, options: ResultViewOptions = {}): ResultViewModel {
  const title = normalizeText(result.title) ?? (result.status === 'success' ? 'Success' : 'Failure');
  const summary = normalizeText(result.summary);
  const details = normalizeText(result.details);
  const error = normalizeError(result.error);
  const dataLines = result.data === undefined
    ? []
    : ['Data:', ...formatStructuredValue(result.data, {
        maxDataDepth: options.maxDataDepth ?? DEFAULT_MAX_DATA_DEPTH,
        maxDataEntries: options.maxDataEntries ?? DEFAULT_MAX_DATA_ENTRIES,
      }, 0, '  ', new WeakSet<object>())];
  const nextStepLines = buildNextStepLines(result.nextSteps, options.maxNextSteps ?? DEFAULT_MAX_NEXT_STEPS);

  return {
    header: `[${result.status.toUpperCase()}] ${title}`,
    summary,
    details,
    error,
    dataLines,
    nextStepLines,
  };
}

export function renderResultViewText(result: CommandResult, options: ResultViewOptions = {}): string {
  const model = buildResultViewModel(result, options);
  return renderResultViewModelText(model);
}

export function renderResultViewModelText(model: ResultViewModel): string {
  const lines: string[] = [model.header];

  if (model.summary) {
    lines.push('', `Summary: ${model.summary}`);
  }

  if (model.details) {
    lines.push('', 'Details:', indentLines(model.details.split(/\r?\n/), '  '));
  }

  if (model.error) {
    lines.push('', `Error: ${model.error}`);
  }

  if (model.dataLines.length > 0) {
    lines.push('', ...model.dataLines);
  }

  if (model.nextStepLines.length > 0) {
    lines.push('', ...model.nextStepLines);
  }

  return lines.flat().join('\n');
}

export function ResultView(props: ResultViewProps): string | unknown {
  const model = buildResultViewModel(props.result, props);

  if (!props.runtime) {
    return renderResultViewModelText(model);
  }

  return createInkResultViewNode(props.runtime, model);
}

export function createInkResultViewNode(runtime: InkRuntime, model: ResultViewModel): unknown {
  const { React, Box, Text } = runtime;
  const children: unknown[] = [
    React.createElement(Text as never, { bold: true }, model.header),
  ];

  if (model.summary) {
    children.push(createSectionNode(React, Box, Text, 'Summary', [model.summary]));
  }

  if (model.details) {
    children.push(createSectionNode(React, Box, Text, 'Details', model.details.split(/\r?\n/)));
  }

  if (model.error) {
    children.push(createSectionNode(React, Box, Text, 'Error', [model.error]));
  }

  if (model.dataLines.length > 0) {
    children.push(createSectionNode(React, Box, Text, 'Data', model.dataLines.slice(1)));
  }

  if (model.nextStepLines.length > 0) {
    children.push(createSectionNode(React, Box, Text, 'Next Steps', model.nextStepLines.slice(1)));
  }

  return React.createElement(
    Box as never,
    { flexDirection: 'column' },
    ...children,
  );
}

function createSectionNode(
  React: ReactLike,
  Box: unknown,
  Text: unknown,
  title: string,
  lines: readonly string[],
): unknown {
  const body = lines.length > 0 ? lines : [''];

  return React.createElement(
    Box as never,
    { flexDirection: 'column', marginTop: 1 },
    React.createElement(Text as never, { bold: true }, title),
    ...body.map((line) => React.createElement(Text as never, undefined, line)),
  );
}

function buildNextStepLines(nextSteps: readonly string[] | undefined, maxNextSteps: number): string[] {
  if (!nextSteps || nextSteps.length === 0) {
    return [];
  }

  const lines = ['Next Steps:'];
  nextSteps.slice(0, maxNextSteps).forEach((step, index) => {
    lines.push(`  ${index + 1}. ${normalizeText(step) ?? ''}`);
  });

  if (nextSteps.length > maxNextSteps) {
    lines.push(`  ... ${nextSteps.length - maxNextSteps} more`);
  }

  return lines;
}

function formatStructuredValue(
  value: unknown,
  options: Required<Pick<ResultViewOptions, 'maxDataDepth' | 'maxDataEntries'>>,
  depth: number,
  indent: string,
  seen: WeakSet<object>,
): string[] {
  if (value === null || isPrimitive(value)) {
    return [`${indent}${formatScalar(value)}`];
  }

  if (depth >= options.maxDataDepth) {
    return [`${indent}${summarizeContainer(value)}`];
  }

  if (value instanceof Date) {
    return [`${indent}${value.toISOString()}`];
  }

  if (value instanceof RegExp) {
    return [`${indent}${value.toString()}`];
  }

  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return [`${indent}[Circular]`];
    }
    seen.add(value);

    const lines = [`${indent}Array(${value.length})`];
    value.slice(0, options.maxDataEntries).forEach((item, index) => {
      lines.push(...renderEntry(`[${index}]`, item, options, depth, indent, seen));
    });

    if (value.length > options.maxDataEntries) {
      lines.push(`${indent}  ... ${value.length - options.maxDataEntries} more`);
    }

    return lines;
  }

  if (value instanceof Map) {
    if (seen.has(value)) {
      return [`${indent}[Circular Map]`];
    }
    seen.add(value);

    const lines = [`${indent}Map(${value.size})`];
    Array.from(value.entries()).slice(0, options.maxDataEntries).forEach(([key, item]) => {
      lines.push(...renderEntry(formatScalar(key), item, options, depth, indent, seen));
    });

    if (value.size > options.maxDataEntries) {
      lines.push(`${indent}  ... ${value.size - options.maxDataEntries} more`);
    }

    return lines;
  }

  if (value instanceof Set) {
    if (seen.has(value)) {
      return [`${indent}[Circular Set]`];
    }
    seen.add(value);

    const lines = [`${indent}Set(${value.size})`];
    Array.from(value.values()).slice(0, options.maxDataEntries).forEach((item, index) => {
      lines.push(...renderEntry(String(index), item, options, depth, indent, seen));
    });

    if (value.size > options.maxDataEntries) {
      lines.push(`${indent}  ... ${value.size - options.maxDataEntries} more`);
    }

    return lines;
  }

  if (isRecord(value)) {
    if (seen.has(value)) {
      return [`${indent}[Circular Object]`];
    }
    seen.add(value);

    const keys = Object.keys(value);
    const lines = [`${indent}Object(${keys.length})`];

    keys.slice(0, options.maxDataEntries).forEach((key) => {
      lines.push(...renderEntry(key, value[key], options, depth, indent, seen));
    });

    if (keys.length > options.maxDataEntries) {
      lines.push(`${indent}  ... ${keys.length - options.maxDataEntries} more`);
    }

    return lines;
  }

  return [`${indent}${summarizeContainer(value)}`];
}

function renderEntry(
  key: string,
  value: unknown,
  options: Required<Pick<ResultViewOptions, 'maxDataDepth' | 'maxDataEntries'>>,
  depth: number,
  indent: string,
  seen: WeakSet<object>,
): string[] {
  if (value === null || isPrimitive(value) || value instanceof Date || value instanceof RegExp) {
    return [`${indent}  ${key}: ${formatScalar(value)}`];
  }

  const nested = formatStructuredValue(value, options, depth + 1, `${indent}    `, seen);
  return [`${indent}  ${key}:`, ...nested];
}

function summarizeContainer(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof RegExp) {
    return value.toString();
  }

  if (Array.isArray(value)) {
    return `Array(${value.length})`;
  }

  if (value instanceof Map) {
    return `Map(${value.size})`;
  }

  if (value instanceof Set) {
    return `Set(${value.size})`;
  }

  if (isRecord(value)) {
    return `Object(${Object.keys(value).length})`;
  }

  return formatScalar(value);
}

function formatScalar(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (value === undefined) {
    return 'undefined';
  }

  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  if (typeof value === 'symbol') {
    return value.toString();
  }

  if (typeof value === 'function') {
    return `[Function ${value.name || 'anonymous'}]`;
  }

  if (value instanceof Error) {
    return `${value.name}: ${value.message}`;
  }

  try {
    const serialized = JSON.stringify(value);
    return serialized ?? String(value);
  } catch {
    return String(value);
  }
}

function normalizeError(error: unknown): string | undefined {
  if (error === undefined || error === null) {
    return undefined;
  }

  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  if (typeof error === 'string') {
    return error;
  }

  return formatScalar(error);
}

function normalizeText(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function indentLines(lines: readonly string[], indent: string): string {
  return lines.map((line) => `${indent}${line}`).join('\n');
}

function isPrimitive(value: unknown): value is string | number | boolean | bigint | symbol | undefined | null {
  const type = typeof value;
  return value === null || type === 'string' || type === 'number' || type === 'boolean' || type === 'bigint' || type === 'symbol' || type === 'undefined';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date) && !(value instanceof RegExp) && !(value instanceof Map) && !(value instanceof Set);
}
