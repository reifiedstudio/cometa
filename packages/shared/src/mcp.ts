/**
 * Shared MCP utilities — used by all services that expose MCP tools.
 *
 * `zodToJsonSchema` converts Zod v4 internal representations to standard
 * JSON Schema objects. This is needed because `hono-openapi/zod`'s `resolver()`
 * is incompatible with Zod v4.
 *
 * `extractMcpTools` reads the internal tool registry from an McpServer instance
 * and returns a plain JSON tool catalog for the `/mcp/tools` endpoint.
 */

/** Convert a Zod v4 schema to a JSON Schema object */
export function zodToJsonSchema(schema: any): any {
  if (!schema) return { type: "object", properties: {} };
  const type = schema.type ?? schema.def?.type;
  if (type === "object") {
    const shape = schema.def?.shape ?? {};
    const properties: Record<string, any> = {};
    const required: string[] = [];
    for (const [key, val] of Object.entries(shape)) {
      const v = val as any;
      const vType = v.type ?? v.def?.type;
      if (vType === "optional") {
        properties[key] = zodToJsonSchema(v.def?.innerType);
      } else {
        properties[key] = zodToJsonSchema(v);
        required.push(key);
      }
      if (v.description) properties[key].description = v.description;
    }
    const result: any = { type: "object", properties };
    if (required.length > 0) result.required = required;
    return result;
  }
  if (type === "string") {
    const result: any = { type: "string" };
    if (schema.def?.values) {
      result.enum = Array.isArray(schema.def.values)
        ? schema.def.values
        : Object.values(schema.def.values);
    }
    return result;
  }
  if (type === "number") return { type: "number" };
  if (type === "boolean") return { type: "boolean" };
  if (type === "array") return { type: "array", items: zodToJsonSchema(schema.def?.element) };
  if (type === "enum") {
    const raw = schema.def?.entries ?? schema.def?.values;
    const values = raw ? (Array.isArray(raw) ? raw : Object.values(raw)) : [];
    return { type: "string", enum: values };
  }
  if (type === "record") return { type: "object", additionalProperties: true };
  return {};
}

/** Extract tool catalog from an McpServer instance for the `/mcp/tools` endpoint */
export function extractMcpTools(mcpServer: any): {
  total: number;
  tools: { name: string; description: string; inputSchema?: any }[];
} {
  const toolsMap = mcpServer._registeredTools;
  const tools: { name: string; description: string; inputSchema?: any }[] = [];

  const extract = (t: any, name: string) => {
    if (t.enabled === false) return;
    const entry: any = { name, description: t.description ?? "" };
    if (t.inputSchema) entry.inputSchema = zodToJsonSchema(t.inputSchema);
    tools.push(entry);
  };

  if (toolsMap && typeof toolsMap.forEach === "function") {
    toolsMap.forEach((t: any, name: string) => extract(t, name));
  } else if (toolsMap && typeof toolsMap === "object") {
    for (const [name, t] of Object.entries(toolsMap as Record<string, any>)) extract(t, name);
  }

  return { total: tools.length, tools };
}
