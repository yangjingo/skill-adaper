require('ts-node/register/transpile-only');

const assert = require('assert');
const {
  failure,
  printCommandResult,
  renderJsonCommandResult,
  renderTextCommandResult,
  success,
} = require('../src/commands');

function run() {
  const ok = success({ name: 'demo', enabled: true }, { command: 'demo:list', durationMs: 12 });
  const text = renderTextCommandResult(ok);
  const json = renderJsonCommandResult(ok);

  assert.ok(text.includes('Success'));
  assert.ok(text.includes('demo:list'));
  assert.ok(json.includes('"success": true'));

  const parsedOk = JSON.parse(json);
  assert.strictEqual(parsedOk.success, true);
  assert.strictEqual(parsedOk.data.name, 'demo');

  const err = failure(new Error('boom'), { command: 'demo:run' });
  const errText = renderTextCommandResult(err);
  const errJson = renderJsonCommandResult(err);

  assert.ok(errText.includes('Failure [UNKNOWN]'));
  assert.ok(errText.includes('boom'));
  assert.ok(errJson.includes('"success": false'));

  const parsedErr = JSON.parse(errJson);
  assert.strictEqual(parsedErr.success, false);
  assert.strictEqual(parsedErr.error.message, 'boom');

  let captured = '';
  const printed = printCommandResult(ok, {
    stdout: value => {
      captured = value;
    }
  });

  assert.strictEqual(captured, printed);
  assert.ok(captured.includes('demo:list'));

  console.log('PASS(command-result): result helpers and renderers behave as expected');
}

run();
