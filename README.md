# ts-mcp-tools

This is a starter template for a MCP project. Its a multi module project each MCP tool is a child of the parent (/tools/*). When compiled a MCPServer is produced with all of its children and dependencies in a single JS executable file. This allows for simpler deployment.

## Commands

| code               | description                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| `npm install`      | install dependencies                                                       |
| `nvm use`          | use node version specified in projects .nvmrc file. (NVM needs installing) |
| `npm run test`     | run node:test library                                                      |
| `npm run clean`    | clean project using prettier                                               |
| `npm run validate` | validate code using typescript compiler. Does not generate files           |
| `npm run serve`    | serve MCP locally                                                          |

## Instructions

### Setting up Docker

This project has been designed to be deployed as docker compose container, and is accessible over a network bridge.

To create the bridge issues the following command on your target server.

```
docker network create mcp-tools-net
```

Update your main project / LLM client to use that bridge

```
services:
  LLMChatService:
  ...
  networks:
    - mcp_network
...
...
networks:
  mcp_network:
    external: true
    name: mcp-tools-net
```

No ports are exposed in the project as is. To see its alive and running use the following commands

```bash
docker exec -it custom-mcp-server wget -qO- http://localhost:3000/ping
# should return {"status":"ok", "timestamp": "..."}

docker compose logs custom-mcp-server
```
