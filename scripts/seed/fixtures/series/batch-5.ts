import type { SeriesManifest } from "../../types.ts";

export const BATCH_5_SERIES: SeriesManifest[] = [
  // 41. Action (Studio: Iron Quill)
  {
    id: "series-41",
    batchNumber: 5,
    slug: "siege-of-the-dragon-gate",
    title: "Siege of the Dragon Gate",
    synopsis:
      "High in the jagged Dragon's Teeth mountain range, the Grand Alpine Bastion defends the fertile southern plains from winged wyvern clans. When the skies darken with three hundred drakes, an archer and an engineer must unleash the Titan Ballista.",
    genre: "Action",
    format: "page",
    ownerType: "studio",
    ownerRef: "iron-quill-studios",
    credits: [
      { roleCategory: "writer", creatorUsername: "marcus_kane" },
      { roleCategory: "artist", creatorUsername: "jin_woo_park" },
      { roleCategory: "letterer", creatorUsername: "rowan_macleod" },
    ],
    artStyle: "Grand-scale aerial fantasy warfare, swooping wyverns, heavy siege engines, and dynamic wind-swept mountain peaks.",
    characters: [
      {
        name: "Captain Kaelen Thorne",
        role: "Protagonist",
        visualDescription: "32-year-old alpine archer with heavy composite recurve bow, leather lamellar armor, green eagle-feather cloak, scarred nose.",
        palette: ["#1B4332", "#2D6A4F", "#D8F3DC", "#E9C46A"],
      },
    ],
    coverPrompt:
      "Epic siege action comic cover for 'Siege of the Dragon Gate'. Captain Kaelen perched on an alpine fortress crenellation, drawing his longbow to loose a glowing silver arrow at a colossal emerald wyvern diving through storm clouds.",
    coverFile: "covers/siege-of-the-dragon-gate.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Cloud Shadows",
        slug: "chapter-1-the-cloud-shadows",
        synopsis: "The mountain sirens sound as the sky blackens with winged silhouettes.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Titanic stone fortress wall spanning a two-mile gap between snowy alpine peaks.",
            imagePrompt: "Fantasy comic page panel 1. Gigantic stone wall fortress built between snowy mountain peaks, brass alarm horns blowing steam in freezing air.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Kaelen peering through his brass spyglass: hundreds of winged wyverns diving from the clouds.",
            imagePrompt: "Comic page panel 2. Kaelen looking through spyglass: a swarm of three hundred green and black flying drakes descending from storm clouds.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The fortress ballistas unleash a volley of harpoons with trailing iron chains.",
            imagePrompt: "Comic page panel 3. Battery of colossal wooden ballistas firing massive iron harpoons into the sky, cables whirring violently off drums.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "An enormous alpha wyvern breathes green acid fire across the main gatehouse.",
            imagePrompt: "Comic page panel 4. Colossal alpha drake with seventy-foot wingspan raining boiling green chemical fire onto the fortress battlements.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Titan Ballista",
        slug: "chapter-2-the-titan-ballista",
        synopsis: "Manually loading the ancient central siege cannon under heavy assault.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Kaelen and chief engineer Bran hauling a twenty-foot steel bolt into the center carriage.",
            imagePrompt: "Comic page panel 1. Soldiers straining to crank the iron winch of the colossal Titan Ballista, loading a massive runic steel bolt.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A wyvern lands on the wooden platform, snapping its jaws inches from Kaelen's face.",
            imagePrompt: "Comic page panel 2. A ferocious reptilian wyvern landing directly on the wooden deck, claws gouging beams as Kaelen rolls under its tail.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kaelen shoots an explosive fire arrow directly into the beast's maw.",
            imagePrompt: "Comic page panel 3. Point-blank combat. Kaelen loosing a blazing fire arrow into the open dragon throat, detonating the beast backwards.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "He takes the sighting wheel: aiming directly at the descending alpha commander.",
            imagePrompt: "Comic page panel 4. Kaelen peering through the brass sighting ring of the giant ballista, locking crosshairs on the diving alpha drake.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Skyfall",
        slug: "chapter-3-skyfall",
        synopsis: "The shot that shatters the invasion and frees the pass.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Kaelen pulls the trip lever: the Titan Ballista fires with a thunderclap.",
            imagePrompt: "Comic page panel 1. The titanic steel bowstring snapping forward, releasing a shockwave that blows back dust and soldiers.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The massive bolt impales the alpha wyvern's wing joint in mid-dive.",
            imagePrompt: "Comic page panel 2. The twenty-foot steel bolt punching cleanly through the alpha drake's wing membrane, sending it spiraling into the abyss.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The remaining swarm scatters in terror across the northern peaks.",
            imagePrompt: "Comic page panel 3. The wyvern army breaking formation and fleeing back into the distant arctic peaks, sky clearing into blue.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Sunlight breaks over the mountain fortress as the garrison cheers in triumph.",
            imagePrompt: "Comic page panel 4. Ending panel. Golden morning sunlight washing over the battle-worn stone ramparts as Captain Kaelen raises his bow to the cheering troops.",
            imageFile: "episodes/siege-of-the-dragon-gate/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 42. Fantasy (Individual)
  {
    id: "series-42",
    batchNumber: 5,
    slug: "whispers-of-yggdrasil",
    title: "Whispers of Yggdrasil",
    synopsis:
      "When the World Tree begins shedding its golden leaves, an orphaned Valkyrie apprentice must journey through the roots of Niflheim to recover the dew of creation before the nine realms freeze into eternal winter.",
    genre: "Fantasy",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "rowan_macleod",
    credits: [
      { roleCategory: "writer", creatorUsername: "rowan_macleod" },
      { roleCategory: "artist", creatorUsername: "rowan_macleod" },
      { roleCategory: "editor", creatorUsername: "marcus_kane" },
    ],
    artStyle: "Epic Norse mythology, colossal roots woven across starry night voids, glowing golden leaves, and frost-crusted rune armor.",
    characters: [
      {
        name: "Astrid Silverwing",
        role: "Protagonist",
        visualDescription: "19-year-old Valkyrie trainee with braided platinum hair, winged silver coronet, frosted steel spear, and swan-feather cloak.",
        palette: ["#48CAE4", "#0096C7", "#03045E", "#CAF0F8"],
      },
    ],
    coverPrompt:
      "Mythic Norse fantasy comic cover for 'Whispers of Yggdrasil'. Astrid Silverwing leaping with her glowing silver spear between colossal bark-covered roots of the World Tree suspended in a cosmic aurora-filled starry sky.",
    coverFile: "covers/whispers-of-yggdrasil.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Golden Leaf Falls",
        slug: "chapter-1-the-golden-leaf-falls",
        synopsis: "The sacred canopy of Asgard begins to wither.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Panoramic cosmic view of the colossal World Tree Yggdrasil connecting starry realms.",
            imagePrompt: "Vertical scroll panel. Majestic cosmic tree Yggdrasil with roots spanning across glowing nebula clouds, branches holding crystal realms.",
            imageFile: "episodes/whispers-of-yggdrasil/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A giant golden leaf detaches from the branches and shatters into frost on the bridge.",
            imagePrompt: "Vertical scroll panel. A house-sized glowing golden leaf drifting downward and shattering like brittle ice across the rainbow bridge Bifrost.",
            imageFile: "episodes/whispers-of-yggdrasil/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Astrid catches a falling spark of the leaf, her winged coronet gleaming.",
            imagePrompt: "Vertical scroll panel. Astrid catching a golden ember in her gauntlet, determination blazing in her ice-blue eyes.",
            imageFile: "episodes/whispers-of-yggdrasil/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "She leaps into the root chasm leading down into the misty void of Niflheim.",
            imagePrompt: "Vertical scroll panel reveal. Astrid spreading her feathered swan cloak and diving into the swirling violet clouds of the underworld abyss.",
            imageFile: "episodes/whispers-of-yggdrasil/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Frost Dragon's Lair",
        slug: "chapter-2-the-frost-dragons-lair",
        synopsis: "Confronting the serpent Nidhogg at the deepest root.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Colossal icy cavern where massive frozen tree roots are gnawed by ancient serpents.",
            imagePrompt: "Vertical scroll panel. Chilling underground ice cavern where roots thick as mountains are coated in blue glacial ice and serpent venom.",
            imageFile: "episodes/whispers-of-yggdrasil/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The titanic serpent Nidhogg uncoils from the frozen lake with glowing yellow eyes.",
            imagePrompt: "Vertical scroll panel. Gigantic primordial frost serpent with pale scales and jagged icicle fangs rearing out of black glacial water.",
            imageFile: "episodes/whispers-of-yggdrasil/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Astrid parries a blast of freezing venom with her silver shield.",
            imagePrompt: "Vertical scroll panel. Astrid deflecting a jet of corrosive blue frost breath with her round runic shield, ice crystals shattering.",
            imageFile: "episodes/whispers-of-yggdrasil/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "She spots the Well of Urd: a pool of pure liquid starlight protected beneath the roots.",
            imagePrompt: "Vertical scroll panel. Hidden behind the serpent: a small glowing pool of pristine golden starlight dew humming with ancient life.",
            imageFile: "episodes/whispers-of-yggdrasil/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Dew of Life",
        slug: "chapter-3-the-dew-of-life",
        synopsis: "Collecting the sacred elixir and reviving the branches above.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Astrid dips her horn vial into the glowing water, singing the ancient valkyrie hymn.",
            imagePrompt: "Vertical scroll panel. Astrid kneeling reverently by the golden pool, singing a melodic chant as the sacred water flows into her horn.",
            imageFile: "episodes/whispers-of-yggdrasil/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The serpent pauses, pacified by the celestial harmony, curling peacefully around the stone.",
            imagePrompt: "Vertical scroll panel. The great serpent lowering its massive horned head, closed eyes calm and restful under the song.",
            imageFile: "episodes/whispers-of-yggdrasil/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Astrid ascends on wings of aurora borealis back to the upper boughs.",
            imagePrompt: "Vertical scroll panel. Astrid soaring upward on trailing wings of green and magenta northern lights, breaking through the clouds.",
            imageFile: "episodes/whispers-of-yggdrasil/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Pouring the dew on the Great Bough: thousands of golden leaves burst into glorious bloom.",
            imagePrompt: "Vertical scroll panel ending. Pouring the golden droplet onto the bark, sending a shockwave of blooming golden leaves across the cosmic tree.",
            imageFile: "episodes/whispers-of-yggdrasil/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 43. Sci-Fi (Individual)
  {
    id: "series-43",
    batchNumber: 5,
    slug: "the-neon-nomad",
    title: "The Neon Nomad",
    synopsis:
      "A lone all-terrain solar crawler pilot navigates the radioactive dust storms of terraformed Mars, transporting vital genetic seeds between isolated dome settlements while dodging corporate highway raiders.",
    genre: "Sci-Fi",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "tariq_al_mansoor",
    credits: [
      { roleCategory: "writer", creatorUsername: "tariq_al_mansoor" },
      { roleCategory: "artist", creatorUsername: "tariq_al_mansoor" },
      { roleCategory: "editor", creatorUsername: "elena_vance" },
    ],
    artStyle: "Rust-red Martian deserts, solar-crawler vehicles, dust-storm twisters, and neon cockpit HUD interfaces.",
    characters: [
      {
        name: "Rashid Vance",
        role: "Protagonist",
        visualDescription: "34-year-old rover courier with dark sand-weathered skin, goggles around neck, worn canvas desert duster, cybernetic prosthetic leg.",
        palette: ["#9A031E", "#FB8B24", "#E36414", "#0F4C5C"],
      },
    ],
    coverPrompt:
      "Sci-fi desert comic cover for 'The Neon Nomad'. Heavy 8-wheeled orange solar-crawler truck speeding across a red Martian dune desert, kicking up red dust while massive red dust tornadoes loom on the horizon.",
    coverFile: "covers/the-neon-nomad.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Valles Marineris Dust Storm",
        slug: "chapter-1-valles-marineris-dust-storm",
        synopsis: "A category-5 silica dust storm closes in on the canyon pass.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Immense red canyon walls of Valles Marineris under a thin peach-colored Martian sky.",
            imagePrompt: "Vertical scroll panel. Colossal red canyon cliffs of Mars stretching for miles, wind whipping red sand into swirling dust devils.",
            imageFile: "episodes/the-neon-nomad/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Rashid's armored orange rover 'The Sandstrider' cruising over rugged basalt boulders.",
            imagePrompt: "Vertical scroll panel. Heavy 8-wheeled industrial desert rover with solar panels and high-beam floodlights tackling rocky terrain.",
            imageFile: "episodes/the-neon-nomad/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Cockpit dashboard radar flashing: a three-mile-high wall of red dust approaching fast.",
            imagePrompt: "Vertical scroll panel. Inside cockpit: Rashid gripping steering yoke as the windshield fills with a terrifying wall of churning red storm clouds.",
            imageFile: "episodes/the-neon-nomad/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The crawler plunges into zero-visibility red darkness as lightning cracks in the sand.",
            imagePrompt: "Vertical scroll panel. The truck engulfed in swirling red dust, forks of static electricity lightning dancing over the reinforced windshield.",
            imageFile: "episodes/the-neon-nomad/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Ambush at Olympus Gate",
        slug: "chapter-2-ambush-at-olympus-gate",
        synopsis: "Pirate dune-buggies emerge from the blinding storm.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Three spiked raider buggies flank the crawler on both sides through the sand.",
            imagePrompt: "Vertical scroll panel. Aggressive spiked pirate buggies with rocket launchers speeding alongside the heavy rover in the dust storm.",
            imageFile: "episodes/the-neon-nomad/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A magnetic harpoon slams into the cargo bay door of the crawler.",
            imagePrompt: "Vertical scroll panel. Heavy magnetic harpoon cable clanging onto the crawler's steel armor, sparking as it winches tight.",
            imageFile: "episodes/the-neon-nomad/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Rashid triggers the electrified hull defense grid, shocking the raiders.",
            imagePrompt: "Vertical scroll panel. Rashid hitting the emergency switch, a surge of high-voltage blue lightning arcing down the harpoon cable to fry the buggy.",
            imageFile: "episodes/the-neon-nomad/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "He hits the nitrous boost, accelerating through a narrow natural rock archway.",
            imagePrompt: "Vertical scroll panel. The heavy rover rocketing forward on blue thruster flame, slipping through a narrow arch as pursuing buggies crash.",
            imageFile: "episodes/the-neon-nomad/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Green Dome of New Cairo",
        slug: "chapter-3-the-green-dome-of-new-cairo",
        synopsis: "Delivering the seed cargo to the thriving agricultural biodome.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The dust storm clears, revealing a massive geodesic glass biodome glowing green.",
            imagePrompt: "Vertical scroll panel. Emerging from red storm into clear sunlight, facing a colossal glass dome city filled with lush green trees on Mars.",
            imageFile: "episodes/the-neon-nomad/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The airlock gates open with a hiss of steam to welcome the courier.",
            imagePrompt: "Vertical scroll panel. Enormous hydraulic airlock doors opening, air mist spraying as the battered orange crawler rolls inside.",
            imageFile: "episodes/the-neon-nomad/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Colony botanists unload the cold-storage canisters of wheat and olive seedlings.",
            imagePrompt: "Vertical scroll panel. Cheerful greenhouse workers unstrapping temperature-controlled canisters of green sprouts and seeds.",
            imageFile: "episodes/the-neon-nomad/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Rashid takes a bite of a freshly picked Martian apple, looking out at the red desert.",
            imagePrompt: "Vertical scroll panel ending. Rashid sitting on his rover hood inside the green dome, biting into a crisp apple with a satisfied smirk.",
            imageFile: "episodes/the-neon-nomad/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 44. Romance (Individual)
  {
    id: "series-44",
    batchNumber: 5,
    slug: "letters-in-the-rain",
    title: "Letters in the Rain",
    synopsis:
      "Two rival paper goods and antique stationery shop owners across a narrow rainy lane in Edinburgh conduct an anonymous correspondence through secret messages left inside borrowed classic novels.",
    genre: "Romance",
    format: "page",
    ownerType: "individual",
    ownerRef: "soraya_mirza",
    credits: [
      { roleCategory: "writer", creatorUsername: "soraya_mirza" },
      { roleCategory: "artist", creatorUsername: "soraya_mirza" },
      { roleCategory: "editor", creatorUsername: "chloe_dupont" },
    ],
    artStyle: "Cozy Edinburgh rain, cobblestone reflections, vintage wax seals, fountain pen cursive, and heartwarming bookstore warmth.",
    characters: [
      {
        name: "Isla MacIntyre",
        role: "Protagonist",
        visualDescription: "27-year-old stationer with auburn hair in a loose braid, knitted mustard cardigan, ink-smudged fingertips, thoughtful hazel eyes.",
        palette: ["#6B705C", "#A5A58D", "#B7B7A4", "#FFE8D6"],
      },
    ],
    coverPrompt:
      "Romantic indie comic cover for 'Letters in the Rain'. Isla holding an open umbrella on a rainy Edinburgh cobblestone street, looking across at an antique bookstore window where a handsome bookshop owner smiles back.",
    coverFile: "covers/letters-in-the-rain.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Book on the Windowsill",
        slug: "chapter-1-the-book-on-the-windowsill",
        synopsis: "A worn copy of Jane Eyre is left on the rain-soaked bench with an envelope tucked inside.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Rain-swept Edinburgh Old Town street with stone tenements and warm shop windows.",
            imagePrompt: "Comic page panel 1. Edinburgh Old Town in gentle rain, wet cobblestones reflecting glowing amber shop lamps and vintage signs.",
            imageFile: "episodes/letters-in-the-rain/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Isla finding a leather-bound book wrapped in clear wax paper on her front bench.",
            imagePrompt: "Comic page panel 2. Isla stepping outside with an umbrella, discovering a classic leather book wrapped in waterproof paper on her bench.",
            imageFile: "episodes/letters-in-the-rain/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Inside page 42: a handwritten letter on heavy handmade cotton rag paper.",
            imagePrompt: "Comic page panel 3. Opening the book to find a deckle-edge cotton letter penned in sepia ink: 'To the curator of fine papers across the lane.'",
            imageFile: "episodes/letters-in-the-rain/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "She looks across the street: Callum the antiquarian bookshop owner is adjusting his display.",
            imagePrompt: "Comic page panel 4. Isla looking across the cobblestones through rain; Callum looking up and meeting her eyes with an enigmatic gentle smile.",
            imageFile: "episodes/letters-in-the-rain/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Crimson Wax",
        slug: "chapter-2-crimson-wax",
        synopsis: "Crafting a response sealed with a custom wax thistle emblem.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Isla melting red sealing wax over a brass spoon burner at her desk.",
            imagePrompt: "Comic page panel 1. Close-up on red sealing wax melting over a tiny tea candle burner, releasing sweet bayberry scents.",
            imageFile: "episodes/letters-in-the-rain/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Writing her reply with a glass dip pen and emerald ink.",
            imagePrompt: "Comic page panel 2. Elegant glass calligraphy pen writing flowing cursive on heavy textured paper under desk lamplight.",
            imageFile: "episodes/letters-in-the-rain/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "She slips the letter into a vintage poetry anthology and leaves it on his stoop at dusk.",
            imagePrompt: "Comic page panel 3. Isla in a trench coat leaving the book under Callum's sheltered bookstore doorway as the streetlamps turn on.",
            imageFile: "episodes/letters-in-the-rain/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Callum picks up the volume, touching the still-warm wax seal with quiet tenderness.",
            imagePrompt: "Comic page panel 4. Callum picking up the book, thumb tracing the embossed wax thistle, eyes glowing with delighted affection.",
            imageFile: "episodes/letters-in-the-rain/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Under One Umbrella",
        slug: "chapter-3-under-one-umbrella",
        synopsis: "A sudden downpour brings the two correspondents face-to-face.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A torrential cloudburst strikes the street, sending pedestrians scattering.",
            imagePrompt: "Comic page panel 1. Sudden heavy thunderstorm downpour on Edinburgh street, gutters overflowing with splashing water.",
            imageFile: "episodes/letters-in-the-rain/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Isla's umbrella flips inside out in the fierce gust of wind.",
            imagePrompt: "Comic page panel 2. Wind catching Isla's umbrella and turning it inside out, Isla laughing in helpless drenched surrender.",
            imageFile: "episodes/letters-in-the-rain/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Callum steps forward with a large black umbrella, sheltering her from the storm.",
            imagePrompt: "Comic page panel 3. Callum stepping over, extending a broad black umbrella over both of them, standing shoulder to shoulder.",
            imageFile: "episodes/letters-in-the-rain/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "He smiles: 'I believe we've run out of books to hide our letters in.'",
            imagePrompt: "Comic page panel 4. Ending panel. Callum and Isla smiling warmly at each other under the umbrella, rain pouring around them as their hands touch.",
            imageFile: "episodes/letters-in-the-rain/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 45. Horror (Individual)
  {
    id: "series-45",
    batchNumber: 5,
    slug: "the-ossuary-carnival",
    title: "The Ossuary Carnival",
    synopsis:
      "A traveling carnival arrives outside a sleepy dust-bowl town during the Great Depression. The admission ticket is free, but anyone who stays past midnight becomes one of the dancing skeletal performers in the bone tent.",
    genre: "Horror",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "clara_thorne",
    credits: [
      { roleCategory: "writer", creatorUsername: "clara_thorne" },
      { roleCategory: "artist", creatorUsername: "clara_thorne" },
      { roleCategory: "editor", creatorUsername: "lucas_valerio" },
    ],
    artStyle: "Vintage macabre carnival, faded red circus stripes, bone xylophones, eerie yellow lanterns, and creeping psychological dread.",
    characters: [
      {
        name: "Elias Vance",
        role: "Protagonist",
        visualDescription: "20-year-old dust bowl farmhand with worn canvas jacket, flat cap, skeptical gray eyes, holding a wooden cane.",
        palette: ["#2B1E17", "#7E2A2D", "#D4A373", "#E9D8A6"],
      },
    ],
    coverPrompt:
      "Spooky vintage horror comic cover for 'The Ossuary Carnival'. Elias standing before the tattered red-and-white striped circus tent under a sickly yellow harvest moon, as dancing skeletal acrobats in top hats perform on high tightropes.",
    coverFile: "covers/the-ossuary-carnival.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Tent in the Wheat",
        slug: "chapter-1-the-tent-in-the-wheat",
        synopsis: "The carnival appears overnight in an abandoned Kansas wheat field.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Bleak flat dust-bowl wheat fields under a blood-orange sunset.",
            imagePrompt: "Horror webcomic panel. Vast dry Kansas wheat field under dusty orange sky, strange carousel calliope music drifting on the wind.",
            imageFile: "episodes/the-ossuary-carnival/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A massive faded circus tent patched with burlap and bone pins.",
            imagePrompt: "Vertical scroll panel. Enormous tattered circus big-top tent with bleached bone poles and glowing yellow lanterns swaying from ropes.",
            imageFile: "episodes/the-ossuary-carnival/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A skeletal barker in a purple top hat offers Elias a black ticket with no price.",
            imagePrompt: "Vertical scroll panel. A pale, gaunt ringmaster with skeletal face in purple top hat extending a black ticket: 'Admission is free, boy.'",
            imageFile: "episodes/the-ossuary-carnival/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Elias steps past the heavy flap as the calliope music turns into chanting.",
            imagePrompt: "Vertical scroll panel. Elias stepping through the velvet curtain into the dim, sawdust-strewn interior as the entrance flap seals shut.",
            imageFile: "episodes/the-ossuary-carnival/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Bone Carousel",
        slug: "chapter-2-the-bone-carousel",
        synopsis: "The wooden horses are replaced with the skeletons of ancient beasts.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A spinning carousel with carved animal skeletons instead of wooden horses.",
            imagePrompt: "Vertical scroll panel. Carousel revolving with yellow lights, riders sitting upon the polished ribcages of skeletal horses and wolves.",
            imageFile: "episodes/the-ossuary-carnival/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Townspeople on the ride have hollow glassy eyes and frozen smiling masks.",
            imagePrompt: "Vertical scroll panel. Townspeople riding the carousel with trance-like vacant stares, singing in eerie mechanical unison.",
            imageFile: "episodes/the-ossuary-carnival/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Elias looks down at his own fingers: his skin is turning translucent like thin parchment.",
            imagePrompt: "Vertical scroll panel. Shock reveal. Elias looking at his hand, finger bones visible beneath rapidly thinning translucent skin.",
            imageFile: "episodes/the-ossuary-carnival/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The clock strikes midnight: the calliope organist is a giant four-armed skeleton.",
            imagePrompt: "Vertical scroll panel. Giant four-armed skeletal organist hammering away at a massive pipe organ made of bleached human bones.",
            imageFile: "episodes/the-ossuary-carnival/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Fire in the Sawdust",
        slug: "chapter-3-the-fire-in-the-sawdust",
        synopsis: "Overturning the kerosene lanterns to break the carnival's illusion.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Elias uses his cane to smash an iron kerosene lantern onto the dry sawdust floor.",
            imagePrompt: "Vertical scroll panel. Elias smashing a heavy glass lantern, yellow kerosene igniting the dry sawdust in a roaring line of orange flame.",
            imageFile: "episodes/the-ossuary-carnival/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The fire burns with green spirit smoke, causing the skeletal tent poles to splinter.",
            imagePrompt: "Vertical scroll panel. Green magical fire sweeping up the tent walls, the bone supports cracking like snapping dry twigs.",
            imageFile: "episodes/the-ossuary-carnival/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The townspeople wake up from their trance, coughing and running for the exit.",
            imagePrompt: "Vertical scroll panel. The enchanted townspeople snapping awake, helping each other scramble through the burning tear in the tent wall.",
            imageFile: "episodes/the-ossuary-carnival/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Elias collapses on the prairie grass as the carnival vanishes into swirling gray ash.",
            imagePrompt: "Vertical scroll panel ending. Elias breathing fresh night air in the wheat field as the burning circus evaporates into harmless gray soot.",
            imageFile: "episodes/the-ossuary-carnival/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 46. Comedy (Individual)
  {
    id: "series-46",
    batchNumber: 5,
    slug: "coffee-and-curses",
    title: "Coffee & Curses",
    synopsis:
      "A modern hedge witch tries to run an artisan potion coffee shop in Portland, but having to deal with entitled influencers demanding oat milk invisibility draughts and one-star Yelp reviews for love hexes is driving her to the brink.",
    genre: "Comedy",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "felix_castillo",
    credits: [
      { roleCategory: "writer", creatorUsername: "felix_castillo" },
      { roleCategory: "artist", creatorUsername: "devon_reed" },
      { roleCategory: "letterer", creatorUsername: "felix_castillo" },
    ],
    artStyle: "Chic modern magical comedy, pastel purples and mint greens, witty chalkboard menus, bubbling potion steam, and deadpan comedic timing.",
    characters: [
      {
        name: "Rowan Thorne",
        role: "Protagonist",
        visualDescription: "25-year-old modern witch with messy lavender hair, pointed modern felt beanie, oversized black cardigan, stirring a copper cauldron with a latte spoon.",
        palette: ["#7209B7", "#560BAD", "#480CA8", "#B5179E"],
      },
    ],
    coverPrompt:
      "Funny modern supernatural comedy comic cover for 'Coffee & Curses'. Modern witch Rowan stirring a bubbling purple glowing cauldron behind an artisan cafe counter while an impatient customer taps their phone demanding an iced oat milk hex.",
    coverFile: "covers/coffee-and-curses.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Invisibility Cold Brew",
        slug: "chapter-1-the-invisibility-cold-brew",
        synopsis: "A customer drinks the stealth potion before their job interview.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Trendy cafe chalkboard menu: 'Lavender Vanilla Latte', 'Potion of Truth ($6.50)', 'Spite Tea'.",
            imagePrompt: "Cartoon webcomic panel. Hipster cafe chalkboard menu listing espresso drinks alongside magical elixirs with funny disclaimers.",
            imageFile: "episodes/coffee-and-curses/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A nervous customer in a suit downs the 'Phasing Cold Brew' in one gulp.",
            imagePrompt: "Cartoon webcomic panel. Anxious guy in a business suit chugging a glowing cyan iced coffee while Rowan screams: 'WAIT! ONLY SIP IT!'",
            imageFile: "episodes/coffee-and-curses/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "His body vanishes completely, leaving only his floating necktie and coffee cup.",
            imagePrompt: "Cartoon webcomic panel. The man's body completely turning invisible, leaving a polka-dot tie and plastic coffee cup hovering in mid-air.",
            imageFile: "episodes/coffee-and-curses/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The floating tie says: 'Honestly? This will probably help with my interview.'",
            imagePrompt: "Cartoon webcomic panel. The floating tie giving a thumbs up and walking out the door as Rowan facepalms behind the register.",
            imageFile: "episodes/coffee-and-curses/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The One-Star Yelp Review",
        slug: "chapter-2-the-one-star-yelp-review",
        synopsis: "Tracking down the internet reviewer who complained their toad hex tasted too bitter.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Rowan reading her phone screen in furious anger: '1 Star: Love potion made my ex fall in love with his own reflection.'",
            imagePrompt: "Cartoon webcomic panel. Rowan fuming with cartoon steam blowing out of her ears while reading a ridiculous 1-star Yelp review on her smartphone.",
            imageFile: "episodes/coffee-and-curses/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Her talking black cat familiar Barnaby adjusts his tiny reading glasses.",
            imagePrompt: "Cartoon webcomic panel. Sleek black cat sitting on the counter typing on an iPad: 'I told you Narcissus roots have that side effect.'",
            imageFile: "episodes/coffee-and-curses/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Rowan prepares a custom reply with an animated glowing keyboard hex.",
            imagePrompt: "Cartoon webcomic panel. Rowan typing a response with glowing purple magic sparks dancing off her fingertips: 'Per my previous email...'",
            imageFile: "episodes/coffee-and-curses/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The reviewer's phone turns into an actual live croaking bullfrog.",
            imagePrompt: "Cartoon webcomic panel. Across town: a rude influencer screaming as their gold smartphone transforms into a fat green bullfrog: *ribbit*.",
            imageFile: "episodes/coffee-and-curses/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Health Inspector",
        slug: "chapter-3-the-health-inspector",
        synopsis: "Hiding the dragon scales and mandrake roots before the city inspection.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "City Health Inspector Mr. Henderson walks through the door with a clipboard.",
            imagePrompt: "Cartoon webcomic panel. Stern health inspector in white coat and clipboard stepping inside, sniffing the air suspiciously.",
            imageFile: "episodes/coffee-and-curses/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Rowan frantically casting illusion spells to disguise cauldrons as espresso grinders.",
            imagePrompt: "Cartoon webcomic panel. Rowan frantically waving her wand behind her back, turning a bubbling skull pot into an Italian espresso machine.",
            imageFile: "episodes/coffee-and-curses/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A baby mandrake in a flowerpot starts crying; Barnaby the cat sits on it and purrs loudly.",
            imagePrompt: "Cartoon webcomic panel. Black cat casually sitting directly on top of a screaming potted mandrake root to muffle its cries.",
            imageFile: "episodes/coffee-and-curses/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Henderson takes a sip of the house blend and gives them an 'A' grade with a tear in his eye.",
            imagePrompt: "Cartoon webcomic panel ending. The inspector tasting the magic caramel latte, eyes welling with joy, stamping 'GRADE A' on the certificate.",
            imageFile: "episodes/coffee-and-curses/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 47. Drama (Individual)
  {
    id: "series-47",
    batchNumber: 5,
    slug: "the-cellist-of-prague",
    title: "The Cellist of Prague",
    synopsis:
      "In 1968 Prague during the height of political censorship, a concert cellist uses covert microdot codes woven into his musical scores to transmit messages for the underground student resistance.",
    genre: "Drama",
    format: "page",
    ownerType: "individual",
    ownerRef: "chloe_dupont",
    credits: [
      { roleCategory: "writer", creatorUsername: "chloe_dupont" },
      { roleCategory: "artist", creatorUsername: "chloe_dupont" },
      { roleCategory: "editor", creatorUsername: "soraya_mirza" },
    ],
    artStyle: "Cold War Prague noir, grand concert hall acoustics, muted cobalt and sepia shadows, and emotional musical drama.",
    characters: [
      {
        name: "Jan Horak",
        role: "Protagonist",
        visualDescription: "38-year-old concert cellist with deep-set mournful eyes, dark tailored tuxedo, scarred knuckles, holding a 1740 Montagnana cello.",
        palette: ["#1B1B1B", "#2B2D42", "#8D99AE", "#D90429"],
      },
    ],
    coverPrompt:
      "Tense historical drama comic cover for 'The Cellist of Prague'. Jan Horak playing a grand cello on the stage of an ornate Prague concert hall under a single spotlight, while armed state police officers stand silhouetted in the back shadows.",
    coverFile: "covers/the-cellist-of-prague.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Coded Stave",
        slug: "chapter-1-the-coded-stave",
        synopsis: "Jan receives the sheet music containing microdots of the banned manifesto.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Foggy cobblestones of Charles Bridge at night with dark Gothic statues.",
            imagePrompt: "Historical drama comic page panel 1. Charles Bridge in Prague shrouded in cold winter night fog, gas lamps illuminating dark stone statues.",
            imageFile: "episodes/the-cellist-of-prague/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A student activist slips a sheet music folder into Jan's cello case.",
            imagePrompt: "Comic page panel 2. A young student in trench coat swiftly slipping an envelope of musical score sheets into Jan's velvet-lined cello case.",
            imageFile: "episodes/the-cellist-of-prague/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Jan inspecting the music notes under a jeweler's lens: microscopic printed letters inside the noteheads.",
            imagePrompt: "Comic page panel 3. Magnifying lens showing microscopic printed dissident text hidden inside the black ink dots of musical notes.",
            imageFile: "episodes/the-cellist-of-prague/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "State security agents knock loudly on his apartment door.",
            imagePrompt: "Comic page panel 4. Heavy thumping on the frosted glass apartment door, silhouettes of two trench-coated secret police officers.",
            imageFile: "episodes/the-cellist-of-prague/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Interrogation at the Dvořák Hall",
        slug: "chapter-2-interrogation-at-the-dvorak-hall",
        synopsis: "The secret police search his instrument before the gala performance.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "State police captain inspecting the carved wooden soundbox of the cello with a flashlight.",
            imagePrompt: "Comic page panel 1. Stern police captain peering into the f-holes of the antique cello with a mirror and flashlight probe.",
            imageFile: "episodes/the-cellist-of-prague/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Jan stands calmly with folded hands, betraying zero fear in his heartbeat.",
            imagePrompt: "Comic page panel 2. Jan standing tall in his concert tuxedo with impenetrable dignified calm, looking the captain in the eye.",
            imageFile: "episodes/the-cellist-of-prague/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The captain finds nothing: the microfilm is hidden inside the mother-of-pearl bow frog.",
            imagePrompt: "Comic page panel 3. The officer handing the cello back; close up on Jan's fingers gripping the mother-of-pearl inlay of the bow.",
            imageFile: "episodes/the-cellist-of-prague/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The stage manager whispers: 'Two minutes to curtain, Maestro.'",
            imagePrompt: "Comic page panel 4. Jan walking through the backstage velvet curtains into the blinding brilliance of stage footlights.",
            imageFile: "episodes/the-cellist-of-prague/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Dvořák's Cello Concerto",
        slug: "chapter-3-dvoraks-cello-concerto",
        synopsis: "Playing with an explosive fury that sparks hope in a captive nation.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Jan strikes the opening chords of Dvořák's Concerto, tears in the eyes of audience members.",
            imagePrompt: "Comic page panel 1. Jan playing with breathtaking passion, cello bow blurring across strings as rich resonant music fills the hall.",
            imageFile: "episodes/the-cellist-of-prague/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "In the balcony, a foreign diplomat receives the score with the microdots.",
            imagePrompt: "Comic page panel 2. Up in the balcony box, a Swedish cultural attaché receiving the program folder containing the smuggled microdots.",
            imageFile: "episodes/the-cellist-of-prague/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The entire hall rises for a five-minute standing ovation, defying state censors.",
            imagePrompt: "Comic page panel 3. The grand concert hall erupting into thunderous standing ovation, audience waving flowers in peaceful defiance.",
            imageFile: "episodes/the-cellist-of-prague/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Jan bows, clutching his cello like a shield of freedom.",
            imagePrompt: "Comic page panel 4. Ending panel. Jan bowing deeply under the spotlight, his instrument gleaming, knowing the truth is on its way to the world.",
            imageFile: "episodes/the-cellist-of-prague/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 48. Slice of Life (Individual)
  {
    id: "series-48",
    batchNumber: 5,
    slug: "the-rainy-day-bookshop",
    title: "The Rainy Day Bookshop",
    synopsis:
      "Tucked away on a quiet cedar hill in ancient Kamakura, a second-hand bookshop only opens its cedar sliding doors when it rains, serving roasted hojicha tea to patrons seeking refuge from the storm.",
    genre: "Slice of Life",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "aiko_takahashi",
    credits: [
      { roleCategory: "writer", creatorUsername: "aiko_takahashi" },
      { roleCategory: "artist", creatorUsername: "aiko_takahashi" },
      { roleCategory: "editor", creatorUsername: "devon_reed" },
    ],
    artStyle: "Gentle Kamakura rain, weathered cedarwood textures, aroma of roasted hojicha tea, and comforting quiet slice-of-life pacing.",
    characters: [
      {
        name: "Shunji Arai",
        role: "Protagonist",
        visualDescription: "48-year-old gentle bookseller with round wire spectacles, charcoal samue work robes, quiet smile, carrying a wooden tray of tea.",
        palette: ["#283618", "#606C38", "#DDA15E", "#BC6C25"],
      },
    ],
    coverPrompt:
      "Cozy slice-of-life comic cover for 'The Rainy Day Bookshop'. Shunji Arai sliding open the cedar lattice door of his moss-surrounded Kamakura second-hand bookstore while rain falls gently on stone garden lanterns.",
    coverFile: "covers/the-rainy-day-bookshop.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The First Drops on Cedar",
        slug: "chapter-1-the-first-drops-on-cedar",
        synopsis: "The wooden sign 'OPEN WHEN IT RAINS' is hung on the front pillar.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Raindrops splashing into a stone basin in a mossy Kamakura garden.",
            imagePrompt: "Vertical scroll panel. Stone water basin in a tranquil moss garden rippling as gentle rain begins to fall from pine branches.",
            imageFile: "episodes/the-rainy-day-bookshop/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Shunji sliding open the cedar screen doors, letting in the fresh petrichor breeze.",
            imagePrompt: "Vertical scroll panel. Shunji sliding open wooden lattice doors, warm light from paper lanterns spilling onto stone steps.",
            imageFile: "episodes/the-rainy-day-bookshop/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The shop interior: floor-to-ceiling wooden shelves stacked with vintage paperbacks and art books.",
            imagePrompt: "Vertical scroll panel. Cozy shop interior packed with thousands of used books, worn tatami mats, and low wooden reading tables.",
            imageFile: "episodes/the-rainy-day-bookshop/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "A university student steps inside to escape the sudden shower, shaking her umbrella.",
            imagePrompt: "Vertical scroll panel. A young woman stepping across the threshold, sighing in relief as the scent of old paper and roasted tea surrounds her.",
            imageFile: "episodes/the-rainy-day-bookshop/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Hojicha & Poetry",
        slug: "chapter-2-hojicha-and-poetry",
        synopsis: "Finding a volume of classical tanka poems forgotten on the top shelf.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Shunji setting a ceramic cup of dark roasted hojicha tea beside the student's table.",
            imagePrompt: "Vertical scroll panel. A warm brown ceramic cup of steaming roasted tea placed on a bamboo coaster beside an open book.",
            imageFile: "episodes/the-rainy-day-bookshop/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The student finds a pressed maple leaf bookmark inside an 80-year-old poetry volume.",
            imagePrompt: "Vertical scroll panel. Close-up on ancient yellowed book page: a perfectly preserved dry red maple leaf pressed between lines of calligraphy.",
            imageFile: "episodes/the-rainy-day-bookshop/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Rain intensifies outside, drumming peacefully against the cedar shake roof.",
            imagePrompt: "Vertical scroll panel. Steady rhythmic rain streaming down the glass veranda panes, blurring the green bamboo garden outside.",
            imageFile: "episodes/the-rainy-day-bookshop/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The student smiles and begins reading, all her deadline anxiety melting away.",
            imagePrompt: "Vertical scroll panel. The young woman resting her chin in her hand, completely absorbed in the peaceful poetry as time slows down.",
            imageFile: "episodes/the-rainy-day-bookshop/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Clearing Sky",
        slug: "chapter-3-the-clearing-sky",
        synopsis: "The rain stops and the clouds part to reveal the setting sun over the hydrangeas.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The rain slows to a gentle mist as sunlight breaks through gray clouds.",
            imagePrompt: "Vertical scroll panel. Golden sunbeams piercing through silver clouds, water droplets on hydrangea bushes glistening like diamonds.",
            imageFile: "episodes/the-rainy-day-bookshop/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The student buys the poetry volume and bows gratefully to Shunji.",
            imagePrompt: "Vertical scroll panel. The student purchasing the book at the wooden counter, exchanging a warm grateful bow with Shunji.",
            imageFile: "episodes/the-rainy-day-bookshop/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Shunji flips the wooden sign back to 'CLOSED UNTIL NEXT RAIN'.",
            imagePrompt: "Vertical scroll panel. Shunji flipping the rustic wooden sign with a gentle smile as the sky clears into brilliant blue.",
            imageFile: "episodes/the-rainy-day-bookshop/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "He takes his own cup of tea to the veranda, watching the evening swallows fly.",
            imagePrompt: "Vertical scroll panel ending. Shunji sitting on the wooden veranda steps sipping tea, watching birds soar across a golden sunset sky.",
            imageFile: "episodes/the-rainy-day-bookshop/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 49. Mystery (Individual)
  {
    id: "series-49",
    batchNumber: 5,
    slug: "the-silk-road-cipher",
    title: "The Silk Road Cipher",
    synopsis:
      "When an illuminated 8th-century Sogdian silk manuscript is stolen from the British Museum, an antiquities forensic analyst follows a trail of smuggled pigment trade routes across Istanbul and Samarkand to stop a billionaire's dark collection.",
    genre: "Mystery",
    format: "page",
    ownerType: "individual",
    ownerRef: "maya_lin",
    credits: [
      { roleCategory: "writer", creatorUsername: "maya_lin" },
      { roleCategory: "artist", creatorUsername: "maya_lin" },
      { roleCategory: "editor", creatorUsername: "hannah_lindqvist" },
    ],
    artStyle: "Intricate forensic antiquities mystery, ultramarine lapis lazuli pigments, ancient calligraphy, and exotic bazaar alleyways.",
    characters: [
      {
        name: "Dr. Maya Salinger",
        role: "Protagonist",
        visualDescription: "32-year-old antiquities forensics expert with sharp hazel eyes, dark leather jacket, magnifying loupe on necklace, notebook in hand.",
        palette: ["#1D3557", "#E63946", "#F1FAEE", "#A8DADC"],
      },
    ],
    coverPrompt:
      "Intriguing international mystery comic cover for 'The Silk Road Cipher'. Dr. Maya Salinger examining a fragment of gold-illuminated silk manuscript under a portable UV light inside an ancient spice bazaar in Samarkand at dusk.",
    coverFile: "covers/the-silk-road-cipher.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Slashed Display",
        slug: "chapter-1-the-slashed-display",
        synopsis: "The museum gallery is breached without triggering a single pressure sensor.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "British Museum East Asian gallery in darkness under flashing forensic laser pointers.",
            imagePrompt: "Mystery comic page panel 1. Grand museum gallery at night with shattered reinforced glass case and forensic yellow markers on marble floor.",
            imageFile: "episodes/the-silk-road-cipher/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Maya kneeling by the empty velvet mount, using an ultraviolet torch.",
            imagePrompt: "Comic page panel 2. Maya shining a purple UV flashlight on the velvet pedestal, revealing glowing blue chemical traces of lapis lazuli pigment.",
            imageFile: "episodes/the-silk-road-cipher/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The chemical spectrum indicates authentic Afghan lapis mined from the Badakhshan province.",
            imagePrompt: "Comic page panel 3. Handheld spectrometer device showing a mineral graph: 'Purity 99.4% — Badakhshan Source 8th Century'.",
            imageFile: "episodes/the-silk-road-cipher/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "A flight ticket receipt to Istanbul is found tucked behind the air vent.",
            imagePrompt: "Comic page panel 4. Maya using tweezers to extract a burned boarding pass from an air vent grille, eyes narrowing with determination.",
            imageFile: "episodes/the-silk-road-cipher/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Grand Bazaar Chase",
        slug: "chapter-2-the-grand-bazaar-chase",
        synopsis: "Tracking the black-market antiquities dealer through the alleys of Istanbul.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Crowded vaulted corridors of the Grand Bazaar filled with hanging lanterns and carpets.",
            imagePrompt: "Comic page panel 1. Bustling Istanbul Grand Bazaar under ancient arched brick ceilings, brass lanterns glowing over colorful spice mounds.",
            imageFile: "episodes/the-silk-road-cipher/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Maya spots the courier carrying a distinctive leather tube case.",
            imagePrompt: "Comic page panel 2. Maya spotting a man in a dark trench coat slipping through the rug merchant crowd with an antique leather scroll cylinder.",
            imageFile: "episodes/the-silk-road-cipher/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A high-speed foot chase across the tiled rooftops overlooking the Hagia Sophia.",
            imagePrompt: "Comic page panel 3. Dynamic pursuit across the terracotta roof tiles of Istanbul, domes of Hagia Sophia silhouetted against sunset.",
            imageFile: "episodes/the-silk-road-cipher/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The courier trips and drops the case into an open pigeon loft.",
            imagePrompt: "Comic page panel 4. The courier tumbling into a rooftop dovecote as hundreds of white pigeons erupt into the sky, the case rolling across the ledge.",
            imageFile: "episodes/the-silk-road-cipher/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Golden Folio",
        slug: "chapter-3-the-golden-folio",
        synopsis: "Recovering the manuscript and deciphering its hidden cartographic secret.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Maya catches the leather tube just before it rolls off the roof edge.",
            imagePrompt: "Comic page panel 1. Maya sliding on her knees and catching the leather cylinder inches before it plunges off the five-story cornice.",
            imageFile: "episodes/the-silk-road-cipher/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Unrolling the ancient silk in the sanctuary of a quiet library.",
            imagePrompt: "Comic page panel 2. Unrolling the intact golden silk manuscript under daylight, exquisite gold calligraphy and turquoise painted horses revealed.",
            imageFile: "episodes/the-silk-road-cipher/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Holding the silk to the light reveals a secret watermarked map of the lost city of Otrar.",
            imagePrompt: "Comic page panel 3. Backlighting the translucent silk to reveal faint hidden watermarked geometric lines of an ancient lost Silk Road oasis.",
            imageFile: "episodes/the-silk-road-cipher/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Maya smiles, booking her next train ticket to Central Asia.",
            imagePrompt: "Comic page panel 4. Ending panel. Maya closing her passport with a confident smile at the station platform, ready for the expedition ahead.",
            imageFile: "episodes/the-silk-road-cipher/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 50. Supernatural (Individual)
  {
    id: "series-50",
    batchNumber: 5,
    slug: "grimoire-of-the-lost-hours",
    title: "Grimoire of the Lost Hours",
    synopsis:
      "Inside the clocktower museum of Edinburgh, an apprentice horologist discovers that the leap seconds and lost minutes shaved off the calendar year don't vanish—they accumulate into a phantom 25th hour every night where the dead walk freely.",
    genre: "Supernatural",
    format: "page",
    ownerType: "individual",
    ownerRef: "lucas_valerio",
    credits: [
      { roleCategory: "writer", creatorUsername: "lucas_valerio" },
      { roleCategory: "artist", creatorUsername: "clara_thorne" },
      { roleCategory: "editor", creatorUsername: "hannah_lindqvist" },
    ],
    artStyle: "Gothic horological dark fantasy, ticking bronze gears, floating Roman numerals, glowing cyan spectral hours, and midnight shadows.",
    characters: [
      {
        name: "Eamon Bell",
        role: "Protagonist",
        visualDescription: "24-year-old museum watchmaker with silver pocket watch, wire spectacles, tweed vest, dark ink-stained fingers, watchful amber eyes.",
        palette: ["#0D1B2A", "#1B263B", "#415A77", "#778DA9"],
      },
    ],
    coverPrompt:
      "Stunning supernatural comic cover for 'Grimoire of the Lost Hours'. Eamon Bell standing inside a massive clock face whose Roman numerals are detaching and floating in glowing cyan spirit energy while phantom figures step through the clock glass into the midnight room.",
    coverFile: "covers/grimoire-of-the-lost-hours.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The 25th Hour",
        slug: "chapter-1-the-25th-hour",
        synopsis: "The clock strikes 12:00:60 and time freezes completely.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Massive clocktower room filled with hundreds of ticking pendulum clocks.",
            imagePrompt: "Supernatural comic page panel 1. Towering vaulted museum filled with hundreds of antique grandfather clocks, brass gears, and swinging pendulums.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The minute hands reach twelve, but instead of striking one, the hands click backward to an unnumbered Roman numeral 'XIII'.",
            imagePrompt: "Comic page panel 2. Close up on clock dial. The minute hand clicking backward into a secret glowing cyan numeral 'XIII' on the brass dial.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Outside the frosted window, falling raindrops freeze motionless in mid-air.",
            imagePrompt: "Comic page panel 3. Looking out the Gothic window: raindrops frozen in mid-air like glass beads, streetcars frozen mid-intersection below.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The museum doors swing open; a gathering of historical ghosts in evening wear step inside to borrow time.",
            imagePrompt: "Comic page panel 4. Spectral figures from the 18th and 19th centuries stepping into the clock room, glowing with ethereal cyan starlight.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Borrowing Seconds",
        slug: "chapter-2-borrowing-seconds",
        synopsis: "Eamon learns how to repair memories using clockwork escapements.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A gentle phantom poet approaches Eamon holding an empty brass hourglass.",
            imagePrompt: "Comic page panel 1. A translucent Victorian poet holding out an empty brass hourglass: 'May I borrow three minutes to finish my last verse?'",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Eamon winds an ancient chronometer, pouring glowing golden sand into the hourglass.",
            imagePrompt: "Comic page panel 2. Eamon turning a tiny key on a chronometer, glowing golden sands of time pouring magically into the poet's hourglass.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A shadow reaper creature with shears appears in the rafters to steal the accumulated time.",
            imagePrompt: "Comic page panel 3. Ominous shadow beast made of broken watch springs and iron shears lunging down from the dark ceiling beams.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Eamon raises his master tuning fork, striking it to create a concussive chime.",
            imagePrompt: "Comic page panel 4. Eamon striking a massive silver acoustic tuning fork, the harmonic chime blasting the shadow creature into dust.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Bell Resumes",
        slug: "chapter-3-the-bell-resumes",
        synopsis: "The 25th hour concludes and normal time returns.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The poet finishes writing the final stanza with a radiant peaceful smile.",
            imagePrompt: "Comic page panel 1. The poet writing the final rhyming couplet on parchment, glowing with golden satisfaction before bowing in gratitude.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The clocks begin whirring in synchronized motion as the 25th hour slips away.",
            imagePrompt: "Comic page panel 2. Hundreds of clock hands clicking forward smoothly from 'XIII' to 'I' as the cyan spectral light fades into dawn.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The frozen raindrops fall, splashing on the stone windowsill.",
            imagePrompt: "Comic page panel 3. The suspended raindrops suddenly plunging down in a gentle splash, the city below resuming its normal morning hum.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Eamon locks his pocket watch with a quiet smile, ready for tomorrow's extra hour.",
            imagePrompt: "Comic page panel 4. Ending panel. Eamon snapping his silver pocket watch shut, tucking it into his vest as morning sun streams through the clock glass.",
            imageFile: "episodes/grimoire-of-the-lost-hours/ep3_p4.png",
          },
        ],
      },
    ],
  },
];
