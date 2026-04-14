import type { AgentDefinition } from "../types.js";
import { accounting } from "./accounting.js";
import { legal } from "./legal.js";

/** All task agent definitions — add new tasks here */
export const tasks: AgentDefinition[] = [accounting, legal];

export { accounting, legal };
