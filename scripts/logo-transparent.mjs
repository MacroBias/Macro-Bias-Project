/**
 * One-off script: make logo.png white background transparent using sharp.
 * Run: node scripts/logo-transparent.mjs
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoPath = join(__dirname, "..", "public", "logo.png");

const WHITE_THRESHOLD = 250; // pixels with r,g,b all >= this become transparent

async function main() {
  const input = readFileSync(logoPath);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const bytes = new Uint8Array(data);
  const alphaIndex = channels - 1; // 4 for RGBA

  for (let i = 0; i < bytes.length; i += channels) {
    const r = bytes[i];
    const g = bytes[i + 1];
    const b = bytes[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      bytes[i + alphaIndex] = 0;
    }
  }

  await sharp(bytes, {
    raw: { width, height, channels },
  })
    .png()
    .toFile(logoPath);

  console.log("Logo background made transparent and saved to public/logo.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
