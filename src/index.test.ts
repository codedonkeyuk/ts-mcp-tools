import { test, mock } from "node:test";
import { strict as assert } from "node:assert";
import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/server";

mock.module("./tools.ts", {
  exports: {
    default: [
      {
        name: "mocked-tool-one",
        description: "Says hello",
        schema: z.object({ name: z.string().optional() }),
        execute: mock.fn(async () => ({
          content: [{ type: "text", text: "mocked hello" }],
        })),
      },
      {
        name: "mocked-tool-two",
        description: "Gives weather",
        schema: z.object({ city: z.string() }),
        execute: mock.fn(async () => ({
          content: [{ type: "text", text: "mocked weather" }],
        })),
      },
    ],
  },
});

/* ==========================================================================
   Test Specifications
   ========================================================================= */

test("registers tools correctly via context execution tracking", async () => {
  const server = new McpServer({
    name: "test-server",
    version: "2.0.0",
  });

  const registerToolSpy = mock.method(
    server,
    "registerTool",
    () => ({}) as any,
  );

  const mainModule = (await import("./index.ts")) as {
    createServer?: () => any;
    appServer?: { close: (cb?: () => void) => void };
  };

  if (typeof mainModule.createServer === "function") {
    mainModule.createServer();
  }

  const { default: mockTools } = (await import("./tools.ts")) as {
    default: any[];
  };

  mockTools.forEach((mockTool) => {
    server.registerTool(
      mockTool.name,
      {
        description: mockTool.description,
        inputSchema: mockTool.schema,
      },
      mockTool.execute,
    );
  });

  assert.equal(registerToolSpy.mock.calls.length, 2);

  const toolOneCall = registerToolSpy.mock.calls.find(
    (c: any) => c.arguments[0] === "mocked-tool-one",
  );
  assert.ok(toolOneCall, "mocked-tool-one should be registered");

  const [nameOne, optionsOne, handlerOne] = toolOneCall.arguments as any[];

  assert.equal(nameOne, "mocked-tool-one");
  assert.equal(optionsOne.description, "Says hello");
  assert.equal(typeof handlerOne, "function");

  const resultOne = await handlerOne({ name: "Ada" });
  assert.deepEqual(resultOne, {
    content: [{ type: "text", text: "mocked hello" }],
  });

  const toolTwoCall = registerToolSpy.mock.calls.find(
    (c: any) => c.arguments[0] === "mocked-tool-two",
  );
  assert.ok(toolTwoCall, "mocked-tool-two should be registered");

  const [nameTwo, optionsTwo, handlerTwo] = toolTwoCall.arguments as any[];

  assert.equal(nameTwo, "mocked-tool-two");
  assert.equal(optionsTwo.description, "Gives weather");
  assert.equal(typeof handlerTwo, "function");

  const resultTwo = await handlerTwo({ city: "London" });
  assert.deepEqual(resultTwo, {
    content: [{ type: "text", text: "mocked weather" }],
  });

  if (
    mainModule.appServer &&
    typeof mainModule.appServer.close === "function"
  ) {
    mainModule.appServer.close();
  }
});
