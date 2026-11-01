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

export function genreToSlug(genre: string): string {
  return genre
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export function slugToGenre(slug: string): SupportedGenre | null {
  const normalized = slug.toLowerCase().trim();
  const match = SUPPORTED_GENRES.find((g) => genreToSlug(g) === normalized);
  return match ?? null;
}

export interface GenreInfo {
  name: SupportedGenre;
  slug: string;
  tagline: string;
  description: string;
}

export const GENRE_METADATA: Record<SupportedGenre, GenreInfo> = {
  Action: {
    name: "Action",
    slug: "action",
    tagline: "High-octane battles, martial arts, and adrenaline-fueled adventures.",
    description: "Immerse yourself in dynamic panel-to-panel action sequences, martial arts showdowns, superpowered showdowns, and relentless heroism from independent creators worldwide.",
  },
  Fantasy: {
    name: "Fantasy",
    slug: "fantasy",
    tagline: "Mythic realms, arcane magic, legendary beasts, and epic quests.",
    description: "Journey across breathtaking imaginary worlds filled with sorcery, mythical creatures, ancient prophecies, and unforgettable character journeys crafted by indie worldbuilders.",
  },
  "Sci-Fi": {
    name: "Sci-Fi",
    slug: "sci-fi",
    tagline: "Cyberpunk sprawls, interstellar voyages, and speculative futures.",
    description: "Explore high-concept science fiction, futuristic dystopias, artificial intelligence, cosmic mysteries, and alternate realities envisioned by visionary comic creators.",
  },
  Romance: {
    name: "Romance",
    slug: "romance",
    tagline: "Heartfelt connections, dramatic passions, and captivating bonds.",
    description: "Experience genuine emotional storytelling, slow-burn romantic arcs, star-crossed lovers, and vibrant relationship dynamics rendered with striking visual nuance.",
  },
  Horror: {
    name: "Horror",
    slug: "horror",
    tagline: "Eerie psychological thrills, shadowy frights, and cosmic dread.",
    description: "Dark, suspenseful visual tales of psychological horror, supernatural suspense, macabre occurrences, and gothic atmospheres crafted to keep readers on edge.",
  },
  Comedy: {
    name: "Comedy",
    slug: "comedy",
    tagline: "Clever humor, slapstick hijinks, and lighthearted laughs.",
    description: "Brighten your reading with hilarious character antics, witty banter, absurd comic timing, and charming everyday misadventures.",
  },
  Drama: {
    name: "Drama",
    slug: "drama",
    tagline: "Grounded narratives, moral dilemmas, and rich human emotion.",
    description: "Deeply character-driven stories exploring family dynamics, personal struggles, moral conflicts, and evocative storytelling with lasting emotional resonance.",
  },
  "Slice of Life": {
    name: "Slice of Life",
    slug: "slice-of-life",
    tagline: "Warm everyday moments, relatable journeys, and cozy vibes.",
    description: "Celebrate the quiet beauty of ordinary days, artistic friendships, school memories, cozy coffee shops, and relatable human connection.",
  },
  Mystery: {
    name: "Mystery",
    slug: "mystery",
    tagline: "Intricate enigmas, detective noir, and shocking plot twists.",
    description: "Unravel tangled webs of clues, puzzling crimes, detective investigations, and gripping whodunits where every panel holds a potential secret.",
  },
  Supernatural: {
    name: "Supernatural",
    slug: "supernatural",
    tagline: "Spirits, paranormal phenomena, curses, and otherworldly powers.",
    description: "Step beyond the veil into worlds of specters, occult phenomena, mythical curses, and otherworldly entities walking among mortals.",
  },
};
