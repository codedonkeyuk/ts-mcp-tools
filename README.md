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
| `npm run build`    | builds the executable bundle uyusing esbuild                               |

## General Instructions

Out of the box you can build a hello world example. Before coding you should attempt to install this into your LLM as is. From first hand experience each LLM client is very different. It might not work and you don't want to waste your time building something that does not work. *FYI* This has been tested on Libre Chat.