import assert from "node:assert";
import { test } from "node:test";
import { z } from "zod";
import { helloWorldTool } from "./index.ts";

test("helloWorldTool.schema validates correct input", () => {
  const validData = { name: "World" };

  const runtimeSchema = z.object(helloWorldTool.schema);
  const result = runtimeSchema.parse(validData);

  assert.strictEqual(result.name, "World");
});

test("helloWorldTool.execute returns correctly formatted response", async () => {
  const args = { name: "Developer" };

  const result = await helloWorldTool.execute(args);

  assert.ok(Array.isArray(result.content), "Result content should be an array");
  assert.strictEqual(result.content.length, 1);
  assert.strictEqual(result.content[0].type, "text");
  assert.strictEqual(result.content[0].text, "Hello, Developer!");
});

test("helloWorldTool.execute handles unusual but valid string inputs", async () => {
  const args = { name: "123_Special_Chars!" };
  const result = await helloWorldTool.execute(args);
  assert.strictEqual(result.content[0].text, "Hello, 123_Special_Chars!!");
});
