import Anthropic from "@anthropic-ai/sdk";
const c = new Anthropic();
const id = process.argv[2];
const events = await c.beta.sessions.events.list(id, { limit: 50 });
for (const ev of events.data) {
  const e = ev as any;
  const summary = e.type === "tool_use" ? `tool_use ${e.name}(${JSON.stringify(e.input).slice(0, 80)})`
    : e.type === "tool_result" ? `tool_result is_error=${e.is_error} content=${JSON.stringify(e.content).slice(0, 100)}`
    : e.type === "text" ? `text "${e.text?.slice(0,100)}"`
    : e.type;
  console.log(`[${e.created_at}] ${summary}`);
}
