import type { SeriesManifest } from "../../types.ts";

export const BATCH_4_SERIES: SeriesManifest[] = [
  // 31. Action (Individual)
  {
    id: "series-31",
    batchNumber: 4,
    slug: "shadow-weaver-seoul",
    title: "Shadow Weaver: Seoul Underground",
    synopsis:
      "When a shadow syndicate infiltrates the decommissioned bunker networks beneath Seoul, undercover intelligence operative Min-Jae uses acrobatic wire-arts and stealth combat to dismantle their nuclear extortion ring.",
    genre: "Action",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "jin_woo_park",
    credits: [
      { roleCategory: "writer", creatorUsername: "jin_woo_park" },
      { roleCategory: "artist", creatorUsername: "jin_woo_park" },
      { roleCategory: "editor", creatorUsername: "devon_reed" },
    ],
    artStyle: "Stealth action noir, razor-sharp monomolecular wires, glowing infrared goggles, and fluid acrobatic panelling.",
    characters: [
      {
        name: "Min-Jae Song",
        role: "Protagonist",
        visualDescription: "26-year-old covert operative with dark utility suit, titanium monofilament wire spools on gauntlets, and sharp amber eyes.",
        palette: ["#0F1416", "#202C33", "#00B4D8", "#FF3366"],
      },
    ],
    coverPrompt:
      "High-octane action webcomic cover for 'Shadow Weaver: Seoul Underground'. Min-Jae mid-backflip across a subterranean tunnel ceiling, weaving glowing cyan monofilament combat wires to ensnare three heavily armed syndicate enforcers.",
    coverFile: "covers/shadow-weaver-seoul.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Bunker Descent",
        slug: "chapter-1-bunker-descent",
        synopsis: "Infiltrating the abandoned Cold War command shelter.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Silhouetted skyline of rainy Seoul as an operative rappels down an air shaft.",
            imagePrompt: "Vertical scroll panel. Min-Jae rappelling down a dark concrete ventilation shaft in rain, neon city reflection disappearing above.",
            imageFile: "episodes/shadow-weaver-seoul/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Landing on an iron catwalk in a decommissioned missile silo.",
            imagePrompt: "Vertical scroll panel. Silently crouching on a rusted steel catwalk, night-vision optics illuminating armed mercenaries below.",
            imageFile: "episodes/shadow-weaver-seoul/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Deploying silent monowires across the corridor to create a tactical web.",
            imagePrompt: "Vertical scroll panel. Min-Jae launching nearly invisible glowing blue filament wires across the corridor walls.",
            imageFile: "episodes/shadow-weaver-seoul/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The syndicate guards trigger the trap and are hoisted silently into the shadows.",
            imagePrompt: "Vertical scroll panel climax. Two guards caught in the snare wires and hoisted swiftly into darkness without making a sound.",
            imageFile: "episodes/shadow-weaver-seoul/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Laser Grid",
        slug: "chapter-2-the-laser-grid",
        synopsis: "Navigating an active defense laser security corridor.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A long white corridor humming with criss-crossing red laser security beams.",
            imagePrompt: "Vertical scroll panel. Clean white subterranean corridor filled with a complex web of criss-crossing red laser alarm tripwires.",
            imageFile: "episodes/shadow-weaver-seoul/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Min-Jae flips effortlessly through the microscopic gaps with gymnastic precision.",
            imagePrompt: "Vertical scroll panel. Min-Jae executing an acrobatic aerial contortion mid-air through inches of clearance between red lasers.",
            imageFile: "episodes/shadow-weaver-seoul/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "He reaches the terminal and slides his decryption spike into the security port.",
            imagePrompt: "Vertical scroll panel. Min-Jae plugging a glowing data spike into the wall panel, green code lines overriding the alarms.",
            imageFile: "episodes/shadow-weaver-seoul/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The heavy vault door unlocks, revealing the stolen warhead container.",
            imagePrompt: "Vertical scroll panel. The massive steel blast door rolling open on pneumatic tracks, revealing an armed nuclear warhead inside.",
            imageFile: "episodes/shadow-weaver-seoul/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Final Gauntlet",
        slug: "chapter-3-the-final-gauntlet",
        synopsis: "A high-speed fight on the roof of a runaway underground transport train.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Min-Jae sprinting on the roof of a rushing subway train in the tunnel.",
            imagePrompt: "Vertical scroll panel. High-speed combat on the roof of a speeding subway train passing under concrete tunnel beams.",
            imageFile: "episodes/shadow-weaver-seoul/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Dueling the syndicate commander wielding dual tactical combat knives.",
            imagePrompt: "Vertical scroll panel. Dynamic knife vs wire combat between Min-Jae and a masked syndicate boss in the rushing wind.",
            imageFile: "episodes/shadow-weaver-seoul/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Min-Jae ties the boss's weapons with a looping wire grapple to the overhead tunnel beam.",
            imagePrompt: "Vertical scroll panel. Min-Jae looping his wires around the boss's blades and hooking them into an overhead railway support truss.",
            imageFile: "episodes/shadow-weaver-seoul/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The train stops safely at the terminal as police swat units secure the platform.",
            imagePrompt: "Vertical scroll panel ending. The train screeching to a halt at a brightly lit platform as Min-Jae vanishes into the shadows above.",
            imageFile: "episodes/shadow-weaver-seoul/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 32. Fantasy (Studio: Iron Quill)
  {
    id: "series-32",
    batchNumber: 4,
    slug: "the-star-forged-bastion",
    title: "The Star-Forged Bastion",
    synopsis:
      "Deep inside Mount Karakor, dwarven master smiths guard a fallen celestial star that fuels their kingdom's molten forges. When shadow drakes breach the lower caldera, an apprentice smith must reforge the shattered ancestral hammer.",
    genre: "Fantasy",
    format: "page",
    ownerType: "studio",
    ownerRef: "iron-quill-studios",
    credits: [
      { roleCategory: "writer", creatorUsername: "marcus_kane" },
      { roleCategory: "artist", creatorUsername: "rowan_macleod" },
      { roleCategory: "letterer", creatorUsername: "devon_reed" },
    ],
    artStyle: "Epic dwarven architecture, colossal stone carvings, cascading rivers of orange molten gold, and sparkling starlight meteors.",
    characters: [
      {
        name: "Thorin Emberstone",
        role: "Protagonist",
        visualDescription: "Stocky young dwarf smith with braided copper beard, leather apron, heavy forged tongs, and glowing starlight eyes.",
        palette: ["#7F4F24", "#936639", "#A68A56", "#DDB892"],
      },
    ],
    coverPrompt:
      "Grand fantasy comic cover for 'The Star-Forged Bastion'. Thorin Emberstone striking a glowing blue star-meteorite on a colossal anvil in a cavernous dwarven forge surrounded by rivers of orange magma.",
    coverFile: "covers/the-star-forged-bastion.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Falling Starlight",
        slug: "chapter-1-the-falling-starlight",
        synopsis: "The core of the mountain forge flickers as the celestial star destabilizes.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Colossal underground dwarven city with tiers of stone halls carved into a mountain cavern.",
            imagePrompt: "Fantasy comic page panel 1. Gigantic dwarven underground city with colossal stone statues and aqueducts of glowing orange molten iron.",
            imageFile: "episodes/the-star-forged-bastion/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The Great Anvil hall: a floating chunk of glowing celestial blue star-ore suspended by chains.",
            imagePrompt: "Comic page panel 2. The central forge: a radiant blue meteorite humming with raw cosmic lightning, held by titanic mithril chains.",
            imageFile: "episodes/the-star-forged-bastion/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Black shadow drakes swarm from the volcanic depths, clawing at the forge supports.",
            imagePrompt: "Comic page panel 3. Obsidian shadow drakes with bat wings bursting from the magma rivers, their acid breath hissing on the stone.",
            imageFile: "episodes/the-star-forged-bastion/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Thorin grabs the shattered pieces of the Ancestral Hammer and runs toward the blue star.",
            imagePrompt: "Comic page panel 4. Thorin leaping across a river of fire, clutching glowing fragments of an ancient hammer in his leather-clad arms.",
            imageFile: "episodes/the-star-forged-bastion/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Starlight Hammer",
        slug: "chapter-2-starlight-hammer",
        synopsis: "Reforging the sacred relic in the heart of cosmic heat.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Thorin thrusts the hammer fragments directly into the blue celestial meteorite flame.",
            imagePrompt: "Comic page panel 1. Plunging the iron hammer head into the blinding cyan starfire, sparks swirling like miniature constellations.",
            imageFile: "episodes/the-star-forged-bastion/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Striking the metal on the anvil with thunderous rhythmic hammer blows.",
            imagePrompt: "Comic page panel 2. Thorin swinging a heavy forging mallet, sparks exploding with the sound of roaring thunderclaps.",
            imageFile: "episodes/the-star-forged-bastion/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The metal fuses together, glowing with radiant celestial starlight runes.",
            imagePrompt: "Comic page panel 3. The newly forged warhammer glowing with pristine blue and gold cosmic runes along its polished head.",
            imageFile: "episodes/the-star-forged-bastion/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Thorin lifts the hammer high as a shockwave of starlight pushes the shadow drakes back.",
            imagePrompt: "Comic page panel 4. Thorin raising the glowing hammer, a blinding pulse of star energy blasting the attacking drakes backward.",
            imageFile: "episodes/the-star-forged-bastion/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Mountain Reborn",
        slug: "chapter-3-the-mountain-reborn",
        synopsis: "The dwarven kingdom rallies behind the new Star-Bearer.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Dwarven warriors in heavy brass armor cheer as the shadow beasts retreat into the abyss.",
            imagePrompt: "Comic page panel 1. Hundreds of dwarven infantry raising round shields and axes in victory as the dark monsters flee.",
            imageFile: "episodes/the-star-forged-bastion/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The forges roar back to full power, blazing with clean brilliant heat.",
            imagePrompt: "Comic page panel 2. Vast smelters and furnaces igniting with renewed golden energy, powering the great waterwheels.",
            imageFile: "episodes/the-star-forged-bastion/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The King places a golden circlet upon Thorin's copper head.",
            imagePrompt: "Comic page panel 3. The bearded Dwarf King crowning young Thorin as the official High Smith of Mount Karakor.",
            imageFile: "episodes/the-star-forged-bastion/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Thorin strikes the anvil once more, a single bell-like tone of peace echoing through the mountain.",
            imagePrompt: "Comic page panel 4. Ending panel. Thorin striking the great anvil in solemn pride, the ringing tone filling the majestic stone halls.",
            imageFile: "episodes/the-star-forged-bastion/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 33. Sci-Fi (Individual)
  {
    id: "series-33",
    batchNumber: 4,
    slug: "chronicles-of-kepler-186",
    title: "Chronicles of Kepler-186",
    synopsis:
      "A planetary biologist sent to catalogue alien vegetation on an earth-sized world orbiting a dim red dwarf sun discovers that the red-foliaged jungle communicates through root pulses and possesses an ancient planetary memory.",
    genre: "Sci-Fi",
    format: "page",
    ownerType: "individual",
    ownerRef: "tariq_al_mansoor",
    credits: [
      { roleCategory: "writer", creatorUsername: "tariq_al_mansoor" },
      { roleCategory: "artist", creatorUsername: "tariq_al_mansoor" },
      { roleCategory: "editor", creatorUsername: "elena_vance" },
    ],
    artStyle: "Crimson exoplanet landscapes, scarlet-leaved alien flora, dim orange sunlight, and contemplative planetary exploration.",
    characters: [
      {
        name: "Dr. Nadia Sen",
        role: "Protagonist",
        visualDescription: "33-year-old botanist in white and teal environmental exploration suit, sensor scanner backpack, observant dark eyes.",
        palette: ["#800E13", "#AD2831", "#38040E", "#250902"],
      },
    ],
    coverPrompt:
      "Breathtaking exoplanet sci-fi comic cover for 'Chronicles of Kepler-186'. Dr. Nadia Sen standing in a vast forest of giant crimson-leafed alien trees under a dim reddish-orange dwarf star in the violet twilight sky.",
    coverFile: "covers/chronicles-of-kepler-186.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Crimson Forest",
        slug: "chapter-1-the-crimson-forest",
        synopsis: "First steps onto the scarlet soil of Kepler-186f.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Lander module touching down on a vast plateau covered in deep red fern forests.",
            imagePrompt: "Sci-fi comic page panel 1. White exploration lander settling on scarlet mossy plains beneath towering crimson trees under dim red sun.",
            imageFile: "episodes/chronicles-of-kepler-186/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Nadia steps off the ladder, holding a bio-scanner device.",
            imagePrompt: "Comic page panel 2. Nadia in full environmental EVA suit taking her first step onto the alien soil, her handheld scanner blinking blue.",
            imageFile: "episodes/chronicles-of-kepler-186/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Scanning a giant spiral blossom: the sensor detects electrical neural pulses in the stem.",
            imagePrompt: "Comic page panel 3. Close up on scanner display showing brain-like neural synaptic rhythms pulsing through the red plant stem.",
            imageFile: "episodes/chronicles-of-kepler-186/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Around her, the entire forest floor begins pulsing with rhythmic amber light.",
            imagePrompt: "Comic page panel 4. Stunned wide panel. The entire crimson jungle lighting up in synchronous amber light waves across miles of terrain.",
            imageFile: "episodes/chronicles-of-kepler-186/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Root Communion",
        slug: "chapter-2-root-communion",
        synopsis: "Connecting her datapad to the botanical mycelium network.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Nadia kneeling beside a massive moss-covered root trunk, attaching a neural probe.",
            imagePrompt: "Comic page panel 1. Nadia carefully inserting a diagnostic probe into a translucent glowing root network spreading across the rock.",
            imageFile: "episodes/chronicles-of-kepler-186/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Her visor displays memories of the planet from three billion years ago.",
            imagePrompt: "Comic page panel 2. Visor HUD displaying ancient planetary records: comet impacts, continental shifts, and oceans forming.",
            imageFile: "episodes/chronicles-of-kepler-186/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The root tendrils gently curl around her boots without harming her.",
            imagePrompt: "Comic page panel 3. Bioluminescent red plant tendrils softly wrapping around Nadia's boots like a curious, welcoming organism.",
            imageFile: "episodes/chronicles-of-kepler-186/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Nadia takes off her protective glove and touches the leaf with bare skin.",
            imagePrompt: "Comic page panel 4. Emotional courage. Nadia sliding off her glove, pressing her warm bare palm against the soft glowing alien leaf.",
            imageFile: "episodes/chronicles-of-kepler-186/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Living World",
        slug: "chapter-3-the-living-world",
        synopsis: "Transmitting her findings to Earth: we are not alone.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A gentle shower of glowing pollen drifts through the twilight air.",
            imagePrompt: "Comic page panel 1. Golden luminescent spores drifting like fireflies through the dark crimson canopy in gentle planetary wind.",
            imageFile: "episodes/chronicles-of-kepler-186/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Nadia sitting at her lander terminal, writing her scientific dispatch.",
            imagePrompt: "Comic page panel 2. Inside the cozy lander cabin, Nadia typing with a radiant smile: 'The ecosystem is a single conscious mind.'",
            imageFile: "episodes/chronicles-of-kepler-186/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Transmitting the message via high-gain dish back to Earth across 500 light-years.",
            imagePrompt: "Comic page panel 3. The lander's satellite dish beaming a laser signal upward into the starry deep space cosmos.",
            imageFile: "episodes/chronicles-of-kepler-186/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Nadia watches the twin moons rise above the peaceful glowing red forest.",
            imagePrompt: "Comic page panel 4. Ending panel. Nadia standing on the ridge watching two turquoise crescent moons rise over the glowing crimson planetary horizon.",
            imageFile: "episodes/chronicles-of-kepler-186/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 34. Romance (Individual)
  {
    id: "series-34",
    batchNumber: 4,
    slug: "under-the-magnolia-boughs",
    title: "Under the Magnolia Boughs",
    synopsis:
      "In 1910 Savannah, an outspoken historical preservationist fighting to save live oak groves from urban expansion finds an unexpected ally and secret admirer in the city surveyor tasked with cutting them down.",
    genre: "Romance",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "soraya_mirza",
    credits: [
      { roleCategory: "writer", creatorUsername: "soraya_mirza" },
      { roleCategory: "artist", creatorUsername: "soraya_mirza" },
      { roleCategory: "editor", creatorUsername: "chloe_dupont" },
    ],
    artStyle: "Southern gothic romance, Spanish moss draped over live oaks, dappled golden sunlight, vintage linen suits, and slow-burn glances.",
    characters: [
      {
        name: "Lillian DuPre",
        role: "Protagonist",
        visualDescription: "24-year-old botanical activist with dark wavy chignon hair, lace-trimmed linen dress, holding a leather map case, fierce brown eyes.",
        palette: ["#2D6A4F", "#52B788", "#D8F3DC", "#B7094C"],
      },
    ],
    coverPrompt:
      "Gentle period romance comic cover for 'Under the Magnolia Boughs'. Lillian DuPre and city surveyor Thomas standing beneath an ancient moss-draped live oak tree in Savannah, looking at a shared parchment map in soft golden afternoon sunlight.",
    coverFile: "covers/under-the-magnolia-boughs.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Live Oak Survey",
        slug: "chapter-1-the-live-oak-survey",
        synopsis: "A confrontation over surveyors' stakes in the historic park.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Historic Savannah square shaded by towering ancient live oaks dripping with Spanish moss.",
            imagePrompt: "Vertical scroll panel. Historic Savannah cobblestone square under colossal live oak trees draped in silvery Spanish moss in soft morning haze.",
            imageFile: "episodes/under-the-magnolia-boughs/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Young surveyor Thomas adjusting his brass theodolite tripod on the grass.",
            imagePrompt: "Vertical scroll panel. Thomas in a tweed waistcoat and rolled-up sleeves leveling a brass antique surveying transit telescope.",
            imageFile: "episodes/under-the-magnolia-boughs/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Lillian steps directly in front of his lens, holding a signed petition.",
            imagePrompt: "Vertical scroll panel. Lillian blocking the view of the lens, parasol tilted on shoulder, eyes flashing with defiant resolve: 'Not this tree, sir.'",
            imageFile: "episodes/under-the-magnolia-boughs/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Thomas looks up from the eyepiece, completely stunned by her grace and courage.",
            imagePrompt: "Vertical scroll panel. Thomas looking up, taking off his straw boater hat in silent stunned admiration.",
            imageFile: "episodes/under-the-magnolia-boughs/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Redrawn Lines",
        slug: "chapter-2-the-redrawn-lines",
        synopsis: "Thomas brings alternate street plans to Lillian's garden gazebo.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Lillian's white garden gazebo surrounded by blooming pink camellias at sunset.",
            imagePrompt: "Vertical scroll panel. White wooden garden gazebo surrounded by flowering pink camellia bushes and magnolia blossoms at dusk.",
            imageFile: "episodes/under-the-magnolia-boughs/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Thomas unrolls a new blueprint showing a curving avenue that saves every single oak.",
            imagePrompt: "Vertical scroll panel. Thomas spreading out a large blueprint with a graceful curving road that skirts around the historic grove.",
            imageFile: "episodes/under-the-magnolia-boughs/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Lillian touches the blueprint beside his hand, her face softening into a radiant smile.",
            imagePrompt: "Vertical scroll panel. Lillian looking up from the map, touched by his quiet sacrifice: 'You risked your position for this?'",
            imageFile: "episodes/under-the-magnolia-boughs/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Thomas answers softly: 'Some things are far too beautiful to tear down.'",
            imagePrompt: "Vertical scroll panel. Close up. Thomas gazing at her with tender sincerity, fireflies beginning to blink in the garden shadows.",
            imageFile: "episodes/under-the-magnolia-boughs/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Magnolia Ball",
        slug: "chapter-3-the-magnolia-ball",
        synopsis: "The city council votes to adopt the preservation boulevard.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "City hall chambers erupting into applause as the preservation ordinance passes.",
            imagePrompt: "Vertical scroll panel. Grand wood-paneled Savannah city hall bursting into applause as the mayor signs the historic preservation bill.",
            imageFile: "episodes/under-the-magnolia-boughs/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Lillian in an evening gown finding Thomas standing by the open veranda balcony.",
            imagePrompt: "Vertical scroll panel. Lillian in an emerald silk evening gown stepping out onto the balustrade veranda to meet Thomas under starlight.",
            imageFile: "episodes/under-the-magnolia-boughs/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Thomas presents her with a fresh white magnolia blossom pinned to a silver brooch.",
            imagePrompt: "Vertical scroll panel. Thomas pinning a creamy white magnolia flower to her lapel, their fingers brushing gently.",
            imageFile: "episodes/under-the-magnolia-boughs/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "They share their first waltz beneath the ancient mossy oaks as music drifts from the hall.",
            imagePrompt: "Vertical scroll panel ending. Thomas and Lillian dancing on the stone terrace beneath the magnificent illuminated oaks under starry night skies.",
            imageFile: "episodes/under-the-magnolia-boughs/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 35. Horror (Individual)
  {
    id: "series-35",
    batchNumber: 4,
    slug: "the-marionette-asylum",
    title: "The Marionette Asylum",
    synopsis:
      "A young urban explorer breaks into the abandoned Blackwood Manor Puppet Theater, only to find three hundred life-sized porcelain marionettes hanging from copper ceiling wires—and their strings are tightening around her wrists.",
    genre: "Horror",
    format: "page",
    ownerType: "individual",
    ownerRef: "clara_thorne",
    credits: [
      { roleCategory: "writer", creatorUsername: "clara_thorne" },
      { roleCategory: "artist", creatorUsername: "clara_thorne" },
      { roleCategory: "editor", creatorUsername: "lucas_valerio" },
    ],
    artStyle: "Cracked porcelain gothic, decaying red velvet curtains, copper marionette strings, and suffocating psychological claustrophobia.",
    characters: [
      {
        name: "Samantha Drake",
        role: "Protagonist",
        visualDescription: "22-year-old photographer with dark denim jacket, Canon SLR camera around neck, flashlight, terrified wide eyes.",
        palette: ["#1B263B", "#415A77", "#778DA9", "#E0E1DD"],
      },
    ],
    coverPrompt:
      "Nightmarish gothic horror comic cover for 'The Marionette Asylum'. Samantha trapped on a crumbling theater stage, illuminated by flashlight, surrounded by dozens of tall hanging porcelain marionettes whose cracked painted faces slowly turn toward her.",
    coverFile: "covers/the-marionette-asylum.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Velvet Curtain",
        slug: "chapter-1-the-velvet-curtain",
        synopsis: "Squeezing through the rotting basement grating into the abandoned theater.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Decaying Victorian theater facade overgrown with ivy under a cloudy moon.",
            imagePrompt: "Horror comic page panel 1. Crumbling Victorian theater facade with broken arched windows and weathered stone gargoyles in moonlight.",
            imageFile: "episodes/the-marionette-asylum/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Samantha shining her flashlight across rows of rotting velvet auditorium seats.",
            imagePrompt: "Comic page panel 2. Flashlight beam illuminating rows of moldy red velvet theater seats covered in white dust sheets and cobwebs.",
            imageFile: "episodes/the-marionette-asylum/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Looking up at the stage: dozens of life-sized porcelain dolls hanging from wooden crossbars.",
            imagePrompt: "Comic page panel 3. Horrifying reveal. Scores of life-sized porcelain marionettes suspended by strings from the fly loft rafters in the shadows.",
            imageFile: "episodes/the-marionette-asylum/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "A sharp metallic snap echoes; one of the wooden control crosses creaks above her.",
            imagePrompt: "Comic page panel 4. Extreme close up on a wooden marionette control bar pivoting on its own in the darkness: *creeeak*.",
            imageFile: "episodes/the-marionette-asylum/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "Tangled Strings",
        slug: "chapter-2-tangled-strings",
        synopsis: "The marionettes begin descending from the ceiling ropes.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Samantha tries to retreat, but finds the exit doors sealed shut with thick cables.",
            imagePrompt: "Comic page panel 1. Samantha rattling the heavy brass exit door handles, locked tight by thick braided wire cables.",
            imageFile: "episodes/the-marionette-asylum/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A porcelain harlequin doll drops onto the stage with a sharp clatter of wooden joints.",
            imagePrompt: "Comic page panel 2. A cracked porcelain harlequin marionette landing on the stage floorboards, wooden knees bending in awkward rhythm.",
            imageFile: "episodes/the-marionette-asylum/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Strings dangle from the ceiling, wrapping gently around Samantha's fingers.",
            imagePrompt: "Comic page panel 3. Thin copper strings silently looping around Samantha's wrists and camera strap, lifting her hands without her consent.",
            imageFile: "episodes/the-marionette-asylum/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The master puppeteer's shadowy silhouette appears in the high projection booth.",
            imagePrompt: "Comic page panel 4. High projection booth glowing with dim green gaslight, showing an elongated skeletal puppeteer pulling hundreds of control wires.",
            imageFile: "episodes/the-marionette-asylum/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Cut the Cord",
        slug: "chapter-3-cut-the-cord",
        synopsis: "Using a photographer's utility shears to break free from the performance.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Samantha manages to reach her camera kit and pull out heavy wire cutters.",
            imagePrompt: "Comic page panel 1. Samantha struggling against the tightening wires, gripping titanium shears with her teeth and snapping the first string.",
            imageFile: "episodes/the-marionette-asylum/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The puppet master screeches as the severed strings whip backward like broken guitar cables.",
            imagePrompt: "Comic page panel 2. The snapped strings whipping upward with sparks, causing the suspended dolls to crash and shatter into porcelain shards.",
            imageFile: "episodes/the-marionette-asylum/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Samantha sets fire to the moth-eaten stage curtain with her emergency flare.",
            imagePrompt: "Comic page panel 3. Red emergency road flare igniting the dusty velvet curtain, orange flames roaring up the proscenium arch.",
            imageFile: "episodes/the-marionette-asylum/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "She bursts through the stained glass doors into the rain as the theater burns behind her.",
            imagePrompt: "Comic page panel 4. Ending panel. Samantha stumbling out into the cool rainy street, safe and free, as smoke billows from the cursed theater.",
            imageFile: "episodes/the-marionette-asylum/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 36. Comedy (Individual)
  {
    id: "series-36",
    batchNumber: 4,
    slug: "cat-detective-watson",
    title: "Cat Detective Watson",
    synopsis:
      "Watson is a 14-pound ginger tabby who takes his job as 'Private Inquisitor of the Suburbs' very seriously, investigating the grave mystery of the missing bacon, the mailman's suspicious uniform, and the vacuum monster.",
    genre: "Comedy",
    format: "page",
    ownerType: "individual",
    ownerRef: "devon_reed",
    credits: [
      { roleCategory: "writer", creatorUsername: "devon_reed" },
      { roleCategory: "artist", creatorUsername: "devon_reed" },
      { roleCategory: "letterer", creatorUsername: "felix_castillo" },
    ],
    artStyle: "Humorous cartoon perspective, exaggerated feline drama, detective film-noir inner monologues, and warm suburban watercolors.",
    characters: [
      {
        name: "Detective Watson",
        role: "Protagonist",
        visualDescription: "Plump ginger tabby cat with white chest, intense analytical narrowed eyes, miniature felt deerstalker hat pinned between ears.",
        palette: ["#F77F00", "#FCBF49", "#EAE2B7", "#003049"],
      },
    ],
    coverPrompt:
      "Charming comedy comic cover for 'Cat Detective Watson'. Watson the fat ginger cat wearing a tiny Sherlock Holmes deerstalker hat, holding a magnifying glass in his paw while inspecting muddy dog pawprints on a suburban kitchen tile floor.",
    coverFile: "covers/cat-detective-watson.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Case of the Missing Roast",
        slug: "chapter-1-the-case-of-the-missing-roast",
        synopsis: "A Sunday pot roast goes missing from the kitchen counter.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Moody black-and-white noir panel with Watson narrating: 'It was a cold Tuesday in Suburbia.'",
            imagePrompt: "Cartoon noir comic page panel 1. Watson the cat silhouetted dramatically in venetian blind shadows on a kitchen stool, narrating like Humphrey Bogart.",
            imageFile: "episodes/cat-detective-watson/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The empty silver platter on the kitchen counter: only a parsley garnish remains.",
            imagePrompt: "Comic page panel 2. Crime scene. Empty ceramic serving dish on granite island, yellow caution tape drawn in cartoon crayon around a breadcrumb.",
            imageFile: "episodes/cat-detective-watson/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Watson interrogates Suspect #1: Buster the Golden Retriever, who is pretending to sleep.",
            imagePrompt: "Comic page panel 3. Watson glaring with narrowed eyes at Buster the golden retriever, who is snoring loudly with brown gravy smeared on his nose.",
            imageFile: "episodes/cat-detective-watson/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Watson swats Buster on the snout: 'The gravy does not lie, canine.'",
            imagePrompt: "Comic page panel 4. Watson delivering a swift cartoon paw-slap to the dog's nose, Buster looking up with comically guilty puppy eyes.",
            imageFile: "episodes/cat-detective-watson/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Roaring Vacuum Beast",
        slug: "chapter-2-the-roaring-vacuum-beast",
        synopsis: "The terrifying mechanical monster emerges from the closet.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The utility closet door creaks open; human owner wheels out the vacuum cleaner.",
            imagePrompt: "Comic page panel 1. Low angle dramatic horror parody. The human mother wheeling out an upright vacuum cleaner like a colossal demon.",
            imageFile: "episodes/cat-detective-watson/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The vacuum motor roars: Watson's fur puffs up to three times its normal size.",
            imagePrompt: "Comic page panel 2. The vacuum screaming: *VRRRROOOOOOM*, Watson instantly inflating into a giant spiky orange puffball with dilated saucer eyes.",
            imageFile: "episodes/cat-detective-watson/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Watson scampers up the curtains, clinging to the wooden rod like a fruit bat.",
            imagePrompt: "Comic page panel 3. Watson clinging upside down from the floral living room curtain rod, hissing valiantly at the carpet nozzle below.",
            imageFile: "episodes/cat-detective-watson/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The vacuum turns off; Watson calmly grooms his paw: 'I have successfully scared it into silence.'",
            imagePrompt: "Comic page panel 4. The vacuum unplugged; Watson sitting haughtily on the sofa, casually licking his front paw as if nothing happened.",
            imageFile: "episodes/cat-detective-watson/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Laser Dot Conspiracy",
        slug: "chapter-3-the-laser-dot-conspiracy",
        synopsis: "The elusive red phantom returns to haunt the hallway floor.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A tiny glowing red dot dances across the living room carpet.",
            imagePrompt: "Comic page panel 1. A glowing red laser dot hovering innocently on the oriental rug, Watson freezing mid-stride with intense focus.",
            imageFile: "episodes/cat-detective-watson/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Watson does his rhythmic pre-pounce butt wiggle with serious concentration.",
            imagePrompt: "Comic page panel 2. Watson crouching low, his fluffy ginger butt wiggling with cartoon physics as he calculates the ballistic trajectory.",
            imageFile: "episodes/cat-detective-watson/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "He leaps four feet into the air and crashes face-first into the sofa cushion.",
            imagePrompt: "Comic page panel 3. Watson soaring through the air like an orange comet, belly-flopping directly into a velvet throw pillow as the dot skips away.",
            imageFile: "episodes/cat-detective-watson/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Watson adjusts his hat: 'The red phantom escapes once more... but I will be ready.'",
            imagePrompt: "Comic page panel 4. Ending panel. Watson straightening his tiny felt detective hat, staring determinedly out the window as evening falls.",
            imageFile: "episodes/cat-detective-watson/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 37. Drama (Individual)
  {
    id: "series-37",
    batchNumber: 4,
    slug: "the-glassblower-of-murano",
    title: "The Glassblower of Murano",
    synopsis:
      "On the island of Murano in 1968, a fiercely proud third-generation furnace master refuses to sell his handmade artisan studio to industrial plastic conglomerates, teaching his rebellious granddaughter the secret recipe of ruby gold-leaf glass.",
    genre: "Drama",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "chloe_dupont",
    credits: [
      { roleCategory: "writer", creatorUsername: "chloe_dupont" },
      { roleCategory: "artist", creatorUsername: "chloe_dupont" },
      { roleCategory: "editor", creatorUsername: "soraya_mirza" },
    ],
    artStyle: "Luminous Venetian canal watercolors, blazing glassblowing furnaces, glowing molten amber goblets, and heartfelt family heritage drama.",
    characters: [
      {
        name: "Maestro Carlo Rossi",
        role: "Protagonist",
        visualDescription: "68-year-old master glassblower with white hair, leathery tanned skin, linen shirt with rolled sleeves, holding a five-foot steel blowpipe.",
        palette: ["#9B2226", "#AE2012", "#E9D8A6", "#005F73"],
      },
    ],
    coverPrompt:
      "Vibrant Venetian drama comic cover for 'The Glassblower of Murano'. Maestro Carlo and his granddaughter blowing a glowing molten ruby glass vase at the mouth of an ancient fiery brick furnace overlooking the blue Venice lagoon.",
    coverFile: "covers/the-glassblower-of-murano.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Fire Never Sleeps",
        slug: "chapter-1-the-fire-never-sleeps",
        synopsis: "The kiln has been burning continuously since Carlo's grandfather lit it in 1892.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Brick furnace workshop opening onto a turquoise Murano canal with gondolas.",
            imagePrompt: "Vertical scroll panel. Historic brick glassblowing atelier on Murano island, morning sun reflecting off canal waters through arched doorways.",
            imageFile: "episodes/the-glassblower-of-murano/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Carlo gathers a glowing red orb of molten silica from the crucible on the tip of his pipe.",
            imagePrompt: "Vertical scroll panel. Carlo dipping his stainless-steel rod into the fiery furnace crucible, gathering a glowing sphere of golden molten glass.",
            imageFile: "episodes/the-glassblower-of-murano/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "His granddaughter Francesca arrives from Milan with corporate buy-out contracts.",
            imagePrompt: "Vertical scroll panel. Francesca in a stylish tailored 1960s trench coat stepping onto the workshop flagstones, holding an executive leather folder.",
            imageFile: "episodes/the-glassblower-of-murano/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Carlo blows gently into the pipe, shaping a delicate translucent swan before her eyes.",
            imagePrompt: "Vertical scroll panel. Carlo blowing smoothly into the pipe, tweezers shaping a fragile glowing glass swan neck, capturing Francesca's breath.",
            imageFile: "episodes/the-glassblower-of-murano/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Ruby Secret",
        slug: "chapter-2-the-ruby-secret",
        synopsis: "Carlo reveals the family's secret 24-karat gold powder glaze formula.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Carlo opens an antique locked wooden chest containing jars of powdered mineral oxides.",
            imagePrompt: "Vertical scroll panel. Carlo unlocking an antique spice chest with labeled apothecary jars of cobalt, copper, and pure gold flakes.",
            imageFile: "episodes/the-glassblower-of-murano/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Francesca takes the steel pipe in her own hands, feeling the intense radiant heat.",
            imagePrompt: "Vertical scroll panel. Francesca rolling up her sleeves and taking the heavy iron blowpipe, her face illuminated by the molten red glass heat.",
            imageFile: "episodes/the-glassblower-of-murano/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Rolling the molten glass over a sheet of pure gold foil on the marver stone.",
            imagePrompt: "Vertical scroll panel. Rolling the hot ruby glass across a marble slab covered in leaf gold, microscopic gold flecks fusing into the fiery crystal.",
            imageFile: "episodes/the-glassblower-of-murano/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Francesca tears the buyout contract in half and tosses it into the waste bin.",
            imagePrompt: "Vertical scroll panel. Francesca tearing the corporate contract in two, smiling fiercely at her grandfather: 'We are making the Biennale.'",
            imageFile: "episodes/the-glassblower-of-murano/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Biennale Chandelier",
        slug: "chapter-3-the-biennale-chandelier",
        synopsis: "Unveiling their collaborative masterwork at the Venice Art Exhibition.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "A colossal ten-foot Murano chandelier hanging in the grand marble palazzo salon.",
            imagePrompt: "Vertical scroll panel. Grand Venetian palazzo ballroom with marble columns, holding a breathtaking chandelier of ruby, amber, and gold glass flowers.",
            imageFile: "episodes/the-glassblower-of-murano/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The lights turn on: hundreds of handmade glass petals illuminate the room in warm ruby light.",
            imagePrompt: "Vertical scroll panel. The chandelier switching on, casting warm kaleidoscopic patterns of ruby and amber light across hundreds of amazed patrons.",
            imageFile: "episodes/the-glassblower-of-murano/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The corporate director bows his head in defeat, unable to replicate such soul.",
            imagePrompt: "Vertical scroll panel. The defeated corporate executive quietly folding his briefcase and slipping away as the crowd roars with applause.",
            imageFile: "episodes/the-glassblower-of-murano/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Carlo and Francesca raise a glass of prosecco on their canal boat heading home.",
            imagePrompt: "Vertical scroll panel ending. Carlo and Francesca clinking glasses on a wooden water taxi on the Grand Canal, the city lights reflecting in the dark water.",
            imageFile: "episodes/the-glassblower-of-murano/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 38. Slice of Life (Individual)
  {
    id: "series-38",
    batchNumber: 4,
    slug: "the-bento-box-diaries",
    title: "The Bento Box Diaries",
    synopsis:
      "A culinary arts graduate working at a neighborhood Tokyo deli prepares personalized bento boxes with handwritten recipes and artistic arrangements that quietly brighten the lives of commuters, elderly neighbors, and exhausted students.",
    genre: "Slice of Life",
    format: "page",
    ownerType: "individual",
    ownerRef: "aiko_takahashi",
    credits: [
      { roleCategory: "writer", creatorUsername: "aiko_takahashi" },
      { roleCategory: "artist", creatorUsername: "aiko_takahashi" },
      { roleCategory: "editor", creatorUsername: "devon_reed" },
    ],
    artStyle: "Mouth-watering culinary illustrations, warm kitchen lighting, colorful vegetable garnishes, and gentle comforting slice-of-life storytelling.",
    characters: [
      {
        name: "Yuki Morita",
        role: "Protagonist",
        visualDescription: "24-year-old deli cook with short black hair under a clean white bandana, apron with wooden chopsticks tucked into the pocket, warm smiling eyes.",
        palette: ["#D4A373", "#CCD5AE", "#E9EDC9", "#FAEDCD"],
      },
    ],
    coverPrompt:
      "Heartwarming food slice-of-life comic cover for 'The Bento Box Diaries'. Yuki Morita arranging an exquisite lacquered wooden bento box with rolled tamagoyaki egg, pink pickled ginger, crisp karaage fried chicken, and molded rice topped with black sesame.",
    coverFile: "covers/the-bento-box-diaries.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Tamagoyaki Sunrise",
        slug: "chapter-1-tamagoyaki-sunrise",
        synopsis: "The rhythmic morning prep of sweet rolled omelettes and steaming rice.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Tokyo neighborhood morning: dawn light touching the green deli awning on a shopping street.",
            imagePrompt: "Food comic page panel 1. Tokyo neighborhood shopping street at sunrise, steam rising from bakery vents, Yuki unlocking the deli front door.",
            imageFile: "episodes/the-bento-box-diaries/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Yuki rolling a rectangular golden yellow omelette in a traditional copper pan.",
            imagePrompt: "Comic page panel 2. Close up on square copper tamagoyaki pan. Yuki using long wooden chopsticks to roll layers of golden yellow seasoned egg.",
            imageFile: "episodes/the-bento-box-diaries/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "An exhausted cram-school student looks into the glass counter with drooping eyes.",
            imagePrompt: "Comic page panel 3. A tired high school boy with heavy backpack and study books peering at the glass display case with a hungry, defeated look.",
            imageFile: "episodes/the-bento-box-diaries/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Yuki hands him a freshly packed bento with an extra slice of egg and a note: 'You've got this.'",
            imagePrompt: "Comic page panel 4. Yuki handing the warm bento wrapped in furoshiki cloth with a handwritten note, the student's eyes lighting up with gratitude.",
            imageFile: "episodes/the-bento-box-diaries/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Autumn Chestnut Rice",
        slug: "chapter-2-the-autumn-chestnut-rice",
        synopsis: "Celebrating the autumn harvest with sweet chestnuts and grilled salmon.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Steaming wooden rice tub being opened, revealing fragrant chestnut rice with black sesame.",
            imagePrompt: "Comic page panel 1. Steam billowing from an open wooden cedar rice cooker, revealing glistening rice mixed with golden roasted chestnuts.",
            imageFile: "episodes/the-bento-box-diaries/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Grilling salted salmon fillets over charcoal until the skin blisters crisp and golden.",
            imagePrompt: "Comic page panel 2. Sizzling pink salmon fillets on a charcoal grill wire mesh, white smoke rising as fat drips onto hot coals.",
            imageFile: "episodes/the-bento-box-diaries/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "An elderly neighbor Mrs. Honda stops by with fresh persimmons from her garden.",
            imagePrompt: "Comic page panel 3. Sweet elderly neighborhood grandma handing Yuki a basket of orange persimmons, trading gossip with warm smiles.",
            imageFile: "episodes/the-bento-box-diaries/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Packing a special low-sodium bento with simmered kabocha pumpkin for Mrs. Honda.",
            imagePrompt: "Comic page panel 4. Beautifully packed wooden bento box with glazed orange kabocha pumpkin and fresh lotus root slices arranged like a flower.",
            imageFile: "episodes/the-bento-box-diaries/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "Spring Hanami Picnic",
        slug: "chapter-3-spring-hanami-picnic",
        synopsis: "The neighborhood gathers in the park under falling cherry blossoms.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Ueno Park under peak pink cherry blossom canopy, blue tarps spread across the lawn.",
            imagePrompt: "Comic page panel 1. Ueno park bursting with pink sakura cherry blossoms in full bloom, pink petals falling like confetti in the breeze.",
            imageFile: "episodes/the-bento-box-diaries/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Deli regulars, students, and neighbors sharing a massive multi-tiered picnic bento.",
            imagePrompt: "Comic page panel 2. A grand three-tiered black lacquer bento jubilee box filled with colorful onigiri, fried chicken, and colorful pickled radish.",
            imageFile: "episodes/the-bento-box-diaries/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "The student from Chapter 1 returns with his college acceptance letter to show Yuki.",
            imagePrompt: "Comic page panel 3. The high school student smiling proudly, showing Yuki his university acceptance certificate as everyone cheers.",
            imageFile: "episodes/the-bento-box-diaries/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Yuki laughs warmly with her friends as cherry blossom petals drift into her tea cup.",
            imagePrompt: "Comic page panel 4. Ending panel. Yuki laughing with neighbors under the pink sakura branches, a single petal floating gently in her green tea cup.",
            imageFile: "episodes/the-bento-box-diaries/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 39. Mystery (Studio: Neon District)
  {
    id: "series-39",
    batchNumber: 4,
    slug: "tokyo-redacted-files",
    title: "The Tokyo Redacted Files",
    synopsis:
      "Within Tokyo Metropolitan Police Division 0, a skeptical detective and an eccentric archive archivist investigate urban cold cases that official reports classify as 'classified atmospheric anomalies'—the supernatural crimes the city refuses to acknowledge.",
    genre: "Mystery",
    format: "scroll",
    ownerType: "studio",
    ownerRef: "neon-district-collective",
    credits: [
      { roleCategory: "writer", creatorUsername: "maya_lin" },
      { roleCategory: "artist", creatorUsername: "elena_vance" },
      { roleCategory: "editor", creatorUsername: "tariq_al_mansoor" },
    ],
    artStyle: "High-contrast urban procedural noir, red censorship redaction tape, Tokyo rain-slicked crosswalks, and eerie supernatural forensic clues.",
    characters: [
      {
        name: "Detective Kenji Sato",
        role: "Protagonist",
        visualDescription: "36-year-old homicide detective with stubbled jaw, black suit with loosened tie, umbrella, sharp suspicious gaze.",
        palette: ["#14213D", "#FCA311", "#E5E5E5", "#000000"],
      },
    ],
    coverPrompt:
      "Gripping investigative mystery comic cover for 'The Tokyo Redacted Files'. Detective Kenji Sato standing under an umbrella at a rainy Shibuya scramble crossing at night, looking at a crime scene silhouette that glows with eerie purple supernatural energy.",
    coverFile: "covers/tokyo-redacted-files.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "Case #001: The Vanishing Platform",
        slug: "chapter-1-case-001-the-vanishing-platform",
        synopsis: "A subway car enters the Yamanote loop and vanishes between two stations.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Crowded evening Shibuya station in rain, trains entering the glowing tunnel.",
            imagePrompt: "Vertical scroll panel. Rainy Shibuya train station at rush hour, colorful umbrella crowds and glowing train headlights.",
            imageFile: "episodes/tokyo-redacted-files/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Kenji examining the empty track where Train 402 stopped responding to dispatch.",
            imagePrompt: "Vertical scroll panel. Detective Kenji in wet overcoat walking down the dark subway tracks with a flashlight, yellow tape on rails.",
            imageFile: "episodes/tokyo-redacted-files/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "His quirky partner Shiori points out an unmapped maintenance hatch covered in black seals.",
            imagePrompt: "Vertical scroll panel. Archive specialist Shiori shining an ultraviolet blacklight on the tunnel wall, revealing glowing warding talismans.",
            imageFile: "episodes/tokyo-redacted-files/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Inside the hatch: a phantom platform lit by retro 1970s incandescent lights.",
            imagePrompt: "Vertical scroll panel reveal. Step through the hatch into a hidden vintage 1970s train station frozen in time, the missing train sitting silent.",
            imageFile: "episodes/tokyo-redacted-files/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Midnight Express",
        slug: "chapter-2-the-midnight-express",
        synopsis: "Boarding the ghost train to rescue the frozen passengers.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Walking through the train cars: passengers sitting frozen in place like wax figures.",
            imagePrompt: "Vertical scroll panel. Walking down the green-seated train aisle: passengers frozen motionless mid-motion, newspapers suspended in air.",
            imageFile: "episodes/tokyo-redacted-files/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "In the conductor's cab, a faceless shadow figure operates the brake throttle.",
            imagePrompt: "Vertical scroll panel. Conductor cabin. A faceless shadowy entity in a vintage rail uniform holding the bronze brake lever.",
            imageFile: "episodes/tokyo-redacted-files/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kenji draws his service revolver and Shiori tosses an ancient bronze coin into the ticket slot.",
            imagePrompt: "Vertical scroll panel. Shiori tossing an antique coin into the fare box: 'Fare paid for twenty-two passengers, conductor.'",
            imageFile: "episodes/tokyo-redacted-files/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The shadow conductor bows and pulls the emergency brake, breaking the time curse.",
            imagePrompt: "Vertical scroll panel. The shadow conductor bowing politely as the brakes hiss with white steam, the curse lifting.",
            imageFile: "episodes/tokyo-redacted-files/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The File is Stamped",
        slug: "chapter-3-the-file-is-stamped",
        synopsis: "Returning the train to the modern grid and filing the secret dossier.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The train glides smoothly back into modern Shinjuku station; passengers wake up as if from a nap.",
            imagePrompt: "Vertical scroll panel. The train pulling safely into bright modern Shinjuku station, passengers blinking and looking at their watches.",
            imageFile: "episodes/tokyo-redacted-files/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "Back in Division 0 basement: filing the case report under lock and key.",
            imagePrompt: "Vertical scroll panel. Kenji typing the report on an old typewriter, Shiori filing the folder into a massive steel bank vault.",
            imageFile: "episodes/tokyo-redacted-files/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Kenji slams the red rubber stamp across the case summary: 'REDACTED'.",
            imagePrompt: "Vertical scroll panel. Close-up on official manila folder: heavy red ink stamp: 'REDACTED — DIVISION 0 EYES ONLY'.",
            imageFile: "episodes/tokyo-redacted-files/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "The telephone rings: 'Kenji? We have another anomaly in Akihabara.'",
            imagePrompt: "Vertical scroll panel ending. Kenji picking up the ringing black rotary phone, lighting a cigarette with a tired smirk: 'On our way.'",
            imageFile: "episodes/tokyo-redacted-files/ep3_p4.png",
          },
        ],
      },
    ],
  },

  // 40. Supernatural (Individual)
  {
    id: "series-40",
    batchNumber: 4,
    slug: "tides-of-the-spirit-moon",
    title: "Tides of the Spirit Moon",
    synopsis:
      "Once every twenty-seven years, the spring tides of Bahia Blanca recede so far into the ocean that the ancient sunken spirit city of the indigenous coast emerges, allowing a lighthouse diver to reunite with the phantom of his lost childhood friend.",
    genre: "Supernatural",
    format: "scroll",
    ownerType: "individual",
    ownerRef: "lucas_valerio",
    credits: [
      { roleCategory: "writer", creatorUsername: "lucas_valerio" },
      { roleCategory: "artist", creatorUsername: "lucas_valerio" },
      { roleCategory: "editor", creatorUsername: "clara_thorne" },
    ],
    artStyle: "Magical realism, luminescent sea-glass colors, vast low-tide ocean horizons, and ethereal spirit reunions.",
    characters: [
      {
        name: "Gabriel Santos",
        role: "Protagonist",
        visualDescription: "27-year-old coastal diver with sun-darkened skin, sea-turtle shell amulet, rolled fisherman trousers, barefoot on wet tidal sand.",
        palette: ["#03045E", "#0077B6", "#00B4D8", "#90E0EF"],
      },
    ],
    coverPrompt:
      "Breathtaking supernatural comic cover for 'Tides of the Spirit Moon'. Gabriel walking across an endless mirror-like low-tide wet sand beach toward the glowing moonlit coral ruins of a sunken city under a giant luminous full moon.",
    coverFile: "covers/tides-of-the-spirit-moon.png",
    episodes: [
      {
        episodeNumber: 1,
        title: "The Great Ebb",
        slug: "chapter-1-the-great-ebb",
        synopsis: "The ocean recedes two miles past the reef barrier under the supermoon.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Colossal supermoon rising over the tranquil South American coastal cliffs.",
            imagePrompt: "Vertical scroll panel. Gigantic silver full moon rising over rocky ocean cliffs, casting a brilliant silver highway of light across calm water.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep1_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The water drawing back rapidly, exposing ancient stone pathways on the sea floor.",
            imagePrompt: "Vertical scroll panel. The sea drawing back in a massive low tide, revealing ancient stone paved roads and coral archways covered in starfish.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep1_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Gabriel walking barefoot onto the damp sand carrying a woven sea-grass lantern.",
            imagePrompt: "Vertical scroll panel. Gabriel stepping onto the wet reflective sand, his lantern casting warm golden light across tidal pools.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep1_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "In the distance, the glowing translucent shapes of ancient spirit villagers begin walking.",
            imagePrompt: "Vertical scroll panel reveal. Far out on the exposed sand, hundreds of glowing blue spirits of ancient sea-peoples gathering with torches.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep1_p4.png",
          },
        ],
      },
      {
        episodeNumber: 2,
        title: "The Coral Plaza",
        slug: "chapter-2-the-coral-plaza",
        synopsis: "Entering the submerged amphitheater that only appears once a generation.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "Gabriel reaching the circular stone amphitheater adorned with glowing sea anemones.",
            imagePrompt: "Vertical scroll panel. Grand stone amphitheater rising from the wet sand, draped in purple and turquoise glowing bioluminescent sea plants.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep2_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "A glowing spirit girl steps forward from the crowd: his childhood friend Marina.",
            imagePrompt: "Vertical scroll panel. A radiant spirit girl with sea-glass flowers in her hair stepping forward with an unforgettable, loving smile.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep2_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "They embrace: her touch feels like cool ocean mist and warm summer memories.",
            imagePrompt: "Vertical scroll panel. Emotional embrace. Gabriel and the spirit girl holding each other, blue bioluminescent motes swirling around them.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep2_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Marina hands him an iridescent conch shell that holds the memory of their lost song.",
            imagePrompt: "Vertical scroll panel. Marina placing a pearlescent conch shell into his hands, pulsing with soft musical chimes.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep2_p4.png",
          },
        ],
      },
      {
        episodeNumber: 3,
        title: "The Returning Tide",
        slug: "chapter-3-the-returning-tide",
        synopsis: "The ocean returns as the spirit moon sets into dawn.",
        pages: [
          {
            pageNumber: 1,
            sceneDescription: "The distant roar of the returning tide crashing against the outer reef.",
            imagePrompt: "Vertical scroll panel. The white wall of foaming ocean tide rushing back across the distant reef in thunderous white surf.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep3_p1.png",
          },
          {
            pageNumber: 2,
            sceneDescription: "The spirits bow and dissolve peacefully into silver sea spray.",
            imagePrompt: "Vertical scroll panel. The hundreds of spirits dissolving into glittering sea mist, waving in peaceful farewell.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep3_p2.png",
          },
          {
            pageNumber: 3,
            sceneDescription: "Gabriel sprints back toward the safety of the cliff staircase as water reaches his ankles.",
            imagePrompt: "Vertical scroll panel. Gabriel running along the wet sand path back toward the stone cliff steps as clean turquoise waves roll in.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep3_p3.png",
          },
          {
            pageNumber: 4,
            sceneDescription: "Standing on the cliff top, he listens to the conch shell with peace in his heart.",
            imagePrompt: "Vertical scroll panel ending. Gabriel standing safely on the high cliff at sunrise, holding the shell to his ear with a serene, healed smile.",
            imageFile: "episodes/tides-of-the-spirit-moon/ep3_p4.png",
          },
        ],
      },
    ],
  },
];
