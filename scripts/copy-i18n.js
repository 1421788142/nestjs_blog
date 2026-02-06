import fs from "fs";
import path from "path";

const src = path.resolve("src/i18n");
const dest = path.resolve("dist/src/i18n");

if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });

console.log("✅ i18n files copied to dist/i18n");
