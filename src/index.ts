import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { helloWorldTool } from "@mcp/hello-world";

const server = new McpServer({
  name: "ts-mcp-tools-server",
  version: "1.0.0",
});

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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio transport");
}

main().catch((error) => {
  console.error("Server crashed:", error);
  process.exit(1);
});
