#!/usr/bin/env node
import { getAdminClient, rollbackSeed } from "./seed-service.ts";
import { purgeSeedCloudinaryAssets } from "./ingestion/cloudinary-uploader.ts";

function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    dryRun: boolean;
    seriesSlug?: string;
    batch?: number;
    all: boolean;
    purgeCloudinary: boolean;
    confirm: boolean;
    help: boolean;
  } = {
    dryRun: false,
    all: false,
    purgeCloudinary: false,
    confirm: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--series" && args[i + 1]) {
      options.seriesSlug = args[++i];
    } else if (arg === "--batch" && args[i + 1]) {
      options.batch = parseInt(args[++i], 10);
    } else if (arg === "--all") {
      options.all = true;
    } else if (arg === "--purge-cloudinary") {
      options.purgeCloudinary = true;
    } else if (arg === "--confirm") {
      options.confirm = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
PageProwl Seed Rollback
=======================
Safely rolls back seed records from Supabase and Cloudinary.
Never deletes any non-seed records or real user accounts.

Usage: node scripts/seed/rollback-seed.ts [options]

Options:
  --dry-run                 Simulate the rollback without modifying data
  --series <slug>           Roll back a single specific seed series (preserves creators/studios)
  --batch <1-5>             Roll back an entire batch of 10 seed series (preserves shared identities)
  --all                     Roll back all seed series, studios, and creator users (requires --confirm)
  --purge-cloudinary        Also delete scoped Cloudinary assets owned by the targeted series/batch
  --confirm                 Required confirmation flag for full rollback
  --help, -h                Show this help message

Examples:
  node scripts/seed/rollback-seed.ts --dry-run --series vanguard-strike-neo-seoul
  node scripts/seed/rollback-seed.ts --dry-run --batch 1
  node scripts/seed/rollback-seed.ts --dry-run --all
  node scripts/seed/rollback-seed.ts --series vanguard-strike-neo-seoul
  node scripts/seed/rollback-seed.ts --all --confirm --purge-cloudinary
`);
}

async function main() {
  const options = parseArgs();

  if (options.help || (!options.seriesSlug && !options.batch && !options.all)) {
    printHelp();
    process.exit(0);
  }

  console.log("=== PageProwl Seed Rollback ===");
  if (options.dryRun) {
    console.log("MODE: DRY-RUN (No records will be deleted)");
  }

  const supabase = getAdminClient();

  await rollbackSeed(supabase, {
    dryRun: options.dryRun,
    targetSeriesSlug: options.seriesSlug,
    batchNumber: options.batch,
    purgeCloudinary: options.purgeCloudinary,
    confirm: options.confirm,
  });

  if (options.purgeCloudinary) {
    console.log("\nPurging scoped Cloudinary assets...");
    await purgeSeedCloudinaryAssets({
      dryRun: options.dryRun,
      confirm: options.confirm,
      seriesSlug: options.seriesSlug,
      batchNumber: options.batch,
    });
  }

  console.log("\nRollback complete.");
}

main().catch((err) => {
  console.error("\nRollback encountered a fatal error:");
  console.error(err?.message || err);
  process.exit(1);
});
