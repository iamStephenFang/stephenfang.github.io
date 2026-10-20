import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../../", import.meta.url);
const fonts = new URL("public/fonts/reading/", root);
const manifest = JSON.parse(
  await readFile(new URL("manifest.json", fonts), "utf8")
);
const covered = new Set(
  manifest.chunks.flatMap(chunk => [...chunk.characters])
);
const missing = new Set();
const cjk =
  /[\u2e80-\u9fff\uf900-\ufaff\ufe10-\ufe1f\ufe30-\ufe4f\uff00-\uffef\u{20000}-\u{323af}]/u;
const baseline = new Set(
  [
    ...(await readFile(
      new URL("scripts/fonts/common-characters.txt", root),
      "utf8"
    )),
  ].filter(character => cjk.test(character))
);
if (baseline.size !== 3755)
  throw new Error("Expected 3,755 baseline characters.");
for (const character of baseline) {
  if (!covered.has(character)) missing.add(character);
}

async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(
      entry.name + (entry.isDirectory() ? "/" : ""),
      directory
    );
    if (entry.isDirectory()) await check(path);
    else if (/\.(mdx?|astro|ts|json)$/.test(entry.name)) {
      for (const character of await readFile(path, "utf8")) {
        if (cjk.test(character) && !covered.has(character))
          missing.add(character);
      }
    }
  }
}

await check(new URL("src/", root));
for (const chunk of manifest.chunks) {
  const file = new URL(chunk.file, fonts);
  if ((await stat(file)).size !== chunk.bytes)
    throw new Error(`Font file changed: ${fileURLToPath(file)}`);
}
if (missing.size) {
  process.stderr.write(
    `CJK font subsets need ${missing.size} new characters: ${[...missing].join("")}\n`
  );
  process.stderr.write(
    "Regenerate with scripts/fonts/generate.py; see scripts/fonts/README.md.\n"
  );
  process.exitCode = 1;
} else {
  process.stdout.write(
    `CJK font coverage passed (${covered.size} characters, ${manifest.chunks.length} chunks).\n`
  );
}
