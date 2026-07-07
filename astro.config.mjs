// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://joshferrara.com',
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({
    // Optimize <Image> at build time into static /_astro assets. The v13
    // default ('cloudflare-binding') needs a Cloudflare Images binding we
    // don't provision, so its runtime /_image endpoint 404s on Workers.
    imageService: 'compile',
  }),
  // Prefetch internal links on hover/focus so navigation feels instant.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  redirects: {
    '/blog/': '/writing/',
    '/feed/': '/feed.xml',
    '/library/': '/reading/',
  },
});