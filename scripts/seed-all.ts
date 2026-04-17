#!/usr/bin/env bun
/**
 * Runs all per-service seed scripts in sequence with clear output.
 *
 * Each service owns its seed logic under `apps/<svc>/scripts/seed.ts` and
 * registers a `seed` script in its package.json. This orchestrator just
 * kicks each one off with the root .env loaded.
 */
import { spawn } from "node:child_process";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;

interface Target {
  name: string;
  cwd: string;
}

const targets: Target[] = [
  { name: "intake-api  ", cwd: join(ROOT, "apps/intake-api") },
  { name: "signatures-api", cwd: join(ROOT, "apps/signatures-api") },
  { name: "tasks-api    ", cwd: join(ROOT, "apps/tasks-api") },
  { name: "gateway (notes)", cwd: join(ROOT, "apps/gateway") },
];

function runOne(t: Target): Promise<{ name: string; ok: boolean }> {
  return new Promise((resolve) => {
    const envFile = join(ROOT, ".env");
    const proc = spawn("bun", [`--env-file=${envFile}`, "run", "seed"], {
      cwd: t.cwd,
      stdio: "inherit",
    });
    proc.on("exit", (code) => {
      resolve({ name: t.name, ok: code === 0 });
    });
  });
}

async function main() {
  console.log("\n╔══ Seeding all services ══╗\n");
  const results: { name: string; ok: boolean }[] = [];

  for (const t of targets) {
    console.log(`\n── ${t.name.trim()} ──`);
    const result = await runOne(t);
    results.push(result);
  }

  console.log("\n╔══ Summary ══╗");
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    console.log(`  ${mark} ${r.name.trim()}`);
  }

  const anyFailed = results.some((r) => !r.ok);
  process.exit(anyFailed ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
