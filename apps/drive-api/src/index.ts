import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.DRIVE_PORT ?? 3004);

export default {
  port,
  fetch: app.fetch,
};

console.log(`Drive API running on http://localhost:${port}`);
