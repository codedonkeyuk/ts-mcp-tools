import { test } from 'node:test';
import assert from 'node:assert';
import { helloWorldTool } from './index.ts';

test('helloWorldTool returns correct string', () => {
  const result = helloWorldTool.execute('Human');
  assert.strictEqual(result, 'Hello, Human!');
});