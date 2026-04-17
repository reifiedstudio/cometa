import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.INTAKE_API_PORT ?? 3006);

export default {
  port,
  fetch: app.fetch,
};

console.log(`Intake API running on http://localhost:${port}`);
