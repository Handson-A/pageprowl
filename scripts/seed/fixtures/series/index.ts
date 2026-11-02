import { BATCH_1_SERIES } from "./batch-1.ts";
import { BATCH_2_SERIES } from "./batch-2.ts";
import { BATCH_3_SERIES } from "./batch-3.ts";
import { BATCH_4_SERIES } from "./batch-4.ts";
import { BATCH_5_SERIES } from "./batch-5.ts";
import type { SeriesManifest } from "../../types.ts";

export const ALL_SEED_SERIES: SeriesManifest[] = [
  ...BATCH_1_SERIES,
  ...BATCH_2_SERIES,
  ...BATCH_3_SERIES,
  ...BATCH_4_SERIES,
  ...BATCH_5_SERIES,
];

export function getSeriesByBatch(batchNumber: number): SeriesManifest[] {
  return ALL_SEED_SERIES.filter((s) => s.batchNumber === batchNumber);
}

export function getSeriesByGenre(genre: string): SeriesManifest[] {
  return ALL_SEED_SERIES.filter((s) => s.genre === genre);
}
