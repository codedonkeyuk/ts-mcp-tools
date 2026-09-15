import { test } from 'node:test';
import assert from 'node:assert';
import { helloWorldTool } from './index.ts';

test('helloWorldTool returns correct MCP compliant structure', async () => {
  const result = await helloWorldTool.execute({ name: 'Human' });
  
  assert.strictEqual(result.content[0].text, 'Hello, Human!');
  assert.strictEqual(result.content[0].type, 'text');
});