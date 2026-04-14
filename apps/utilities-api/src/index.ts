import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.UTILITIES_PORT ?? 3008);

export default {
  port,
  fetch: app.fetch,
};

console.log(`Utilities API running on http://localhost:${port}`);
