const API_KEY = import.meta.env.LASTFM_API_KEY || '';
const USERNAME = import.meta.env.LASTFM_USERNAME || 'joshferrara';
const BASE = 'https://ws.audioscrobbler.com/2.0/';

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

/** Fetch artist image from Deezer (free, no auth required), fall back to Last.fm */
async function getArtistImage(name: string, lastfmImage: string): Promise<string> {
  try {
    const res = await fetch(
      `https://api.deezer.com/search/artist?q=${encodeURIComponent(name)}&limit=1`
    );
    if (!res.ok) return lastfmImage;
    const data = await res.json();
    return data.data?.[0]?.picture_medium || lastfmImage;
  } catch {
    return lastfmImage;
  }
}

export async function getTopArtists(period = '1month', limit = 5): Promise<Artist[]> {
  const data = await fetchLastfm('user.gettopartists', { period, limit: String(limit) });
  if (!data?.topartists?.artist) return [];

  const artists = data.topartists.artist.map((a: any) => ({
    name: a.name,
    playcount: a.playcount,
    url: a.url,
    image: a.image?.find((i: any) => i.size === 'large')?.['#text'] || '',
  }));

  // Fetch images from Deezer in parallel, falling back to Last.fm
  const images = await Promise.all(
    artists.map((a: Artist) => getArtistImage(a.name, a.image))
  );
  for (let i = 0; i < artists.length; i++) {
    artists[i].image = images[i];
  }

  return artists;
}

export async function getRecentTracks(limit = 10): Promise<Track[]> {
  const data = await fetchLastfm('user.getrecenttracks', { limit: String(limit) });
  if (!data?.recenttracks?.track) return [];

  return data.recenttracks.track.map((t: any) => ({
    name: t.name,
    artist: t.artist?.['#text'] || '',
    album: t.album?.['#text'] || '',
    url: t.url,
    image: t.image?.find((i: any) => i.size === 'medium')?.['#text'] || '',
    date: t.date?.['#text'] || '',
    nowPlaying: t['@attr']?.nowplaying === 'true',
  }));
}
