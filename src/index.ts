import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import { createMcpExpressApp } from "@modelcontextprotocol/express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { helloWorldTool } from "@mcp/hello-world";
import { type Request, type Response } from "express";

const server = new McpServer({
  name: "ts-mcp-tools-server",
  version: "2.0.0",
});

server.registerTool(
  helloWorldTool.name,
  {
    description: helloWorldTool.description,
    inputSchema: helloWorldTool.schema,
  },
  helloWorldTool.execute,
);

const app = createMcpExpressApp();

const mcpHandler = createMcpHandler(() => server);
const nodeHandler = toNodeHandler(mcpHandler);

app.all("/mcp", (req: Request, res: Response) => {
  void nodeHandler(req, res, req.body);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.error(`MCP Stateless Server running on port ${PORT}`);
});
