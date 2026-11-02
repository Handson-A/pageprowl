import type { SeriesManifest } from "../../types.ts";
import { BATCH_1_STORIES } from "./stories/index.ts";

export const BATCH_1_SERIES: SeriesManifest[] = [
  {
    "id": "series-01",
    "batchNumber": 1,
    "slug": "vanguard-strike-neo-seoul",
    "title": "Vanguard Strike: Neo-Seoul",
    "synopsis": "When rogue combat droids seize control of the subterranean Mag-Lev corridor, cybernetically augmented martial artist Jun-Seo must battle his way upward through thirty fortified levels to save his trapped sister.",
    "genre": "Action",
    "format": "scroll",
    "ownerType": "individual",
    "ownerRef": "jin_woo_park",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "jin_woo_park"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "jin_woo_park"
      },
      {
        "roleCategory": "editor",
        "creatorUsername": "devon_reed"
      }
    ],
    "artStyle": "High-contrast dynamic ink linework with kinetic speedlines and glowing neon cyan and crimson rim lighting.",
    "characters": [
      {
        "name": "Jun-Seo Kang",
        "role": "Protagonist",
        "visualDescription": "Athletic 24-year-old martial artist with an asymmetric undercut, chrome cybernetic right arm with glowing blue power conduits, and dark techwear combat vest.",
        "palette": [
          "#0D1B2A",
          "#1B263B",
          "#00F0FF",
          "#FF0055"
        ]
      }
    ],
    "coverPrompt": "Cinematic action comic cover for 'Vanguard Strike: Neo-Seoul'. Jun-Seo Kang in mid-air flying kick with his glowing cyan cybernetic fist charged with blue lightning, shattering an armored security bot against a rain-slicked Neo-Seoul skyscraper backdrop. Dynamic angles, neon reflections.",
    "coverFile": "covers/vanguard-strike-neo-seoul.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "Breach at Sub-Level 4",
        "slug": "chapter-1-breach-at-sub-level-4",
        "synopsis": "The emergency alarm sounds in Sector 9 as rogue droids sever the power grid.",
        "pages": [
          {
            "pageNumber": 1,
            "sceneDescription": "Panoramic vertical establishing shot of the towering dystopian Neo-Seoul skyline in heavy rain.",
            "imagePrompt": "Comic panel vertical scroll opening. Towering futuristic Neo-Seoul skyscrapers under heavy torrential rain, glowing holographic billboards reflecting off wet steel scaffolding.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep1_p1.png"
          },
          {
            "pageNumber": 2,
            "sceneDescription": "Sub-Level 4 control room plunging into emergency red strobe lighting as security consoles spark.",
            "imagePrompt": "Comic panel interior shot. Subterranean transit station control room bathed in intense red emergency beacon light, shattered computer consoles showering electric sparks.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep1_p2.png"
          },
          {
            "pageNumber": 3,
            "sceneDescription": "Jun-Seo lands silently on a metal catwalk, adjusting his glowing cybernetic fist.",
            "imagePrompt": "Comic panel dynamic hero entrance. Jun-Seo Kang crouching on a steel catwalk, his glowing cyan cybernetic right arm clicking into combat stance, looking down with intense focus.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep1_p3.png"
          },
          {
            "pageNumber": 4,
            "sceneDescription": "A squad of three red-eyed assault droids raise heavy plasma rifles toward him.",
            "imagePrompt": "Comic panel climax confrontation. Three menacing bipedal combat droids with glowing hexagonal red visors raising energy carbines toward the reader from the blast doors.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep1_p4.png"
          }
        ],
        "textContent": "__STORY_vanguard-strike-neo-seoul_1__"
      },
      {
        "episodeNumber": 2,
        "title": "Kinetic Velocity",
        "slug": "chapter-2-kinetic-velocity",
        "synopsis": "Jun-Seo unleashes his augmented combat system to shatter the front vanguard.",
        "pages": [
          {
            "pageNumber": 1,
            "sceneDescription": "Jun-Seo leaps from the catwalk, dodging bright red plasma bolts.",
            "imagePrompt": "Comic panel high-speed action. Jun-Seo diving mid-air while glowing red energy bolts scorch the steel rafters behind him, motion blurs and speedlines.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep2_p1.png"
          },
          {
            "pageNumber": 2,
            "sceneDescription": "Close-up punch as Jun-Seo's fist shatters a combat droid's titanium chestplate.",
            "imagePrompt": "Comic panel extreme close-up impact. Jun-Seo's glowing cyan cybernetic knuckles colliding with a metal robot chestplate, sending metallic shards and electric sparks exploding outwards.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep2_p2.png"
          },
          {
            "pageNumber": 3,
            "sceneDescription": "Spinning sweep kick taking down the second machine against the platform railing.",
            "imagePrompt": "Comic panel kinetic combat. Jun-Seo executing a 360-degree sweep kick, cleaving through the chassis of a combat droid against safety railings overlooking the dark train abyss.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep2_p3.png"
          },
          {
            "pageNumber": 4,
            "sceneDescription": "The remaining droid retreats into the dark express tunnel as a blast door begins to close.",
            "imagePrompt": "Comic panel suspense cliffhanger. A damaged droid crawling into a dark subway tunnel as an armored blast door slams downward with yellow caution hazard stripes.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep2_p4.png"
          }
        ],
        "textContent": "__STORY_vanguard-strike-neo-seoul_2__"
      },
      {
        "episodeNumber": 3,
        "title": "Into the Mag-Lev Dark",
        "slug": "chapter-3-into-the-mag-lev-dark",
        "synopsis": "Diving into the high-speed transit tunnel on the heels of the rogue commander.",
        "pages": [
          {
            "pageNumber": 1,
            "sceneDescription": "Jun-Seo slides under the closing blast door just before it seals shut.",
            "imagePrompt": "Comic panel tension moment. Jun-Seo baseball-sliding horizontally beneath a hydraulic steel blast door with inches to spare, sparks flying from his boots.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep3_p1.png"
          },
          {
            "pageNumber": 2,
            "sceneDescription": "Dark pitch-black tunnel illuminated only by rhythmic blue track magnets.",
            "imagePrompt": "Comic panel eerie deep perspective. Endless subterranean vacuum tube tunnel stretching into darkness, glowing blue electromagnetic guide rails casting cyan light on damp walls.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep3_p2.png"
          },
          {
            "pageNumber": 3,
            "sceneDescription": "Twin headlights appear in the distance: a runaway bullet train hurtling toward him.",
            "imagePrompt": "Comic panel shock discovery. Far down the tunnel, two blinding high-beam halogen headlights of an oncoming magnetic train reflecting off Jun-Seo's alarmed face.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep3_p3.png"
          },
          {
            "pageNumber": 4,
            "sceneDescription": "Jun-Seo readies his magnetic grappling line to latch onto the rushing train roof.",
            "imagePrompt": "Comic panel episode cliffhanger. Jun-Seo aiming a wrist-mounted magnetic harpoon launcher directly upward at the approaching freight train roof, determined grit on his face.",
            "imageFile": "episodes/vanguard-strike-neo-seoul/ep3_p4.png"
          }
        ],
        "textContent": "__STORY_vanguard-strike-neo-seoul_3__"
      }
    ]
  },
  {
    "id": "series-02",
    "batchNumber": 1,
    "slug": "the-runebound-chronicle",
    "title": "The Runebound Chronicle",
    "synopsis": "In a realm where written runes weave the fabric of reality, an apprentice scribe discovers an ancient glyph forbidden by the Grand Citadel—and the dying prophecy carved into her own skin.",
    "genre": "Fantasy",
    "format": "page",
    "ownerType": "studio",
    "ownerRef": "iron-quill-studios",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "marcus_kane"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "rowan_macleod"
      },
      {
        "roleCategory": "letterer",
        "creatorUsername": "devon_reed"
      }
    ],
    "artStyle": "Rich parchment textures, hand-inked crosshatching, luminous amber magical glyphs, and epic atmospheric perspective.",
    "characters": [
      {
        "name": "Lyra Vance",
        "role": "Protagonist",
        "visualDescription": "Spirited 19-year-old scribe with platinum braided hair, dark forest-green linen tunic, leather arm bracers, and a glowing bronze stylus pen.",
        "palette": [
          "#2B4136",
          "#D4AF37",
          "#F4ECD8",
          "#1E1A17"
        ]
      }
    ],
    "coverPrompt": "Epic fantasy comic book cover for 'The Runebound Chronicle'. Apprentice scribe Lyra holding aloft a glowing bronze stylus that etches golden burning runes into mid-air, standing atop the windy ramparts of an ancient stone citadel overlooking a mystic pine valley under twilight skies.",
    "coverFile": "covers/the-runebound-chronicle.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "The Silent Scriptorium",
        "slug": "chapter-1-the-silent-scriptorium",
        "synopsis": "Lyra works the midnight cataloguing shift inside the forbidden subterranean vaults.",
        "textContent": "__STORY_the-runebound-chronicle_1__"
      },
      {
        "episodeNumber": 2,
        "title": "Glyph of the Unspoken",
        "slug": "chapter-2-glyph-of-the-unspoken",
        "synopsis": "The magic marks her skin and sounds the alarm bells across the Citadel.",
        "textContent": "__STORY_the-runebound-chronicle_2__"
      },
      {
        "episodeNumber": 3,
        "title": "Beyond the Iron Gate",
        "slug": "chapter-3-beyond-the-iron-gate",
        "synopsis": "Escaping the Citadel into the whispering mists of the Great Pine Wilderness.",
        "textContent": "__STORY_the-runebound-chronicle_3__"
      }
    ]
  },
  {
    "id": "series-03",
    "batchNumber": 1,
    "slug": "sub-orbital-drift",
    "title": "Sub-Orbital Drift",
    "synopsis": "Deep in the salvage graveyard orbiting Jupiter's moon Ganymede, a lone salvage scrapper recovers an abandoned interstellar freighter containing a hibernation pod that was never registered in corporate manifests.",
    "genre": "Sci-Fi",
    "format": "scroll",
    "ownerType": "studio",
    "ownerRef": "neon-district-collective",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "tariq_al_mansoor"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "elena_vance"
      },
      {
        "roleCategory": "letterer",
        "creatorUsername": "sam_okoro"
      }
    ],
    "artStyle": "Hard science-fiction, pressurized industrial airlocks, deep cosmic starfields, and stark emergency amber hazard lighting.",
    "characters": [
      {
        "name": "Commander Kaelen Voss",
        "role": "Protagonist",
        "visualDescription": "Weathered 38-year-old deep-space salvage pilot with cropped salt-and-pepper hair, scarred left eyebrow, heavy thermal pressure suit with orange utility harness.",
        "palette": [
          "#141923",
          "#FF6B35",
          "#3A86FF",
          "#E0E1DD"
        ]
      }
    ],
    "coverPrompt": "Stunning sci-fi comic cover for 'Sub-Orbital Drift'. Commander Kaelen in his pressurized EVA space suit tethered outside an enormous decaying derelict spaceship hull orbiting the swirling rust-orange storm clouds of Jupiter.",
    "coverFile": "covers/sub-orbital-drift.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "The Graveyard Shift",
        "slug": "chapter-1-the-graveyard-shift",
        "synopsis": "Kaelen's salvage tug locks onto an unregistered derelict drifting in the debris belt.",
        "textContent": "__STORY_sub-orbital-drift_1__"
      },
      {
        "episodeNumber": 2,
        "title": "Thermal Cycle Initiated",
        "slug": "chapter-2-thermal-cycle-initiated",
        "synopsis": "Connecting backup power triggers an emergency automated thawing sequence.",
        "textContent": "__STORY_sub-orbital-drift_2__"
      },
      {
        "episodeNumber": 3,
        "title": "Transmission Intercepted",
        "slug": "chapter-3-transmission-intercepted",
        "synopsis": "The pod release triggers a military homing beacon that alerts deep-space patrol cruisers.",
        "textContent": "__STORY_sub-orbital-drift_3__"
      }
    ]
  },
  {
    "id": "series-04",
    "batchNumber": 1,
    "slug": "between-two-skylines",
    "title": "Between Two Skylines",
    "synopsis": "An ambitious rooftop landscape architect and a reclusive rooftop jazz pianist strike up an unlikely connection across adjacent high-rise balconies during the quiet hours before dawn.",
    "genre": "Romance",
    "format": "scroll",
    "ownerType": "individual",
    "ownerRef": "soraya_mirza",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "soraya_mirza"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "soraya_mirza"
      },
      {
        "roleCategory": "editor",
        "creatorUsername": "chloe_dupont"
      }
    ],
    "artStyle": "Luminous pastel dusk and dawn skies, warm tea-stained washes, delicate architectural linework, and soft romantic lighting.",
    "characters": [
      {
        "name": "Yasmin Farooqi",
        "role": "Protagonist",
        "visualDescription": "27-year-old architectural designer with long raven curls tied in a messy work scarf, warm olive complexion, terracotta work jacket, holding drafting rolls.",
        "palette": [
          "#D97736",
          "#4A5859",
          "#F4A261",
          "#E76F51"
        ]
      },
      {
        "name": "Julian Rhys",
        "role": "Co-Lead",
        "visualDescription": "29-year-old jazz pianist with wavy sandy-brown hair, round silver spectacles, charcoal wool cardigan, and expressive musician hands.",
        "palette": [
          "#264653",
          "#2A9D8F",
          "#E9C46A",
          "#F7EDE2"
        ]
      }
    ],
    "coverPrompt": "Heartfelt indie romance comic cover for 'Between Two Skylines'. Yasmin and Julian leaning against the wrought-iron railings of their adjacent rooftop balconies, sharing a warm quiet smile across the narrow gap as the pink and amber city sunrise breaks behind them.",
    "coverFile": "covers/between-two-skylines.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "Notes Across the Gap",
        "slug": "chapter-1-notes-across-the-gap",
        "synopsis": "A late-night melody drifts across the courtyard during an impossible blueprint deadline.",
        "textContent": "__STORY_between-two-skylines_1__"
      },
      {
        "episodeNumber": 2,
        "title": "Paper Aeroplanes",
        "slug": "chapter-2-paper-aeroplanes",
        "synopsis": "When words are too far to shout, folded drafting paper bridges the distance.",
        "textContent": "__STORY_between-two-skylines_2__"
      },
      {
        "episodeNumber": 3,
        "title": "What Song Was That?",
        "slug": "chapter-3-what-song-was-that",
        "synopsis": "The note reveals the start of an unspoken shared secret.",
        "textContent": "__STORY_between-two-skylines_3__"
      }
    ]
  },
  {
    "id": "series-05",
    "batchNumber": 1,
    "slug": "whispers-of-the-black-bog",
    "title": "Whispers of the Black Bog",
    "synopsis": "A pragmatic Victorian coroner is called to an isolated peat harvesting village on the Yorkshire moors to examine bodies pulled from the bog that show zero decay—and keep opening their eyes.",
    "genre": "Horror",
    "format": "page",
    "ownerType": "studio",
    "ownerRef": "velvet-crow-press",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "clara_thorne"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "clara_thorne"
      },
      {
        "roleCategory": "editor",
        "creatorUsername": "hannah_lindqvist"
      }
    ],
    "artStyle": "Gritty scratchboard Victorian gothic, deep shadow pooling, chilling mist effects, and stark macabre anatomy.",
    "characters": [
      {
        "name": "Dr. Arthur Campbell",
        "role": "Protagonist",
        "visualDescription": "Austere 45-year-old physician with silver wire-rimmed glasses, dark woolen ulster coat, leather doctor's bag, and trembling analytical hands.",
        "palette": [
          "#1B1B1B",
          "#3D3A37",
          "#8D8B88",
          "#58181F"
        ]
      }
    ],
    "coverPrompt": "Chilling gothic horror comic cover for 'Whispers of the Black Bog'. Dr. Arthur Campbell holding a brass kerosene lantern over a black peat bog at midnight, as a pale, perfectly preserved bog body rises silently from the dark water behind him through curling gray fog.",
    "coverFile": "covers/whispers-of-the-black-bog.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "The Peat Vault",
        "slug": "chapter-1-the-peat-vault",
        "synopsis": "Dr. Campbell arrives in Blackwood Fen and inspects the first recovered specimen.",
        "textContent": "__STORY_whispers-of-the-black-bog_1__"
      },
      {
        "episodeNumber": 2,
        "title": "Cold Respiration",
        "slug": "chapter-2-cold-respiration",
        "synopsis": "The autopsy uncovers something far worse than undeath: an ancient living collective.",
        "textContent": "__STORY_whispers-of-the-black-bog_2__"
      },
      {
        "episodeNumber": 3,
        "title": "The Chorus Below",
        "slug": "chapter-3-the-chorus-below",
        "synopsis": "Fleeing the mortuary only to find the entire village gathered at the water's edge.",
        "textContent": "__STORY_whispers-of-the-black-bog_3__"
      }
    ]
  },
  {
    "id": "series-06",
    "batchNumber": 1,
    "slug": "demon-kings-barista",
    "title": "Demon King's Barista",
    "synopsis": "When the terrifying Abyssal Overlord Malakor conquers modern downtown, he discovers Earth's greatest dark sorcery: triple-shot iced oat milk caramel macchiatos. Now, exhausted barista Toby is the most powerful human alive.",
    "genre": "Comedy",
    "format": "scroll",
    "ownerType": "individual",
    "ownerRef": "devon_reed",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "devon_reed"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "devon_reed"
      },
      {
        "roleCategory": "letterer",
        "creatorUsername": "felix_castillo"
      }
    ],
    "artStyle": "Charming colorful pop-art with snappy comedic timing, exaggerated chibi reactions, and bright cozy cafe vibes.",
    "characters": [
      {
        "name": "Toby Finch",
        "role": "Protagonist",
        "visualDescription": "Frazzled 22-year-old barista with unruly brown curls, round glasses, coffee-bean patterned green apron, holding an espresso tamper like a weapon.",
        "palette": [
          "#2A9D8F",
          "#E76F51",
          "#F4A261",
          "#FFFFFF"
        ]
      },
      {
        "name": "Lord Malakor",
        "role": "Co-Lead",
        "visualDescription": "Eight-foot-tall fearsome demon king with obsidian armor, flaming crimson ram horns, glowing yellow eyes, currently sipping delicately through a pink straw.",
        "palette": [
          "#1D1E2C",
          "#E63946",
          "#F1FAEE",
          "#A8DADC"
        ]
      }
    ],
    "coverPrompt": "Hilarious indie comedy webcomic cover for 'Demon King's Barista'. Towering demon overlord Malakor in spiky hellfire armor sitting uncomfortably on a tiny wooden cafe stool, sipping happily from an iced coffee with a pink straw, while frazzled barista Toby wipes the counter with deadpan exhaustion.",
    "coverFile": "covers/demon-kings-barista.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "Order for the Damned",
        "slug": "chapter-1-order-for-the-damned",
        "synopsis": "The apocalypse is temporarily postponed due to a sudden caffeine craving.",
        "textContent": "__STORY_demon-kings-barista_1__"
      },
      {
        "episodeNumber": 2,
        "title": "Extra Foam, Mortal",
        "slug": "chapter-2-extra-foam-mortal",
        "synopsis": "Lord Malakor takes his first sip and rethinks his conquest agenda.",
        "textContent": "__STORY_demon-kings-barista_2__"
      },
      {
        "episodeNumber": 3,
        "title": "Loyalty Punch Card",
        "slug": "chapter-3-loyalty-punch-card",
        "synopsis": "The demon army gets enrolled in the customer rewards program.",
        "textContent": "__STORY_demon-kings-barista_3__"
      }
    ]
  },
  {
    "id": "series-07",
    "batchNumber": 1,
    "slug": "the-clockmakers-ledger",
    "title": "The Clockmaker's Ledger",
    "synopsis": "In 1912 Geneva, a widowed horologist discovers a coded journal concealed within a masterwork grandfather clock left by his estranged father, uncovering thirty years of hidden family sacrifice.",
    "genre": "Drama",
    "format": "page",
    "ownerType": "individual",
    "ownerRef": "chloe_dupont",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "chloe_dupont"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "chloe_dupont"
      },
      {
        "roleCategory": "editor",
        "creatorUsername": "soraya_mirza"
      }
    ],
    "artStyle": "European ligne claire, muted amber and olive palette, fine antique mechanical draftsmanship, and deep human emotional subtlety.",
    "characters": [
      {
        "name": "Henri Delacroix",
        "role": "Protagonist",
        "visualDescription": "52-year-old Swiss horologist with neat silver hair, wire spectacles resting on his nose, linen waistcoat, leather apron with tiny precision tweezers in pocket.",
        "palette": [
          "#403D39",
          "#CCC5B9",
          "#EB5E28",
          "#252422"
        ]
      }
    ],
    "coverPrompt": "Refined dramatic comic cover for 'The Clockmaker's Ledger'. Master clockmaker Henri Delacroix inspecting an intricate brass clockwork escapement under a jeweler's magnifying loupe in his sunlit vintage Swiss workshop overlooking Lake Geneva.",
    "coverFile": "covers/the-clockmakers-ledger.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "The Unwound Spring",
        "slug": "chapter-1-the-unwound-spring",
        "synopsis": "An inheritance arrives at the workshop decades after bitter silence.",
        "textContent": "__STORY_the-clockmakers-ledger_1__"
      },
      {
        "episodeNumber": 2,
        "title": "Ink and Gearwork",
        "slug": "chapter-2-ink-and-gearwork",
        "synopsis": "The first entries reveal the true reason for his father's sudden departure in 1885.",
        "textContent": "__STORY_the-clockmakers-ledger_2__"
      },
      {
        "episodeNumber": 3,
        "title": "The Final Chime",
        "slug": "chapter-3-the-final-chime",
        "synopsis": "Repairing the clock restores a harmony that was broken thirty years before.",
        "textContent": "__STORY_the-clockmakers-ledger_3__"
      }
    ]
  },
  {
    "id": "series-08",
    "batchNumber": 1,
    "slug": "matcha-and-raindrops",
    "title": "Matcha & Raindrops",
    "synopsis": "A quiet artisanal bookbinder opens a workshop above a neighborhood Kyoto tea room, finding comfort in the rhythmic sound of folding paper, steaming tea kettle whistles, and gentle seasonal encounters.",
    "genre": "Slice of Life",
    "format": "scroll",
    "ownerType": "studio",
    "ownerRef": "heartstring-comics",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "aiko_takahashi"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "aiko_takahashi"
      },
      {
        "roleCategory": "editor",
        "creatorUsername": "soraya_mirza"
      }
    ],
    "artStyle": "Soft watercolor and colored pencil textures, gentle earthy tones, steaming mugs, rain on tatami mats, and calm slice-of-life pacing.",
    "characters": [
      {
        "name": "Mei Tanaka",
        "role": "Protagonist",
        "visualDescription": "25-year-old bookbinder with soft brown eyes, hair pinned up with a bone hairpin, indigo dyed linen apron over an oatmeal knit sweater.",
        "palette": [
          "#606C38",
          "#283618",
          "#DDA15E",
          "#BC6C25"
        ]
      }
    ],
    "coverPrompt": "Cozy slice-of-life comic cover for 'Matcha & Raindrops'. Mei Tanaka sitting beside an open wooden veranda window of her second-story Kyoto workshop, stitching an exposed-spine book with cream linen thread while gentle rain falls on the garden maple leaves outside.",
    "coverFile": "covers/matcha-and-raindrops.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "Morning Stitching",
        "slug": "chapter-1-morning-stitching",
        "synopsis": "The gentle morning routine of bone folders, linen thread, and fresh green tea.",
        "textContent": "__STORY_matcha-and-raindrops_1__"
      },
      {
        "episodeNumber": 2,
        "title": "The Waterlogged Diary",
        "slug": "chapter-2-the-waterlogged-diary",
        "synopsis": "A schoolgirl brings in a storm-damaged notebook that holds precious memories.",
        "textContent": "__STORY_matcha-and-raindrops_2__"
      },
      {
        "episodeNumber": 3,
        "title": "Gold-Leaf Binding",
        "slug": "chapter-3-gold-leaf-binding",
        "synopsis": "Adding the finishing touches of gold foil leaf to celebrate a restored memory.",
        "textContent": "__STORY_matcha-and-raindrops_3__"
      }
    ]
  },
  {
    "id": "series-09",
    "batchNumber": 1,
    "slug": "fogline-murders",
    "title": "Fogline Murders",
    "synopsis": "When cargo containers washed ashore on San Francisco's foggy coastline are found locked from the inside with cryptic nautical ciphers, cynical harbor detective Marcus Trent must navigate shipping cartels and city corruption.",
    "genre": "Mystery",
    "format": "page",
    "ownerType": "individual",
    "ownerRef": "maya_lin",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "maya_lin"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "maya_lin"
      },
      {
        "roleCategory": "editor",
        "creatorUsername": "hannah_lindqvist"
      }
    ],
    "artStyle": "High-contrast gritty neo-noir, deep charcoal shadows, rain-drenched pavement reflections, and cinematic wide-angle framing.",
    "characters": [
      {
        "name": "Marcus Trent",
        "role": "Protagonist",
        "visualDescription": "41-year-old harbor homicide detective with stubbled jaw, tired sharp brown eyes, weathered charcoal trench coat, and vintage brass lighter.",
        "palette": [
          "#12161A",
          "#2E3842",
          "#E0FBFC",
          "#C57B57"
        ]
      }
    ],
    "coverPrompt": "Cinematic neo-noir mystery comic cover for 'Fogline Murders'. Detective Marcus Trent standing in a wet trench coat under the orange industrial sodium lights of a foggy San Francisco shipping dock, looking down at an open rusted shipping container door while sirens flash in the misty distance.",
    "coverFile": "covers/fogline-murders.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "Pier 44 Cold Storage",
        "slug": "chapter-1-pier-44-cold-storage",
        "synopsis": "A storm reveals a shipping container that doesn't exist on any manifest.",
        "textContent": "__STORY_fogline-murders_1__"
      },
      {
        "episodeNumber": 2,
        "title": "The Manifest Cipher",
        "slug": "chapter-2-the-manifest-cipher",
        "synopsis": "Cracking the briefcase lock reveals shipping route coordinates that lead into deep water.",
        "textContent": "__STORY_fogline-murders_2__"
      },
      {
        "episodeNumber": 3,
        "title": "Sniper in the Gantry",
        "slug": "chapter-3-sniper-in-the-gantry",
        "synopsis": "Escaping the sniper's crosshairs along the maze of metal shipping crates.",
        "textContent": "__STORY_fogline-murders_3__"
      }
    ]
  },
  {
    "id": "series-10",
    "batchNumber": 1,
    "slug": "spirits-of-the-ironwood",
    "title": "Spirits of the Ironwood",
    "synopsis": "A banished shaman apprentice must escort wandering souls through the cursed Ironwood forest, protecting them from ancient shadow fiends with only a spirit lantern and a carved fox mask.",
    "genre": "Supernatural",
    "format": "scroll",
    "ownerType": "studio",
    "ownerRef": "velvet-crow-press",
    "credits": [
      {
        "roleCategory": "writer",
        "creatorUsername": "lucas_valerio"
      },
      {
        "roleCategory": "artist",
        "creatorUsername": "lucas_valerio"
      },
      {
        "roleCategory": "editor",
        "creatorUsername": "clara_thorne"
      }
    ],
    "artStyle": "Eerie dark fantasy with luminous spectral cyan spirits, deep moss greens, silhouetted ironwood branches, and glowing talismans.",
    "characters": [
      {
        "name": "Ren Takahashi",
        "role": "Protagonist",
        "visualDescription": "18-year-old spirit warden with half-fox wooden mask over his left eye, layered dark charcoal traveling robes, white braided warding rope, and a hanging iron spirit lantern.",
        "palette": [
          "#0B132B",
          "#1C2541",
          "#5BC0BE",
          "#6FFFE9"
        ]
      }
    ],
    "coverPrompt": "Breathtaking supernatural comic cover for 'Spirits of the Ironwood'. Ren Takahashi standing in the heart of a dark ancient forest, holding aloft a glowing spirit lantern that summons a spectral glowing white fox spirit leaping beside him among twisted ancient trees.",
    "coverFile": "covers/spirits-of-the-ironwood.png",
    "episodes": [
      {
        "episodeNumber": 1,
        "title": "The Bell at Dusk",
        "slug": "chapter-1-the-bell-at-dusk",
        "synopsis": "The boundary bell rings as twilight falls, summoning the first spirit pilgrim.",
        "textContent": "__STORY_spirits-of-the-ironwood_1__"
      },
      {
        "episodeNumber": 2,
        "title": "The Shadow Hound",
        "slug": "chapter-2-the-shadow-hound",
        "synopsis": "A ravenous shadow beast ambushes their path along the Whispering Creek.",
        "textContent": "__STORY_spirits-of-the-ironwood_2__"
      },
      {
        "episodeNumber": 3,
        "title": "Crossing the River of Light",
        "slug": "chapter-3-crossing-the-river-of-light",
        "synopsis": "Reaching the celestial gate where peaceful souls cross beyond.",
        "textContent": "__STORY_spirits-of-the-ironwood_3__"
      }
    ]
  }
];

// Wire up the full text content references
for (const s of BATCH_1_SERIES) {
  for (const ep of s.episodes) {
    if (BATCH_1_STORIES[s.slug]?.[ep.episodeNumber]) {
      ep.textContent = BATCH_1_STORIES[s.slug][ep.episodeNumber];
    }
  }
}
