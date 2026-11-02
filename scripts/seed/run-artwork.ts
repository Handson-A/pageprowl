#!/usr/bin/env node
import fs from "node:fs";
import {
  getAllRequiredArtworkAssets,
  getArtworkStatus,
} from "./ingestion/artwork-manifest.ts";
import {
  loadArtworkLedger,
  uploadSingleAsset,
  uploadArtworkBatch,
} from "./ingestion/cloudinary-uploader.ts";

function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    status: boolean;
    uploadReady: boolean;
    assetKey?: string;
    batch?: number;
    dryRun: boolean;
    help: boolean;
  } = {
    status: false,
    uploadReady: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--status") {
      options.status = true;
    } else if (arg === "--upload-ready") {
      options.uploadReady = true;
    } else if (arg === "--key" && args[i + 1]) {
      options.assetKey = args[++i];
    } else if (arg === "--batch" && args[i + 1]) {
      options.batch = parseInt(args[++i], 10);
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  if (options.help || (!options.status && !options.uploadReady && !options.assetKey)) {
    console.log(`
PageProwl Artwork CLI
====================
Usage: node scripts/seed/run-artwork.ts [options]

Options:
  --status              Show local disk coverage and Cloudinary ledger status
  --upload-ready        Upload all local assets present on disk to Cloudinary
  --key <assetKey>      Upload a single asset by its key (e.g. avatar:elena_vance)
  --batch <1-5>         Scope uploads to a specific batch
  --dry-run             Simulate upload without network requests
  --help, -h            Show this help message
`);
    process.exit(0);
  }

  const ledger = loadArtworkLedger();
  const allAssets = getAllRequiredArtworkAssets();

  if (options.status) {
    const status = getArtworkStatus();
    const uploadedCount = Object.keys(ledger.assets).length;

    console.log("=== PageProwl Artwork Status ===");
    console.log(`Total Required Assets: ${status.total}`);
    console.log(`- Present on Local Disk: ${status.existingCount} (${Math.round((status.existingCount / status.total) * 100)}%)`);
    console.log(`- Missing on Local Disk: ${status.missingCount}`);
    console.log(`- Uploaded to Cloudinary: ${uploadedCount} (${Math.round((uploadedCount / status.total) * 100)}%)`);

    if (status.existingCount > 0) {
      console.log("\nAssets Present on Disk:");
      for (const a of status.existing) {
        const isUp = ledger.assets[a.assetKey] ? "Uploaded (CDN)" : "Pending Upload";
        console.log(`  [${a.type}] ${a.assetKey} -> ${a.localRelativePath} [${isUp}]`);
      }
    }
    process.exit(0);
  }

  if (options.assetKey) {
    const target = allAssets.find((a) => a.assetKey === options.assetKey);
    if (!target) {
      console.error(`Asset key '${options.assetKey}' not found in manifest.`);
      process.exit(1);
    }

    console.log(`Uploading single asset: ${target.assetKey} (${target.fullLocalPath})...`);
    const record = await uploadSingleAsset(target, { dryRun: options.dryRun });
    if (record) {
      console.log("\nUpload SUCCESS:");
      console.log(`Public ID:  ${record.cloudinaryPublicId}`);
      console.log(`Secure URL: ${record.secureUrl}`);
      console.log(`Dimensions: ${record.width}x${record.height}`);
      console.log(`Size:       ${record.byteSize} bytes`);
    } else {
      console.error("\nUpload failed or file not found on disk.");
      process.exit(1);
    }
    process.exit(0);
  }

  if (options.uploadReady) {
    console.log("Uploading all disk-present assets to Cloudinary...");
    const res = await uploadArtworkBatch({
      batchNumber: options.batch,
      dryRun: options.dryRun,
    });
    console.log(`\nUpload batch complete: ${res.processed} assets uploaded.`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Artwork CLI encountered an error:", err);
  process.exit(1);
});
