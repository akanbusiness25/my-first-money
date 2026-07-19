import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const listed = execFileSync(
  "git",
  ["ls-files", "-co", "--exclude-standard", "-z"],
  {
    encoding: "utf8",
  },
);

const patterns = [
  [
    "OpenAI-style secret",
    new RegExp("s" + "k-(?:proj-)?[A-Za-z0-9_-]{20,}", "g"),
  ],
  [
    "private key",
    new RegExp("BEGIN " + "(?:RSA |EC |OPENSSH )?PRIVATE KEY", "g"),
  ],
  [
    "assigned OpenAI credential",
    new RegExp("OPENAI_" + "API_KEY\\s*=\\s*[^#\\s][^\\s]*", "g"),
  ],
];

const binaryExtensions = /\.(?:png|jpe?g|gif|webp|ico|woff2?|zip|gz|pdf)$/i;
const findings = [];

for (const file of listed.split("\0").filter(Boolean)) {
  if (binaryExtensions.test(file) || file === "pnpm-lock.yaml") continue;
  if (statSync(file).size > 2_000_000) continue;
  const text = readFileSync(file, "utf8");
  for (const [label, pattern] of patterns) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) findings.push(`${file}: ${label}`);
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log(
  `Secret scan passed (${listed.split("\0").filter(Boolean).length} files considered).`,
);
