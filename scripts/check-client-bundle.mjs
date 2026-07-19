import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = "apps/web/.next/static";
const forbidden = ["OPENAI_" + "API_KEY", "s" + "k-proj-", "gpt-5.6-sol"];
const findings = [];

function scan(directory) {
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) {
      scan(path);
      continue;
    }
    const content = readFileSync(path, "utf8");
    for (const marker of forbidden) {
      if (content.includes(marker)) findings.push(`${path}: ${marker}`);
    }
  }
}

scan(root);
if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}
console.log(
  "Client bundle contains no server credential name, key prefix, or live model id.",
);
