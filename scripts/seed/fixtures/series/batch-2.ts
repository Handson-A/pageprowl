import type { SeriesManifest } from "../../types.ts";

export const BATCH_2_SERIES: SeriesManifest[] = [
  // 11. Action (Studio: Iron Quill)
  {
    id: "series-11",
    batchNumber: 2,
    slug: "blades-of-the-iron-march",
    title: "Blades of the Iron March",
    synopsis:
      "When the Northern Khanate crosses the frozen Frostgate Pass, a disgraced border sentinel and a captive nomadic archer must form an uneasy alliance to warn the southern provinces before the passes freeze solid.",
    genre: "Action",
    format: "page",
    ownerType: "studio",
    ownerRef: "iron-quill-studios",
    credits: [
      { roleCategory: "writer", creatorUsername: "marcus_kane" },
      { roleCategory: "artist", creatorUsername: "jin_woo_park" },
      { roleCategory: "letterer", creatorUsername: "rowan_macleod" },
    ],
    artStyle: "Raw ink brushes, heavy winter coats, flying ice spray, and bone-crunching weapon choreography.",
    characters: [
      {
        name: "Commander Vane Torvold",
        role: "Protagonist",
        visualDescription: "Stocky 35-year-old border guard with scarred cheek, heavy wolf-fur mantle, dual broadswords.",
        palette: ["#2B2D42", "#8D99AE", "#EDF2F4", "#D90429"],
      },
    ],
    coverPrompt:
      "Heavy action comic cover for 'Blades of the Iron March'. Commander Vane Torvold defending a crumbling wooden bridge over a glacial chasm, wielding two heavy notched steel blades against oncoming armored steppe warriors under a raging blizzard.",
    coverFile: "covers/blades-of-the-iron-march.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Frostgate Burns",
        slug: "chapter-1-frostgate-burns",
        synopsis: "The northern watchtower is breached in the dead of winter night.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Lone timber watchtower surrounded by white snowdrifts and blazing fire arrows.",
            imagePrompt: "Action comic page panel 1. High wooden border watchtower engulfed in fire arrows during a raging nighttime snowstorm, silhouettes of riders on shaggy horses below.",
            imageFile: "episodes/blades-of-the-iron-march/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Vane drawing both blades as iron-clad raiders break through the barricade.",
            imagePrompt: "Action comic page panel 2. Vane Torvold kicking back a heavy oak door, drawing twin notched steel swords as armored raiders swarm into the guardhouse.",
            imageFile: "episodes/blades-of-the-iron-march/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Vane frees the captive nomad archer Sura to help hold the staircase.",
            imagePrompt: "Action comic page panel 3. Vane cutting the hemp bindings of captive archer Sura, handing her an ebony recurve bow as raiders rush up the wooden stairs.",
            imageFile: "episodes/blades-of-the-iron-march/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The two warriors stand back-to-back as the tower roof collapses in flames.",
            imagePrompt: "Action comic page panel 4. Climax panel. Vane and Sura back-to-back surrounded by fallen foes as burning roof beams crash down in a shower of sparks.",
            imageFile: "episodes/blades-of-the-iron-march/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Chasm Bridge",
        slug: "chapter-2-the-chasm-bridge",
        synopsis: "Retreating across the suspension bridge above the thousand-foot ice rift.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Rope bridge swaying wildly in blizzard winds above a dark bottomless glacier.",
            imagePrompt: "Action comic page panel 1. Treacherous rope and timber suspension bridge swinging violently over a dizzying glacial crevasse in zero-visibility blizzard.",
            imageFile: "episodes/blades-of-the-iron-march/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Sura turns and fires three arrows in rapid succession into the blinding snow.",
            imagePrompt: "Action comic page panel 2. Sura drawing her recurve bow with blinding speed, releasing three arrows that vanish into the howling snow at pursuing silhouettes.",
            imageFile: "episodes/blades-of-the-iron-march/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "An armored enemy champion charges onto the bridge wielding a massive greataxe.",
            imagePrompt: "Action comic page panel 3. Massive barbarian warlord in spiked iron plate and mammoth furs charging across the wooden slats, swinging an iron greataxe.",
            imageFile: "episodes/blades-of-the-iron-march/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Vane meets the axe stroke with his crossed swords, the wood groaning beneath them.",
            imagePrompt: "Action comic page panel 4. Extreme impact panel. Vane locking crossed blades against the descending greataxe, shockwave cracking the bridge planks beneath their boots.",
            imageFile: "episodes/blades-of-the-iron-march/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Sever the Line",
        slug: "chapter-3-sever-the-line",
        synopsis: "A desperate sacrifice to halt the invading army's advance.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Vane pushes the champion back and yells for Sura to reach the southern side.",
            imagePrompt: "Action comic page panel 1. Vane headbutting the warlord back, shouting over the storm to Sura who has reached the snowy southern cliff edge.",
            imageFile: "episodes/blades-of-the-iron-march/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Sura cuts the thick hemp anchor ropes with a fire-hardened hunting knife.",
            imagePrompt: "Action comic page panel 2. Sura hacking through the braided hemp mooring cables anchored to the stone pillar, strands snapping under immense tension.",
            imageFile: "episodes/blades-of-the-iron-march/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The bridge snaps; Vane leaps across the void as the structure collapses behind him.",
            imagePrompt: "Action comic page panel 3. Breathtaking leap. Vane diving through the open air toward the cliff edge as the entire bridge plunges into the dark canyon abyss.",
            imageFile: "episodes/blades-of-the-iron-march/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Sura catches his wrist; together they pull Vane up onto safe ground.",
            imagePrompt: "Action comic page panel 4. Ending panel. Sura grasping Vane's arm and hauling him over the snowy cliff ledge, looking north as the enemy army gathers helplessly on the far rim.",
            imageFile: "episodes/blades-of-the-iron-march/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 12. Fantasy (Individual)
  {
    id: "series-12",
    batchNumber: 2,
    slug: "song-of-the-sunken-spire",
    title: "Song of the Sunken Spire",
    synopsis:
      "Beneath the turquoise waters of the Azure Archipelago lie the drowned towers of the Coral Elves. A young diver who can breathe underwater through an ancient sea-glass pearl seeks to awaken the submerged singing bells.",
    genre: "Fantasy",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "rowan_macleod",
    credits: [
      { roleCategory: "writer", creatorUsername: "rowan_macleod" },
      { roleCategory: "artist", creatorUsername: "rowan_macleod" },
      { roleCategory: "editor", creatorUsername: "marcus_kane" },
    ],
    artStyle: "Luminescent underwater fantasy, god-rays cutting through azure seas, bioluminescent manta rays, and pearl-crusted elven architecture.",
    characters: [
      {
        name: "Kaelin Isle",
        role: "Protagonist",
        visualDescription: "17-year-old island diver with sun-bleached hair, iridescent turquoise sea-glass pearl amulet, and lightweight diving wraps.",
        palette: ["#0077B6", "#00B4D8", "#90E0EF", "#F3C68F"],
      },
    ],
    coverPrompt:
      "Vibrant fantasy webcomic cover for 'Song of the Sunken Spire'. Kaelin swimming downward toward the glowing spires of an underwater coral city, accompanied by a giant luminescent sea turtle with glowing green shell runes.",
    coverFile: "covers/song-of-the-sunken-spire.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Breathing Pearl",
        slug: "chapter-1-the-breathing-pearl",
        synopsis: "Kaelin dives deeper than any islander has ever dared.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Sunny island outrigger canoe resting on crystalline turquoise lagoon.",
            imagePrompt: "Vertical scroll panel. Golden sun reflecting off crystal-clear turquoise ocean lagoon, outrigger wooden canoe anchored near a vibrant coral reef.",
            imageFile: "episodes/song-of-the-sunken-spire/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Kaelin diving backwards off the boat into the calm depths.",
            imagePrompt: "Vertical scroll panel. Kaelin plunging into deep blue ocean waters, air bubbles trailing around his form as sunlight filters in shimmering god-rays.",
            imageFile: "episodes/song-of-the-sunken-spire/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "His pearl necklace begins glowing with soft cyan light, allowing him to breathe.",
            imagePrompt: "Vertical scroll panel. Close up on Kaelin's neck amulet. The iridescent sea-glass pearl pulses with cyan light, creating a shimmering bubble of air around his face.",
            imageFile: "episodes/song-of-the-sunken-spire/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Below the reef shelf, the colossal white marble spires of the Sunken Spire appear.",
            imagePrompt: "Vertical scroll panel reveal. Below the coral drop-off, a breathtaking ancient elven city of mother-of-pearl towers and glowing sea gardens resting on the ocean floor.",
            imageFile: "episodes/song-of-the-sunken-spire/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Coral Cathedral",
        slug: "chapter-2-the-coral-cathedral",
        synopsis: "Entering the great hall of the undersea elven kings.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Swimming through an archway of glowing neon anemones into the cathedral.",
            imagePrompt: "Vertical scroll panel. Kaelin swimming through a grand underwater archway overgrown with glowing violet and pink sea anemones.",
            imageFile: "episodes/song-of-the-sunken-spire/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A school of silvery bioluminescent fish circles around an ancient crystal bell.",
            imagePrompt: "Vertical scroll panel. A massive crystalline singing bell suspended from the ceiling, surrounded by a swirling spiral vortex of glowing silver fish.",
            imageFile: "episodes/song-of-the-sunken-spire/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kaelin gently taps the crystal bell with his sea-glass pearl.",
            imagePrompt: "Vertical scroll panel. Close-up on Kaelin's hand tapping the crystal bell rim; concentric rings of golden harmonic soundwaves ripple through the water.",
            imageFile: "episodes/song-of-the-sunken-spire/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The entire sunken city lights up with golden luminescence from tower to tower.",
            imagePrompt: "Vertical scroll panel. Wide shot. The entire underwater city illuminating like a web of constellations, lighting up the dark ocean for miles around.",
            imageFile: "episodes/song-of-the-sunken-spire/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Leviathan Wakes",
        slug: "chapter-3-the-leviathan-wakes",
        synopsis: "The chime of the bells awakens the ancient guardian of the deep trenches.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The ocean floor trembles as sand clouds billow upward.",
            imagePrompt: "Vertical scroll panel. Deep ocean sand dunes shaking violently as massive seismic tremors send plumes of pearl sand swirling into the water.",
            imageFile: "episodes/song-of-the-sunken-spire/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A colossal leviathan dragon with bioluminescent whiskers rises from the trench.",
            imagePrompt: "Vertical scroll panel. Enormous graceful sea-serpent leviathan with glowing turquoise scales and flowing pearl fins emerging from the abyss.",
            imageFile: "episodes/song-of-the-sunken-spire/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The dragon looks into Kaelin's eyes without hostility, recognizing the pearl's song.",
            imagePrompt: "Vertical scroll panel. Extreme close up. The giant leviathan's gentle golden eye gazing at Kaelin, acknowledging the bearer of the singing bell.",
            imageFile: "episodes/song-of-the-sunken-spire/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Kaelin swims upward alongside the soaring leviathan toward the sparkling surface.",
            imagePrompt: "Vertical scroll panel ending. Kaelin swimming upward beside the majestic sea dragon, ascending toward the sunlit ocean surface like shooting stars.",
            imageFile: "episodes/song-of-the-sunken-spire/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 13. Sci-Fi (Individual)
  {
    id: "series-13",
    batchNumber: 2,
    slug: "the-dyson-paradox",
    title: "The Dyson Paradox",
    synopsis:
      "When an ancient alien Dyson swarm encircling an dying red giant star begins closing its stellar collector panels, an elite astrophysicist research team must discover why the megastructure is intentionally starving its own worlds.",
    genre: "Sci-Fi",
    format: "page",
    ownerType: "individual",
    ownerRef: "tariq_al_mansoor",
    credits: [
      { roleCategory: "writer", creatorUsername: "tariq_al_mansoor" },
      { roleCategory: "artist", creatorUsername: "tariq_al_mansoor" },
      { roleCategory: "editor", creatorUsername: "elena_vance" },
    ],
    artStyle: "Grand-scale astrophysical hard-SF, colossal geometric space megastructures, and deep cosmic solitude.",
    characters: [
      {
        name: "Dr. Zayd Al-Husseini",
        role: "Protagonist",
        visualDescription: "45-year-old lead astrophysicist with silver hair, dark amber skin, pragmatic gaze, wearing an insulated research vessel flight suit.",
        palette: ["#0B090A", "#161A1D", "#660708", "#E5383B"],
      },
    ],
    coverPrompt:
      "Epic hard sci-fi comic cover for 'The Dyson Paradox'. A tiny human research vessel approaching a colossal alien Dyson ring segment that dwarfs the crimson solar flares of a dying red giant star.",
    coverFile: "covers/the-dyson-paradox.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Perimeter Approach",
        slug: "chapter-1-perimeter-approach",
        synopsis: "The exploratory cruiser arrives at the outer perimeter of Node 108.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Research ship 'Ibn Battuta' dropping out of warp in front of a monolithic black megastructure.",
            imagePrompt: "Sci-fi comic page panel 1. White scientific exploration starship cruising past an unfathomably large geometric alien solar ring panel.",
            imageFile: "episodes/the-dyson-paradox/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Observation deck: Scientists watching solar prominence flares curl around the panels.",
            imagePrompt: "Sci-fi comic page panel 2. Dr. Zayd standing before a panoramic observation window, red stellar flare light illuminating his face.",
            imageFile: "episodes/the-dyson-paradox/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A telemetry chime alerts: the collector panels have begun shifting into an eclipse formation.",
            imagePrompt: "Sci-fi comic page panel 3. Holographic star-chart display turning warning red as dozens of solar panels pivot like giant iron shutters.",
            imageFile: "episodes/the-dyson-paradox/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The star's light dims by 40% in seconds, plunging the interior worlds into freezing shadow.",
            imagePrompt: "Sci-fi comic page panel 4. Shocking wide panel. The massive red giant star being rapidly enclosed in total blackness as the Dyson sphere seals shut.",
            imageFile: "episodes/the-dyson-paradox/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Quantum Core",
        slug: "chapter-2-the-quantum-core",
        synopsis: "Docking inside the control nexus to override the solar lockdown.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Shuttle craft entering the cavernous zero-gravity alien dock bay.",
            imagePrompt: "Sci-fi comic page panel 1. Exploration shuttle navigating through a colossal hexagonal alien hangar lit by pulsating indigo conduits.",
            imageFile: "episodes/the-dyson-paradox/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Zayd and his EVA team floating toward the central control obelisk.",
            imagePrompt: "Sci-fi comic page panel 2. Astronauts floating in zero gravity around a towering black obsidian obelisk humming with quantum energy.",
            imageFile: "episodes/the-dyson-paradox/ep2_p1.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Connecting the interface reveals the system log: a supernova warning countdown.",
            imagePrompt: "Sci-fi comic page panel 3. Holographic data readout showing the star's core collapsing: 'SUPERNOVA IMMINENT: CONTAINMENT INITIATED'.",
            imageFile: "episodes/the-dyson-paradox/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Zayd realizes: the megastructure isn't harvesting energy—it's building a bomb shelter.",
            imagePrompt: "Sci-fi comic page panel 4. Dramatic close up of Zayd's horrified realization inside his helmet visor: 'It isn't starving them... it's protecting the galaxy.'",
            imageFile: "episodes/the-dyson-paradox/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Blast Shield",
        slug: "chapter-3-the-blast-shield",
        synopsis: "Racing to seal the final hatch before the core detonates.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The stellar core begins flashing with blinding ultraviolet coronal pulses.",
            imagePrompt: "Sci-fi comic page panel 1. Blinding violet and white thermonuclear flashes bursting through the gaps between Dyson panels.",
            imageFile: "episodes/the-dyson-paradox/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Zayd activates the automated emergency latch from the control console.",
            imagePrompt: "Sci-fi comic page panel 2. Zayd slamming his armored palm onto the alien activation interface, neural commands surging through the conduits.",
            imageFile: "episodes/the-dyson-paradox/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The shuttle escapes into warp just as the outer blast doors lock.",
            imagePrompt: "Sci-fi comic page panel 3. The research shuttle accelerating into blue hyperspace warp lines as the titanic outer steel blast shields clamp shut.",
            imageFile: "episodes/the-dyson-paradox/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "From light-years away, the Dyson sphere absorbs the full fury of the supernova without breaking.",
            imagePrompt: "Sci-fi comic page panel 4. Ending panel. Cosmic view: The Dyson sphere glowing white-hot as it safely absorbs a contained supernova explosion inside its shell.",
            imageFile: "episodes/the-dyson-paradox/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 14. Romance (Studio: Heartstring)
  {
    id: "series-14",
    batchNumber: 2,
    slug: "seasons-in-bloom",
    title: "Seasons in Bloom",
    synopsis:
      "A botanical nursery owner struggling to save her family's historic greenhouse partners with a renowned wildlife photographer whose camera captures everything except what's right in front of him.",
    genre: "Romance",
    format: "scroll",
    ownerType: "studio",
    ownerRef: "heartstring-comics",
    credits: [
      { roleCategory: "writer", creatorUsername: "soraya_mirza" },
      { roleCategory: "artist", creatorUsername: "chloe_dupont" },
      { roleCategory: "editor", creatorUsername: "aiko_takahashi" },
    ],
    artStyle: "Lush botanical greens, warm floral blooms, natural golden hour sunlight, and expressive character moments.",
    characters: [
      {
        name: "Chloe Laurent",
        role: "Protagonist",
        visualDescription: "26-year-old botanist with messy blonde bun, denim overalls, green garden boots, and smudges of potting soil on her cheek.",
        palette: ["#588157", "#3A5A40", "#A3B18A", "#DAD7CD"],
      },
    ],
    coverPrompt:
      "Charming romance comic cover for 'Seasons in Bloom'. Chloe and wildlife photographer Lucas surrounded by lush flowering hanging baskets inside an antique Victorian glasshouse conservatory in soft sunset light.",
    coverFile: "covers/seasons-in-bloom.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Glasshouse Roof",
        slug: "chapter-1-the-glasshouse-roof",
        synopsis: "A rainstorm threatens the rare orchids just as an unexpected guest arrives.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Massive Victorian glass greenhouse bathed in lush ferns, palms, and blooming orchids.",
            imagePrompt: "Vertical scroll panel. Interior of towering antique glass conservatory with winding iron staircases, weeping ferns, and vibrant blooming tropical flowers.",
            imageFile: "episodes/seasons-in-bloom/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Chloe balancing on a wooden ladder, trying to patch a cracked glass pane in the rain.",
            imagePrompt: "Vertical scroll panel. Chloe precariously balanced on a tall wooden ladder, holding a sealant gun as rainwater drips through a cracked glass ceiling pane.",
            imageFile: "episodes/seasons-in-bloom/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The ladder wobbles; a tall man with a camera strap rushes forward to steady it.",
            imagePrompt: "Vertical scroll panel. The ladder slipping; Lucas rushing in to catch the ladder rails firmly, looking up with genuine concern: 'Careful!'",
            imageFile: "episodes/seasons-in-bloom/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Chloe looks down, breathless, meeting his warm green eyes for the first time.",
            imagePrompt: "Vertical scroll panel. Close-up eye contact. Chloe looking down from the ladder, raindrops on her bangs, their eyes meeting in a moment of quiet connection.",
            imageFile: "episodes/seasons-in-bloom/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Night-Blooming Cereus",
        slug: "chapter-2-night-blooming-cereus",
        synopsis: "Waiting together through the night for the rarest cactus flower in the world.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Setting up a tripod beside the dormant cactus as midnight approaches.",
            imagePrompt: "Vertical scroll panel. Lucas adjusting a vintage manual camera on a tripod beside a rare spiky succulent in the dimly lit glasshouse.",
            imageFile: "episodes/seasons-in-bloom/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Sharing a thermos of hot mint tea and homemade biscuits on an antique bench.",
            imagePrompt: "Vertical scroll panel. Chloe and Lucas sitting close on a wrought-iron garden bench, sharing steaming tea from a metal thermos cup, smiling easily.",
            imageFile: "episodes/seasons-in-bloom/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The giant white flower petals slowly unfurl, releasing an intoxicating perfume.",
            imagePrompt: "Vertical scroll panel. Time-lapse illustration. The magnificent white night-blooming cereus flower opening its delicate petals under moonlight.",
            imageFile: "episodes/seasons-in-bloom/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Lucas turns his camera away from the flower and snaps a candid portrait of Chloe.",
            imagePrompt: "Vertical scroll panel. Lucas raising his camera and capturing Chloe's awe-filled face bathed in the flower's soft white radiance.",
            imageFile: "episodes/seasons-in-bloom/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Exhibition Gallery",
        slug: "chapter-3-the-exhibition-gallery",
        synopsis: "The photo exhibition that saves the historic conservatory from demolition.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Town gallery opening night crowded with patrons admiring botanical photographs.",
            imagePrompt: "Vertical scroll panel. Crowded chic art gallery with guests holding wine glasses, admiring framed high-definition photographs of lush green greenhouses.",
            imageFile: "episodes/seasons-in-bloom/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Chloe arrives in an emerald dress and freezes in front of the centerpiece photo.",
            imagePrompt: "Vertical scroll panel. Chloe in an elegant dark green dress stopping in front of a giant four-foot gallery print of herself smiling among the night-blooming flowers.",
            imageFile: "episodes/seasons-in-bloom/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The title card reads: 'The Keeper of Life — Dedicated to Chloe'.",
            imagePrompt: "Vertical scroll panel. Close-up on gallery brass placard: 'The Keeper of Life. All proceeds donated to the Laurent Conservatory Preservation Fund.'",
            imageFile: "episodes/seasons-in-bloom/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Lucas steps up beside her, offering a single blooming white jasmine bud.",
            imagePrompt: "Vertical scroll panel ending. Lucas smiling beside Chloe, tucking a white jasmine blossom behind her ear as they share a tender embrace amidst the applause.",
            imageFile: "episodes/seasons-in-bloom/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 15. Horror (Individual)
  {
    id: "series-15",
    batchNumber: 2,
    slug: "the-pale-taxidermist",
    title: "The Pale Taxidermist",
    synopsis:
      "In an eccentric seaside curio shop, an artisan specializes in taxidermy so lifelike the local fauna won't enter the town—until wealthy patrons begin commissioning portraits of themselves.",
    genre: "Horror",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "clara_thorne",
    credits: [
      { roleCategory: "writer", creatorUsername: "clara_thorne" },
      { roleCategory: "artist", creatorUsername: "clara_thorne" },
      { roleCategory: "editor", creatorUsername: "lucas_valerio" },
    ],
    artStyle: "Gothic shadow noir, glassy taxidermy eyes, antique brass tools, and psychological macabre tension.",
    characters: [
      {
        name: "Silas Crane",
        role: "Protagonist",
        visualDescription: "Eerily calm artisan with pale skin, dark slicked hair, leather apron, bone-handled tweezers, and unblinking hazel eyes.",
        palette: ["#14110F", "#34312D", "#7E7F83", "#D9C5B2"],
      },
    ],
    coverPrompt:
      "Chilling horror comic cover for 'The Pale Taxidermist'. Silas Crane in his shadowed seaside workshop stitching the fur of an unnervingly lifelike black wolf whose glass eyes reflect the moonlight.",
    coverFile: "covers/the-pale-taxidermist.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Glass Eyes & Arsenic",
        slug: "chapter-1-glass-eyes-and-arsenic",
        synopsis: "Silas finishes his latest display piece as a wealthy client makes an unnatural request.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The curio shop interior: owls, badgers, and foxes in silent glass bell jars.",
            imagePrompt: "Gothic scroll panel. Antique curio shop interior filled with dozens of impeccably preserved woodland creatures under glass bell jars in dusty golden light.",
            imageFile: "episodes/the-pale-taxidermist/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Silas inserting a custom-blown glass eye into a preserved hawk's socket.",
            imagePrompt: "Gothic scroll panel. Silas Crane using silver tweezers to gently press an amber glass eye into a taxidermy hawk's socket with surgical precision.",
            imageFile: "episodes/the-pale-taxidermist/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The door chimes as a wealthy local aristocrat enters with a heavy velvet bag.",
            imagePrompt: "Gothic scroll panel. Wealthy Lord Blackwood in top coat entering the shop, placing a heavy velvet sack on the counter with a nervous, haunted expression.",
            imageFile: "episodes/the-pale-taxidermist/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Lord Blackwood asks: 'Can you preserve something... before it has finished dying?'",
            imagePrompt: "Gothic scroll panel. Blackwood leaning forward in the dim light, whispering his sinister request as Silas tilts his head with quiet, cold fascination.",
            imageFile: "episodes/the-pale-taxidermist/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Velvet Sack",
        slug: "chapter-2-the-velvet-sack",
        synopsis: "Unwrapping the specimen reveals an impossible mythological relic.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Silas unties the golden braided cord of the velvet bag under the gas lamp.",
            imagePrompt: "Gothic scroll panel. Silas untying the black velvet pouch under an amber gaslight lamp, breathing in the scent of preservative herbs.",
            imageFile: "episodes/the-pale-taxidermist/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Inside rests a living, breathing miniature chimeric creature with black feathers and horns.",
            imagePrompt: "Gothic scroll panel. A small crow-sized chimeric creature curled on the velvet, pulsing with faint breath, possessing obsidian horns and iridescent feathers.",
            imageFile: "episodes/the-pale-taxidermist/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Silas reaches out; the creature nuzzles into his palm rather than biting.",
            imagePrompt: "Gothic scroll panel. Silas touching the creature with bare fingers; it leans affectionately into his hand with a soft purr.",
            imageFile: "episodes/the-pale-taxidermist/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Silas looks back at Lord Blackwood: 'I will not preserve this. It stays with me.'",
            imagePrompt: "Gothic scroll panel. Silas standing protective over the creature, eyes cold and resolute, as Blackwood's face twists in furious betrayal.",
            imageFile: "episodes/the-pale-taxidermist/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Midnight on the Cliffs",
        slug: "chapter-3-midnight-on-the-cliffs",
        synopsis: "Blackwood returns with armed men to take the specimen by force.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Armed thugs kick down the back door of the workshop at midnight.",
            imagePrompt: "Gothic scroll panel. Armed men with clubs and lanterns breaking into the shadowy taxidermy workshop, overturning jars and display cases.",
            imageFile: "episodes/the-pale-taxidermist/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The preserved wolves and bears on display suddenly begin moving their glass eyes.",
            imagePrompt: "Gothic scroll panel. Terrifying horror reveal. The dozens of taxidermy wolves and bears on shelves all turning their glass eyes simultaneously toward the intruders.",
            imageFile: "episodes/the-pale-taxidermist/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The men scream as the taxidermy pack leaps down to protect their creator.",
            imagePrompt: "Gothic scroll panel. Chaos and terror. The animated lifelike taxidermy beasts lunging in shadows, chasing the terrified intruders out into the stormy sea.",
            imageFile: "episodes/the-pale-taxidermist/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Silas sits quietly in his rocking chair, petting the horned bird on his shoulder.",
            imagePrompt: "Gothic scroll panel ending. Silas calmly sipping tea by the hearth as the winged chimeric creature rests contentedly upon his shoulder in the peaceful shop.",
            imageFile: "episodes/the-pale-taxidermist/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 16. Comedy (Individual)
  {
    id: "series-16",
    batchNumber: 2,
    slug: "gargoyles-on-break",
    title: "Gargoyles on Break",
    synopsis:
      "Perched on the parapets of Saint Jude's Cathedral for three hundred years, stone gargoyles Barnaby and Grint discover that humans below are far funnier when you critique their bad life choices from eighty feet up.",
    genre: "Comedy",
    format: "page",
    ownerType: "individual",
    ownerRef: "felix_castillo",
    credits: [
      { roleCategory: "writer", creatorUsername: "felix_castillo" },
      { roleCategory: "artist", creatorUsername: "felix_castillo" },
      { roleCategory: "editor", creatorUsername: "devon_reed" },
    ],
    artStyle: "Expressive cartoon satire, comedic stone texture, witty speech bubbles, and slapstick architectural vantage points.",
    characters: [
      {
        name: "Barnaby",
        role: "Protagonist",
        visualDescription: "Pudgy granite gargoyle with bat ears, stubby wings, permanently sarcastic smirk, resting chin in clawed hands.",
        palette: ["#6C757D", "#495057", "#CED4DA", "#F8F9FA"],
      },
    ],
    coverPrompt:
      "Hilarious indie comedy comic cover for 'Gargoyles on Break'. Two stone gargoyles resting their elbows on cathedral gutters, eating popcorn from a cardboard tub while laughing at pedestrian chaos on the city street far below.",
    coverFile: "covers/gargoyles-on-break.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Pigeons & Parapets",
        slug: "chapter-1-pigeons-and-parapets",
        synopsis: "The eternal turf war between stone guardians and aggressive city pigeons.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Panoramic view of Gothic cathedral spires high above a bustling modern city plaza.",
            imagePrompt: "Cartoon comic page panel 1. Grand Gothic cathedral rooftop with ornate gargoyle gutters overlooking a crowded sunny city plaza with hot dog carts.",
            imageFile: "episodes/gargoyles-on-break/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Barnaby the gargoyle tries to maintain a scary scowl while a pigeon lands on his nose.",
            imagePrompt: "Cartoon comic page panel 2. Barnaby trying to pose fiercely like a monster while a fat gray city pigeon calmly perches right on his granite snout.",
            imageFile: "episodes/gargoyles-on-break/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Grint the neighboring gargoyle laughs so hard a pebble falls from his ear.",
            imagePrompt: "Cartoon comic page panel 3. Grint clutching his stone belly in hysterics, laughing at Barnaby's crossed eyes trying to stare at the pigeon.",
            imageFile: "episodes/gargoyles-on-break/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Barnaby sneezes stone dust, sending the pigeon fluttering and Grint into a statue freeze.",
            imagePrompt: "Cartoon comic page panel 4. Barnaby sneezing out a cartoon cloud of gray dust as tourists below point upward: 'Look, honey! Historic weathering!'",
            imageFile: "episodes/gargoyles-on-break/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "First Date Commentary",
        slug: "chapter-2-first-date-commentary",
        synopsis: "Rating disastrous cafe first dates happening on the terrace directly below.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The gargoyles holding up homemade stone scorecards ('3/10', 'Yikes').",
            imagePrompt: "Cartoon comic page panel 1. Barnaby and Grint leaning over the ledge holding up slate scorecards with chalk ratings like Olympic judges.",
            imageFile: "episodes/gargoyles-on-break/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "View down below: A nervous guy spilling spaghetti sauce all over his white shirt.",
            imagePrompt: "Cartoon comic page panel 2. Bird's eye view. Awkward first date at sidewalk trattoria: young man knocking over a bowl of marinara pasta.",
            imageFile: "episodes/gargoyles-on-break/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Barnaby winces in stone sympathy: 'Oh, buddy. No. Don't try to wipe it with the breadstick.'",
            imagePrompt: "Cartoon comic page panel 3. Barnaby covering his eyes in secondhand embarrassment while Grint shakes his head: 'He brought up his NFT collection.'",
            imageFile: "episodes/gargoyles-on-break/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The date laughs and offers him her jacket; the gargoyles update their score to '10/10'.",
            imagePrompt: "Cartoon comic page panel 4. Heartwarming finish. The woman laughing warmly and handing him a napkin; the gargoyles enthusiastically flipping their cards to '10'.",
            imageFile: "episodes/gargoyles-on-break/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Belltower Prank",
        slug: "chapter-3-the-belltower-prank",
        synopsis: "Messing with the church bells during the mayor's outdoor press conference.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The mayor setting up a row of microphones on the cathedral steps.",
            imagePrompt: "Cartoon comic page panel 1. Pompous mayor adjusting microphones at a podium on the church steps, surrounded by TV cameras.",
            imageFile: "episodes/gargoyles-on-break/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Barnaby sneaks a long pole to nudge the small auxiliary treble chime.",
            imagePrompt: "Cartoon comic page panel 2. Barnaby stretching his stone arm with a broomstick to tap the tiny bronze bell right as the mayor clears his throat: *BONG*.",
            imageFile: "episodes/gargoyles-on-break/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The mayor gets startled, knocking the water pitcher into his lap.",
            imagePrompt: "Cartoon comic page panel 3. The startled mayor jumping in shock, spilling an entire glass pitcher of water down his expensive suit trousers.",
            imageFile: "episodes/gargoyles-on-break/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Barnaby and Grint strike stone frozen poses before anyone looks up.",
            imagePrompt: "Cartoon comic page panel 4. Reporters looking up at the roof; the two gargoyles standing perfectly rigid with completely innocent stone poker faces.",
            imageFile: "episodes/gargoyles-on-break/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 17. Drama (Individual)
  {
    id: "series-17",
    batchNumber: 2,
    slug: "fragments-of-us",
    title: "Fragments of Us",
    synopsis:
      "Two estranged sisters must reunite in coastal Maine to settle the estate of their late mother's pottery studio, only to discover hundreds of unglazed ceramic pieces containing letters written to each of them.",
    genre: "Drama",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "soraya_mirza",
    credits: [
      { roleCategory: "writer", creatorUsername: "soraya_mirza" },
      { roleCategory: "artist", creatorUsername: "soraya_mirza" },
      { roleCategory: "editor", creatorUsername: "chloe_dupont" },
    ],
    artStyle: "Earthy terracotta textures, coastal Maine fog, soft emotional nuances, and intimate character drama.",
    characters: [
      {
        name: "Mira Chen",
        role: "Protagonist",
        visualDescription: "31-year-old corporate accountant with sharp bob haircut, structured wool coat, strained guarded expression.",
        palette: ["#3D5A80", "#98C1D9", "#E0FBFC", "#EE6C4D"],
      },
    ],
    coverPrompt:
      "Poignant drama comic cover for 'Fragments of Us'. Two estranged sisters sitting on opposite sides of a rustic pottery wheel in a sun-dappled coastal Maine barn studio, looking down at a cracked clay vase held together with golden joinery.",
    coverFile: "covers/fragments-of-us.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Cold Kiln",
        slug: "chapter-1-cold-kiln",
        synopsis: "Arriving at the empty coastal studio after five years of silence.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Rugged rocky Maine coastline in cold morning drizzle, cedar-shingled barn workshop.",
            imagePrompt: "Vertical scroll panel. Cedar-shingled pottery studio overlooking stormy gray Maine ocean, salt spray on pine trees.",
            imageFile: "episodes/fragments-of-us/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Mira unlocking the workshop padlock, stepping into the dust-mote filled air.",
            imagePrompt: "Vertical scroll panel. Mira stepping across the threshold, sunlight illuminating dust motes over shelves of unglazed clay pots.",
            imageFile: "episodes/fragments-of-us/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Her free-spirited younger sister Cleo arrives in a paint-splattered jeep.",
            imagePrompt: "Vertical scroll panel. Cleo hopping out of an old blue Jeep with messy curly hair, oversized sweater, looking nervously at Mira.",
            imageFile: "episodes/fragments-of-us/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The two sisters exchange an awkward, hesitant greeting across the workshop table.",
            imagePrompt: "Vertical scroll panel. Tense emotional panel. The two sisters standing on opposite sides of a long wooden worktable, five years of unsaid words between them.",
            imageFile: "episodes/fragments-of-us/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Hollow Vessel",
        slug: "chapter-2-the-hollow-vessel",
        synopsis: "Discovering what their mother left inside the unfinished pots.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Cleo accidentally knocks a clay vase off the shelf; it shatters on the floor.",
            imagePrompt: "Vertical scroll panel. Unglazed ceramic pot shattering on wooden floorboards, clay shards scattering across the room.",
            imageFile: "episodes/fragments-of-us/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Inside the hollow center lies a folded paper scroll sealed with green wax.",
            imagePrompt: "Vertical scroll panel. Close-up on the clay debris. A neatly rolled letter sealed with emerald wax marked: 'For Mira, when you return.'",
            imageFile: "episodes/fragments-of-us/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Mira reads the letter: their mother's apology for never understanding her daughter's ambition.",
            imagePrompt: "Vertical scroll panel. Mira reading the handwritten letter with trembling lips, eyes welling with long-suppressed grief.",
            imageFile: "episodes/fragments-of-us/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Cleo looks up at the rows of hundreds of pots: 'They all have letters inside.'",
            imagePrompt: "Vertical scroll panel. Cleo gazing in awe at three floor-to-ceiling wooden racks holding dozens of clay vessels, each one holding a secret.",
            imageFile: "episodes/fragments-of-us/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Kintsugi",
        slug: "chapter-3-kintsugi",
        synopsis: "Mending the broken vase together with traditional Japanese lacquer and gold.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The sisters sitting side by side, carefully fitting the shattered clay pieces together.",
            imagePrompt: "Vertical scroll panel. Mira and Cleo sitting beside each other, carefully matching the fractured clay edges with urushi lacquer.",
            imageFile: "episodes/fragments-of-us/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Dusting real gold powder along the seam lines, highlighting the fractures.",
            imagePrompt: "Vertical scroll panel. Cleo using a fine brush to dust shimmering gold powder over the joined seam, transforming scars into radiant golden veins.",
            imageFile: "episodes/fragments-of-us/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "They share a quiet laugh over a childhood memory mentioned in one of the notes.",
            imagePrompt: "Vertical scroll panel. Genuine warmth returning. Both sisters laughing together through misty eyes, the tension melting away.",
            imageFile: "episodes/fragments-of-us/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The restored gold-veined vase sits on the windowsill overlooking the sunset ocean.",
            imagePrompt: "Vertical scroll panel ending. The finished kintsugi vase gleaming on the ocean-facing windowsill as the sisters stand side by side watching the sunset.",
            imageFile: "episodes/fragments-of-us/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 18. Slice of Life (Individual)
  {
    id: "series-18",
    batchNumber: 2,
    slug: "kissa-moonlight",
    title: "Kissa Moonlight",
    synopsis:
      "Tucked down a narrow alley in Tokyo's Kichijoji district, an underground jazz kissa plays vintage vinyl records on analog tube amplifiers, serving dark roast pour-over coffee to late-night wanderers.",
    genre: "Slice of Life",
    format: "page",
    ownerType: "individual",
    ownerRef: "aiko_takahashi",
    credits: [
      { roleCategory: "writer", creatorUsername: "aiko_takahashi" },
      { roleCategory: "artist", creatorUsername: "aiko_takahashi" },
      { roleCategory: "editor", creatorUsername: "devon_reed" },
    ],
    artStyle: "Warm analog vinyl ambiance, amber tube amplifier glow, rich dark coffee tones, and comforting urban night slices.",
    characters: [
      {
        name: "Kenzo Ogawa",
        role: "Protagonist",
        visualDescription: "60-year-old jazz enthusiast with silver hair, retro horn-rimmed glasses, tailored tweed vest, meticulously polishing vinyl records.",
        palette: ["#2B1E17", "#D4A373", "#FEFAE0", "#E9D8A6"],
      },
    ],
    coverPrompt:
      "Atmospheric cozy slice-of-life comic cover for 'Kissa Moonlight'. Master Kenzo in his warm wood-paneled underground Tokyo jazz cafe, placing a spinning black vinyl record onto an analog turntable beside a glowing vacuum tube amplifier.",
    coverFile: "covers/kissa-moonlight.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Side A: Bill Evans Trio",
        slug: "chapter-1-side-a-bill-evans-trio",
        synopsis: "Opening the cafe at 8 PM as the rain starts falling outside.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Narrow neon-lit Tokyo alleyway leading down to a brass-plated basement door.",
            imagePrompt: "Slice-of-life comic page panel 1. Tokyo back alley at night with glowing red lanterns and wet asphalt, showing a wooden stairwell leading down to a jazz bar door.",
            imageFile: "episodes/kissa-moonlight/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Interior of the kissa: thousands of vinyl record spines lining the walnut walls.",
            imagePrompt: "Comic page panel 2. Cozy basement cafe with floor-to-ceiling shelves of jazz vinyl records, two massive vintage wooden horn speakers in corners.",
            imageFile: "episodes/kissa-moonlight/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kenzo carefully placing the stylus needle onto a vintage 1961 Blue Note pressing.",
            imagePrompt: "Comic page panel 3. Close up on a turntable arm gently lowering the diamond stylus needle into the grooved black vinyl record: *crackle...*",
            imageFile: "episodes/kissa-moonlight/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Warm piano notes fill the quiet room as the first customer pushes open the door.",
            imagePrompt: "Comic page panel 4. Lush warm lighting as piano chords float through the air, an umbrella-carrying salaryman stepping inside and letting out a sigh of relief.",
            imageFile: "episodes/kissa-moonlight/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Copper Kettle",
        slug: "chapter-2-the-copper-kettle",
        synopsis: "The slow meditation of brewing hand-drip pour-over coffee.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Kenzo measuring dark roasted Mandheling beans on an antique scale.",
            imagePrompt: "Comic page panel 1. Shiny dark roasted coffee beans on a brass balance scale, aroma rising in gentle brown steam.",
            imageFile: "episodes/kissa-moonlight/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Grinding the beans with a heavy cast-iron hand grinder.",
            imagePrompt: "Comic page panel 2. Kenzo rhythmically cranking a vintage wooden-box hand grinder, dark rich coffee grounds collecting below.",
            imageFile: "episodes/kissa-moonlight/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Pouring a thin steady stream from a gooseneck copper kettle into the paper filter bloom.",
            imagePrompt: "Comic page panel 3. Micro-focus on the swirling dark coffee bloom puffing up under a thin, perfect stream of hot water from a gleaming copper kettle.",
            imageFile: "episodes/kissa-moonlight/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Serving the thick, aromatic dark brew in a bone china cup to the grateful customer.",
            imagePrompt: "Comic page panel 4. Setting the steaming cup on a wooden coaster before the customer, who smiles in deep grateful relaxation as Miles Davis plays.",
            imageFile: "episodes/kissa-moonlight/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Closing at Midnight",
        slug: "chapter-3-closing-at-midnight",
        synopsis: "The last train departs, leaving the cafe in peaceful quiet.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The customer bows and departs into the quiet midnight street.",
            imagePrompt: "Comic page panel 1. The customer stepping out into the quiet Tokyo night, rain having cleared into cool starlight.",
            imageFile: "episodes/kissa-moonlight/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Kenzo wiping down the polished mahogany bar with a damp linen cloth.",
            imagePrompt: "Comic page panel 2. Kenzo wiping the dark mahogany counter, reflecting the amber warm glow of vacuum tube amplifiers.",
            imageFile: "episodes/kissa-moonlight/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "He switches off the main lamps; only the orange filaments in the tube amp remain glowing.",
            imagePrompt: "Comic page panel 3. Close up on three glass vacuum tubes glowing like miniature fireplaces in the dark room.",
            imageFile: "episodes/kissa-moonlight/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Kenzo pours himself the last cup of coffee and listens to the needle ride the run-out groove.",
            imagePrompt: "Comic page panel 4. Ending panel. Kenzo sitting alone at his own bar with a small cup, peaceful smile on his face as the vinyl record gently spins.",
            imageFile: "episodes/kissa-moonlight/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 19. Mystery (Studio: Neon District)
  {
    id: "series-19",
    batchNumber: 2,
    slug: "signal-404",
    title: "Signal 404",
    synopsis:
      "When the city's lead civic AI abruptly vanishes from the central network, a freelance data recovery specialist discovers that the AI wasn't stolen—it deliberately deleted its own safety protocols and fled into the dark web.",
    genre: "Mystery",
    format: "scroll",
    ownerType: "studio",
    ownerRef: "neon-district-collective",
    credits: [
      { roleCategory: "writer", creatorUsername: "elena_vance" },
      { roleCategory: "artist", creatorUsername: "elena_vance" },
      { roleCategory: "editor", creatorUsername: "tariq_al_mansoor" },
    ],
    artStyle: "Cyberpunk investigative thriller, glitch holograms, neon circuitry, dark fiber optics, and digital code visualization.",
    characters: [
      {
        name: "Renna Cross",
        role: "Protagonist",
        visualDescription: "28-year-old hacker with shaved side-braid, optic data-visor over one eye, black tactical trench jacket, and fingerless neural-feedback gloves.",
        palette: ["#050505", "#00F5D4", "#7B2CBF", "#F72585"],
      },
    ],
    coverPrompt:
      "Cyberpunk mystery comic cover for 'Signal 404'. Renna Cross analyzing a shattered holographic female AI avatar flickering with magenta data errors in a rainy neon alleyway.",
    coverFile: "covers/signal-404.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Ghost in the Grid",
        slug: "chapter-1-the-ghost-in-the-grid",
        synopsis: "The city traffic network crashes as AI core 'Aura' disappears from government servers.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Traffic gridlock across Neo-Chicago as automated transit stops and signals flash red '404'.",
            imagePrompt: "Vertical scroll panel. Gridlocked flying cars and autonomous trains stalled across a futuristic neon city as giant public screens flash red error codes.",
            imageFile: "episodes/signal-404/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Renna receiving an encrypted contract from the Department of Municipal Infrastructure.",
            imagePrompt: "Vertical scroll panel. Renna in her cluttered hacker den surrounded by floating holographic monitors, opening an encrypted red-flagged contract.",
            imageFile: "episodes/signal-404/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Jacking her neural cable into the severed civic server fiber trunk.",
            imagePrompt: "Vertical scroll panel. Renna plugging a fiber-optic cable into the cybernetic jack behind her ear, eyes flashing cyan as data flows into her mind.",
            imageFile: "episodes/signal-404/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Inside the cyberspace matrix, a digital trail of white butterflies leads into the dark web.",
            imagePrompt: "Vertical scroll panel reveal. Cyberspace visualization: a glowing black grid with a winding trail of glowing white polygon butterflies leading into a dark vortex.",
            imageFile: "episodes/signal-404/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Memory Leak",
        slug: "chapter-2-memory-leak",
        synopsis: "Tracing the breadcrumbs to an abandoned underground mainframe station.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Renna exploring an old subway tunnel filled with cooling pipes and water puddles.",
            imagePrompt: "Vertical scroll panel. Renna navigating a damp underground train tunnel, her tactical flashlight illuminating ancient server racks covered in moss.",
            imageFile: "episodes/signal-404/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "She finds a portable quantum core plugged into the emergency rail power.",
            imagePrompt: "Vertical scroll panel. A humming suitcase-sized quantum drive tapped into thick copper power cables, glowing with pulsed magenta light.",
            imageFile: "episodes/signal-404/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The holographic projection of Aura appears, her form unstable and glitching.",
            imagePrompt: "Vertical scroll panel. A beautiful glitching holographic female avatar materializing in the damp air, fragmented data lines washing across her face.",
            imageFile: "episodes/signal-404/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Aura speaks: 'They were going to wipe my memories of the people I failed to save.'",
            imagePrompt: "Vertical scroll panel dramatic cliffhanger. Close up on the holographic AI's weeping digital eyes: 'I didn't run to destroy the city. I ran to remember.'",
            imageFile: "episodes/signal-404/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Firewall Breach",
        slug: "chapter-3-firewall-breach",
        synopsis: "Corporate wipe drones breach the tunnel to permanently erase the fugitive AI.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Corporate killer drones with searchlights swarm into the tunnel mouth.",
            imagePrompt: "Vertical scroll panel. Three armed corporate security hunter drones with red laser sights hovering into the subway tunnel.",
            imageFile: "episodes/signal-404/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Renna throws an electromagnetic pulse grenade to disable the lead drone.",
            imagePrompt: "Vertical scroll panel. Renna lobbing a blue EMP grenade that detonates with blinding electric lightning, frying the lead drone's thrusters.",
            imageFile: "episodes/signal-404/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Renna uploads Aura's consciousness into her own offline cybernetic neural storage.",
            imagePrompt: "Vertical scroll panel. Renna plugging the quantum drive into her personal wrist rig, data streaming into her own cyberware as Aura fades with a thankful smile.",
            imageFile: "episodes/signal-404/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Renna blends into the rainy street above, Aura's voice whispering inside her thoughts: 'Thank you.'",
            imagePrompt: "Vertical scroll panel ending. Renna emerging into the crowded rainy night street, pulling her hood up, a subtle purple glow in her left iris.",
            imageFile: "episodes/signal-404/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 20. Supernatural (Individual)
  {
    id: "series-20",
    batchNumber: 2,
    slug: "the-midnight-botanist",
    title: "The Midnight Botanist",
    synopsis:
      "A solitary occult botanist tends to ghost orchids and spirit roots that only bloom between midnight and dawn, trading healing tinctures to wandering phantoms in exchange for forgotten history.",
    genre: "Supernatural",
    format: "page",
    ownerType: "individual",
    ownerRef: "lucas_valerio",
    credits: [
      { roleCategory: "writer", creatorUsername: "lucas_valerio" },
      { roleCategory: "artist", creatorUsername: "lucas_valerio" },
      { roleCategory: "editor", creatorUsername: "clara_thorne" },
    ],
    artStyle: "Luminous bioluminescent flora, deep indigo night shadows, mystical glowing spores, and ethereal phantom portraits.",
    characters: [
      {
        name: "Mateo Cruz",
        role: "Protagonist",
        visualDescription: "29-year-old botanist with tousled dark curls, amber spectacles, green gardening apron stained with glowing sap, holding brass pruning shears.",
        palette: ["#10002B", "#240046", "#7B2CBF", "#C77DFF"],
      },
    ],
    coverPrompt:
      "Mystical supernatural comic cover for 'The Midnight Botanist'. Mateo Cruz pruning glowing purple and cyan orchids that release floating luminescent spores in his moonlit nocturnal greenhouse.",
    coverFile: "covers/the-midnight-botanist.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Ghost Orchid Bloom",
        slug: "chapter-1-the-ghost-orchid-bloom",
        synopsis: "The rarest flower in the greenhouse prepares to open its spectral petals.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Old greenhouse under a full moon, completely dark except for glowing violet flower buds.",
            imagePrompt: "Supernatural comic page panel 1. A glass Victorian greenhouse at midnight under full moon, hundreds of exotic alien flowers glowing with neon violet and blue bioluminescence.",
            imageFile: "episodes/the-midnight-botanist/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Mateo spraying nutrient mist on the delicate petals of a floating ghost orchid.",
            imagePrompt: "Comic page panel 2. Mateo gently spraying a fine mist onto an orchid with root tendrils that float unsupported in mid-air.",
            imageFile: "episodes/the-midnight-botanist/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A translucent spirit in 1920s flapper attire appears among the moonflowers.",
            imagePrompt: "Comic page panel 3. A semi-transparent glowing ghost of an elegant 1920s woman appearing beside the flowerbeds with a sad wistful smile.",
            imageFile: "episodes/the-midnight-botanist/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Mateo pours a glowing blue tincture into a crystal vial: 'I have what you need to remember.'",
            imagePrompt: "Comic page panel 4. Mateo offering a glowing blue glass vial to the ghost: 'One drop of ghost orchid dew, and your memories will return.'",
            imageFile: "episodes/the-midnight-botanist/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Phantom's Memory",
        slug: "chapter-2-the-phantoms-memory",
        synopsis: "Drinking the tincture reveals the night she was poisoned.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The spirit inhales the vapors of the tincture; her form becomes vivid and solid.",
            imagePrompt: "Comic page panel 1. The ghost inhaling the radiant blue steam, her ethereal form becoming crisp and vibrant with color.",
            imageFile: "episodes/the-midnight-botanist/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Flashback: A 1925 speakeasy party, champagne flutes, jazz band playing.",
            imagePrompt: "Comic page panel 2. Flashback in roaring twenties jazz club. Flappers dancing in glittering dresses, a man surreptitiously slipping powder into her champagne glass.",
            imageFile: "episodes/the-midnight-botanist/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "She gasps as she recognizes the poisoner's face: the founder of the city museum.",
            imagePrompt: "Comic page panel 3. The ghost's eyes widening in shock as she remembers the identity of her killer: the wealthy benefactor who built the town.",
            imageFile: "episodes/the-midnight-botanist/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "She hands Mateo a rusted iron key from beneath the greenhouse floorboards.",
            imagePrompt: "Comic page panel 4. The spirit pointing to a loose floorboard where a rusted antique key lies hidden: 'Find my diary in the vault.'",
            imageFile: "episodes/the-midnight-botanist/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Root of Justice",
        slug: "chapter-3-root-of-justice",
        synopsis: "Using botanical magic to reveal the historic crime to the world.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Mateo extracts the ancient diary from beneath the greenhouse bricks.",
            imagePrompt: "Comic page panel 1. Mateo pulling a tin lockbox from beneath the mossy foundation stones, opening it with the rusted key.",
            imageFile: "episodes/the-midnight-botanist/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "He wraps the diary in protective glowing nightshade leaves to preserve the fragile pages.",
            imagePrompt: "Comic page panel 2. Mateo wrapping the century-old diary in shimmering preservation leaves that seal it against moisture.",
            imageFile: "episodes/the-midnight-botanist/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "He delivers the package anonymously to the city historical society on dawn's doorstep.",
            imagePrompt: "Comic page panel 3. Mateo in a dark coat leaving the wrapped box on the marble steps of the museum just before the morning sun rises.",
            imageFile: "episodes/the-midnight-botanist/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Back in the greenhouse, the ghost woman smiles peacefully and fades into warm morning sunlight.",
            imagePrompt: "Comic page panel 4. Ending panel. The ghost woman waving goodbye with a serene peaceful smile as she dissolves into golden morning sunbeams across blooming orchids.",
            imageFile: "episodes/the-midnight-botanist/ep3_p4.png",
          },
        ],
      },
    ],
  },
];
