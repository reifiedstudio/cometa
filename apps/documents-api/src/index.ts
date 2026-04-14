import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.DOCUMENTS_API_PORT ?? 3006);

export default {
  port,
  fetch: app.fetch,
};

console.log(`Documents API running on http://localhost:${port}`);
