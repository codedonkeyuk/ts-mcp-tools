export const helloWorldTool = {
  name: "hello-world",
  description: "A simple hello world tool",
  execute: (name: string): string => `Hello, ${name}!`,
};
