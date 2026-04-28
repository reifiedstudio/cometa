import Anthropic from "@anthropic-ai/sdk";
const c = new Anthropic();
const id = process.argv[2];
const events = await c.beta.sessions.events.list(id, { limit: 50 });
for (const ev of events.data) {
  console.log(JSON.stringify(ev, null, 2));
  console.log('---');
}
