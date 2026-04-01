#!/usr/bin/env node

/**
 * Clean up Svbtle artifacts from fetched posts:
 * - Remove the title/link header (# \n [Title](url)\n)
 * - Remove the Kudos block at the bottom
 * - Clean up leading/trailing whitespace
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const WRITING_DIR = join(import.meta.dirname, '..', 'src', 'content', 'writing');

const files = [
  'backward-compatability.md',
  'identity-and-motivation.md',
  'im-good-at-the-internet.md',
  'its-like-_____-but-better.md',
  'my-name-is-josh-im-a-neophile.md',
  'persevere.md',
  'setting-goals.md',
  'the-bandwagon.md',
  'the-new-wayfarer.md',
  'undefeated.md',
  'wild-cards.md',
];

async function main() {
  for (const filename of files) {
    const filepath = join(WRITING_DIR, filename);
    let content = await readFile(filepath, 'utf-8');

    // Split frontmatter from body
    const fmMatch = content.match(/^(---\n[\s\S]*?\n---)\n([\s\S]*)$/);
    if (!fmMatch) continue;

    const frontmatter = fmMatch[1];
    let body = fmMatch[2];

    // Remove title header: # \n    [Title](url)\n  \n
    body = body.replace(/^#\s*\n\s*\[.*?\]\(http:\/\/blog\.josh-bob\.com\/.*?\)\s*\n/m, '');

    // Remove Kudos block at the end
    body = body.replace(/\s*\[\s*\]\(#kudo\)\s*\d+\s*Kudos[\s\S]*$/m, '');

    // Clean up leading whitespace on first content line
    body = body.replace(/^\s+/, '');

    // Remove trailing whitespace
    body = body.trimEnd();

    await writeFile(filepath, `${frontmatter}\n\n${body}\n`);
    console.log(`Cleaned: ${filename}`);
  }
}

main();
