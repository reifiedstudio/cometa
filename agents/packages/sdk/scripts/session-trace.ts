import Anthropic from "@anthropic-ai/sdk";
const c = new Anthropic();
const id = process.argv[2];
const events = await c.beta.sessions.events.list(id, { limit: 100 });
for (const ev of events.data) {
  const e = ev as any;
  if (e.type === "agent.mcp_tool_use") {
    console.log(`→ ${e.mcp_server_name}.${e.name}(${JSON.stringify(e.input).slice(0, 150)})`);
  } else if (e.type === "agent.mcp_tool_result") {
    const text = (e.content?.[0]?.text ?? "").replace(/\n/g, " ").slice(0, 180);
    console.log(`← ${e.is_error ? "ERR" : "ok"}: ${text}`);
  } else if (e.type === "agent.message") {
    const t = (e.content?.[0]?.text ?? "").slice(0, 200);
    if (t) console.log(`💬 ${t}`);
  } else if (e.type === "session.error") {
    console.log(`⚠️ ${JSON.stringify(e.error)}`);
  }
}
