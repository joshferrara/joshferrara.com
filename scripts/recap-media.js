#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';

const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);
const VIDEO_EXTENSIONS = new Set(['.m4v', '.mov', '.mp4', '.webm']);
const DEFAULT_BUCKET = process.env.R2_BUCKET ?? 'joshferrara-images';
const DEFAULT_PUBLIC_BASE_URL = process.env.RECAP_MEDIA_PUBLIC_BASE_URL ?? 'https://images.joshferrara.com';

const args = process.argv.slice(2);
const input = args.find((arg) => !arg.startsWith('--'));
const options = Object.fromEntries(
  args
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => {
      const [key, value] = arg.slice(2).split('=');
      return [key, value ?? true];
    }),
);

if (!input || !options.year) {
  console.log('Usage: npm run recap:media -- <media-directory> --year=2026 [--dry-run] [--upload]');
  console.log('');
  console.log('Options:');
  console.log('  --bucket=name                 R2 bucket name');
  console.log('  --public-base-url=https://...  Public media origin');
  console.log('  --output=path                 Manifest output directory');
  console.log('  --dry-run                     Print work without writing manifests or uploading');
  console.log('  --upload                      Upload files with wrangler r2 object put');
  process.exit(1);
}

const inputDir = resolve(input);
const year = String(options.year);
const bucket = String(options.bucket ?? DEFAULT_BUCKET);
const publicBaseUrl = String(options['public-base-url'] ?? DEFAULT_PUBLIC_BASE_URL).replace(/\/$/, '');
const outputDir = resolve(String(options.output ?? `src/content/recap-media/${year}`));
const isDryRun = Boolean(options['dry-run']);
const shouldUpload = Boolean(options.upload);

if (!existsSync(inputDir) || !statSync(inputDir).isDirectory()) {
  console.error(`Media directory not found: ${inputDir}`);
  process.exit(1);
}

const galleryDirs = readdirSync(inputDir)
  .map((name) => join(inputDir, name))
  .filter((path) => statSync(path).isDirectory())
  .sort((a, b) => basename(a).localeCompare(basename(b)));

if (galleryDirs.length === 0) {
  console.error(`No gallery folders found in ${inputDir}`);
  process.exit(1);
}

if (!isDryRun) mkdirSync(outputDir, { recursive: true });

for (const galleryDir of galleryDirs) {
  const gallerySlug = slugify(basename(galleryDir));
  const files = collectMediaFiles(galleryDir);
  const items = files.map((file, index) => buildMediaItem(file, gallerySlug, index + 1));
  const manifest = {
    title: titleize(gallerySlug),
    year: Number(year),
    slug: gallerySlug,
    items,
  };
  const manifestPath = join(outputDir, `${gallerySlug}.json`);

  console.log(`\n${manifest.title}`);
  console.log(`  ${files.length} media file(s)`);
  console.log(`  manifest: ${relative(process.cwd(), manifestPath)}`);
  console.log(`  import: import ${camelCase(gallerySlug)}Gallery from '../recap-media/${year}/${gallerySlug}.json';`);
  console.log(`  usage: <MediaGallery gallery={${camelCase(gallerySlug)}Gallery} />`);

  if (!isDryRun) {
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  }

  if (shouldUpload) {
    for (const file of files) {
      const key = keyForFile(file, gallerySlug, files.indexOf(file) + 1);
      console.log(`  upload: ${relative(process.cwd(), file)} -> r2://${bucket}/${key}`);
      if (!isDryRun) {
        execFileSync('wrangler', ['r2', 'object', 'put', `${bucket}/${key}`, `--file=${file}`, '--remote'], { stdio: 'inherit' });
      }
    }
  }

}

function collectMediaFiles(dir) {
  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isFile())
    .filter((path) => {
      const ext = extname(path).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext);
    })
    .sort((a, b) => basename(a).localeCompare(basename(b), undefined, { numeric: true }));
}

function buildMediaItem(file, gallerySlug, sequence) {
  const ext = extname(file).toLowerCase();
  const key = keyForFile(file, gallerySlug, sequence);
  const base = {
    type: IMAGE_EXTENSIONS.has(ext) ? 'image' : 'video',
    src: `${publicBaseUrl}/${key}`,
    caption: '',
  };

  if (IMAGE_EXTENSIONS.has(ext)) {
    return {
      ...base,
      alt: '',
      ...getImageDimensions(file),
    };
  }

  return base;
}

function keyForFile(file, gallerySlug, sequence) {
  const ext = extname(file).toLowerCase();
  const fileSlug = slugify(basename(file, ext));
  return `recaps/${year}/moments/${gallerySlug}/${String(sequence).padStart(3, '0')}-${fileSlug}${ext}`;
}

function getImageDimensions(file) {
  try {
    const output = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], { encoding: 'utf8' });
    const width = Number(output.match(/pixelWidth:\s*(\d+)/)?.[1]);
    const height = Number(output.match(/pixelHeight:\s*(\d+)/)?.[1]);
    if (width && height) return { width, height };
  } catch {
    // Dimensions are nice to have; the gallery still renders without them.
  }

  return {};
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

function titleize(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
}

function camelCase(slug) {
  return slug.replace(/-([a-z0-9])/g, (_, char) => char.toUpperCase());
}
