import type { SeriesManifest } from "../../types.ts";

export const BATCH_3_SERIES: SeriesManifest[] = [
  // 21. Action (Individual)
  {
    id: "series-21",
    batchNumber: 3,
    slug: "solar-apex-iron-vanguard",
    title: "Solar Apex: Iron Vanguard",
    synopsis:
      "When rogue orbital drop-ships assault the equatorial orbital tether above Lagos, Commander Adebayo pilots the experimental bipedal mech 'Solar Apex' in high-altitude freefall combat.",
    genre: "Action",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "sam_okoro",
    credits: [
      { roleCategory: "writer", creatorUsername: "sam_okoro" },
      { roleCategory: "artist", creatorUsername: "sam_okoro" },
      { roleCategory: "colorist", creatorUsername: "jin_woo_park" },
    ],
    artStyle: "Afrofuturistic mecha action, blazing solar orange thrusters, polished bronze armor plates, and kinetic freefall velocity.",
    characters: [
      {
        name: "Commander Kofi Adebayo",
        role: "Protagonist",
        visualDescription: "30-year-old ace mech pilot with short dreadlock fade, orange neural flight suit, focused eagle gaze.",
        palette: ["#F77F00", "#003049", "#D62828", "#EAE2B7"],
      },
    ],
    coverPrompt:
      "Explosive mecha action comic cover for 'Solar Apex: Iron Vanguard'. Giant bronze and cobalt mech Solar Apex diving through the upper atmosphere above the shining solar panels of Lagos, firing energy cannons at enemy drop pods.",
    coverFile: "covers/solar-apex-iron-vanguard.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Freefall Deployment",
        slug: "chapter-1-freefall-deployment",
        synopsis: "Dropping from orbital altitude into the stratosphere at Mach 5.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Mech launch bay opening above the curving blue horizon of Earth.",
            imagePrompt: "Vertical scroll panel. Mech hangar bay doors opening in low Earth orbit, revealing the curvature of Africa below in brilliant daylight.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Solar Apex launching into the void with roaring orange plasma thrusters.",
            imagePrompt: "Vertical scroll panel. The massive bipedal mech launching feet-first into space, giant plasma thrusters blazing vivid amber flame.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Re-entry heat shield glowing white-hot as atmospheric friction begins.",
            imagePrompt: "Vertical scroll panel. Mech entering the upper atmosphere, aerodynamic shields glowing cherry red with burning re-entry fire.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Cockpit HUD displays: three hostile combat drones locking missile telemetry.",
            imagePrompt: "Vertical scroll panel. Inside cockpit: Kofi gripping control flight sticks, holographic HUD flashing red warning lock-ons.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Supersonic Intercept",
        slug: "chapter-2-supersonic-intercept",
        synopsis: "Engaging enemy fighter craft through dense storm clouds.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Solar Apex deploys twin thermal blades, slicing through the first enemy drone in mid-air.",
            imagePrompt: "Vertical scroll panel. High-speed action. Mech drawing twin glowing thermal blades and cleaving an enemy fighter in half amidst thunderstorm clouds.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Dodging a barrage of seeker missiles with a high-G barrel roll.",
            imagePrompt: "Vertical scroll panel. The mech executing a spiraling evasive barrel roll, missile smoke trails spiraling past its armored shoulders.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kofi charges the chest-mounted solar beam cannon.",
            imagePrompt: "Vertical scroll panel. Mech's chest armor plates sliding apart to reveal a glowing golden solar energy core charging with blinding power.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "A massive beam of golden laser incinerates the enemy command carrier.",
            imagePrompt: "Vertical scroll panel. Epic beam release. A titanic golden laser beam piercing through storm clouds, obliterating an enemy drop cruiser.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Tether Defense",
        slug: "chapter-3-tether-defense",
        synopsis: "Landing on the orbital elevator platform to protect the civilian evacuees.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The space elevator cable stretching tens of thousands of kilometers into the sky.",
            imagePrompt: "Vertical scroll panel. Titanic carbon-nanotube space elevator cable stretching from ocean platform into the stars.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Solar Apex executing a retro-thruster landing on the oceanic gantry.",
            imagePrompt: "Vertical scroll panel. Mech landing with thunderous force on the floating sea platform, water spraying in colossal tidal waves.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The remaining enemy forces retreat into orbit, unable to breach the defense.",
            imagePrompt: "Vertical scroll panel. Enemy surviving gunships turning tail and fleeing back into the upper atmosphere.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Kofi pops his cockpit hatch, looking out at the cheering dock workers as the sunset glows over Lagos.",
            imagePrompt: "Vertical scroll panel ending. Kofi standing atop the mech's shoulder, helmet off, waving to workers as the African sunset paints the sky in gold and crimson.",
            imageFile: "episodes/solar-apex-iron-vanguard/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 22. Fantasy (Individual)
  {
    id: "series-22",
    batchNumber: 3,
    slug: "heir-of-the-ashen-crown",
    title: "Heir of the Ashen Crown",
    synopsis:
      "When the High Sun Kingdom falls to a curse of petrifying ash, the exiled royal shieldbearer must guide the young prince through monster-infested volcanic barrens to reach the sacred Cleansing Spring.",
    genre: "Fantasy",
    format: "page",
    ownerType: "individual",
    ownerRef: "marcus_kane",
    credits: [
      { roleCategory: "writer", creatorUsername: "marcus_kane" },
      { roleCategory: "artist", creatorUsername: "marcus_kane" },
      { roleCategory: "letterer", creatorUsername: "rowan_macleod" },
    ],
    artStyle: "Dark high fantasy, volcanic ash snow, molten orange lava cracks, and weathered knight armor.",
    characters: [
      {
        name: "Sir Gareth Vance",
        role: "Protagonist",
        visualDescription: "Veteran 40-year-old knight in blackened plate armor with notched steel heater shield and greying temples.",
        palette: ["#264653", "#2A9D8F", "#E76F51", "#22223B"],
      },
    ],
    coverPrompt:
      "Grim fantasy comic cover for 'Heir of the Ashen Crown'. Sir Gareth raising his scarred heater shield against a blast of volcanic dragon fire, protecting the young prince huddled behind him amidst ruined ash-covered stone ruins.",
    coverFile: "covers/heir-of-the-ashen-crown.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Ash Falls",
        slug: "chapter-1-the-ash-falls",
        synopsis: "The royal palace turns to stone as gray volcanic ash begins blanketing the kingdom.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Grand golden throne room freezing into petrified gray stone statues.",
            imagePrompt: "Fantasy comic page panel 1. Majestic palace throne room being overtaken by a wave of petrifying gray stone ash, guards and courtiers turned to statues.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Gareth scoops up 8-year-old Prince Valen, wrapping him in his heavy wolf-fur cloak.",
            imagePrompt: "Comic page panel 2. Gareth grabbing the terrified young prince, wrapping him securely in a wool-lined cape as ash rains down.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Shattering the stained-glass window to escape the collapsing castle tower.",
            imagePrompt: "Comic page panel 3. Gareth using his heavy shield to shatter an ornate colored-glass window, diving into the courtyard below.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Looking back at the capital city: an endless sea of silent gray stone spires.",
            imagePrompt: "Comic page panel 4. Tragic wide panel. Looking back from the ridge at the once-golden capital city now completely frozen in silent gray ash.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Obsidian Wastes",
        slug: "chapter-2-the-obsidian-wastes",
        synopsis: "Crossing the volcanic wasteland hunted by cinder hounds.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Gareth and the prince trudging through ankle-deep gray ash under an eclipsed red sun.",
            imagePrompt: "Comic page panel 1. Lonely figures walking across a desolate landscape of jagged black obsidian glass and falling gray ash under a dark red eclipsed sun.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A pack of cinder hounds with glowing ember ribcages stalks them along the ridge.",
            imagePrompt: "Comic page panel 2. Pack of demonic quadruped beasts made of volcanic rock and glowing orange internal fire pacing along a black basalt ridge.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Gareth plants his shield in the ash and draws his broadsword with steady courage.",
            imagePrompt: "Comic page panel 3. Gareth standing firm before the snarling beasts, sword raised high with legendary resolve, protecting the boy.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The prince's hands begin to glow with dormant royal solar magic.",
            imagePrompt: "Comic page panel 4. Close up. Young Prince Valen extending his small hands, a blazing golden sunburst erupting from his palms to blind the beasts.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Living Spring",
        slug: "chapter-3-the-living-spring",
        synopsis: "Reaching the hidden oasis where the ash cannot touch the water.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A hidden valley sanctuary filled with blooming emerald moss and crystalline blue springs.",
            imagePrompt: "Comic page panel 1. Breathtaking paradise valley shielded by giant ancient weeping willow trees, crystal-clear turquoise springs bubbling.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Valen dips his hands into the spring, washing away the gray ash stains.",
            imagePrompt: "Comic page panel 2. The prince kneeling by the pure water pool, water ripples washing away the soot and lighting up with healing golden sparks.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A legendary water spirit offers Gareth an unblemished royal blade forged of living crystal.",
            imagePrompt: "Comic page panel 3. A luminous water nymph rising from the spring pool, presenting an exquisite radiant crystalline sword to Gareth.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Gareth kneels before the young prince, ready to march back and reclaim the realm.",
            imagePrompt: "Comic page panel 4. Ending panel. Sir Gareth kneeling on one knee before Prince Valen, swearing an oath of restoration under the sunbeams.",
            imageFile: "episodes/heir-of-the-ashen-crown/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 23. Sci-Fi (Studio: Neon District)
  {
    id: "series-23",
    batchNumber: 3,
    slug: "chrono-fracture-2099",
    title: "Chrono-Fracture 2099",
    synopsis:
      "When temporal research reactor 'Chronos-01' ruptures above New Singapore, fragments of the 1920s, 2099, and the 24th century collide into a fractured city where crossing the street means traveling three hundred years.",
    genre: "Sci-Fi",
    format: "scroll",
    ownerType: "studio",
    ownerRef: "neon-district-collective",
    credits: [
      { roleCategory: "writer", creatorUsername: "elena_vance" },
      { roleCategory: "artist", creatorUsername: "elena_vance" },
      { roleCategory: "colorist", creatorUsername: "sam_okoro" },
    ],
    artStyle: "Temporal glitch aesthetics, juxtaposed historical and futuristic architecture, fractured chromatic aberration, and neon cyberpunk vibrancy.",
    characters: [
      {
        name: "Jaxson Chen",
        role: "Protagonist",
        visualDescription: "27-year-old temporal anomaly technician wearing a chronal anchor harness, pocket quantum watch, and holographic goggles.",
        palette: ["#7209B7", "#3F37C9", "#4CC9F0", "#F72585"],
      },
    ],
    coverPrompt:
      "Mind-bending sci-fi comic cover for 'Chrono-Fracture 2099'. Jaxson Chen standing at a shattered street intersection where the left half is 1920s vintage brick with steam cars and the right half is towering neon glass skyscrapers with flying speeders.",
    coverFile: "covers/chrono-fracture-2099.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Split Second",
        slug: "chapter-1-the-split-second",
        synopsis: "The reactor detonation splits the downtown core into temporal puzzle pieces.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Giant orbital research ring shattering above the city skyline in a pulse of purple chronal light.",
            imagePrompt: "Vertical scroll panel. Massive orbital ring station exploding in a blinding sphere of violet tachyon energy above futuristic Singapore.",
            imageFile: "episodes/chrono-fracture-2099/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The shockwave hits downtown, instantly transforming half a skyscraper into a Victorian brick clocktower.",
            imagePrompt: "Vertical scroll panel. Shockwave ripping through buildings, half of a glass skyscraper morphing in a purple glitch into vintage brick and copper.",
            imageFile: "episodes/chrono-fracture-2099/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Jaxson activates his chronal anchor harness, locking his body to the present year.",
            imagePrompt: "Vertical scroll panel. Jaxson slamming the central dial on his chest rig, a protective blue holographic energy shield encasing his body.",
            imageFile: "episodes/chrono-fracture-2099/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "He looks across the road: a 1920s tram car is stopped next to a hovering autonomous delivery pod.",
            imagePrompt: "Vertical scroll panel reveal. Bizarre reality clash. A vintage green streetcar and modern flying taxi frozen side by side in the middle of the street.",
            imageFile: "episodes/chrono-fracture-2099/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Paradox Loop",
        slug: "chapter-2-the-paradox-loop",
        synopsis: "Getting trapped inside a five-minute loop inside the central bank plaza.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Jaxson steps into the central plaza and notices the same cup of coffee spilling three times.",
            imagePrompt: "Vertical scroll panel. Jaxson noticing a paper coffee cup falling and spilling, then rewinding backwards into a patron's hand in an endless loop.",
            imageFile: "episodes/chrono-fracture-2099/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A future version of himself taps his shoulder: 'Don't turn left at the fountain.'",
            imagePrompt: "Vertical scroll panel. Jaxson turning around to face an older scarred version of himself holding a severed temporal cable.",
            imageFile: "episodes/chrono-fracture-2099/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A predatory chronal rift beast made of spinning clock hands appears at the fountain.",
            imagePrompt: "Vertical scroll panel. Terrifying anomaly. A swirling vortex beast composed of spinning gear wheels and razor-sharp brass clock hands lunging forward.",
            imageFile: "episodes/chrono-fracture-2099/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Both Jaxsons fire their tachyon tethers simultaneously to pin the beast in time.",
            imagePrompt: "Vertical scroll panel. Both past and future Jaxsons firing twin cyan energy grappling cables that freeze the clock-beast in a solid stasis block.",
            imageFile: "episodes/chrono-fracture-2099/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Re-Weaving the Web",
        slug: "chapter-3-re-weaving-the-web",
        synopsis: "Reaching the central reactor core to initiate the chronal stitching sequence.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Climbing the fractured tower where gravity fluctuates between horizontal and vertical.",
            imagePrompt: "Vertical scroll panel. Jaxson running up the side of a glass building where gravity shifts 90 degrees, neon cars falling into the sky.",
            imageFile: "episodes/chrono-fracture-2099/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Reaching the core chamber: a spinning kaleidoscope of historical moments.",
            imagePrompt: "Vertical scroll panel. Chamber containing a swirling tachyon singularity reflecting dozens of historical eras in floating glass shards.",
            imageFile: "episodes/chrono-fracture-2099/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Jaxson inserts the master stabilizer key, reversing the chronal expansion.",
            imagePrompt: "Vertical scroll panel. Jaxson locking a glowing gold stabilizer core into the socket, sending rings of harmonic blue light through the city.",
            imageFile: "episodes/chrono-fracture-2099/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The fractures stitch together smoothly, leaving the city whole under a calm starlit sky.",
            imagePrompt: "Vertical scroll panel ending. The Singapore skyline snapping back into alignment, peaceful calm neon city reflecting off the quiet marina water.",
            imageFile: "episodes/chrono-fracture-2099/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 24. Romance (Individual)
  {
    id: "series-24",
    batchNumber: 3,
    slug: "letters-from-the-riviera",
    title: "Letters from the Riviera",
    synopsis:
      "In 1964 coastal Nice, a talented vintage automobile mechanic and an aristocratic Italian travel writer bond over the restoration of an abandoned 1955 Alfa Romeo Giulietta Spider.",
    genre: "Romance",
    format: "page",
    ownerType: "individual",
    ownerRef: "soraya_mirza",
    credits: [
      { roleCategory: "writer", creatorUsername: "soraya_mirza" },
      { roleCategory: "artist", creatorUsername: "chloe_dupont" },
      { roleCategory: "editor", creatorUsername: "aiko_takahashi" },
    ],
    artStyle: "Mid-century Riviera glamor, sun-drenched azure Mediterranean water, vintage sports cars, and warm 1960s film grain.",
    characters: [
      {
        name: "Lucie Fontaine",
        role: "Protagonist",
        visualDescription: "24-year-old French mechanic with tousled auburn curls, oil-stained cream mechanic overalls, confident charismatic smile.",
        palette: ["#E76F51", "#2A9D8F", "#E9C46A", "#264653"],
      },
    ],
    coverPrompt:
      "Sun-drenched vintage romance comic cover for 'Letters from the Riviera'. Lucie and handsome Italian writer Matteo driving an open-top red vintage Alfa Romeo along the scenic cliffside coastal road overlooking the turquoise Mediterranean in summer 1964.",
    coverFile: "covers/letters-from-the-riviera.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Dusty Garage in Nice",
        slug: "chapter-1-the-dusty-garage-in-nice",
        synopsis: "An aristocratic visitor brings a legendary barn find into Lucie's shop.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Sunlit garage on the French Riviera, Mediterranean blue sea visible through the open double doors.",
            imagePrompt: "Vintage comic page panel 1. Sun-drenched open-air auto garage in Nice with olive trees outside, sea breeze rustling canvas awnings.",
            imageFile: "episodes/letters-from-the-riviera/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A flatbed truck delivering a dusty, neglected cherry-red vintage convertible sports car.",
            imagePrompt: "Comic page panel 2. A dusty 1955 Alfa Romeo roadster being rolled into the garage, paint faded but timeless curves intact.",
            imageFile: "episodes/letters-from-the-riviera/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Matteo steps down from the passenger seat in a tailored linen suit, offering his hand.",
            imagePrompt: "Comic page panel 3. Matteo stepping out in sunglasses and tailored Italian beige suit, charming warm smile on his face.",
            imageFile: "episodes/letters-from-the-riviera/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Lucie wipes her greasy hands on a rag and smirks: 'You found a masterpiece, signore.'",
            imagePrompt: "Comic page panel 4. Lucie smiling confidently with wrench in hand, eyes sparkling with passion for the classic engine.",
            imageFile: "episodes/letters-from-the-riviera/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Tuning the Carburetors",
        slug: "chapter-2-tuning-the-carburetors",
        synopsis: "Working late into the evening while sharing espresso and stories.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Lucie teaching Matteo how to hold an adjustable spanner over the dual Weber carburetors.",
            imagePrompt: "Comic page panel 1. Lucie guiding Matteo's hand over the twin carburetors, their shoulders touching over the open engine bay.",
            imageFile: "episodes/letters-from-the-riviera/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Evening falls; jazz music plays from an old vacuum tube radio on the workbench.",
            imagePrompt: "Comic page panel 2. Warm twilight in the garage, portable transistor radio playing, empty espresso cups on the tool cart.",
            imageFile: "episodes/letters-from-the-riviera/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "They turn the ignition key: the engine roars to life with a throaty Italian exhaust note.",
            imagePrompt: "Comic page panel 3. The red car vibrating with power, clean exhaust smoke curling as the engine purrs like a lion.",
            imageFile: "episodes/letters-from-the-riviera/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Lucie and Matteo cheer, turning to each other and sharing an electric, breathless gaze.",
            imagePrompt: "Comic page panel 4. Both cheering in triumph, suddenly locking eyes inches apart, laughter turning into soft romantic tension.",
            imageFile: "episodes/letters-from-the-riviera/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Grande Corniche Drive",
        slug: "chapter-3-the-grande-corniche-drive",
        synopsis: "The maiden test drive along the winding high cliffs to Monaco.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The polished red sports car speeding along the famous cliffside Corniche highway at sunset.",
            imagePrompt: "Comic page panel 1. Sleek cherry-red roadster hugging a scenic mountain curve overlooking the golden glittering Mediterranean Sea.",
            imageFile: "episodes/letters-from-the-riviera/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Lucie at the wheel, hair blowing in the sea wind, laughing with complete joy.",
            imagePrompt: "Comic page panel 2. Lucie driving with effortless mastery, silk scarf trailing in the coastal breeze, pure exhilaration on her face.",
            imageFile: "episodes/letters-from-the-riviera/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Pulling over at a scenic cliffside lookout overlooking the twinkling harbor lights of Nice.",
            imagePrompt: "Comic page panel 3. The car parked at a stone balustrade overlook, the lights of Nice and luxury yachts twinkling in the bay below.",
            imageFile: "episodes/letters-from-the-riviera/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Matteo takes Lucie's hand under the starlit sky: 'I don't think I'll be returning to Rome after all.'",
            imagePrompt: "Comic page panel 4. Ending panel. Matteo and Lucie leaning against the car hood, hands entwined under the starry Riviera night sky.",
            imageFile: "episodes/letters-from-the-riviera/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 25. Horror (Studio: Velvet Crow)
  {
    id: "series-25",
    batchNumber: 3,
    slug: "the-black-lighthouse",
    title: "The Black Lighthouse",
    synopsis:
      "Perched on an isolated storm-lashed sea rock in the North Atlantic, three lighthouse keepers find their lantern beam penetrating a dense ocean trench where bioluminescent horrors begin crawling up the iron stairs.",
    genre: "Horror",
    format: "page",
    ownerType: "studio",
    ownerRef: "velvet-crow-press",
    credits: [
      { roleCategory: "writer", creatorUsername: "clara_thorne" },
      { roleCategory: "artist", creatorUsername: "clara_thorne" },
      { roleCategory: "editor", creatorUsername: "hannah_lindqvist" },
    ],
    artStyle: "Deep nautical horror, cyclopean stone architecture, blinding Fresnel lighthouse beams cutting pitch darkness, and deep-sea monstrosities.",
    characters: [
      {
        name: "Keeper Donald Campbell",
        role: "Protagonist",
        visualDescription: "50-year-old Scottish lighthouse keeper with thick beard, heavy oilskin slicker coat, iron flare gun, haunted observant eyes.",
        palette: ["#03071E", "#370617", "#6A040F", "#FFBA08"],
      },
    ],
    coverPrompt:
      "Terrifying nautical horror comic cover for 'The Black Lighthouse'. Colossal black granite lighthouse being battered by monstrous fifty-foot ocean waves under midnight storm clouds, its rotating yellow beam illuminating tentacled horrors scaling the wet rocks.",
    coverFile: "covers/the-black-lighthouse.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Dead Tide",
        slug: "chapter-1-the-dead-tide",
        synopsis: "The ocean goes eerily flat and black right before the storm of the century hits.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Imposing black granite lighthouse tower rising from a jagged sea rock surrounded by boiling waves.",
            imagePrompt: "Horror comic page panel 1. Monolithic black stone lighthouse perched on a razor-sharp sea stack in a raging North Atlantic storm.",
            imageFile: "episodes/the-black-lighthouse/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Campbell cranking the heavy clockwork weights that rotate the giant glass Fresnel lens.",
            imagePrompt: "Comic page panel 2. Campbell winding the brass clockwork winch inside the lantern room, the gigantic tiered glass Fresnel lens casting rotating yellow beams.",
            imageFile: "episodes/the-black-lighthouse/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The rotating light beam sweeps across the black water, revealing thousands of pale eyes looking up.",
            imagePrompt: "Comic page panel 3. The lighthouse beam cutting through the ocean swells, revealing thousands of pale glowing bioluminescent eyes staring up from beneath the waves.",
            imageFile: "episodes/the-black-lighthouse/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "A wet, webbed claw slams against the outside glass of the lantern gallery eighty feet up.",
            imagePrompt: "Comic page panel 4. Shock jump-scare panel. A massive glistening clawed appendage covered in barnacles and bioluminescent slime slamming against the glass pane.",
            imageFile: "episodes/the-black-lighthouse/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Breach at the Lower Gallery",
        slug: "chapter-2-breach-at-the-lower-gallery",
        synopsis: "The bottom iron blast doors are ripped open by the deep sea tide.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Sea water flooding up the spiral granite stairs as the bottom hatch buckles.",
            imagePrompt: "Comic page panel 1. Foaming seawater roaring up the winding stone stairs of the lighthouse tower, washing away wooden barrels and lantern oil cans.",
            imageFile: "episodes/the-black-lighthouse/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Campbell and young assistant Thomas barricading the engine room door with iron bars.",
            imagePrompt: "Comic page panel 2. Campbell and his assistant frantically dropping heavy iron bars across the reinforced oak hatch as heavy impacts pound against the wood.",
            imageFile: "episodes/the-black-lighthouse/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A haunting subsonic hum vibrates through the stone walls, shaking dust from the mortar.",
            imagePrompt: "Comic page panel 3. The granite walls vibrating, mortar crumbling into dust as an ancient oceanic leviathan voice resonates through the stone.",
            imageFile: "episodes/the-black-lighthouse/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Thomas looks through the keyhole and his eyes turn completely pitch black.",
            imagePrompt: "Comic page panel 4. Thomas peering through the brass keyhole; in the next second turning around with pupil-less black eyes and an empty, chilling smile.",
            imageFile: "episodes/the-black-lighthouse/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Burner's Last Light",
        slug: "chapter-3-the-burners-last-light",
        synopsis: "Overloading the kerosene burner to create a blinding flash that drives the darkness back.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Campbell retreats to the top lantern room, locking the floor hatch behind him.",
            imagePrompt: "Comic page panel 1. Campbell locking the final trapdoor in the top glass lantern room, clutching an iron wrench and flare gun.",
            imageFile: "episodes/the-black-lighthouse/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "He opens the pressurized kerosene valve directly into the open burner flame.",
            imagePrompt: "Comic page panel 2. Campbell wrenching open the brass fuel bypass valve, pressurized white kerosene hissing into the massive lantern mantle.",
            imageFile: "episodes/the-black-lighthouse/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "A thermonuclear brilliance of pure white light erupts from the Fresnel lens.",
            imagePrompt: "Comic page panel 3. Blinding white explosive radiance erupting from the lighthouse top, searing the surrounding storm clouds into brilliant daylight.",
            imageFile: "episodes/the-black-lighthouse/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The sea beasts shriek and plunge into the abyss as dawn breaks on the quiet sea.",
            imagePrompt: "Comic page panel 4. Ending panel. The deep-sea horrors dissolving back into the ocean depths, morning sun rising peacefully over calm blue waters around the smoking tower.",
            imageFile: "episodes/the-black-lighthouse/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 26. Comedy (Individual)
  {
    id: "series-26",
    batchNumber: 3,
    slug: "dungeon-intern",
    title: "Dungeon Intern",
    synopsis:
      "College senior Kevin takes an unpaid corporate internship at 'Brimstone & Associates: Dark Citadel LLC', only to discover his job is filing OSHA compliance paperwork for spiked pit traps and scheduling coffee breaks for fire elementals.",
    genre: "Comedy",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "felix_castillo",
    credits: [
      { roleCategory: "writer", creatorUsername: "felix_castillo" },
      { roleCategory: "artist", creatorUsername: "devon_reed" },
      { roleCategory: "letterer", creatorUsername: "felix_castillo" },
    ],
    artStyle: "Vibrant workplace satire cartoon, humorous dungeon schematics, corporate jargon parodies, and expressive comedic characters.",
    characters: [
      {
        name: "Kevin Miller",
        role: "Protagonist",
        visualDescription: "21-year-old college intern with oversized glasses, clip-on tie over short-sleeve shirt, clipboard, permanent look of bewilderment.",
        palette: ["#3A86FF", "#8338EC", "#FF006E", "#FB5607"],
      },
    ],
    coverPrompt:
      "Hilarious workplace comedy comic cover for 'Dungeon Intern'. Kevin the intern in short-sleeved shirt and tie holding a clipboard while asking a terrifying twelve-foot fire-breathing balrog to sign an expense report.",
    coverFile: "covers/dungeon-intern.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Orientation in the Pit",
        slug: "chapter-1-orientation-in-the-pit",
        synopsis: "Kevin's first day at HR includes signing away his immortal soul in triplicate.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Corporate office cubicles built inside a volcanic subterranean cavern with stalactites.",
            imagePrompt: "Cartoon webcomic panel. Gray corporate cubicle farm built directly inside a glowing lava cavern with stalactites and water coolers.",
            imageFile: "episodes/dungeon-intern/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "HR representative Ms. Grendel (a three-headed hydra in reading glasses) handing him a stack of forms.",
            imagePrompt: "Cartoon webcomic panel. A three-headed swamp hydra wearing reading glasses handing a three-foot-tall stack of legal paperwork across a reception desk.",
            imageFile: "episodes/dungeon-intern/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kevin reads the employee handbook: 'Casual Fridays do NOT permit uncursing coworkers.'",
            imagePrompt: "Cartoon webcomic panel. Close up on glossy employee handbook: 'Section 4: Do not feed adventuring parties after midnight. Violators will be demoted to mimic status.'",
            imageFile: "episodes/dungeon-intern/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "A dungeon alarm screams: 'INTRUDER ALERT! PALADIN IN THE BREAKROOM!'",
            imagePrompt: "Cartoon webcomic panel. Red siren lights spinning as Kevin sighs, pulls out his ballpoint pen, and heads to handle the customer dispute.",
            imageFile: "episodes/dungeon-intern/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Health & Safety Audit",
        slug: "chapter-2-the-health-and-safety-audit",
        synopsis: "Making sure the swinging blade pendulum traps meet modern municipal safety codes.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Kevin with yellow hard hat inspecting a razor-sharp rusty swinging pendulum blade.",
            imagePrompt: "Cartoon webcomic panel. Kevin in high-vis safety vest and yellow hard hat inspecting a giant rusty swinging axe blade with a tape measure.",
            imageFile: "episodes/dungeon-intern/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "He tells the skeleton trap engineer: 'You need a handrail here or OSHA will shut down Level 3.'",
            imagePrompt: "Cartoon webcomic panel. Kevin pointing to a bubbling pit of acid while a skeleton worker in overalls takes notes on a clipboard.",
            imageFile: "episodes/dungeon-intern/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The skeleton engineer nods solemnly: 'The union will be very pleased with these ergonomics.'",
            imagePrompt: "Cartoon webcomic panel. The skeleton engineer giving a thumbs up with his bony hand while sipping cold coffee through his teeth.",
            imageFile: "episodes/dungeon-intern/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "An adventuring party steps into the room and immediately gets stuck in the wet cement.",
            imagePrompt: "Cartoon webcomic panel. An armored knight and wizard walking into the hallway and stepping into fresh wet cement with yellow 'CAUTION: WET FLOOR' cones.",
            imageFile: "episodes/dungeon-intern/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Performance Review",
        slug: "chapter-3-the-performance-review",
        synopsis: "The Dungeon Master reviews Kevin's quarterly contributions.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Dark Lord Mordred sitting behind a giant obsidian executive desk with a laser pointer.",
            imagePrompt: "Cartoon webcomic panel. Dark Lord in horned armor sitting behind an executive mahogany desk, pointing at a PowerPoint graph showing 'Adventurer Casualties: +14%'.",
            imageFile: "episodes/dungeon-intern/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Mordred reviews Kevin's spreadsheet: 'Your trap maintenance budget cut our operating costs by 20%.'",
            imagePrompt: "Cartoon webcomic panel. The terrifying demon lord adjusting reading spectacles, impressed by Kevin's colorful color-coded Excel spreadsheet.",
            imageFile: "episodes/dungeon-intern/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kevin receives his reward: a coffee mug that says '#1 Dark Minion'.",
            imagePrompt: "Cartoon webcomic panel. Mordred handing Kevin a ceramic mug that says '#1 Minion' with little red skulls, Kevin smiling genuinely.",
            imageFile: "episodes/dungeon-intern/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Kevin takes a sip: 'Best internship ever.'",
            imagePrompt: "Cartoon webcomic panel ending. Kevin sitting at his desk happily typing on his laptop while a friendly goblin brings him a glazed donut.",
            imageFile: "episodes/dungeon-intern/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 27. Drama (Individual)
  {
    id: "series-27",
    batchNumber: 3,
    slug: "atelier-st-germain",
    title: "Atelier St. Germain",
    synopsis:
      "In 1920s Montparnasse, an ambitious portraitist from provincial Normandy and a radical avant-garde sculptor share a freezing attic studio, clashing over the definition of art while fighting poverty and the Paris salon elite.",
    genre: "Drama",
    format: "page",
    ownerType: "individual",
    ownerRef: "chloe_dupont",
    credits: [
      { roleCategory: "writer", creatorUsername: "chloe_dupont" },
      { roleCategory: "artist", creatorUsername: "chloe_dupont" },
      { roleCategory: "editor", creatorUsername: "soraya_mirza" },
    ],
    artStyle: "Rich oil-paint impressionism, Parisian bohemian garret light, turpentine bottles, canvas textures, and period drama.",
    characters: [
      {
        name: "Camille Moreau",
        role: "Protagonist",
        visualDescription: "23-year-old painter with sharp green eyes, dark curly hair tied back, paint-crusted smock, charcoal-stained fingers.",
        palette: ["#1F2421", "#216869", "#49A078", "#9CC5A1"],
      },
    ],
    coverPrompt:
      "Evocative bohemian drama comic cover for 'Atelier St. Germain'. Camille Moreau standing before an easel in a freezing Paris garret studio, palette in hand, looking out a large slanted skylight window at the snowy zinc rooftops of Montparnasse in 1922.",
    coverFile: "covers/atelier-st-germain.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Zinc Rooftops in Winter",
        slug: "chapter-1-zinc-rooftops-in-winter",
        synopsis: "Surviving the coldest winter in decades on coffee and burning sketchbooks.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Slanted skylight of an attic studio covered in frost, view of Paris rooftops under gray skies.",
            imagePrompt: "Period drama comic page panel 1. Slanted glass skylight of a 1920s Paris artist garret covered in frost, looking out at snowy zinc rooftops.",
            imageFile: "episodes/atelier-st-germain/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Camille blowing on her numb fingers before picking up her sable brush.",
            imagePrompt: "Comic page panel 2. Camille wrapped in a thick wool scarf, blowing warm breath into her cupped hands, brushes resting in a terracotta jar.",
            imageFile: "episodes/atelier-st-germain/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Her roommate Étienne chiseling a raw block of marble, stone chips flying.",
            imagePrompt: "Comic page panel 3. Étienne in a heavy sweater chiseling an avant-garde cubist sculpture from white marble, sweat glistening despite the cold.",
            imageFile: "episodes/atelier-st-germain/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "A fierce debate erupts over whether classic realism still has a place in the post-war world.",
            imagePrompt: "Comic page panel 4. Camille and Étienne arguing passionately across a clutter of paint cans, bread crusts, and wine bottles, eyes blazing with artistic fire.",
            imageFile: "episodes/atelier-st-germain/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Autumn Salon Jury",
        slug: "chapter-2-the-autumn-salon-jury",
        synopsis: "Submitting their masterworks to the conservative Grand Palais committee.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Carrying two giant canvases through the rain across the Pont des Arts.",
            imagePrompt: "Comic page panel 1. Camille and Étienne struggling across the windy Paris bridge in rain, shielding their wrapped canvases beneath an oilcloth tarp.",
            imageFile: "episodes/atelier-st-germain/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The cavernous Grand Palais hall where thousands of artists wait in endless lines.",
            imagePrompt: "Comic page panel 2. Grand Palais interior under iron glass dome, hundreds of bohemian artists lined up with paintings under the gaze of pompous judges.",
            imageFile: "episodes/atelier-st-germain/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The aristocratic jury inspector scoffs at Camille's raw brushstrokes: 'Too modern.'",
            imagePrompt: "Comic page panel 3. An elderly judge in velvet coat scoffing with a monocle at Camille's expressive painting: 'Unfinished madness.'",
            imageFile: "episodes/atelier-st-germain/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "They both get rejected with chalk 'R' stamps on the backs of their frames.",
            imagePrompt: "Comic page panel 4. Close-up on the cruel white chalk 'R' (Refusé) stamped onto the wooden stretcher bars of both their paintings.",
            imageFile: "episodes/atelier-st-germain/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Independent Exhibition",
        slug: "chapter-3-the-independent-exhibition",
        synopsis: "Opening their own outlaw gallery in the studio to thunderous acclaim.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Transforming the attic studio into an independent exhibition space with candlelight.",
            imagePrompt: "Comic page panel 1. The attic cleaned and glowing with dozens of candles, paintings and marble sculptures displayed against rustic brick walls.",
            imageFile: "episodes/atelier-st-germain/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A crowd of writers, poets, and international collectors packs the narrow stairwell.",
            imagePrompt: "Comic page panel 2. Crowd of fashionable young Paris intellectuals, flappers, and foreign art critics packing into the garret gallery.",
            imageFile: "episodes/atelier-st-germain/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "An American collector purchases both Camille's portrait and Étienne's sculpture.",
            imagePrompt: "Comic page panel 3. An American collector in pinstripe suit shaking Camille and Étienne's hands, red 'SOLD' stickers applied to the frames.",
            imageFile: "episodes/atelier-st-germain/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "They celebrate on the moonlit roof terrace with a bottle of cheap champagne, laughing in triumph.",
            imagePrompt: "Comic page panel 4. Ending panel. Camille and Étienne raising champagne glasses on the tin rooftop overlooking illuminated nighttime Paris.",
            imageFile: "episodes/atelier-st-germain/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 28. Slice of Life (Studio: Heartstring)
  {
    id: "series-28",
    batchNumber: 3,
    slug: "the-cat-on-the-fire-escape",
    title: "The Cat on the Fire Escape",
    synopsis:
      "A wandering calico cat named Marmalade creates an accidental neighborhood web of friendship across the black wrought-iron fire escapes of a vintage Brooklyn brownstone apartment building.",
    genre: "Slice of Life",
    format: "scroll",
    ownerType: "studio",
    ownerRef: "heartstring-comics",
    credits: [
      { roleCategory: "writer", creatorUsername: "devon_reed" },
      { roleCategory: "artist", creatorUsername: "aiko_takahashi" },
      { roleCategory: "editor", creatorUsername: "soraya_mirza" },
    ],
    artStyle: "Warm Brooklyn brownstone watercolor, cheerful calico cat antics, cozy apartment interiors, and heartwarming neighborly moments.",
    characters: [
      {
        name: "Marmalade",
        role: "Protagonist",
        visualDescription: "Chubby calico cat with ginger, black, and white patches, a notched ear, and an insatiable appetite for tuna and chin scratches.",
        palette: ["#DDA15E", "#BC6C25", "#283618", "#FEFAE0"],
      },
    ],
    coverPrompt:
      "Delightful slice-of-life comic cover for 'The Cat on the Fire Escape'. Fat calico cat Marmalade napping lazily on a sunlit black iron fire escape landing adorned with terracotta flowerpots outside a Brooklyn brick brownstone.",
    coverFile: "covers/the-cat-on-the-fire-escape.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Morning Sunbeams",
        slug: "chapter-1-morning-sunbeams",
        synopsis: "Marmalade starts her daily rounds from 4th floor to ground level.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A classic red-brick Brooklyn brownstone with black wrought-iron fire escape zig-zagging down.",
            imagePrompt: "Vertical scroll panel. Four-story red-brick Brooklyn brownstone building on a sunny leafy street, green sycamore tree branches swaying.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Marmalade stretching luxuriously on the 4th floor metal grating in the golden morning light.",
            imagePrompt: "Vertical scroll panel. Chubby calico cat stretching its front paws forward in a deep yoga stretch on the sunny black metal fire escape.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Tapping her paw on apartment 4B's window: Leo the animator opens the sash with a saucer of milk.",
            imagePrompt: "Vertical scroll panel. An animator with glasses sliding open his window sash, offering a saucer of milk: 'Morning, your majesty.'",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Marmalade trotting down the iron ladder to 3A to see what the baker is preparing.",
            imagePrompt: "Vertical scroll panel. The cat nimbly descending the iron ladder rungs to the floor below, tail held high in cheerful curiosity.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Tomato Plant Incident",
        slug: "chapter-2-the-tomato-plant-incident",
        synopsis: "Connecting two neighbors who have lived fifty feet apart for two years without speaking.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Marmalade chasing a butterfly across the 2nd floor balcony, knocking over a tomato seedling.",
            imagePrompt: "Vertical scroll panel. Marmalade leaping after a yellow butterfly, accidentally tipping over a small terracotta pot with a green tomato plant.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The pot drops toward the 1st floor landing where Maya is reading a novel.",
            imagePrompt: "Vertical scroll panel. Maya on the 1st floor landing looking up in surprise as dry potting soil rains down like gentle brown confetti.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Leo leans over the railing in absolute panic: 'I am so, so sorry! It was the cat!'",
            imagePrompt: "Vertical scroll panel. Leo leaning over the railing apologizing profusely, face bright red, while Marmalade sits beside him licking her paw.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Maya bursts out laughing and invites Leo down for iced tea: 'Bring the guilty party with you.'",
            imagePrompt: "Vertical scroll panel. Maya laughing warmly from her sunlit window, holding up a glass pitcher of iced tea with lemon slices.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Rooftop Potluck",
        slug: "chapter-3-the-rooftop-potluck",
        synopsis: "The entire building gathers on the roof for summer dinner because of one calico cat.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Neighbors from all six apartments carrying dishes up to the gravel roof deck at sunset.",
            imagePrompt: "Vertical scroll panel. Brooklyn rooftop at sunset with string lights, neighbors carrying folding tables, pasta salads, and grill skewers.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Leo and Maya laughing together over a sketchbook of funny Marmalade drawings.",
            imagePrompt: "Vertical scroll panel. Leo and Maya sitting together on lawn chairs, flipping through funny cartoon sketches of the calico cat's adventures.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Marmalade receiving her own custom ceramic bowl filled with gourmet salmon flakes.",
            imagePrompt: "Vertical scroll panel. Marmalade happily purring with half-closed eyes in front of a golden bowl filled with grilled salmon.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "View of the New York skyline as the building community laughs together under the stars.",
            imagePrompt: "Vertical scroll panel ending. Distant Manhattan skyline glowing purple across the river as the happy rooftop gathering shines in warm golden light.",
            imageFile: "episodes/the-cat-on-the-fire-escape/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 29. Mystery (Individual)
  {
    id: "series-29",
    batchNumber: 3,
    slug: "fjord-of-secrets",
    title: "Fjord of Secrets",
    synopsis:
      "In an isolated Norwegian fishing village nestled beneath steep mountain fjords, a veteran detective investigates a passenger ferry that drifted into the harbor on autopilot with all twenty-two passengers missing without a trace.",
    genre: "Mystery",
    format: "page",
    ownerType: "individual",
    ownerRef: "hannah_lindqvist",
    credits: [
      { roleCategory: "writer", creatorUsername: "hannah_lindqvist" },
      { roleCategory: "artist", creatorUsername: "hannah_lindqvist" },
      { roleCategory: "editor", creatorUsername: "maya_lin" },
    ],
    artStyle: "Nordic noir realism, cold arctic blues, imposing granite fjord walls, misty waters, and methodical forensic deduction.",
    characters: [
      {
        name: "Detective Astrid Holm",
        role: "Protagonist",
        visualDescription: "38-year-old Norwegian police inspector with cropped platinum hair, dark green park coat, sharp observant pale blue eyes.",
        palette: ["#1D3557", "#457B9D", "#A8DADC", "#F1FAEE"],
      },
    ],
    coverPrompt:
      "Nordic noir mystery comic cover for 'Fjord of Secrets'. Detective Astrid Holm standing on the wooden pier of a remote Norwegian fjord in winter mist, looking at an empty white passenger ferry drifting silently toward the dark rocky shore.",
    coverFile: "covers/fjord-of-secrets.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Ghost Ferry",
        slug: "chapter-1-the-ghost-ferry",
        synopsis: "The 8:15 AM ferry arrives on schedule, but nobody walks off the ramp.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Imposing two-thousand-foot granite fjord walls flanking a tranquil, dark blue waterway.",
            imagePrompt: "Nordic noir comic page panel 1. Towering misty Norwegian fjord cliffs rising sheer out of cold dark waters under a pale gray arctic morning sky.",
            imageFile: "episodes/fjord-of-secrets/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The white car ferry 'Fjordkatt' bumping gently against the wooden pier pilings.",
            imagePrompt: "Comic page panel 2. White regional passenger ferry gliding slowly against dock fenders, engine idling at low hum, gangway empty.",
            imageFile: "episodes/fjord-of-secrets/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Astrid steps onto the car deck: steaming coffee cups on tables, coats on chairs, zero people.",
            imagePrompt: "Comic page panel 3. Interior passenger salon: half-eaten pastries and steaming mugs on tables, umbrellas leaning against seats, totally deserted.",
            imageFile: "episodes/fjord-of-secrets/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "On the captain's wheelhouse radar, a single waypoint marker is set to an uncharted sea cave.",
            imagePrompt: "Comic page panel 4. Close up on navigation GPS screen: a custom nautical waypoint pulsing red inside an ominous sea cavern marked 'Svartgrotta'.",
            imageFile: "episodes/fjord-of-secrets/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Svartgrotta Cave",
        slug: "chapter-2-svartgrotta-cave",
        synopsis: "Taking a police launch to explore the uncharted sea cavern.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Small police Zodiac boat navigating into a massive black sea cave opening at water level.",
            imagePrompt: "Comic page panel 1. Black inflatable police motorboat heading into the gaping black mouth of an immense sea cave beneath sheer granite cliffs.",
            imageFile: "episodes/fjord-of-secrets/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Astrid sweeps her tactical searchlight over wet stalactites inside the cavern.",
            imagePrompt: "Comic page panel 2. Powerful white searchlight beam illuminating glistening limestone formations and deep emerald calm subterranean waters.",
            imageFile: "episodes/fjord-of-secrets/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "She spots twenty-two orange emergency lifejackets neatly folded on a gravel beach inside.",
            imagePrompt: "Comic page panel 3. Startling discovery. Twenty-two bright orange life vests arranged in a neat geometric circle on a pebble beach inside the cavern.",
            imageFile: "episodes/fjord-of-secrets/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Footprints in the sand lead toward an iron door embedded in the cavern rock.",
            imagePrompt: "Comic page panel 4. Fresh boot prints leading out of the water to a heavy World War II German naval bunker door set into the granite cliff face.",
            imageFile: "episodes/fjord-of-secrets/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Submerged Vault",
        slug: "chapter-3-the-submerged-vault",
        synopsis: "Opening the bunker door reveals an elaborate staged disappearance.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Astrid cuts the chain on the bunker wheel door with a hydraulic tool.",
            imagePrompt: "Comic page panel 1. Astrid using heavy hydraulic bolt cutters to snap a rusted chain wrapped around the submarine bunker hatch wheel.",
            imageFile: "episodes/fjord-of-secrets/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Inside: the missing passengers are quietly gathered around radios, safe and alive.",
            imagePrompt: "Comic page panel 2. Inside the dry bunker: the missing passengers sitting on cots with emergency blankets, drinking soup from a camp stove.",
            imageFile: "episodes/fjord-of-secrets/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The ferry captain steps forward: 'We had to hide them from the chemical transport ship.'",
            imagePrompt: "Comic page panel 3. The grey-bearded ferry captain explaining with urgent gravity: an illegal toxic cargo leak was covered up by local authorities.",
            imageFile: "episodes/fjord-of-secrets/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Astrid calls in federal coastal guard cruisers to arrest the corrupt shipping executive.",
            imagePrompt: "Comic page panel 4. Ending panel. Astrid on her satellite radio as three large Norwegian Coast Guard cutters arrive in the fjord to escort the passengers home.",
            imageFile: "episodes/fjord-of-secrets/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 30. Supernatural (Studio: Velvet Crow)
  {
    id: "series-30",
    batchNumber: 3,
    slug: "the-bell-witch-of-blackwood",
    title: "The Bell Witch of Blackwood",
    synopsis:
      "Deep in the misty Blue Ridge Mountains, an apprentice folklorist recording oral histories uncovers an ancient bell hidden inside a hollow chestnut tree whose chime summons the restless spirit that founded the town.",
    genre: "Supernatural",
    format: "scroll",
    ownerType: "studio",
    ownerRef: "velvet-crow-press",
    credits: [
      { roleCategory: "writer", creatorUsername: "lucas_valerio" },
      { roleCategory: "artist", creatorUsername: "clara_thorne" },
      { roleCategory: "editor", creatorUsername: "hannah_lindqvist" },
    ],
    artStyle: "Atmospheric Appalachian folk horror, autumn golden leaves, shadowed mountain hollers, and spectral white spirit apparitions.",
    characters: [
      {
        name: "Jesse Campbell",
        role: "Protagonist",
        visualDescription: "26-year-old ethnomusicologist with canvas field jacket, vintage reel-to-reel tape recorder on shoulder, keen observant brown eyes.",
        palette: ["#3D3A45", "#B56576", "#E56B6F", "#EAAC8B"],
      },
    ],
    coverPrompt:
      "Appalachian folk supernatural comic cover for 'The Bell Witch of Blackwood'. Jesse holding a glowing brass bell under the mossy branches of a giant hollow tree in the misty Blue Ridge Mountains as a pale translucent woman with raven hair hovers in the fog.",
    coverFile: "covers/the-bell-witch-of-blackwood.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Reel-to-Reel in the Holler",
        slug: "chapter-1-reel-to-reel-in-the-holler",
        synopsis: "Recording an old mountain ballad captures an unexplained harmonic frequency.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Misty autumn mountain holler with orange sugar maples and weathered wood log cabins.",
            imagePrompt: "Vertical scroll panel. Autumn Appalachian mountain holler surrounded by misty blue ridges and glowing orange maple trees.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Jesse setting up his microphone on a wooden porch while an elderly banjo player sings.",
            imagePrompt: "Vertical scroll panel. Jesse monitoring sound levels on his analog Nagra tape recorder while an old mountain elder picks an ancient banjo.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The needle on the VU audio meter spikes into the red with a high-pitched bell chime.",
            imagePrompt: "Vertical scroll panel. Close-up on analog audio meter needle pegging hard against the red line as a pure bell tone echoes through headphones.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Jesse looks into the deep woods where a pale woman in white lace points deeper up the mountain.",
            imagePrompt: "Vertical scroll panel reveal. Through the autumn tree trunks in deep fog, a translucent spectral woman pointing toward the mountain crest.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Hollow Chestnut",
        slug: "chapter-2-the-hollow-chestnut",
        synopsis: "Following the coordinates to an ancient tree marked with colonial carvings.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Hiking up a rocky mountain ridge through swirling twilight mist.",
            imagePrompt: "Vertical scroll panel. Jesse hiking up a steep pine needle trail through curling mountain fog with his flashlight beam cutting through dusk.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A massive four-hundred-year-old American chestnut tree split down the center.",
            imagePrompt: "Vertical scroll panel. Colossal hollow chestnut tree trunk wide as a house, covered in green moss and carved protective hex symbols.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Inside the hollow trunk hangs an ornate iron bell covered in unreadable runes.",
            imagePrompt: "Vertical scroll panel. Inside the hollow trunk: an ancient dark bronze bell hanging from a root, engraved with celestial constellations.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Jesse's hand brushes the iron clapper; the bell rings with a thunderous mystical resonance.",
            imagePrompt: "Vertical scroll panel climax. Jesse touching the bell; a concussive shockwave of blue light ripples through the forest canopy.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Mountain's Memory",
        slug: "chapter-3-the-mountains-memory",
        synopsis: "The spirit reveals the true history buried by the logging barons.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The mountain mist condenses into floating luminous memories of the 18th century settlers.",
            imagePrompt: "Vertical scroll panel. Spectral figures of colonial settlers and native Cherokee scouts walking peacefully together in glowing spirit light.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The Bell Witch speaks not with malice, but as the eternal guardian of the mountain peace.",
            imagePrompt: "Vertical scroll panel. The Bell Witch floating gently before Jesse, her face compassionate and ancient: 'Tell them our pact was never broken.'",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Jesse records her voice on the magnetic tape reel, the audio waveform glowing with cyan energy.",
            imagePrompt: "Vertical scroll panel. Jesse's tape recorder spinning smoothly, capturing the spectral voice into permanent magnetic preservation.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Jesse bows in reverence as dawn breaks over the Blue Ridge, the bell quiet and protected.",
            imagePrompt: "Vertical scroll panel ending. Jesse walking down the mountain trail at sunrise, the morning light kissing the autumn ridges with peaceful gold.",
            imageFile: "episodes/the-bell-witch-of-blackwood/ep3_p4.png",
          },
        ],
      },
    ],
  },
];
