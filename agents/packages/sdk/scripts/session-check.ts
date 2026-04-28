import Anthropic from "@anthropic-ai/sdk";
const c = new Anthropic();
const session = await c.beta.sessions.retrieve("sesn_011CaUrqEZjyHzzzff13VS4w");
console.log(JSON.stringify({ id: session.id, status: session.status, error: (session as any).error, vault_ids: (session as any).vault_ids, agent: (session as any).agent?.id, latest: (session as any).latest_event_id }, null, 2));
