/**
 * Prefixed-ID helpers.
 *
 * Cometa uses single-prefix IDs across services so any ID identifies its
 * primitive type at a glance:
 *
 *   task_98801e47-fc77-4465-8d65-611b0006011a
 *   sig_e5c319a9-a0d5-4c53-8277-f402a9f5b892
 *   doc_55bd728b-fc9c-4a3a-b309-dbd0db8b37a5
 *   note_1777244809828
 *   msg_f55d08ed-9d2c-4adc-8040-f35758e033b1
 *   trace_87a5efc4-1101-4584-8399-c8aee2a14b8b
 *
 * The DB still stores bare UUIDs; the prefix is a presentation + parse layer.
 * `parseId` accepts both prefixed and bare forms forever — old links keep working.
 */

export type IdPrefix =
  | "task"
  | "msg"
  | "trace"
  | "doc"
  | "sig"
  | "sigfile"
  | "signer"
  | "note";

const VALID_PREFIXES: ReadonlySet<string> = new Set([
  "task",
  "msg",
  "trace",
  "doc",
  "sig",
  "sigfile",
  "signer",
  "note",
]);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Build a prefixed ID. Idempotent — if the input already carries the right prefix, returned as-is. */
export function withPrefix(prefix: IdPrefix, id: string): string {
  if (!id) return id;
  if (id.startsWith(`${prefix}_`)) return id;
  return `${prefix}_${id}`;
}

/**
 * Parse an ID. Strips a `<prefix>_` prefix if present and returns the bare body.
 *
 * - If `expectedPrefix` is provided and the input has a different prefix,
 *   throws — guards against `get_intake_document(sig_xxx)` style mistakes.
 * - If the input is already bare (no prefix), it is returned unchanged.
 *   This is the back-compat path for old URLs / messages that pre-date the
 *   prefix rollout.
 */
export function parseId(value: string, expectedPrefix?: IdPrefix): string {
  if (!value) throw new Error("parseId: empty value");
  const m = value.match(/^([a-z]+)_(.+)$/);
  if (!m) {
    // bare value — accept (back-compat).
    return value;
  }
  const [, prefix, body] = m;
  if (!VALID_PREFIXES.has(prefix)) {
    // Unknown prefix → treat the whole thing as the bare ID.
    // (e.g. legacy `note-1777244809828` would parse as bare since it uses `-` not `_`.)
    return value;
  }
  if (expectedPrefix && prefix !== expectedPrefix) {
    throw new Error(
      `parseId: expected '${expectedPrefix}_' prefix but got '${prefix}_'`,
    );
  }
  return body;
}

/**
 * Inspect an ID without throwing. Returns the prefix (if any) and the body.
 * Useful for routing logic — "what kind of thing is this ID?".
 */
export function tryParseId(
  value: string,
): { prefix: IdPrefix | undefined; id: string } {
  if (!value) return { prefix: undefined, id: value };
  const m = value.match(/^([a-z]+)_(.+)$/);
  if (!m) return { prefix: undefined, id: value };
  const [, prefix, body] = m;
  if (VALID_PREFIXES.has(prefix)) {
    return { prefix: prefix as IdPrefix, id: body };
  }
  return { prefix: undefined, id: value };
}

/** Validate that a parsed body looks like a UUID. Optional, opt-in by callers. */
export function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}
