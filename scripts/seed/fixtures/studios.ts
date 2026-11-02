import type { StudioManifest } from "../types.ts";

export const SEED_STUDIOS: StudioManifest[] = [
  {
    id: "studio-01",
    slug: "iron-quill-studios",
    name: "Iron Quill Studios",
    description:
      "A collective of seasoned worldbuilders and sequential artists dedicated to grand-scale epic fantasy adventures and relentless martial action.",
    createdByUsername: "marcus_kane",
    members: [
      { creatorUsername: "marcus_kane", role: "owner" },
      { creatorUsername: "rowan_macleod", role: "admin" },
      { creatorUsername: "jin_woo_park", role: "editor" },
      { creatorUsername: "devon_reed", role: "member" },
    ],
    logoPrompt:
      "Emblem logo for Iron Quill Studios, minimalist graphic mark showing a raven-feather quill intersecting an ancient steel broadsword, embossed metallic gold and forged iron texture, solid deep charcoal background.",
    logoFile: "studios/iron-quill-studios.png",
  },
  {
    id: "studio-02",
    slug: "neon-district-collective",
    name: "Neon District Collective",
    description:
      "Forward-thinking sci-fi, cyberpunk, and speculative fiction studio crafting high-concept vertical scroll epics with neon aesthetics and cinematic pacing.",
    createdByUsername: "elena_vance",
    members: [
      { creatorUsername: "elena_vance", role: "owner" },
      { creatorUsername: "tariq_al_mansoor", role: "admin" },
      { creatorUsername: "sam_okoro", role: "editor" },
      { creatorUsername: "maya_lin", role: "member" },
    ],
    logoPrompt:
      "Futuristic vector logo for Neon District Collective, sharp geometric isometric skyscraper silhouette intertwined with glowing cyan and electric magenta circuit traces, sleek cybernetic aesthetic.",
    logoFile: "studios/neon-district-collective.png",
  },
  {
    id: "studio-03",
    slug: "velvet-crow-press",
    name: "Velvet Crow Press",
    description:
      "Indie publishing imprint dedicated to atmospheric gothic horror, occult mysteries, psychological suspense, and shadow-drenched folklore.",
    createdByUsername: "clara_thorne",
    members: [
      { creatorUsername: "clara_thorne", role: "owner" },
      { creatorUsername: "lucas_valerio", role: "admin" },
      { creatorUsername: "hannah_lindqvist", role: "editor" },
      { creatorUsername: "chloe_dupont", role: "member" },
    ],
    logoPrompt:
      "Gothic emblem for Velvet Crow Press, silhouette of a crowned crow perched atop an ornate antique key, surrounded by dark thorny brambles in deep crimson and silver leaf, dark textured background.",
    logoFile: "studios/velvet-crow-press.png",
  },
  {
    id: "studio-04",
    slug: "heartstring-comics",
    name: "Heartstring Comics",
    description:
      "Creator-led studio crafting heartfelt romance, nuanced family dramas, and comforting slice-of-life stories that resonate deeply with readers worldwide.",
    createdByUsername: "soraya_mirza",
    members: [
      { creatorUsername: "soraya_mirza", role: "owner" },
      { creatorUsername: "aiko_takahashi", role: "admin" },
      { creatorUsername: "chloe_dupont", role: "editor" },
      { creatorUsername: "felix_castillo", role: "member" },
    ],
    logoPrompt:
      "Warm handcrafted logo for Heartstring Comics, continuous golden thread forming the shape of an open comic book and an intertwined heart, soft terracotta and warm rose tones, artisanal letterpress feel.",
    logoFile: "studios/heartstring-comics.png",
  },
];
