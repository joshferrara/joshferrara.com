const FEED_URL = import.meta.env.LETTERBOXD_RSS_URL || 'https://letterboxd.com/joshferrara/rss/';

export interface FilmEntry {
  title: string;
  link: string;
  rating: string;
  watchedDate: string;
  year: string;
  image: string;
  review: string;
}

export async function getRecentFilms(limit = 20): Promise<FilmEntry[]> {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) return [];

    const xml = await res.text();
    return parseRSS(xml).slice(0, limit);
  } catch {
    return [];
  }
}

function parseRSS(xml: string): FilmEntry[] {
  const items: FilmEntry[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];

    const title = extractTag(content, 'letterboxd:filmTitle') || extractTag(content, 'title') || '';
    const link = extractTag(content, 'link') || '';
    const rating = extractTag(content, 'letterboxd:memberRating') || '';
    const watchedDate = extractTag(content, 'letterboxd:watchedDate') || '';
    const year = extractTag(content, 'letterboxd:filmYear') || '';
    const review = extractTag(content, 'description') || '';

    // Extract poster image from description HTML
    const imgMatch = review.match(/<img src="([^"]+)"/);
    const image = imgMatch?.[1] || '';

    items.push({ title, link, rating, watchedDate, year, image, review });
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?(.*?)(?:\\]\\]>)?<\\/${tag}>`, 's');
  const match = xml.match(regex);
  return match?.[1]?.trim() || '';
}
