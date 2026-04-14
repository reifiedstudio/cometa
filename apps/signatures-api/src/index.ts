import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.SIGNATURES_PORT ?? 3007);

export default {
  port,
  fetch: app.fetch,
};

console.log(`Signatures API running on http://localhost:${port}`);
