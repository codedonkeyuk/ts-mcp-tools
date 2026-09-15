import { test, mock } from "node:test";
import { strict as assert } from "node:assert";

const executeMock = mock.fn(async (args: any) => {
  return { content: [{ type: "text", text: "mocked hello" }] };
});

const registerToolMock = mock.fn();

mock.module("@mcp/hello-world", {
  namedExports: {
    helloWorldTool: {
      name: "helloWorld",
      description: "Says hello",
      schema: { type: "object" },
      execute: executeMock,
    },
  },
});

mock.module("@modelcontextprotocol/server", {
  namedExports: {
    McpServer: class {
      registerTool = registerToolMock;
      connect = mock.fn(async () => {});
    },
  },
});

mock.module("@modelcontextprotocol/server/stdio", {
  namedExports: {
    StdioServerTransport: class {},
  },
});

test("registers helloWorld tool with correct handler", async () => {
  await import("./index.ts");

  assert.equal(registerToolMock.mock.calls.length, 1);

  const [name, options, handler] = registerToolMock.mock.calls[0].arguments;

  assert.equal(name, "helloWorld");
  assert.equal(options.description, "Says hello");
  assert.deepEqual(options.inputSchema, { type: "object" });
  assert.equal(typeof handler, "function");

  const result = await handler({ name: "Ada" });
  assert.deepEqual(result, {
    content: [{ type: "text", text: "mocked hello" }],
  });

  assert.equal(executeMock.mock.calls.length, 1);
});
