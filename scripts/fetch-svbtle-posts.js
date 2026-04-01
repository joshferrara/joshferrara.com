#!/usr/bin/env node

/**
 * Fetch blog post content from Svbtle (blog.josh-bob.com) and update
 * local markdown files that currently just contain redirect links.
 */

import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const WRITING_DIR = join(import.meta.dirname, '..', 'src', 'content', 'writing');

// Map local filenames to Svbtle URLs
const redirectPosts = {
  'backward-compatability.md': 'http://blog.josh-bob.com/backward-compatability/',
  'identity-and-motivation.md': 'http://blog.josh-bob.com/identity-and-motivation/',
  'im-good-at-the-internet.md': 'http://blog.josh-bob.com/im-good-at-the-internet/',
  'its-like-_____-but-better.md': 'http://blog.josh-bob.com/its-like-but-better/',
  'my-name-is-josh-im-a-neophile.md': 'http://blog.josh-bob.com/my-name-is-josh-im-a-neophile/',
  'persevere.md': 'http://blog.josh-bob.com/persevere/',
  'setting-goals.md': 'http://blog.josh-bob.com/setting-goals/',
  'the-bandwagon.md': 'http://blog.josh-bob.com/the-bandwagon/',
  'the-new-wayfarer.md': 'http://blog.josh-bob.com/the-new-wayfarer/',
  'undefeated.md': 'http://blog.josh-bob.com/undefeated/',
  'wild-cards.md': 'http://blog.josh-bob.com/wild-cards/',
};

async function fetchAndExtract(url) {
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  FAILED (${res.status}): ${url}`);
    return null;
  }

  const html = await res.text();

  // Svbtle wraps article content in <article> or <div class="post_body">
  // Try multiple selectors
  let content = '';

  // Try <article class="post">...</article> or <div class="post_body">
  const articleMatch = html.match(/<article[^>]*class="[^"]*post[^"]*"[^>]*>([\s\S]*?)<\/article>/);
  if (articleMatch) {
    content = articleMatch[1];
  }

  if (!content) {
    const bodyMatch = html.match(/<div[^>]*class="[^"]*post_body[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (bodyMatch) content = bodyMatch[1];
  }

  if (!content) {
    // Broader fallback: look for the main content area
    const mainMatch = html.match(/<div[^>]*class="[^"]*article_body[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (mainMatch) content = mainMatch[1];
  }

  if (!content) {
    console.warn(`  Could not extract content from: ${url}`);
    // Return the full body as fallback for manual inspection
    const fullBody = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    content = fullBody?.[1] || '';
  }

  // Convert HTML to markdown-ish text
  return htmlToMarkdown(content);
}

function htmlToMarkdown(html) {
  return html
    // Remove script/style tags
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    // Remove nav, header, footer, aside
    .replace(/<(nav|header|footer|aside)[\s\S]*?<\/\1>/gi, '')
    // Remove date/time elements (we have those in frontmatter)
    .replace(/<time[\s\S]*?<\/time>/gi, '')
    // Remove sharing/social elements
    .replace(/<div[^>]*class="[^"]*share[^"]*"[\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]*class="[^"]*kudos[^"]*"[\s\S]*?<\/div>/gi, '')
    // Headers
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n')
    // Bold/italic
    .replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, '**$2**')
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, '*$2*')
    // Links
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    // Images
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    // Blockquotes
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, text) => {
      return text.trim().split('\n').map(l => `> ${l.trim()}`).join('\n') + '\n\n';
    })
    // Code blocks
    .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n')
    // Inline code
    .replace(/<code>([\s\S]*?)<\/code>/gi, '`$1`')
    // Lists
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
    .replace(/<\/?[ou]l[^>]*>/gi, '\n')
    // Paragraphs
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Horizontal rules
    .replace(/<hr\s*\/?>/gi, '\n---\n\n')
    // Strip remaining HTML tags
    .replace(/<[^>]+>/g, '')
    // Decode entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8230;/g, '…')
    // Clean up whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function main() {
  console.log(`Processing ${Object.keys(redirectPosts).length} redirect posts\n`);

  let updated = 0;
  let failed = 0;

  for (const [filename, url] of Object.entries(redirectPosts)) {
    const filepath = join(WRITING_DIR, filename);
    console.log(`\n${filename}:`);

    // Read existing file to preserve frontmatter
    const existing = await readFile(filepath, 'utf-8');
    const fmMatch = existing.match(/^(---\n[\s\S]*?\n---)\n/);
    if (!fmMatch) {
      console.warn('  No frontmatter found, skipping');
      failed++;
      continue;
    }

    const frontmatter = fmMatch[1];
    const content = await fetchAndExtract(url);

    if (!content || content.length < 50) {
      console.warn(`  Content too short (${content?.length || 0} chars), skipping`);
      failed++;
      continue;
    }

    await writeFile(filepath, `${frontmatter}\n\n${content}\n`);
    console.log(`  Updated (${content.length} chars)`);
    updated++;
  }

  console.log(`\n\nDone: ${updated} updated, ${failed} failed`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
