const API_URL = 'https://api.hardcover.app/v1/graphql';
const TOKEN = import.meta.env.HARDCOVER_API_TOKEN || '';
const USER_ID = 89363;

// Status IDs from the Hardcover API
const STATUS = {
  WANT_TO_READ: 1,
  CURRENTLY_READING: 2,
  READ: 3,
} as const;

export interface Book {
  id: number;
  title: string;
  author: string;
  slug: string;
  coverUrl: string | null;
  rating: number | null;
  dateAdded: string | null;
}

async function query(gql: string): Promise<any> {
  if (!TOKEN) return null;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ query: gql }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function parseBooks(data: any): Book[] {
  if (!data?.data?.user_books) return [];

  return data.data.user_books.map((ub: any) => ({
    id: ub.id,
    title: ub.book?.title || ub.edition?.title || '',
    author: ub.book?.contributions?.[0]?.author?.name || '',
    slug: ub.book?.slug || '',
    coverUrl: ub.edition?.image?.url || ub.book?.image?.url || null,
    rating: ub.rating,
    dateAdded: ub.date_added,
  }));
}

export async function getCurrentlyReading(): Promise<Book[]> {
  const data = await query(`{
    user_books(
      where: { status_id: { _eq: ${STATUS.CURRENTLY_READING} }, user_id: { _eq: ${USER_ID} } }
    ) {
      id rating date_added
      edition { title image { url } }
      book { title slug image { url } contributions { author { name } } }
    }
  }`);
  return parseBooks(data);
}

export async function getReadBooks(limit = 20): Promise<Book[]> {
  const data = await query(`{
    user_books(
      where: { status_id: { _eq: ${STATUS.READ} }, user_id: { _eq: ${USER_ID} } }
      order_by: { date_added: desc }
      limit: ${limit}
    ) {
      id rating date_added
      edition { title image { url } }
      book { title slug image { url } contributions { author { name } } }
    }
  }`);
  return parseBooks(data);
}

export async function getWantToRead(limit = 20): Promise<Book[]> {
  const data = await query(`{
    user_books(
      where: { status_id: { _eq: ${STATUS.WANT_TO_READ} }, user_id: { _eq: ${USER_ID} } }
      order_by: { date_added: desc }
      limit: ${limit}
    ) {
      id rating date_added
      edition { title image { url } }
      book { title slug image { url } contributions { author { name } } }
    }
  }`);
  return parseBooks(data);
}
