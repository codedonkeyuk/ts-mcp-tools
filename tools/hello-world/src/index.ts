import { z } from "zod";

export const helloWorldTool = {
  name: "hello_world",
  description: "A tool that greets a user by their name.",

  schema: {
    name: z.string().describe("The name of the person to greet"),
  },

  execute: async (args: { name: string }) => {
    return {
      content: [
        {
          type: "text" as const,
          text: `Hello, ${args.name}!`,
        },
      ],
    };
  },
};
