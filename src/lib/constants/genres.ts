export const SUPPORTED_GENRES = [
  "Action",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Horror",
  "Comedy",
  "Drama",
  "Slice of Life",
  "Mystery",
  "Supernatural",
] as const;

export type SupportedGenre = (typeof SUPPORTED_GENRES)[number];

export function isValidGenre(genre: string): boolean {
  return SUPPORTED_GENRES.includes(genre as SupportedGenre);
}
