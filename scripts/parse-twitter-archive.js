#!/usr/bin/env node

/**
 * Parse Twitter archive into a clean JSON file.
 *
 * Supports two formats:
 *   - JS format (new): window.YTD.tweets.part0 = [...]  (from full archive export)
 *   - CSV format (legacy): tweets.csv from older exports
 *
 * Usage:
 *   node scripts/parse-twitter-archive.js [path-to-tweets.js-or-tweets.csv]
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const INPUT_PATH = process.argv[2];
const OUTPUT = join(import.meta.dirname, '..', 'src', 'data', 'tweets.json');

if (!INPUT_PATH) {
  console.error('Usage: node scripts/parse-twitter-archive.js <path-to-tweets.js-or-tweets.csv>');
  process.exit(1);
}

async function main() {
  const raw = await readFile(INPUT_PATH, 'utf-8');

  // For JS archives, try to load note-tweet.js from the same directory
  // (contains full text for longer tweets that get truncated in tweets.js)
  let noteTweets = new Map();
  if (INPUT_PATH.endsWith('.js')) {
    const notePath = join(INPUT_PATH, '..', 'note-tweet.js');
    try {
      const noteRaw = await readFile(notePath, 'utf-8');
      const noteJson = noteRaw.replace(/^window\.YTD\.note_tweet\.part0\s*=\s*/, '');
      const noteEntries = JSON.parse(noteJson);
      // Index by createdAt timestamp — the only reliable link to tweets.js
      for (const entry of noteEntries) {
        const nt = entry.noteTweet;
        if (nt?.core?.text && nt.createdAt) {
          const key = new Date(nt.createdAt).toISOString();
          noteTweets.set(key, {
            text: nt.core.text,
            urls: nt.core.urls || [],
          });
        }
      }
      console.log(`Loaded ${noteTweets.size} note tweets (full-length text for long posts)`);
    } catch {
      // note-tweet.js not present — that's fine
    }
  }

  let tweets;
  if (INPUT_PATH.endsWith('.js')) {
    tweets = parseJSArchive(raw, noteTweets);
  } else {
    tweets = parseCSVArchive(raw);
  }

  tweets.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());

  // Deduplicate by ID (edited tweets can appear multiple times)
  const seen = new Set();
  const deduped = [];
  for (const tweet of tweets) {
    if (!seen.has(tweet.id)) {
      seen.add(tweet.id);
      deduped.push(tweet);
    }
  }

  const original = deduped.filter((t) => !t.isRetweet);
  const noReplies = original.filter((t) => !t.isReply);

  console.log(`Total tweets: ${deduped.length}`);
  console.log(`Original (no RTs): ${original.length}`);
  console.log(`Original, no replies: ${noReplies.length}`);

  const dates = deduped.map((t) => new Date(t.date));
  const earliest = new Date(Math.min(...dates));
  const latest = new Date(Math.max(...dates));
  console.log(`Date range: ${earliest.toISOString().slice(0, 10)} → ${latest.toISOString().slice(0, 10)}`);

  await writeFile(OUTPUT, JSON.stringify(deduped, null, 2));
  console.log(`\nWritten ${deduped.length} tweets to ${OUTPUT}`);
}

// --- JS format parser (new Twitter archive export) ---

function parseJSArchive(raw, noteTweets) {
  // Strip the variable assignment: window.YTD.tweets.part0 = [...]
  const json = raw.replace(/^window\.YTD\.tweets\.part0\s*=\s*/, '');
  const entries = JSON.parse(json);

  // Build a set of superseded tweet IDs (earlier versions of edited tweets).
  // Each edit chain lists all version IDs in order — all but the last are superseded.
  const superseded = new Set();
  for (const entry of entries) {
    const ei = entry.tweet?.edit_info;
    const ids =
      ei?.initial?.editTweetIds ||
      ei?.edit?.editControlInitial?.editTweetIds ||
      [];
    if (ids.length > 1) {
      // All IDs except the last (final version) are superseded
      for (const id of ids.slice(0, -1)) {
        superseded.add(id);
      }
    }
  }
  if (superseded.size > 0) {
    console.log(`Filtered ${superseded.size} superseded edit(s), keeping latest versions`);
  }

  return entries
    .filter((entry) => entry.tweet?.full_text && !superseded.has(entry.tweet.id_str))
    .map((entry) => {
      const t = entry.tweet;

      // Use full text from note-tweet.js if available (for longer posts truncated in tweets.js)
      const dateKey = new Date(t.created_at).toISOString();
      const note = noteTweets.get(dateKey);
      let text = cleanText(note?.text || t.full_text);

      // Expand t.co URLs from note tweet entities
      if (note?.urls) {
        for (const u of note.urls) {
          if (u.shortUrl && u.expandedUrl) {
            text = text.replaceAll(u.shortUrl, u.expandedUrl);
          }
        }
      }

      // Replace t.co short URLs with their expanded/display versions
      if (t.entities?.urls) {
        for (const u of t.entities.urls) {
          if (u.url && u.expanded_url) {
            text = text.replaceAll(u.url, u.expanded_url);
          }
        }
      }
      // Remove t.co links for media (the media itself is the content, not the link)
      if (t.entities?.media) {
        for (const m of t.entities.media) {
          if (m.url) {
            text = text.replaceAll(m.url, '').trim();
          }
        }
      }

      const isRetweet = text.startsWith('RT @') || t.retweeted === true;
      const isReply = !!t.in_reply_to_status_id_str;

      // Extract expanded URLs from entities
      const urls = [];
      if (t.entities?.urls) {
        for (const u of t.entities.urls) {
          if (u.expanded_url) urls.push(u.expanded_url);
        }
      }

      // Extract media URLs
      if (t.entities?.media) {
        for (const m of t.entities.media) {
          if (m.expanded_url) urls.push(m.expanded_url);
        }
      }
      if (t.extended_entities?.media) {
        for (const m of t.extended_entities.media) {
          if (m.media_url_https) urls.push(m.media_url_https);
        }
      }

      // Normalize date to consistent format
      const date = new Date(t.created_at);
      const dateStr = date.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' +0000');

      return {
        id: t.id_str,
        text,
        date: dateStr,
        isReply,
        isRetweet,
        inReplyTo: t.in_reply_to_status_id_str || null,
        urls: [...new Set(urls)], // deduplicate URLs
      };
    });
}

// --- CSV format parser (legacy) ---

function parseCSVArchive(raw) {
  const rows = parseCSV(raw);
  console.log(`Parsed ${rows.length} rows from CSV`);

  return rows
    .filter((row) => row.text && row.timestamp)
    .map((row) => ({
      id: row.tweet_id,
      text: cleanText(row.text),
      date: row.timestamp,
      isReply: row.text.startsWith('@'),
      isRetweet: !!row.retweeted_status_id,
      inReplyTo: row.in_reply_to_status_id || null,
      urls: row.expanded_urls ? row.expanded_urls.split(',').filter(Boolean) : [],
    }));
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
        i++;
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

// --- Shared utilities ---

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
