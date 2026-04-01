#!/usr/bin/env node

/**
 * Upload images to Cloudflare R2.
 *
 * Prerequisites:
 *   - wrangler CLI authenticated (`wrangler login`)
 *   - R2 bucket created (e.g., `joshferrara-images`)
 *
 * Usage:
 *   node scripts/upload-to-r2.js <file-or-directory> [--bucket=joshferrara-images] [--prefix=recaps/2025/]
 *
 * Examples:
 *   node scripts/upload-to-r2.js ./photos/vacation.jpg --prefix=recaps/2025/
 *   node scripts/upload-to-r2.js ./photos/ --prefix=recaps/2025/moments/
 */

import { execSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith('--'));
const bucket = args.find((a) => a.startsWith('--bucket='))?.split('=')[1] || 'joshferrara-images';
const prefix = args.find((a) => a.startsWith('--prefix='))?.split('=')[1] || '';

if (!input) {
  console.log('Usage: node scripts/upload-to-r2.js <file-or-dir> [--bucket=name] [--prefix=path/]');
  process.exit(1);
}

const stat = statSync(input);
const files = stat.isDirectory()
  ? readdirSync(input)
      .filter((f) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(f))
      .map((f) => join(input, f))
  : [input];

console.log(`Uploading ${files.length} file(s) to r2://${bucket}/${prefix}`);

for (const file of files) {
  const key = `${prefix}${basename(file)}`;
  console.log(`  ${basename(file)} → ${key}`);
  try {
    execSync(`wrangler r2 object put "${bucket}/${key}" --file="${file}"`, { stdio: 'inherit' });
  } catch (err) {
    console.error(`  Failed: ${err.message}`);
  }
}

console.log('\nDone. Files accessible at:');
console.log(`  https://images.joshferrara.com/${prefix}<filename>`);
console.log('  (Once R2 bucket is configured with custom domain or public access)');
