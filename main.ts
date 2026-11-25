import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "This ten-person meeting about a missing comma generated two new commas, an em dash, and a bearded man softly crying onto a folded snorkeling chart.";

// Sealed gate (verified from RULES.txt): /output/entry.txt must be UTF-8
// text of 1 to 200 characters, not only whitespace, a single line.
if (LINE.length < 1 || LINE.length > 200) {
  console.error(`entry must be 1-200 characters, got ${LINE.length}`);
  process.exit(1);
}
if (/\n|\r/.test(LINE)) {
  console.error("entry must be a single line");
  process.exit(1);
}
if (LINE.trim().length === 0) {
  console.error("entry must not be only whitespace");
  process.exit(1);
}

// Reject control characters (other than the trailing newline we add),
// which would make the file fail the sealed gate's UTF-8 text check.
if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(LINE)) {
  console.error("entry contains control characters");
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE + "\n", "utf8");

// Read-back check: the file on disk must be exactly the line + newline.
import { readFileSync } from "node:fs";
if (readFileSync(outPath, "utf8") !== LINE + "\n") {
  console.error("read-back mismatch: file on disk differs from entry");
  process.exit(1);
}
console.log(`wrote entry.txt (${LINE.length} chars)`);
