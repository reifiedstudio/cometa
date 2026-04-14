import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.TASKS_API_PORT ?? 3005);

export default {
  port,
  fetch: app.fetch,
};

console.log(`Tasks API running on http://localhost:${port}`);
