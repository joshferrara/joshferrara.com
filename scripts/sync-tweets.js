#!/usr/bin/env node

/**
 * Fetch new tweets from the X API and prepend them to src/data/tweets.json.
 *
 * Runs incrementally via `since_id` = the highest ID already on disk, so each
 * call only pulls genuinely new posts. Designed to be invoked on a schedule
 * (see .github/workflows/sync-content.yml).
 *
 * Env:
 *   X_BEARER_TOKEN  (required) — X API v2 bearer token
 *
 * The user ID is hardcoded — this script is single-purpose for joshferrara.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const USER_ID = '5690692';
const OUTPUT = join(import.meta.dirname, '..', 'src', 'data', 'tweets.json');
const MAX_PAGES = 5;
const BEARER = process.env.X_BEARER_TOKEN;

if (!BEARER) {
  console.error('X_BEARER_TOKEN env var is required');
  process.exit(1);
}

async function main() {
  const existing = JSON.parse(await readFile(OUTPUT, 'utf-8'));

  const sinceId = highestId(existing);
  console.log(`Existing tweets: ${existing.length}. Fetching since_id=${sinceId}`);

  const fresh = await fetchSince(sinceId);
  console.log(`Fetched ${fresh.length} new tweet(s) from X`);

  if (fresh.length === 0) {
    console.log('Nothing to write.');
    return;
  }

  const existingIds = new Set(existing.map((t) => t.id));
  const additions = fresh.filter((t) => !existingIds.has(t.id));

  if (additions.length === 0) {
    console.log('All fetched tweets already present — no change.');
    return;
  }

  additions.sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf());
  const merged = [...additions, ...existing];

  await writeFile(OUTPUT, JSON.stringify(merged, null, 2));
  console.log(`Added ${additions.length} new tweet(s). Total: ${merged.length}`);
}

function highestId(tweets) {
  let max = 0n;
  for (const t of tweets) {
    const id = BigInt(t.id);
    if (id > max) max = id;
  }
  return max.toString();
}

async function fetchSince(sinceId) {
  const collected = [];
  let pageToken = undefined;

  for (let page = 0; page < MAX_PAGES; page++) {
    const params = new URLSearchParams({
      max_results: '100',
      since_id: sinceId,
      'tweet.fields': 'created_at,in_reply_to_user_id,referenced_tweets,entities',
    });
    if (pageToken) params.set('pagination_token', pageToken);

    const url = `https://api.x.com/2/users/${USER_ID}/tweets?${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${BEARER}` },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`X API ${res.status}: ${body}`);
    }

    const json = await res.json();
    const data = json.data || [];
    for (const t of data) collected.push(mapTweet(t));

    pageToken = json.meta?.next_token;
    if (!pageToken) break;
  }

  return collected;
}

function mapTweet(t) {
  const refs = t.referenced_tweets || [];
  const retweet = refs.find((r) => r.type === 'retweeted');
  const reply = refs.find((r) => r.type === 'replied_to');

  let text = t.text || '';
  const urls = [];
  for (const u of t.entities?.urls || []) {
    if (u.url && u.expanded_url) text = text.replaceAll(u.url, u.expanded_url);
    if (u.expanded_url) urls.push(u.expanded_url);
  }
  text = cleanText(text);

  const created = new Date(t.created_at);
  const date = created.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' +0000');

  return {
    id: t.id,
    text,
    date,
    isReply: !!reply,
    isRetweet: !!retweet || text.startsWith('RT @'),
    inReplyTo: reply?.id || null,
    urls: [...new Set(urls)],
  };
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
  console.error('Sync failed:', err);
  process.exit(1);
});
