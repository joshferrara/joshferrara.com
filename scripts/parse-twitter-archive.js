#!/usr/bin/env node

/**
 * Parse Twitter archive CSV into a clean JSON file.
 *
 * Usage: node scripts/parse-twitter-archive.js [path-to-tweets.csv]
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const CSV_PATH = process.argv[2] || `${process.env.HOME}/Developer/joshferrara.github.com/twitter/tweets.csv`;
const OUTPUT = join(import.meta.dirname, '..', 'src', 'data', 'tweets.json');

async function main() {
  const raw = await readFile(CSV_PATH, 'utf-8');
  const rows = parseCSV(raw);

  console.log(`Parsed ${rows.length} rows from CSV`);

  const tweets = rows
    .filter((row) => row.text && row.timestamp)
    // Filter out pure replies (start with @)
    // Keep them all for now — can filter in the UI
    .map((row) => ({
      id: row.tweet_id,
      text: cleanText(row.text),
      date: row.timestamp,
      isReply: row.text.startsWith('@'),
      isRetweet: !!row.retweeted_status_id,
      inReplyTo: row.in_reply_to_status_id || null,
      urls: row.expanded_urls ? row.expanded_urls.split(',').filter(Boolean) : [],
    }))
    .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

  const original = tweets.filter((t) => !t.isRetweet);
  const withReplies = original;
  const noReplies = original.filter((t) => !t.isReply);

  console.log(`Total tweets: ${tweets.length}`);
  console.log(`Original (no RTs): ${original.length}`);
  console.log(`Original, no replies: ${noReplies.length}`);

  await writeFile(OUTPUT, JSON.stringify(tweets, null, 2));
  console.log(`\nWritten to ${OUTPUT}`);
}

function parseCSV(raw) {
  const lines = raw.split('\n');
  if (lines.length < 2) return [];

  const headers = parseCSVRow(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = parseCSVRow(line);
    const row = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || '';
    }
    rows.push(row);
  }

  return rows;
}

function parseCSVRow(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }

  values.push(current.trim());
  return values;
}

function cleanText(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

main().catch((err) => {
  console.error('Parse failed:', err);
  process.exit(1);
});
