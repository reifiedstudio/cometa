import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.GATEWAY_PORT ?? 3002);

export default {
  port,
  fetch: app.fetch,
};

console.log(`Gateway running on http://localhost:${port}`);
console.log(`API docs: http://localhost:${port}/docs`);
console.log(`MCP endpoint: http://localhost:${port}/mcp`);
