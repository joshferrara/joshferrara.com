# joshferrara.com v9 — Project Brief

## Vision

A personal website that serves as a living dashboard of Josh Ferrara's digital life — writing, reading, listening, watching, building, and thinking. Type-forward, calm, and content-diverse. Inspired by the structural philosophy of maggieappleton.com but with its own identity.

The site aggregates both hand-authored content (essays, notes, projects) and externally-sourced content (tweets, music, movies, books, podcasts) into a unified, searchable personal hub.

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | Astro + MDX | Content collections with typed schemas per content type; zero JS by default; MDX for rich authoring with custom components; Cloudflare owns Astro as of Jan 2026 |
| **Hosting** | Cloudflare Workers | Unlimited bandwidth/requests on free tier; Workers is Cloudflare's strategic direction (Pages is maintenance mode); Astro adapter v13+ targets Workers only |
| **Image hosting** | Cloudflare R2 | Zero egress fees; native Workers bindings; 10GB free, $0.015/GB after; same-platform simplicity |
| **Scheduled rebuilds** | Workers Cron Triggers | Free, minute-level precision; triggers rebuild via deploy hook |
| **Search** | Pagefind | Static, free, WASM-powered client-side search; built for static sites; indexes all content types at build time |
| **Package manager** | TBD (npm/pnpm) | |
| **Version control** | GitHub (`joshferrara.com` repo) | New repo, clean start |

---

## Content Types

### Authored Content (stored as MDX/Markdown files)

| Type | Description | Schema Notes |
|---|---|---|
| **Writing** | Blog posts, essays, long-form pieces. The primary authored content type. | Title, date, description, tags, growth stage (draft/published), cover image (optional) |
| **Notes** | Loose ideas, things being figured out. Learning in public. | Title, date, tags, growth stage. Lighter-weight than Writing. |
| **Talks** | Recordings, slides, or transcripts of talks and teachings given. | Title, date, event name, video URL (optional), slides URL (optional), description |
| **Projects** | Side projects launched — portfolio-style cards with links. | Title, description, URL, image/screenshot, status (active/archived), tags |
| **Annual Recaps** | Year-in-review posts with collapsible categories (books, music, food, moments, etc.). | Title, year, categories with accordion content. MDX-heavy with custom Accordion component. Photo galleries linked or embedded. |
| **Travel** | City guides with recommendations — what to do, where to stay, what to eat/drink/see. Each city is its own page. | Title (city name), region/country, coverImage, last updated date. Sections within each page for categories (eat, drink, see, stay, do). |
| **Guides** | How-to and reference content — packing lists, photo organization, package tracking setup, etc. | Title, date, description, tags, growth stage |
| **Favorites** | Evergreen curated recommendation lists — favorite apps, devices, TV shows, podcasts, EDC, live music, etc. Updated over time, not tied to a specific year. | Title, category, last updated date. Distinct from Annual Recaps which are time-bound snapshots. |

### Standalone Pages

| Page | Description |
|---|---|
| **Now** | A single living page with reverse-chronological life/work snapshots. Updated every few months. Captures what Josh is working on, reading, watching, thinking about — the texture of life between blog posts. Low-friction way to keep the site feeling alive. Inspired by the [/now page movement](https://nownownow.com/about). |
| **About** | Expanded professional bio + career timeline + personal origin story. Intro/tagline, professional context, reverse-chronological career history with dates/company/description, personal background (LSU, how interests connect), photos. |
| **Colophon** | Meta-page documenting how the site is built. Tech stack, API integrations, typography/color choices, authoring workflow, the migration story. Written last (Phase 7) since it documents the final state. |

### Aggregated Content (fetched from external APIs/feeds)

| Type | Source | API/Method | Storage |
|---|---|---|---|
| **Tweets** | X/Twitter | Full archive export (initial) + X API for ongoing sync | JSON file in repo |
| **Last.fm** | Last.fm API | `user.getRecentTracks`, `user.getTopArtists` | Fetched at build time |
| **Letterboxd** | Letterboxd RSS feed | Parse RSS at build time | Fetched at build time |
| **Library** | Open Library API or Google Books API | Book metadata lookup; personal lists maintained as YAML/JSON | YAML/JSON for lists, API for metadata |
| **Podcasts** | Manual curation (Pocketcasts has no public API) | OPML export for subscriptions; manual or semi-automated episode tracking | YAML/JSON file |

### Growth Stages

Two stages only:
- **Draft** — displayed with a subtle banner: *"This is a work in progress. Ideas here are still forming."*
- **Published** — default state, no banner. The assumed state.

---

## Design Direction

### Philosophy
- **Calm and type-forward** — generous whitespace, readable measure, content-first
- **Warm, not sterile** — off-white backgrounds, no harsh black or white
- **Tasteful color** — forest green / British racing green accent used sparingly (links, hover states, active elements)
- **Evolved from the current site** — keep the centered, minimal feel but add a content grid and more visual interest
- **Dark mode supported** — soft charcoal, not pure black

### Typography
- Serif + sans-serif pairing (specific fonts TBD — exploring options like Newsreader/Inter, Lora/DM Sans, or premium alternatives)
- Current site uses Mrs Eaves (Typekit) — may keep or evolve
- Fluid type scale for responsive sizing

### Layout
- Centered content, ~640-720px max-width for prose (up from current 490-570px)
- Card-based grids for listing pages
- Homepage: bio + social links → living content grid with sections from each content type
- Responsive: works well on mobile through desktop

### Color Palette (approximate, to be refined)
- **Background**: warm off-white (~`#faf8f5`), dark mode soft charcoal (~`#1a1a2e` or `#1a1a1a`)
- **Text**: warm dark gray for body, darker for headings
- **Accent**: forest green / British racing green family (around `#2d6a4f` — to be dialed in)
- **Subtle**: light borders, soft shadows on hover for cards

---

## Pages & Navigation

### Primary Navigation
- Home
- Writing
- Notes
- Projects
- Now
- About

### Secondary Navigation (footer, "More" dropdown, or linked from relevant pages)
- Talks
- Travel
- Guides
- Favorites
- Library
- Tweets
- Listening (Last.fm)
- Watching (Letterboxd)
- Podcasts
- Annual Recaps
- Archive (pre-2012 blog posts)
- Goals (carried forward from current site)

### Footer Only
- Colophon
- RSS

### Homepage Layout
```
[Photo]  Josh Ferrara
         Product strategist, dad, musician, reader, photographer.
         [social icons]

─────────────────────────────────────────────────

Latest Writing        [2-3 cards]
Recent Notes          [2-3 cards]
Listening To          [Last.fm: top artists or recent tracks]
Recently Watched      [Letterboxd: recent movie posters]
Currently Reading     [1-2 book covers]
Recent Tweets         [5-10 recent tweets, "More on X →"]
```

---

## Migration Strategy

### Source
- Current site: `joshferrara.github.com` repo, Jekyll, hosted on GitHub Pages
- 264 blog posts (2006–2013), projects page, mini-apps, goals page, Twitter archive

### Approach
1. Build new site in parallel on a temporary `*.workers.dev` URL
2. Current site stays live and untouched throughout development
3. When ready: DNS cutover from GitHub Pages to Cloudflare Workers
4. Old repo becomes archive (optionally made private)

### Content Migration
- **Posts from Aug 14, 2012 onward** → Writing section, fully integrated
- **Posts before Aug 2012** → Archive page with clear "college-era" framing, linked from bottom of Writing page
- **Mini-apps** (`/wordle/`, `/sea/`, `/tmux/`, `/popcorn/`, etc.) → copied to Astro's `public/` directory, same URLs
- **Projects page** → migrated and redesigned
- **Goals page** → carried forward
- **Twitter archive** (`/twitter/`) → re-ingested as Tweets content type
- **Profile photos, CNAME** → carried forward

### SEO Preservation
- Same domain (`joshferrara.com`) — domain authority preserved
- 301 redirects for all changed URL paths (e.g., `/blog/slug/` → `/writing/slug/`)
- Sitemap generation via `@astrojs/sitemap`
- `llms.txt` and markdown content negotiation carried forward
- OG meta tags on all pages
- Submit updated sitemap to Google Search Console after cutover

### URL Redirect Map
| Old Path | New Path |
|---|---|
| `/blog/[slug]/` | `/writing/[slug]/` |
| `/blog/` | `/writing/` |
| `/archive/` | `/archive/` (same) |
| `/projects/` | `/projects/` (same) |
| `/goals/` | `/goals/` (same) |
| `/feed/` | `/feed.xml` |

---

## External Integrations Detail

### Twitter/X
- **Initial import**: Download full Twitter archive from X → parse `tweets.js` → convert to JSON
- **Ongoing sync**: Script that hits X API free tier (1,500 reads/month) for recent tweets since last import
- **Storage**: Single JSON file in repo (`src/data/tweets.json`)
- **Display**: Layered UI — homepage shows last 5-10, `/tweets` shows recent 50 with pagination, full archive searchable via Pagefind

### Last.fm
- **API**: `user.getRecentTracks`, `user.getTopArtists` (free API key required)
- **Fetch**: At build time via Workers Cron rebuild
- **Display**: Homepage widget (top artists this month or recent tracks), dedicated `/listening` page with longer history

### Letterboxd
- **Source**: Public RSS feed (no API application needed)
- **Fetch**: Parse RSS at build time
- **Display**: Homepage row of recent movie posters, dedicated `/watching` page with diary entries and ratings

### Library / Books
- **Personal lists**: Maintained as YAML or JSON files (`reading.yaml`, `want-to-read.yaml`)
- **Metadata**: Open Library API or Google Books API for covers, descriptions, ISBNs
- **Display**: `/library` page with "Read" and "Want to Read" sections, book cover grid

### Podcasts
- **Source**: Manual curation (no Pocketcasts API)
- **Storage**: YAML or JSON file with episode title, show, date, link, optional notes
- **Display**: `/podcasts` page, simple list

---

## Open Items / Future Considerations

- [ ] Final font selection (exploring options)
- [ ] Exact green accent color (looking at swatches)
- [ ] Card design inspiration (Josh looking for examples)
- [ ] Smidgeons content type — dropped for now, can add later if direct site traffic grows
- [ ] Comments/interactions (webmentions, Giscus, or nothing) — not decided
- [ ] Newsletter/RSS signup — not discussed yet
- [ ] Analytics solution — current site uses Gauges + legacy GA, needs modernizing
