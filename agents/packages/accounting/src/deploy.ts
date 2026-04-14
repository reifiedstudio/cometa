import { deployAll } from "@cometa/agents-sdk";
import { accounting } from "./index.js";

deployAll([accounting]).catch((err) => {
  console.error("Deploy failed:", err);
  process.exit(1);
});
