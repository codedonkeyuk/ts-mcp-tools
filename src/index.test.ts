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
    },
    createMcpHandler: mock.fn(() => mock.fn()),
  },
});

mock.module("@modelcontextprotocol/express", {
  namedExports: {
    createMcpExpressApp: mock.fn(() => ({
      all: mock.fn(),
      listen: mock.fn((port, cb) => {
        if (typeof cb === "function") cb();
      }),
    })),
  },
});

mock.module("@modelcontextprotocol/node", {
  namedExports: {
    toNodeHandler: mock.fn(() => mock.fn()),
  },
});

test("registers helloWorld tool with correct handler", async () => {
  await import(`./index.ts?update=${Date.now()}`);

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
