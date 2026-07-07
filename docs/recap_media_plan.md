# Annual Recap Media Plan

## Recommendation

Use Cloudflare R2 as the canonical storage location for annual recap photos and original media files, serve them from an `images.joshferrara.com` custom domain, and render galleries with first-party Astro components rather than adding a third-party gallery plugin. The site's current architecture is already well suited for this: recap pages are MDX entries in `src/content/recaps`, MDX can import local Astro components, and the app already contains starter `PhotoGallery` and `OptimizedImage` components plus an R2 upload script.

This should be a staged system rather than a one-off media dump:

1. Store originals in R2 with predictable keys.
2. Generate or record a small manifest for each gallery.
3. Reference those manifests from MDX recap pages.
4. Let a reusable gallery component handle layout, thumbnails, captions, video embeds, and future lightbox behavior.

## Why R2 makes sense

R2 is a good default for this site because the content is personal, image-heavy, and mostly static. Recaps do not need a database-backed CMS, and keeping media on the same Cloudflare platform as the Astro Workers deployment avoids adding another vendor. Cloudflare's current R2 pricing documentation emphasizes free data egress, while Cloudflare Images can optimize remote images stored outside Images, including R2. Cloudflare Stream is better suited for videos that need adaptive playback, but short low-stakes clips can start as R2-hosted MP4/WebM files and graduate to Stream later if playback quality, encoding, or bandwidth becomes annoying.

The important distinction is:

- **Photos:** store originals in R2; optionally serve resized/optimized versions through Cloudflare Images transformations.
- **Short casual video clips:** start in R2 with native `<video>` rendering.
- **Long or prominent videos:** use Cloudflare Stream and store Stream IDs in the same gallery manifest.

## What not to do

Avoid committing hundreds of original recap photos and videos into the repo. That would make Git slow, bloat deployment artifacts, and mix authored content with media storage. Also avoid relying on Notion's media URLs as permanent assets because those URLs can be signed, unstable, or tied to Notion's page export behavior.

Avoid a heavy client-side gallery plugin as the primary system. The current site is Astro-first and mostly static, so the default gallery should be server-rendered HTML with lazy-loaded images. A tiny client-side lightbox can be added later as progressive enhancement, but the recap should still read and render without JavaScript.

## Proposed storage structure

Use stable, human-readable keys in R2:

```text
recaps/{year}/cover/{slug}.{ext}
recaps/{year}/moments/{moment-slug}/{sequence}-{slug}.{ext}
recaps/{year}/moments/{moment-slug}/poster/{video-slug}.jpg
recaps/{year}/favorites/{category-slug}/{sequence}-{slug}.{ext}
```

Examples:

```text
recaps/2025/moments/snow-in-baton-rouge/001-luca-snowman.jpg
recaps/2025/moments/snow-in-baton-rouge/002-backyard-snow.jpg
recaps/2025/moments/severance-birthday-party/001-waffle-party.mp4
recaps/2025/moments/severance-birthday-party/poster/001-waffle-party.jpg
```

Guidelines:

- Use lowercase slugs and numbered prefixes so ordering is obvious.
- Keep R2 originals separate from generated thumbnails if generated derivatives are ever stored.
- Prefer `.jpg` or `.webp` for gallery images and `.mp4` for broad video compatibility.
- Preserve originals locally during migration until the R2 import is verified, but do not commit them.

## Proposed manifest shape

Each gallery should have a manifest file in the repo. The manifest is the bridge between authored MDX and remote media storage. Start with JSON because Astro can import it easily and validate it later.

Recommended location:

```text
src/content/recap-media/{year}/{gallery-slug}.json
```

Recommended shape:

```json
{
  "title": "Snow in Baton Rouge",
  "year": 2025,
  "slug": "snow-in-baton-rouge",
  "description": "A rare snowy day in Baton Rouge.",
  "items": [
    {
      "type": "image",
      "src": "https://images.joshferrara.com/recaps/2025/moments/snow-in-baton-rouge/001-luca-snowman.jpg",
      "alt": "Luca standing next to a small snowman in the yard",
      "width": 3024,
      "height": 4032,
      "caption": "Luca's first real snow day at home."
    },
    {
      "type": "video",
      "src": "https://images.joshferrara.com/recaps/2025/moments/severance-birthday-party/001-waffle-party.mp4",
      "poster": "https://images.joshferrara.com/recaps/2025/moments/severance-birthday-party/poster/001-waffle-party.jpg",
      "caption": "The Severance-themed birthday reveal."
    }
  ]
}
```

Why manifests instead of hand-writing every image in MDX:

- MDX stays readable and focused on the story.
- Galleries can be rearranged or regenerated without rewriting the recap prose.
- Scripts can create manifests during historical import.
- The gallery component can enforce consistent markup, lazy loading, captions, dimensions, and video treatment.

## Authoring model in recap MDX

A future recap entry should keep the annual story in MDX and drop galleries inline where they belong. For example:

```mdx
import MediaGallery from '../../components/MediaGallery.astro';
import snowGallery from '../recap-media/2025/snow-in-baton-rouge.json';

### Snow in Baton Rouge

It’s always a rare and special occasion when we get legitimate snow in Baton Rouge...

<MediaGallery gallery={snowGallery} />
```

This keeps the site architecture close to what already exists: content lives in MDX, rich display is handled by Astro components, and the route rendering does not need special database logic.

## Component plan

Build the media UI in layers:

1. **`MediaGallery.astro`** — replaces/extends `PhotoGallery.astro`; accepts a manifest or `items` array; renders images and videos.
2. **`MediaItem.astro`** — shared rendering for image, video, and Stream embeds.
3. **`R2Image.astro` or upgraded `OptimizedImage.astro`** — builds transformed Cloudflare image URLs, sets dimensions, `loading="lazy"`, `decoding="async"`, and sensible `sizes`.
4. **Optional `Lightbox` island** — added later if the static gallery feels too limited; should enhance existing links rather than own the gallery.

Minimum viable gallery behavior:

- Responsive grid or masonry-like layout.
- Click-through to the original file.
- Captions when available.
- Native lazy loading.
- Video poster support.
- No required JavaScript.

Nice-to-have behavior after MVP:

- Lightbox navigation.
- Download original link.
- Featured/hero item support.
- `limit` and `show more` for large galleries.
- Automatic blur placeholders or dominant color backgrounds.

## Upload/import workflow for historical recaps

Historical import should be scripted so the same workflow can be reused yearly.

1. Export or crawl Notion media for each nested picture page.
2. Save the raw files to a temporary, gitignored folder such as `.media-import/recaps/{year}/{moment-slug}/`.
3. Normalize filenames into ordered slugs.
4. Extract dimensions for images and duration/poster frames for videos.
5. Upload files to R2 under the agreed key structure.
6. Generate `src/content/recap-media/{year}/{gallery-slug}.json`.
7. Replace MDX placeholder text like `Pictures: ... media items kept...` with `<MediaGallery />` imports/usages.
8. Run a build and spot-check the generated recap pages.

Because Notion media can include volatile URLs, the import script should download assets immediately, verify byte sizes, and retry failures before upload. If a page is empty or media cannot be fetched, keep a small manifest with an empty `items` array and a note so the recap still records that unfinished gallery.

## Workflow for future annual recaps

The long-term yearly process should be intentionally low-friction:

1. Create a local folder for the year, such as `~/Pictures/recaps/2026/`.
2. Inside it, create one folder per moment or category: `snow-day`, `beach-trip`, `favorite-meals`, etc.
3. Drop raw photos/videos into those folders throughout the year or during recap writing.
4. Run a script like:

   ```bash
   npm run recap:media -- ./recap-media/2026 --year=2026
   ```

5. The script should optimize/rename/upload media, generate manifests, and print MDX import snippets.
6. Paste the snippets into `src/content/recaps/2026.mdx` beside the relevant story sections.
7. Run the build and preview the recap.

This means future annual recaps become mostly raw media upload plus writing. The repo contains the narrative and manifests; R2 contains the heavy files.

## Script improvements needed

The existing `scripts/upload-to-r2.js` is a useful proof of concept, but the production workflow should add:

- Recursive directory traversal.
- Video file support.
- Slugified/numbered output keys.
- Dry-run mode.
- Manifest generation.
- Image width/height detection.
- Optional poster frame generation for videos.
- A way to skip already-uploaded files.
- Environment-driven public base URL, bucket, and prefix.

A future script could be named `scripts/recap-media.js` and produce both uploads and manifests in one pass.

## Suggested build phases

### Phase 1 — Gallery MVP

- Create `MediaGallery.astro` for image/video manifests.
- Upgrade image rendering to support dimensions and optional Cloudflare transformation URLs.
- Add one sample gallery manifest with a small number of test assets.
- Replace one recap placeholder with the real gallery call.

### Phase 2 — Upload pipeline

- Replace or extend `scripts/upload-to-r2.js` into a recap-specific media importer.
- Add dry-run output and generated MDX snippets.
- Add `.media-import/` to `.gitignore` if it is not already ignored.

### Phase 3 — Historical import

- Crawl/download Notion media from the 2022–2025 recap picture pages.
- Upload all historical assets to R2.
- Generate one manifest per picture page.
- Replace all current media placeholders in recap MDX.

### Phase 4 — Polish

- Add lightbox enhancement if desired.
- Add image transformation URL helper.
- Add poster generation and/or Stream support for longer videos.
- Add a visual index of galleries per recap if very large years become hard to scan.

## Open decisions before implementation

- What public media domain should be used: `images.joshferrara.com`, `media.joshferrara.com`, or another subdomain?
- Should Cloudflare Images transformations be enabled immediately, or should the first build serve original R2 files and add transformations later?
- Do videos need Cloudflare Stream from day one, or is native R2-hosted MP4 good enough for the historical clips?
- Should gallery manifests live under `src/content/recap-media` as JSON, or beside each recap as co-located files?
- Do you want captions/alt text generated during import as placeholders, or only hand-authored when you edit each recap?

## Recommended first implementation target

Build the MVP around R2-hosted media plus JSON manifests, with native static Astro rendering and no third-party gallery plugin. Start by implementing one historical gallery end-to-end, likely a small 2025 moment, then use that as the pattern for the larger historical import.

## External references checked

- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare Images transformations overview: https://developers.cloudflare.com/images/transform-images/
- Cloudflare Images pricing: https://developers.cloudflare.com/images/pricing/
- Cloudflare Stream pricing: https://developers.cloudflare.com/stream/pricing/
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Astro MDX integration: https://docs.astro.build/en/guides/integrations-guide/mdx/
