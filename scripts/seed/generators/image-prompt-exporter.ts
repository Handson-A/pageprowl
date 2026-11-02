import fs from "node:fs";
import path from "node:path";
import { getAllRequiredArtworkAssets } from "../ingestion/artwork-manifest.ts";

export function exportPromptCatalog() {
  const assets = getAllRequiredArtworkAssets();
  const catalogPath = path.resolve(process.cwd(), "scripts/seed/fixtures/prompt-catalog.json");

  const byBatch: Record<number, typeof assets> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  const avatars: typeof assets = [];
  const logos: typeof assets = [];

  for (const asset of assets) {
    if (asset.type === "avatar") {
      avatars.push(asset);
    } else if (asset.type === "logo") {
      logos.push(asset);
    } else if (asset.batchNumber) {
      byBatch[asset.batchNumber] = byBatch[asset.batchNumber] || [];
      byBatch[asset.batchNumber].push(asset);
    }
  }

  const catalog = {
    summary: {
      totalAssets: assets.length,
      avatars: avatars.length,
      logos: logos.length,
      seriesBatches: {
        batch1: byBatch[1]?.length || 0,
        batch2: byBatch[2]?.length || 0,
        batch3: byBatch[3]?.length || 0,
        batch4: byBatch[4]?.length || 0,
        batch5: byBatch[5]?.length || 0,
      },
    },
    avatars,
    logos,
    batches: byBatch,
  };

  fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), "utf-8");
  return catalog;
}

// CLI execution
if (process.argv[1]?.endsWith("image-prompt-exporter.ts")) {
  const catalog = exportPromptCatalog();
  console.log("Exported prompt catalog successfully:", catalog.summary);
}
