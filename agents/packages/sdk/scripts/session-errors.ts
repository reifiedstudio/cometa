import Anthropic from "@anthropic-ai/sdk";
const c = new Anthropic();
const id = process.argv[2];
const events = await c.beta.sessions.events.list(id, { limit: 50 });
for (const ev of events.data) {
  const e = ev as any;
  if (e.type === "session.error" || e.type === "span.model_request_end") {
    console.log(JSON.stringify(e, null, 2));
    console.log('---');
  }
}
