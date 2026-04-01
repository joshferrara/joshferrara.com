#!/usr/bin/env node

/**
 * Migrate Jekyll blog posts to Astro content collections.
 *
 * Posts from Aug 14, 2012 onward → src/content/writing/
 * Posts before Aug 14, 2012     → src/content/archive/
 *
 * Usage: node scripts/migrate-jekyll-posts.js [path-to-jekyll-posts]
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, basename } from 'node:path';

const JEKYLL_POSTS_DIR = process.argv[2] || `${process.env.HOME}/Developer/joshferrara.github.com/_posts`;
const CUTOFF_DATE = new Date('2012-08-14');

const WRITING_DIR = join(import.meta.dirname, '..', 'src', 'content', 'writing');
const ARCHIVE_DIR = join(import.meta.dirname, '..', 'src', 'content', 'archive');

async function main() {
  await mkdir(WRITING_DIR, { recursive: true });
  await mkdir(ARCHIVE_DIR, { recursive: true });

  const files = (await readdir(JEKYLL_POSTS_DIR))
    .filter((f) => f.endsWith('.markdown') || f.endsWith('.md'))
    .sort();

  console.log(`Found ${files.length} posts to migrate`);

  let writingCount = 0;
  let archiveCount = 0;

  for (const file of files) {
    const raw = await readFile(join(JEKYLL_POSTS_DIR, file), 'utf-8');
    const { frontmatter, body } = parseFrontmatter(raw);

    // Extract date and slug from filename: YYYY-MM-DD-slug.markdown
    const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.(markdown|md)$/);
    if (!match) {
      console.warn(`  Skipping (bad filename): ${file}`);
      continue;
    }

    const [, dateStr, slug] = match;
    const postDate = new Date(dateStr);

    // Build clean frontmatter
    const title = cleanTitle(frontmatter.title || slug.replace(/-/g, ' '));
    const date = frontmatter.date
      ? normalizeDate(frontmatter.date)
      : dateStr;

    // Clean up body content
    let content = body.trim();

    // Determine destination
    const isWriting = postDate >= CUTOFF_DATE;
    const destDir = isWriting ? WRITING_DIR : ARCHIVE_DIR;

    // Build new frontmatter (only what we need)
    const newFrontmatter = [
      '---',
      `title: ${yamlString(title)}`,
      `date: ${date}`,
      `growthStage: published`,
      '---',
    ].join('\n');

    const outFile = `${slug}.md`;
    await writeFile(join(destDir, outFile), `${newFrontmatter}\n\n${content}\n`);

    if (isWriting) {
      writingCount++;
    } else {
      archiveCount++;
    }
  }

  console.log(`\nMigration complete:`);
  console.log(`  Writing (Aug 2012+): ${writingCount} posts → src/content/writing/`);
  console.log(`  Archive (pre-2012):  ${archiveCount} posts → src/content/archive/`);
}

function parseFrontmatter(raw) {
  const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    return { frontmatter: {}, body: raw };
  }

  const fm = {};
  for (const line of fmMatch[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    fm[key] = value;
  }

  return { frontmatter: fm, body: fmMatch[2] };
}

function cleanTitle(title) {
  // Remove surrounding quotes
  return title.replace(/^["']|["']$/g, '').trim();
}

function normalizeDate(dateStr) {
  // Handle Jekyll's verbose date format: 2006-12-01 12:25:00.000000000 -06:00
  const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : dateStr;
}

function yamlString(str) {
  // Quote if contains special YAML characters
  if (/[:#\[\]{}&*!|>'"%@`]/.test(str) || str.startsWith('- ') || str.startsWith('? ')) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
