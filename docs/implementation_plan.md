# joshferrara.com v9 — Implementation Plan

> Reference: [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) for all decisions and context.

---

## Phase 1: Foundation

**Goal**: Astro project scaffolded, deployed to Cloudflare Workers, design system established, homepage and about page live.

### 1.1 Project Setup
- [ ] Initialize Astro project (`npm create astro@latest`)
- [ ] Configure TypeScript
- [ ] Install and configure `@astrojs/mdx`
- [ ] Install and configure `@astrojs/cloudflare` adapter
- [ ] Create `wrangler.jsonc` for Cloudflare Workers deployment
- [ ] Set up GitHub repo (`joshferrara.com`)
- [ ] Connect repo to Cloudflare Workers (Workers Builds or `wrangler deploy` in CI)
- [ ] Verify deployment to temporary `*.workers.dev` URL

### 1.2 Design System
- [ ] Define CSS custom properties: colors (light/dark), spacing scale, type scale
- [ ] Set up font loading (serif + sans-serif pairing — placeholder until final selection)
- [ ] Green accent color system (primary, hover, active, muted variants)
- [ ] Dark mode support via `prefers-color-scheme` + optional manual toggle
- [ ] Base component styles: links, buttons, cards, tags, dividers
- [ ] Responsive breakpoints and container widths

### 1.3 Layout Components
- [ ] `BaseHead.astro` — meta tags, OG tags, fonts, CSS
- [ ] `BaseLayout.astro` — wraps all pages (head, nav, main, footer)
- [ ] `Nav.astro` — primary navigation (Home, Writing, Notes, Projects, Now, About)
- [ ] `Footer.astro` — secondary nav links (Talks, Travel, Guides, Favorites, Library, Tweets, Listening, Watching, Podcasts, Recaps, Archive, Goals), Colophon link, RSS link, social icons
- [ ] `SocialIcons.astro` — X, Instagram, Threads, GitHub, Letterboxd, Spotify, YouTube, Flickr

### 1.4 Homepage
- [ ] Bio section: photo, name, tagline, social icons
- [ ] Content grid skeleton (sections for Writing, Notes, Listening, Watching, Reading, Tweets)
- [ ] Each section: placeholder content initially, wired up to real data in later phases
- [ ] "More →" links from each section to its dedicated page

### 1.5 About Page
- [ ] Intro/tagline section
- [ ] "A little context" — professional identity, what drives Josh, how interests connect
- [ ] Career timeline — reverse-chronological positions with dates, company, brief description
- [ ] Personal history — LSU, path into tech/product, the thread connecting interests
- [ ] Photos (profile shots)
- [ ] Links to social profiles

### 1.6 Now Page
- [ ] `/now/` — single MDX page with reverse-chronological life/work snapshots
- [ ] Each entry: date heading (month + year), prose covering work, reading, watching, listening, personal life
- [ ] Seed with an initial entry for the current period
- [ ] Add to primary navigation

**Deliverable**: Site is live on `*.workers.dev` with homepage, about page, now page, navigation, and design system. No content yet.

---

## Phase 2: Writing, Notes & Blog Migration

**Goal**: Core authored content types working. All 264 legacy blog posts migrated. Writing and Notes pages live.

### 2.1 Content Collections
- [ ] Define `writing` collection schema (title, date, description, tags, growthStage, coverImage)
- [ ] Define `notes` collection schema (title, date, tags, growthStage)
- [ ] Set up content directories (`src/content/writing/`, `src/content/notes/`)

### 2.2 Shared Content Components
- [ ] `PostCard.astro` — card component for listing pages (title, date, description, tags, growth stage badge)
- [ ] `DraftBanner.astro` — subtle banner for draft-stage content: "This is a work in progress. Ideas here are still forming."
- [ ] `TagList.astro` — display tags with optional filtering
- [ ] `Prose.astro` — styled wrapper for MDX content (typography, images, blockquotes, code blocks)

### 2.3 Writing Pages
- [ ] `/writing/` — listing page with all posts (newest first), tag filtering
- [ ] `/writing/[slug]/` — individual post layout (title, date, tags, growth stage, content, prev/next nav)
- [ ] RSS feed at `/feed.xml` via `@astrojs/rss`

### 2.4 Notes Pages
- [ ] `/notes/` — listing page (card grid, tag filtering)
- [ ] `/notes/[slug]/` — individual note layout (lighter-weight than writing)

### 2.5 Blog Migration
- [ ] Write migration script: parse Jekyll `_posts/` → Astro content collection format
  - Preserve frontmatter (title, date, tags)
  - Convert WordPress-era HTML in post bodies to clean markdown where feasible
  - Map posts from Aug 14, 2012+ → `writing` collection
  - Map posts before Aug 2012 → `archive` collection (or tagged subset)
- [ ] Create `/archive/` page for pre-2012 posts with framing text
- [ ] Add "Browse the college-era archive →" link at bottom of `/writing/`
- [ ] Set up 301 redirects: `/blog/[slug]/` → `/writing/[slug]/`

### 2.6 LLM Content Negotiation
- [ ] Generate `llms.txt` at site root
- [ ] Markdown alternate versions of pages (carry forward from current site concept)

**Deliverable**: Writing and Notes sections fully functional. 264 blog posts migrated. Old URLs redirect properly.

---

## Phase 3: Projects, Talks, Lists & Static Pages

**Goal**: Projects, Talks, Travel, Guides, and Favorites content types live. Legacy mini-apps and standalone pages preserved.

### 3.1 Projects
- [ ] Define `projects` collection schema (title, description, url, image, status, tags, year)
- [ ] `/projects/` — card grid page with active and archived sections
- [ ] Migrate project data from current site (Welcome to F1, Issued, Haha Scale, Life Clock, etc.)
- [ ] Annual Recaps listed here temporarily (until Phase 6 builds them out)

### 3.2 Talks
- [ ] Define `talks` collection schema (title, date, event, videoUrl, slidesUrl, description)
- [ ] `/talks/` — listing page
- [ ] `/talks/[slug]/` — individual talk page with embedded video/slides
- [ ] Seed with any existing talk content

### 3.3 Travel
- [ ] Define `travel` collection schema (title/city, region/country, coverImage, lastUpdated)
- [ ] `/travel/` — listing page (card grid of cities)
- [ ] `/travel/[slug]/` — individual city guide with sections (eat, drink, see, stay, do)
- [ ] Migrate existing city guides from Notion

### 3.4 Guides
- [ ] Define `guides` collection schema (title, date, description, tags, growthStage)
- [ ] `/guides/` — listing page
- [ ] `/guides/[slug]/` — individual guide layout
- [ ] Migrate existing guides from Notion (packing list, photo org, package tracking, etc.)

### 3.5 Favorites
- [ ] Define `favorites` collection schema (title, category, lastUpdated)
- [ ] `/favorites/` — listing page grouped by category
- [ ] `/favorites/[slug]/` — individual list (e.g., "Favorite Mac Apps", "Favorite Live Music")
- [ ] Migrate existing favorites lists from Notion
- [ ] Note: evergreen lists, not time-bound. Distinct from Annual Recaps.

### 3.6 Legacy Pages & Mini-Apps
- [ ] Copy `/wordle/` to `public/wordle/`
- [ ] Copy `/sea/` to `public/sea/`
- [ ] Copy `/tmux/` to `public/tmux/`
- [ ] Copy `/popcorn/` to `public/popcorn/`
- [ ] Copy `/weather/` to `public/weather/`
- [ ] Copy other standalone pages as needed (`/nuts/`, `/beef-tallow/`, etc.)
- [ ] Migrate `/goals/` as a proper Astro page
- [ ] Verify all legacy URLs still resolve

**Deliverable**: Projects, Talks, Travel, Guides, and Favorites pages live. All legacy mini-apps accessible at original URLs.

---

## Phase 4: Twitter Archive & Tweets

**Goal**: Full tweet archive imported, searchable, and displayed with layered UI.

### 4.1 Twitter Archive Import
- [ ] Download Twitter archive from X (manual step — Josh does this)
- [ ] Write parser script: `scripts/parse-twitter-archive.js`
  - Read `tweets.js` from archive
  - Extract: tweet ID, text, date, media URLs, reply-to, retweet info, like count
  - Output to `src/data/tweets.json`
- [ ] Handle tweet media: download images from archive, upload to R2 (or reference original URLs)
- [ ] Validate: spot-check parsed data against original tweets

### 4.2 Tweet Display
- [ ] `TweetCard.astro` — styled tweet display component (text, date, media, link to original on X)
- [ ] `/tweets/` page — layered UI:
  - Recent 50 tweets with pagination (or infinite scroll)
  - Search bar (Pagefind integration in Phase 7)
  - "View on X →" links
- [ ] Individual tweet pages: `/tweets/[id]/` for SEO and direct linking
- [ ] Homepage integration: "Recent Tweets" section showing last 5-10

### 4.3 Ongoing Sync Script
- [ ] `scripts/sync-tweets.js` — hits X API for tweets since last import
- [ ] Appends new tweets to `tweets.json`
- [ ] Designed to be run manually before deploys (automatable later via cron)
- [ ] Document X API free tier setup (API key, app registration)

**Deliverable**: 7.5k tweets imported, browsable, individually linkable. Sync script ready for ongoing use.

---

## Phase 5: External Integrations

**Goal**: Last.fm, Letterboxd, Library, and Podcasts data flowing into the site.

### 5.1 Last.fm
- [ ] Register for Last.fm API key
- [ ] Build-time fetch: `user.getTopArtists` (period: 1month) and `user.getRecentTracks`
- [ ] `ListeningWidget.astro` — homepage component (top 5 artists this month with album art)
- [ ] `/listening/` page — extended view (top artists by various periods, recent track history)
- [ ] Cache API responses as JSON during build to avoid redundant calls

### 5.2 Letterboxd
- [ ] Identify Josh's Letterboxd RSS feed URL
- [ ] Build-time RSS parsing (diary entries, ratings, reviews)
- [ ] `WatchingWidget.astro` — homepage component (last 4-5 movie posters in a row)
- [ ] `/watching/` page — full diary with ratings, links to Letterboxd reviews
- [ ] Fetch movie poster images (from TMDB API or Letterboxd's included images)

### 5.3 Library / Books
- [ ] Create `src/data/books-read.yaml` and `src/data/books-want-to-read.yaml`
  - Fields: title, author, isbn, dateRead (optional), rating (optional), reviewUrl (optional), notes (optional)
- [ ] Build-time enrichment: fetch cover images and metadata from Open Library API using ISBN
- [ ] `/library/` page — two sections: "Read" and "Want to Read", book cover grid
- [ ] Homepage integration: "Currently Reading" section (1-2 books)

### 5.4 Podcasts
- [ ] Create `src/data/podcasts.yaml`
  - Fields: showName, episodeTitle, date, url, notes (optional)
- [ ] `/podcasts/` page — simple chronological list with show name, episode, date, link
- [ ] Optional: group by show, or show most recent first

### 5.5 Workers Cron Setup
- [ ] Create deploy hook in Cloudflare Workers dashboard
- [ ] Create a small Worker with cron trigger (daily) that hits the deploy hook
- [ ] Verify: site rebuilds daily, pulling fresh Last.fm / Letterboxd data

**Deliverable**: Homepage is a living dashboard. All external data sources flowing in. Daily rebuilds keep content fresh.

---

## Phase 6: Annual Recaps & Photo Hosting

**Goal**: Annual recaps migrated from Notion with full accordion UI. Photo gallery system working via R2.

### 6.1 Cloudflare R2 Setup
- [ ] Create R2 bucket (e.g., `joshferrara-images`)
- [ ] Configure public access (custom domain or R2.dev subdomain)
- [ ] Set up Workers binding for R2 in `wrangler.jsonc`
- [ ] Create upload script or workflow: `scripts/upload-to-r2.js` (or use wrangler CLI directly)
- [ ] Test: upload a few images, verify they're accessible via URL

### 6.2 Image Components
- [ ] `OptimizedImage.astro` — wrapper for R2-hosted images with lazy loading, responsive sizing
- [ ] `PhotoGallery.astro` — responsive masonry/grid gallery component for annual recaps
- [ ] Decide: gallery as inline embed in recap page vs. separate `/recaps/[year]/moments/` subpage

### 6.3 Accordion Component
- [ ] `Accordion.astro` (or React island if interactivity needs it) — collapsible section for MDX
  - Props: `title`, `defaultOpen` (optional)
  - Smooth expand/collapse animation
  - Works with nested content (markdown, images, links)
  - Styled to match design system

### 6.4 Annual Recaps
- [ ] Define recaps content structure (MDX files in `src/content/recaps/`)
- [ ] `/recaps/` listing page (grid of year cards)
- [ ] `/recaps/[year]/` individual recap page
- [ ] Migrate existing recaps from Notion (2022–2025):
  - Export content from Notion
  - Restructure into MDX with Accordion components
  - Upload photos to R2
  - Link/embed photo galleries
- [ ] Update Projects page to link to in-house recaps instead of Notion

**Deliverable**: Annual recaps fully in-house with collapsible categories and photo galleries. R2 image pipeline working.

---

## Phase 7: Search, SEO, Polish & Launch

**Goal**: Site is production-ready. Search works. SEO is handled. DNS cutover complete.

### 7.1 Search
- [ ] Install and configure Pagefind (`@pagefind/astro` or manual integration)
- [ ] Configure indexing: include all content types (writing, notes, tweets, projects, books, etc.)
- [ ] Search UI component — accessible from nav or a dedicated search page
- [ ] Test: search across content types, verify results quality

### 7.2 SEO & Meta
- [ ] `<BaseHead>` component: title, description, OG image, Twitter card meta
- [ ] Dynamic OG images (optional — could use `@vercel/og`-style generation or static fallback)
- [ ] `@astrojs/sitemap` configured and generating
- [ ] `robots.txt`
- [ ] `llms.txt` with site description and content access instructions
- [ ] Canonical URLs on all pages
- [ ] Structured data / JSON-LD where appropriate (articles, person)

### 7.3 301 Redirects (Final Pass)
- [ ] Verify all redirects in `astro.config.mjs`:
  - `/blog/[slug]/` → `/writing/[slug]/`
  - `/blog/` → `/writing/`
  - `/feed/` → `/feed.xml`
  - Any other moved paths
- [ ] Test: hit old URLs, confirm 301 response and correct destination

### 7.4 Colophon Page
- [ ] `/colophon/` — how the site is built
  - Tech stack (Astro, Cloudflare Workers, R2, MDX)
  - API integrations (Last.fm, Letterboxd, Twitter archive, Open Library)
  - Typography and color choices
  - Content authoring workflow (MDX files, flat file CMS)
  - The rebuild/cron pipeline
  - Migration story (Jekyll → Astro, GitHub Pages → Cloudflare Workers)
  - Growth stages system explained
  - Link to GitHub repo (if open source)
- [ ] Add Colophon link to footer

### 7.5 Polish
- [ ] Dark mode: verify all pages/components look good in both modes
- [ ] Responsive: test on mobile, tablet, desktop
- [ ] Performance: Lighthouse audit, optimize images, minimize JS
- [ ] Accessibility: semantic HTML, keyboard navigation, ARIA labels, color contrast
- [ ] 404 page: design a proper one (replace the ancient Bootstrap one)
- [ ] Favicon and web app manifest
- [ ] Social preview: test OG images render correctly on Twitter/LinkedIn/iMessage

### 7.6 Analytics
- [ ] Choose analytics solution (Cloudflare Web Analytics is free and built-in, or Plausible/Fathom for more detail)
- [ ] Install and verify tracking

### 7.7 DNS Cutover & Launch
- [ ] Final review of site on `*.workers.dev` URL
- [ ] Move DNS nameservers to Cloudflare (if not already)
- [ ] Update DNS: point `joshferrara.com` to Cloudflare Workers
- [ ] Configure SSL (automatic with Cloudflare)
- [ ] Verify site loads on `joshferrara.com`
- [ ] Verify redirects work on production domain
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor Search Console for crawl errors over next 1-2 weeks
- [ ] Archive or privatize old `joshferrara.github.com` repo

**Deliverable**: Site is live at joshferrara.com. Search works. SEO preserved. Old URLs redirect. Done.

---

## Phase Dependencies

```
Phase 1 (Foundation + About + Now)
  └─→ Phase 2 (Writing & Notes)
  └─→ Phase 3 (Projects, Talks, Travel, Guides, Favorites)
  └─→ Phase 4 (Tweets)
  └─→ Phase 5 (External Integrations)
  └─→ Phase 6 (Annual Recaps & Photos)
                                 all ──→ Phase 7 (Search, Colophon, Polish, Launch)
```

Phases 2–6 can be worked on in any order after Phase 1 is complete. Phase 7 depends on all others being substantially done.

---

## Notes

- **Fonts**: TBD — Josh is exploring options. Placeholder fonts in Phase 1, swap later.
- **Color**: Forest green / British racing green family. Exact values to be refined during Phase 1 design system work.
- **Card design**: Josh is looking for examples he loves. Design will evolve.
- **Comments/interactions**: Not in scope for v9 launch. Can add later (webmentions, Giscus, etc.)
- **Newsletter**: Not discussed. Could add RSS signup or email list later.
