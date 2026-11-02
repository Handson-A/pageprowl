import { VANGUARD_STRIKE_STORIES } from "./series-01-vanguard.ts";
import { RUNEBOUND_CHRONICLE_STORIES } from "./series-02-runebound.ts";
import { SUB_ORBITAL_DRIFT_STORIES } from "./series-03-suborbital.ts";
import { BETWEEN_TWO_SKYLINES_STORIES } from "./series-04-skylines.ts";
import { WHISPERS_BLACK_BOG_STORIES } from "./series-05-blackbog.ts";
import { DEMON_KINGS_BARISTA_STORIES } from "./series-06-barista.ts";
import { CLOCKMAKERS_LEDGER_STORIES } from "./series-07-clockmaker.ts";
import { MATCHA_RAINDROPS_STORIES } from "./series-08-matcha.ts";
import { FOGLINE_MURDERS_STORIES } from "./series-09-fogline.ts";
import { SPIRITS_IRONWOOD_STORIES } from "./series-10-ironwood.ts";

export const BATCH_1_STORIES: Record<string, Record<number, string>> = {
  "vanguard-strike-neo-seoul": VANGUARD_STRIKE_STORIES,
  "the-runebound-chronicle": RUNEBOUND_CHRONICLE_STORIES,
  "sub-orbital-drift": SUB_ORBITAL_DRIFT_STORIES,
  "between-two-skylines": BETWEEN_TWO_SKYLINES_STORIES,
  "whispers-of-the-black-bog": WHISPERS_BLACK_BOG_STORIES,
  "demon-kings-barista": DEMON_KINGS_BARISTA_STORIES,
  "the-clockmakers-ledger": CLOCKMAKERS_LEDGER_STORIES,
  "matcha-and-raindrops": MATCHA_RAINDROPS_STORIES,
  "fogline-murders": FOGLINE_MURDERS_STORIES,
  "spirits-of-the-ironwood": SPIRITS_IRONWOOD_STORIES,
};
