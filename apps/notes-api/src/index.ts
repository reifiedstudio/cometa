import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.NOTES_API_PORT ?? 3009);

console.log(`Notes API listening on http://localhost:${port}`);

export default { port, fetch: app.fetch };
