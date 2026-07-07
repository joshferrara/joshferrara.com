#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve } from 'node:path';

const NOTION_VERSION = '23.13.20260602.1212';
const NOTION_API = 'https://www.notion.so/api/v3';

const args = process.argv.slice(2);
const sourceUrl = args.find((arg) => !arg.startsWith('--'));
const options = Object.fromEntries(
  args
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => {
      const [key, value] = arg.slice(2).split('=');
      return [key, value ?? true];
    }),
);

if (!sourceUrl || !options.year) {
  console.log('Usage: npm run recap:notion-media -- <notion-url> --year=2025 [--upload]');
  console.log('');
  console.log('Options:');
  console.log('  --bucket=name                 R2 bucket name');
  console.log('  --public-base-url=https://...  Public media origin');
  console.log('  --output=path                 Manifest output directory');
  console.log('  --upload                      Download from Notion and upload files to R2');
  process.exit(1);
}

const year = String(options.year);
const outputDir = resolve(String(options.output ?? `src/content/recap-media/${year}`));
const bucket = String(options.bucket ?? process.env.R2_BUCKET ?? 'joshferrara-images');
const publicBaseUrl = String(options['public-base-url'] ?? process.env.RECAP_MEDIA_PUBLIC_BASE_URL ?? 'https://images.joshferrara.com').replace(/\/$/, '');
const shouldUpload = Boolean(options.upload);
const tempDir = shouldUpload ? mkdtempSync(join(tmpdir(), `recap-notion-${year}-`)) : null;
mkdirSync(outputDir, { recursive: true });

const rootPageId = idFromNotionUrl(sourceUrl);
const rootRecordMap = await loadPage(rootPageId);
const collectionViewPage = Object.values(rootRecordMap.block)
  .map((record) => record.value?.value)
  .find((block) => block?.type === 'collection_view_page');

if (!collectionViewPage) {
  throw new Error(`Could not find collection view page in ${sourceUrl}`);
}

const collection = await queryCollection({
  collectionId: collectionViewPage.collection_id,
  collectionViewId: collectionViewPage.view_ids[0],
  spaceId: collectionViewPage.space_id,
});

const recapPage = Object.values(collection.recordMap.block)
  .map((record) => record.value?.value)
  .find((block) => textFromProperty(block?.properties?.title).includes(year));

if (!recapPage) {
  throw new Error(`Could not find recap page for ${year}`);
}

const recapRecordMap = await loadPage(recapPage.id);
const momentsBlock = Object.values(recapRecordMap.block)
  .map((record) => record.value?.value)
  .find((block) => block?.type === 'sub_header' && textFromProperty(block.properties?.title).includes('Moments'));

if (!momentsBlock?.content?.length) {
  throw new Error(`Could not find Moments section for ${year}`);
}

const momentRecords = await syncBlocks(momentsBlock.content);
const momentBlocks = momentsBlock.content
  .map((id) => momentRecords.block[id]?.value?.value)
  .filter(Boolean);

const galleries = [];
let currentHeading = null;

for (const block of momentBlocks) {
  if (block.type === 'sub_sub_header') {
    currentHeading = textFromProperty(block.properties?.title);
    continue;
  }

  if (block.type === 'page' && textFromProperty(block.properties?.title) === 'Pictures') {
    galleries.push({
      title: currentHeading ?? 'Pictures',
      picturePage: block,
    });
  }
}

const pictureChildIds = galleries.flatMap((gallery) => gallery.picturePage.content ?? []);
const pictureRecords = await syncBlocks(pictureChildIds);

try {
  for (const gallery of galleries) {
    const slug = slugify(gallery.title);
    const mediaBlocks = (gallery.picturePage.content ?? [])
      .map((id) => pictureRecords.block[id]?.value?.value)
      .filter((block) => block && ['image', 'video'].includes(block.type));

    const signedUrls = await getSignedUrls(mediaBlocks);
    const items = [];

    for (const [index, block] of mediaBlocks.entries()) {
      const key = r2KeyForBlock(block, slug, index + 1);
      const src = shouldUpload
        ? await uploadSignedUrlToR2(signedUrls[index], key)
        : signedUrls[index];

      items.push({
        type: block.type,
        src,
        alt: block.type === 'image' ? textFromProperty(block.properties?.title) : undefined,
        caption: '',
      });
    }

    const manifest = {
      title: gallery.title,
      year: Number(year),
      slug,
      source: {
        type: 'notion',
        pageId: gallery.picturePage.id,
      },
      items,
    };

    const manifestPath = join(outputDir, `${slug}.json`);
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`${gallery.title}: ${items.length} item(s) -> ${manifestPath}`);
  }
} finally {
  if (tempDir) rmSync(tempDir, { recursive: true, force: true });
}

async function loadPage(pageId) {
  const response = await notionPost('loadPageChunk', {
    pageId,
    limit: 500,
    cursor: { stack: [] },
    chunkNumber: 0,
    verticalColumns: false,
  });

  return normalizeRecordMap(response.recordMap);
}

async function queryCollection({ collectionId, collectionViewId, spaceId }) {
  return notionPost('queryCollection', {
    collectionId,
    collectionViewId,
    loader: {
      type: 'reducer',
      reducers: {
        collection_group_results: { type: 'results', limit: 50 },
      },
      sort: [],
      searchQuery: '',
      userTimeZone: 'America/Chicago',
    },
    source: {
      type: 'collection',
      id: collectionId,
      spaceId,
    },
  });
}

async function syncBlocks(ids) {
  const response = await notionPost('syncRecordValues', {
    requests: ids.map((id) => ({ table: 'block', id, version: -1 })),
  });

  return normalizeRecordMap(response.recordMap);
}

async function getSignedUrls(blocks) {
  if (blocks.length === 0) return [];

  const response = await notionPost('getSignedFileUrls', {
    urls: blocks.map((block) => ({
      url: block.properties?.source?.[0]?.[0] ?? block.format?.display_source,
      permissionRecord: { table: 'block', id: block.id },
    })),
  });

  return response.signedUrls;
}

async function uploadSignedUrlToR2(url, key) {
  if (!tempDir) throw new Error('No temporary directory available');

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download Notion media: ${response.status} ${url}`);
  }

  const filePath = join(tempDir, basename(key));
  const bytes = Buffer.from(await response.arrayBuffer());
  writeFileSync(filePath, bytes);
  console.log(`  upload: ${key} (${bytes.length} bytes)`);
  uploadWithRetry(filePath, key);

  return `${publicBaseUrl}/${key}`;
}

function uploadWithRetry(filePath, key) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      execFileSync('wrangler', ['r2', 'object', 'put', `${bucket}/${key}`, `--file=${filePath}`, '--remote'], { stdio: 'inherit' });
      return;
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      console.warn(`  upload retry ${attempt + 1}/${maxAttempts}: ${key}`);
    }
  }
}

function r2KeyForBlock(block, gallerySlug, sequence) {
  const sourceName = textFromProperty(block.properties?.title) || block.properties?.source?.[0]?.[0] || block.id;
  const ext = extname(sourceName.split('?')[0]) || (block.type === 'video' ? '.mov' : '.jpg');
  const filename = basename(sourceName.split('?')[0], ext);
  return `recaps/${year}/moments/${gallerySlug}/${String(sequence).padStart(3, '0')}-${slugify(filename)}${ext.toLowerCase()}`;
}

async function notionPost(endpoint, body) {
  const response = await fetch(`${NOTION_API}/${endpoint}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'notion-client-version': NOTION_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`${endpoint} failed with ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  if (data.isNotionError) {
    throw new Error(`${endpoint} failed: ${data.message ?? data.name}`);
  }

  return data;
}

function normalizeRecordMap(recordMap) {
  return Object.fromEntries(
    Object.entries(recordMap ?? {}).map(([table, records]) => [
      table,
      Object.fromEntries(
        Object.entries(records ?? {}).map(([id, record]) => [
          id,
          record.value?.value ? { ...record, value: record.value } : record,
        ]),
      ),
    ]),
  );
}

function idFromNotionUrl(value) {
  const pathname = new URL(value).pathname;
  const match = pathname.match(/[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
  if (!match) throw new Error(`Could not find a Notion page id in ${value}`);
  return formatUuid(match[0]);
}

function formatUuid(value) {
  const compact = value.replace(/-/g, '');
  return `${compact.slice(0, 8)}-${compact.slice(8, 12)}-${compact.slice(12, 16)}-${compact.slice(16, 20)}-${compact.slice(20)}`;
}

function textFromProperty(property) {
  return (property ?? [])
    .map((part) => part[0])
    .join('')
    .replace(/\u00a0/g, ' ')
    .trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
