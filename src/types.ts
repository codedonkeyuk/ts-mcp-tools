import z from "zod";

export interface McpTool<T extends z.ZodObject<any>> {
  name: string;
  description: string;
  schema: T;
  execute: (args: z.infer<T>) => Promise<any>;
}
