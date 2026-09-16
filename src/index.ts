import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { helloWorldTool } from "@mcp/hello-world";
import express, { type Request, type Response } from "express";

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

const app = express();
app.use(express.json());

app.get("/ping", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const mcpHandler = createMcpHandler(() => server);
const nodeHandler = toNodeHandler(mcpHandler);

app.all("/mcp", (req: Request, res: Response) => {
  void nodeHandler(req, res, req.body);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.error(`MCP Stateless Server running on port ${PORT}`);
});
