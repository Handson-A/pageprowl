import type { CreatorManifest } from "../types.ts";

export const SEED_CREATORS: CreatorManifest[] = [
  {
    id: "creator-01",
    username: "elena_vance",
    displayName: "Elena Vance",
    penName: "E. V. Vance",
    bio: "Concept artist and cyberpunk storyteller exploring the intersection of neuro-tech and humanity in vertical scroll format.",
    websiteUrl: "https://elenavance.art",
    socialLinks: {
      portfolio: "https://elenavance.art/gallery",
      bluesky: "@elenavance.bsky.social",
    },
    avatarPrompt:
      "Digital painting portrait of Elena Vance, a female cyberpunk comic artist with an asymmetrical undercut dyed teal, warm amber eyes, high-collared dark slate jacket with illuminated circuit accents, moody rim lighting.",
    avatarFile: "avatars/elena_vance.png",
  },
  {
    id: "creator-02",
    username: "marcus_kane",
    displayName: "Marcus Kane",
    penName: "M. K. Kane",
    bio: "Classic high-fantasy illustrator focused on vast worldbuilding, mythic creatures, and deep historical sagas.",
    websiteUrl: "https://marcuskane.art",
    socialLinks: {
      portfolio: "https://marcuskane.art/portfolio",
      mastodon: "@marcuskane@mastodon.art",
    },
    avatarPrompt:
      "Portrait of Marcus Kane, an indie fantasy comic creator with salt-and-pepper beard, focused hazel eyes, wearing a dark wool coat and holding a brass-nibbed ink pen, warm candlelit studio background.",
    avatarFile: "avatars/marcus_kane.png",
  },
  {
    id: "creator-03",
    username: "soraya_mirza",
    displayName: "Soraya Mirza",
    penName: "S. Mirza",
    bio: "Visual novelist crafting slow-burn romances, emotional dramas, and nuanced relationship dynamics with vibrant palettes.",
    websiteUrl: "https://sorayamirza.com",
    socialLinks: {
      portfolio: "https://sorayamirza.com/works",
      instagram: "@sorayamirza_comics",
    },
    avatarPrompt:
      "Illustrated portrait of Soraya Mirza, a woman in her late 20s with long dark wavy hair, gold hoop earrings, warm skin tone, terracotta turtleneck sweater, soft golden hour sunlight filtering through Monstera leaves.",
    avatarFile: "avatars/soraya_mirza.png",
  },
  {
    id: "creator-04",
    username: "jin_woo_park",
    displayName: "Jin-Woo Park",
    penName: "J. W. Park",
    bio: "Specializing in dynamic martial arts choreographies, kinetic action panelling, and urban supernatural lore.",
    websiteUrl: null,
    socialLinks: {
      portfolio: "https://artstation.com/jinwoopark_comic",
    },
    avatarPrompt:
      "Stylized comic portrait of Jin-Woo Park, a sharp-eyed Korean artist with short styled black hair, wearing a sleek black hoodie with minimalist geometric red graphics, dramatic diagonal studio lighting.",
    avatarFile: "avatars/jin_woo_park.png",
  },
  {
    id: "creator-05",
    username: "clara_thorne",
    displayName: "Clara Thorne",
    penName: "Thorne",
    bio: "Dark fantasy and psychological horror author. Lover of gothic architecture, Victorian occultism, and eerie mystery.",
    websiteUrl: "https://clarathorne.darkarts.net",
    socialLinks: {
      portfolio: "https://clarathorne.darkarts.net/grimoire",
    },
    avatarPrompt:
      "Gothic ink portrait of Clara Thorne, pale complexion, dark burgundy wavy bob haircut, silver raven-skull brooch pinned to a high-neck velvet collar, subtle antique lace textures in background.",
    avatarFile: "avatars/clara_thorne.png",
  },
  {
    id: "creator-06",
    username: "devon_reed",
    displayName: "Devon Reed",
    penName: "D. Reed",
    bio: "Cartoonist and humorist. Creating wholesome slice-of-life and witty comedic strips that celebrate everyday absurdities.",
    websiteUrl: "https://devonreed.me",
    socialLinks: {
      portfolio: "https://devonreed.me/strips",
    },
    avatarPrompt:
      "Vibrant indie comic portrait of Devon Reed, expressive smiling face, round tortoiseshell glasses, messy brown curls, mustard-yellow knit cardigan, pastel mint-green gradient background with whimsical hand-drawn doodles.",
    avatarFile: "avatars/devon_reed.png",
  },
  {
    id: "creator-07",
    username: "tariq_al_mansoor",
    displayName: "Tariq Al-Mansoor",
    penName: "T. Mansoor",
    bio: "Sci-fi worldbuilder and hard-SF creator. Drawing massive megastructures, alien biospheres, and deep space survival.",
    websiteUrl: "https://almansoor-archives.org",
    socialLinks: {
      portfolio: "https://almansoor-archives.org/schematics",
    },
    avatarPrompt:
      "Portrait of Tariq Al-Mansoor, thoughtful middle-aged Arab artist with neatly trimmed beard, dark aviator frames, navy mechanic utility jumpsuit, backlit by holographic star charts and deep blue ambient starlight.",
    avatarFile: "avatars/tariq_al_mansoor.png",
  },
  {
    id: "creator-08",
    username: "aiko_takahashi",
    displayName: "Aiko Takahashi",
    penName: "Aiko-T",
    bio: "Watercolorist and webcomic author capturing gentle moments, botanical coffee shops, and heartfelt friendships.",
    websiteUrl: "https://aiko-takahashi.ink",
    socialLinks: {
      portfolio: "https://aiko-takahashi.ink/watercolors",
    },
    avatarPrompt:
      "Soft watercolor style portrait of Aiko Takahashi, Japanese woman with shoulder-length straight brown hair with bangs, oversized lavender knit sweater, clutching a steaming ceramic mug, warm bakery glow in soft focus.",
    avatarFile: "avatars/aiko_takahashi.png",
  },
  {
    id: "creator-09",
    username: "rowan_macleod",
    displayName: "Rowan MacLeod",
    penName: "R. MacLeod",
    bio: "Celtic mythologist, fantasy cartographer, and sword-and-sorcery epic creator.",
    websiteUrl: null,
    socialLinks: {
      portfolio: "https://artstation.com/rowanmacleod",
    },
    avatarPrompt:
      "Painterly portrait of Rowan MacLeod, auburn beard and hair tied in a loose warrior bun, rugged weathered features, charcoal wool fisherman sweater, moody Scottish highland overcast sky in background.",
    avatarFile: "avatars/rowan_macleod.png",
  },
  {
    id: "creator-10",
    username: "maya_lin",
    displayName: "Maya Lin",
    penName: "M. Lin",
    bio: "Noir detective fiction writer and cinematic layout specialist. Exploring tangled moral dilemmas in rainy concrete canyons.",
    websiteUrl: "https://mayalin-noir.com",
    socialLinks: {
      portfolio: "https://mayalin-noir.com/casefiles",
    },
    avatarPrompt:
      "Dramatic film noir portrait of Maya Lin, high-contrast monochrome with subtle cyan tint, sharp cheekbones, trench coat with upturned collar, Venetian blind shadows cast across face, rainy window reflection.",
    avatarFile: "avatars/maya_lin.png",
  },
  {
    id: "creator-11",
    username: "lucas_valerio",
    displayName: "Lucas Valerio",
    penName: "L. Valerio",
    bio: "Supernatural illustrator and occult folklorist. Bridging the gap between the living world and ancient spirits.",
    websiteUrl: "https://lucasvalerio.art",
    socialLinks: {
      portfolio: "https://lucasvalerio.art/occult",
    },
    avatarPrompt:
      "Atmospheric portrait of Lucas Valerio, Latino comic artist with wavy black hair, observant dark eyes, dark denim jacket over a floral shirt, surrounded by glowing floating ember-like spirit motes in deep twilight.",
    avatarFile: "avatars/lucas_valerio.png",
  },
  {
    id: "creator-12",
    username: "chloe_dupont",
    displayName: "Chloé Dupont",
    penName: "C. Dupont",
    bio: "Historical and contemporary drama creator focusing on intricate character arcs, period details, and family sagas.",
    websiteUrl: "https://chloedupont-bd.fr",
    socialLinks: {
      portfolio: "https://chloedupont-bd.fr/albums",
    },
    avatarPrompt:
      "Bande-dessinée inspired portrait of Chloé Dupont, French artist with chic platinum blonde bob, elegant black turtleneck, minimalist silver pendant, warm Parisian studio with drafting table and ink pots in background.",
    avatarFile: "avatars/chloe_dupont.png",
  },
  {
    id: "creator-13",
    username: "sam_okoro",
    displayName: "Sam Okoro",
    penName: "S. Okoro",
    bio: "Afrofuturistic mecha artist, explosive action layouts, and sprawling solar empire adventures.",
    websiteUrl: "https://samokoro-mech.com",
    socialLinks: {
      portfolio: "https://samokoro-mech.com/hangar",
    },
    avatarPrompt:
      "Energetic portrait of Sam Okoro, Nigerian artist with sharp braided fade, charismatic grin, wearing an orange and cobalt tech-wear bomber jacket, bright industrial hangar lighting with giant robotic silhouette behind.",
    avatarFile: "avatars/sam_okoro.png",
  },
  {
    id: "creator-14",
    username: "hannah_lindqvist",
    displayName: "Hannah Lindqvist",
    penName: "H. Lindqvist",
    bio: "Nordic mystery and psychological crime fiction writer. Frozen landscapes, isolated secrets, and silent tension.",
    websiteUrl: null,
    socialLinks: {
      portfolio: "https://hannah-lindqvist.nordicart.se",
    },
    avatarPrompt:
      "Nordic atmospheric portrait of Hannah Lindqvist, pale blue eyes, Scandinavian blonde hair in a functional braid, heavy dark green park coat, frosted winter pines and pale misty arctic dawn in background.",
    avatarFile: "avatars/hannah_lindqvist.png",
  },
  {
    id: "creator-15",
    username: "felix_castillo",
    displayName: "Felix Castillo",
    penName: "F. Castillo",
    bio: "Dark comedy and satirist writer. Twisting urban folklore and workplace absurdities into laugh-out-loud sequential art.",
    websiteUrl: "https://felixcastillo.ink",
    socialLinks: {
      portfolio: "https://felixcastillo.ink/cartoons",
    },
    avatarPrompt:
      "Quirky expressive comic portrait of Felix Castillo, Hispanic artist with infectious laughter, arched eyebrow, graphic tee featuring a retro monster, bright pop-art split complementary background (magenta and lemon yellow).",
    avatarFile: "avatars/felix_castillo.png",
  },
];
