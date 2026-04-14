import { deployAll } from "@cometa/agents-sdk";
import { legal } from "./index.js";

deployAll([legal]).catch((err) => {
  console.error("Deploy failed:", err);
  process.exit(1);
});
