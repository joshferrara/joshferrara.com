import yaml from 'js-yaml';
import booksReadRaw from '../data/books-read.yaml?raw';
import booksWantRaw from '../data/books-want-to-read.yaml?raw';
import booksReadingRaw from '../data/books-reading.yaml?raw';

export interface Book {
  title: string;
  author: string;
  isbn?: string;
  dateRead?: string;
  rating?: number;
  notes?: string;
}

function parseYaml(raw: string): Book[] {
  try {
    const data = yaml.load(raw);
    if (!Array.isArray(data)) return [];
    return data;
  } catch {
    return [];
  }
}

export function getBooksRead(): Book[] {
  return parseYaml(booksReadRaw);
}

export function getBooksWantToRead(): Book[] {
  return parseYaml(booksWantRaw);
}

export function getBooksReading(): Book[] {
  return parseYaml(booksReadingRaw);
}
