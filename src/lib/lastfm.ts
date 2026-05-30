const API_KEY = import.meta.env.LASTFM_API_KEY || '';
const USERNAME = import.meta.env.LASTFM_USERNAME || 'joshferrara';
const BASE = 'https://ws.audioscrobbler.com/2.0/';
const LASTFM_PLACEHOLDER_IMAGE_HASH = '2a96cbd8b46e442fc41c2b86b821562f';
const artistImageCache = new Map<string, Promise<{ image: string; found: boolean }>>();

export interface Artist {
  name: string;
  playcount: string;
  url: string;
  image: string;
}

export interface Track {
  name: string;
  artist: string;
  album: string;
  url: string;
  image: string;
  date: string;
  nowPlaying: boolean;
}

async function fetchLastfm(method: string, params: Record<string, string> = {}) {
  if (!API_KEY) return null;

  const query = new URLSearchParams({
    method,
    user: USERNAME,
    api_key: API_KEY,
    format: 'json',
    ...params,
  });

  try {
    const res = await fetch(`${BASE}?${query}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function isLastfmPlaceholderImage(image: string) {
  return image.includes(LASTFM_PLACEHOLDER_IMAGE_HASH);
}

function usableImage(image: string) {
  return image && !isLastfmPlaceholderImage(image) ? image : '';
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (nextIndex < items.length) {
        const index = nextIndex++;
        results[index] = await mapper(items[index]);
      }
    })
  );

  return results;
}

/** Fetch artist image from Deezer (free, no auth required), fall back to Last.fm.
 *  Returns empty string if the artist isn't found on Deezer (likely an audiobook). */
async function getArtistImage(name: string, lastfmImage: string): Promise<{ image: string; found: boolean }> {
  const fallbackImage = usableImage(lastfmImage);

  try {
    const res = await fetch(
      `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=1`
    );
    if (!res.ok) return { image: fallbackImage, found: true };
    const data = await res.json();
    const match = data.data?.[0];
    if (!match) return { image: fallbackImage, found: false };
    return { image: match.picture_medium || fallbackImage, found: true };
  } catch {
    return { image: fallbackImage, found: true };
  }
}

function getCachedArtistImage(name: string, lastfmImage: string) {
  const key = name.trim().toLowerCase();
  let promise = artistImageCache.get(key);
  if (!promise) {
    promise = getArtistImage(name, lastfmImage);
    artistImageCache.set(key, promise);
  }
  return promise;
}

export async function getTopArtists(period = '7day', limit = 5): Promise<Artist[]> {
  // Fetch extra artists so we still have enough after filtering audiobooks
  const fetchLimit = limit + 10;
  const data = await fetchLastfm('user.gettopartists', { period, limit: String(fetchLimit) });
  if (!data?.topartists?.artist) return [];

  const raw = data.topartists.artist.map((a: any) => ({
    name: a.name,
    playcount: a.playcount,
    url: a.url,
    image: usableImage(a.image?.find((i: any) => i.size === 'large')?.['#text'] || ''),
  }));

  // Fetch images from Deezer with light concurrency; filter out artists not found (likely audiobooks).
  const results = await mapWithConcurrency(
    raw,
    4,
    (a: Artist) => getCachedArtistImage(a.name, a.image)
  );

  const artists: Artist[] = [];
  for (let i = 0; i < raw.length && artists.length < limit; i++) {
    if (results[i].found) {
      raw[i].image = results[i].image;
      artists.push(raw[i]);
    }
  }

  return artists;
}

async function getTrackImage(trackName: string, artistName: string, lastfmImage: string): Promise<string> {
  const fallbackImage = usableImage(lastfmImage);

  try {
    const q = encodeURIComponent(`${artistName} ${trackName}`);
    const res = await fetch(`https://api.deezer.com/search/track?q=${q}&limit=1`);
    if (!res.ok) return fallbackImage;
    const data = await res.json();
    const match = data.data?.[0];
    return match?.album?.cover_medium || fallbackImage;
  } catch {
    return fallbackImage;
  }
}

export async function getRecentTracks(limit = 10): Promise<Track[]> {
  const data = await fetchLastfm('user.getrecenttracks', { limit: String(limit) });
  if (!data?.recenttracks?.track) return [];

  const raw = data.recenttracks.track.map((t: any) => ({
    name: t.name,
    artist: t.artist?.['#text'] || '',
    album: t.album?.['#text'] || '',
    url: t.url,
    image: usableImage(t.image?.find((i: any) => i.size === 'medium')?.['#text'] || ''),
    date: t.date?.['#text'] || '',
    nowPlaying: t['@attr']?.nowplaying === 'true',
  }));

  const images = await Promise.all(
    raw.map((t: Track) => getTrackImage(t.name, t.artist, t.image))
  );

  return raw.map((t: Track, i: number) => ({ ...t, image: images[i] }));
}
