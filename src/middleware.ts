import { defineMiddleware } from 'astro:middleware';

// Notion recap redirects (temporary until content is migrated in-house)
const notionRecaps: Record<string, string> = {
  '/2022': 'https://joshferrara.notion.site/Things-I-Loved-In-2022-8bce19bdf6e84474876feae5b5f4d4ea',
  '/2023': 'https://joshferrara.notion.site/Things-I-Loved-In-2023-ddbff4653ceb4c7fa2080d5631679768',
  '/2024': 'https://joshferrara.notion.site/Things-I-Loved-In-2024-b6af7c8b0f134f92ae44bd8e8d0b46ff',
};

export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  // Redirect /blog/[slug]/ to /writing/[slug]/
  const blogMatch = url.pathname.match(/^\/blog\/(.+?)\/?\s*$/);
  if (blogMatch) {
    return redirect(`/writing/${blogMatch[1]}/`, 301);
  }

  // Notion recap redirects
  const cleanPath = url.pathname.replace(/\/$/, '');
  if (notionRecaps[cleanPath]) {
    return redirect(notionRecaps[cleanPath], 302);
  }

  return next();
});
