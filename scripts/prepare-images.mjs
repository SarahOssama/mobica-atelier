/**
 * prepare-images.mjs
 * -------------------
 * Reads source images inside public/images/ and produces:
 *
 *   claddings/{id}/
 *     preview.jpg  ← full-size JPEG (background layer, no transparency needed)
 *     thumb.jpg    ← 400×300 JPEG thumbnail (4:3 crop from centre)
 *
 *   desks/{id}/
 *     preview.jpg  ← full-size JPEG
 *     thumb.jpg    ← 400×300 JPEG thumbnail (4:3 crop from centre)
 *
 *   sofas/{id}/
 *     preview.jpg  ← full-size JPEG
 *     thumb.jpg    ← 400×300 JPEG thumbnail
 *
 * Source file: any .jpeg/.jpg/.png in the item folder that does NOT start
 * with "preview" or "thumb".
 *
 * Uses only macOS `sips` — no npm dependencies required.
 * Run with:  node scripts/prepare-images.mjs
 */

import { execSync } from "child_process";
import { readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_ROOT = join(__dirname, "../public/images");

const THUMB_W = 400;
const THUMB_H = 300;

// ─── helpers ────────────────────────────────────────────────────────────────

function run(cmd) {
  try {
    execSync(cmd, { stdio: "pipe" });
  } catch (e) {
    console.error(`  ✗ command failed: ${cmd}`);
    console.error("   ", e.stderr?.toString().trim() ?? e.message);
  }
}

/** Use sips to resize + convert a file. */
function sipsConvert(src, dest, { format, maxWidth, maxHeight } = {}) {
  let cmd = `sips`;
  if (format) cmd += ` -s format ${format}`;
  if (maxWidth && maxHeight) cmd += ` --resampleHeightWidthMax ${maxHeight}:${maxWidth}`;
  else if (maxWidth) cmd += ` --resampleWidth ${maxWidth}`;
  else if (maxHeight) cmd += ` --resampleHeight ${maxHeight}`;
  cmd += ` "${src}" --out "${dest}"`;
  run(cmd);
}

/**
 * Resize to fit within 400x300 and convert to JPEG.
 * Since source images are small, we just scale to fit (no crop, no black padding).
 * CSS object-fit: cover on the card handles the visual cropping.
 */
function makeThumbnail(src, dest) {
  // Convert to JPEG, scale so longest edge fits within 400×300
  sipsConvert(src, dest, { format: "jpeg", maxWidth: THUMB_W, maxHeight: THUMB_H });
}

// ─── helpers ────────────────────────────────────────────────────────────────

function findSourceImage(itemPath) {
  const files = readdirSync(itemPath);
  // Prefer a raw source image (not a generated output)
  const raw = files.find(f => {
    const lower = f.toLowerCase();
    return (lower.endsWith('.jpeg') || lower.endsWith('.jpg') || lower.endsWith('.png'))
      && !lower.startsWith('preview')
      && !lower.startsWith('thumb');
  });
  if (raw) return raw;
  // Fall back to preview.jpg for items where the original source is gone
  if (files.includes('preview.jpg')) return 'preview.jpg';
  return undefined;
}

// ─── main ───────────────────────────────────────────────────────────────────

const categories = readdirSync(IMAGES_ROOT).filter((name) => {
  const full = join(IMAGES_ROOT, name);
  return statSync(full).isDirectory() && name !== "." && name !== "..";
});

let processed = 0;
let skipped = 0;

for (const category of categories) {
  const categoryPath = join(IMAGES_ROOT, category);
  const isCladding = category === "claddings";
  const isDesk = category === "desks";
  const isSofa = category === "sofas";

  const items = readdirSync(categoryPath).filter((name) =>
    statSync(join(categoryPath, name)).isDirectory()
  );

  for (const item of items) {
    const itemPath = join(categoryPath, item);
    const srcFile = findSourceImage(itemPath);

    if (!srcFile) {
      console.log(`  ⚠  Skipping ${category}/${item} — no source image found`);
      skipped++;
      continue;
    }

    const src = join(itemPath, srcFile);
    console.log(`\n📂 ${category}/${item}`);

    // ── preview ──────────────────────────────────────────────────────────
    if ((isCladding || isDesk || isSofa) && srcFile !== "preview.jpg") {
      const dest = join(itemPath, "preview.jpg");
      console.log(`  → preview.jpg (JPEG, full size)`);
      sipsConvert(src, dest, { format: "jpeg" });
    }

    // ── thumbnail ────────────────────────────────────────────────────────
    const thumbDest = join(itemPath, "thumb.jpg");
    console.log(`  → thumb.jpg (${THUMB_W}×${THUMB_H} JPEG, centre-cropped)`);
    makeThumbnail(src, thumbDest);

    processed++;
  }
}

console.log(`\n✅ Done — ${processed} item(s) processed, ${skipped} skipped.\n`);
