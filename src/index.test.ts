// server.test.js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { McpServer } from "@modelcontextprotocol/server";
import { helloWorldTool } from "@mcp/hello-world";

test("MCP Server initialization", async (t) => {
  await t.test("should create server without errors", () => {
    const server = new McpServer({
      name: "ts-mcp-tools-server",
      version: "1.0.0",
    });

    assert.ok(server, "Server instance should be created");
    assert.equal(typeof server, "object", "Server should be an object");
  });

  await t.test("should register helloWorldTool with registerTool (v2)", () => {
    const server = new McpServer({
      name: "ts-mcp-tools-server",
      version: "1.0.0",
    });

    // v2 registerTool signature: registerTool(name, config, handler)
    assert.doesNotThrow(() => {
      server.registerTool(
        helloWorldTool.name,
        {
          description: helloWorldTool.description,
          inputSchema: helloWorldTool.schema,
        },
        async (args) => {
          return await helloWorldTool.execute(args);
        }
      );
    });
  });

  await t.test("should execute helloWorldTool correctly", async () => {
    const result = await helloWorldTool.execute({ name: "Test" });
    
    assert.ok(result, "Tool should return a result");
    assert.equal(typeof result, "object", "Result should be an object");
  });

  await t.test("should handle tool registration and execution", async () => {
    const server = new McpServer({
      name: "ts-mcp-tools-server",
      version: "1.0.0",
    });

    assert.doesNotThrow(() => {
      server.registerTool(
        helloWorldTool.name,
        {
          description: helloWorldTool.description,
          inputSchema: helloWorldTool.schema,
        },
        async (args) => {
          return await helloWorldTool.execute(args);
        }
      );
    });

    assert.ok(typeof server.registerTool === "function");
  });
});

test("Tool properties", async (t) => {
  await t.test("helloWorldTool should have required properties", () => {
    assert.ok(helloWorldTool.name, "Tool should have a name");
    assert.equal(typeof helloWorldTool.name, "string", "Tool name should be a string");
    
    assert.ok(helloWorldTool.description, "Tool should have a description");
    assert.equal(typeof helloWorldTool.description, "string", "Tool description should be a string");
    
    assert.ok(helloWorldTool.schema, "Tool should have a schema");
    assert.ok(typeof helloWorldTool.execute === "function", "Tool should have an execute method");
  });

  await t.test("helloWorldTool schema should be valid", () => {
    const schema = helloWorldTool.schema;
    
    // Check if it's a Zod schema or other Standard Schema
    assert.ok(
      schema._def || typeof schema.parse === "function" || typeof schema === "object",
      "Schema should be a valid Standard Schema"
    );
  });
});

test("Tool execution", async (t) => {
  await t.test("should execute helloWorldTool with valid input", async () => {
    const result = await helloWorldTool.execute({ name: "World" });
    assert.ok(result, "Should return a result");
  });

  await t.test("should handle tool execution errors gracefully", async () => {
    try {
      const result = await helloWorldTool.execute({});
      assert.ok(result !== undefined, "Should handle the call");
    } catch (error) {
      assert.ok(error instanceof Error, "Should throw a proper error");
    }
  });
});

test("Server integration", async (t) => {
  await t.test("should create a fully configured server with v2 API", () => {
    const server = new McpServer({
      name: "ts-mcp-tools-server",
      version: "1.0.0",
    });

    assert.doesNotThrow(() => {
      server.registerTool(
        helloWorldTool.name,
        {
          description: helloWorldTool.description,
          inputSchema: helloWorldTool.schema,
        },
        async (args) => {
          return await helloWorldTool.execute(args);
        }
      );
    }, "Should register tool without errors");
  });
});
