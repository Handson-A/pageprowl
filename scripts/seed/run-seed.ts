#!/usr/bin/env node
import { ALL_SEED_SERIES } from "./fixtures/series/index.ts";
import { SEED_CREATORS } from "./fixtures/creators.ts";
import { SEED_STUDIOS } from "./fixtures/studios.ts";
import {
  getAdminClient,
  seedSingleSeries,
  seedBatch,
  seedAllCreatorsAndStudios,
  validateSeries,
  verifySeriesIntegrity,
} from "./seed-service.ts";

function parseArgs() {
  const args = process.argv.slice(2);
  const options: {
    dryRun: boolean;
    batch?: number;
    seriesSlug?: string;
    creatorsOnly: boolean;
    validateSlug?: string;
    verifySlug?: string;
    validateBatch?: number;
    all: boolean;
    help: boolean;
  } = {
    dryRun: false,
    creatorsOnly: false,
    all: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--batch" && args[i + 1]) {
      options.batch = parseInt(args[++i], 10);
    } else if (arg === "--series" && args[i + 1]) {
      options.seriesSlug = args[++i];
    } else if (arg === "--creators-only" || arg === "--provision-identities") {
      options.creatorsOnly = true;
    } else if (arg === "--validate" && args[i + 1]) {
      options.validateSlug = args[++i];
    } else if (arg === "--verify-series" && args[i + 1]) {
      options.verifySlug = args[++i];
    } else if (arg === "--validate-batch" && args[i + 1]) {
      options.validateBatch = parseInt(args[++i], 10);
    } else if (arg === "--all") {
      options.all = true;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }

  return options;
}

function printHelp() {
  console.log(`
PageProwl Seed Runner
=====================
Usage: node scripts/seed/run-seed.ts [options]

Options:
  --dry-run                 Simulate the seed run without mutating the database
  --series <slug>           Seed a single specific series (provisions only its direct dependencies)
  --batch <1-5>             Seed a specific batch of 10 series
  --creators-only           Seed only the shared 15 creators and 4 studios
  --all                     Seed all 50 series across batches 1 through 5
  --verify-series <slug>    Deep verification report (DB integrity + artwork completeness)
  --validate <slug>         Basic structural validation of a series in Supabase
  --validate-batch <1-5>    Validate all series in a given batch
  --help, -h                Show this help message

Examples:
  node scripts/seed/run-seed.ts --dry-run --series vanguard-strike-neo-seoul
  node scripts/seed/run-seed.ts --series vanguard-strike-neo-seoul
  node scripts/seed/run-seed.ts --verify-series vanguard-strike-neo-seoul
  node scripts/seed/run-seed.ts --batch 1
`);
}

async function main() {
  const options = parseArgs();

  if (options.help) {
    printHelp();
    process.exit(0);
  }

  console.log("=== PageProwl Seed Runner ===");
  if (options.dryRun) {
    console.log("MODE: DRY-RUN (No database writes will occur)");
  }

  const supabase = getAdminClient();

  // 1. Deep verification report mode
  if (options.verifySlug) {
    console.log(`Running deep verification for series: '${options.verifySlug}'...\n`);
    const res = await verifySeriesIntegrity(options.verifySlug, supabase);

    if (!res.report) {
      console.error(`ERROR: ${res.issues.join(", ")}`);
      process.exit(1);
    }

    const { series, credits, episodes, releaseEvents, analysis } = res.report;

    console.log("--------------------------------------------------");
    console.log(`Series:         ${series.title} (${series.slug})`);
    console.log(`Series ID:      ${series.id}`);
    console.log(`Genre / Format: ${series.genre} / ${series.format}`);
    console.log(`Visibility:     ${series.visibility}`);
    console.log(`Owner:          ${series.ownerName} [${series.ownerType}]`);
    console.log(`Credits:        ${credits.map((c: any) => `${c.role_category}: ${c.user_id}`).join(", ") || "None"}`);
    console.log(`Cover CDN URL:  ${series.coverUrl}`);
    console.log(`Cover PublicID: ${series.coverPublicId || "N/A"} (Fallback: ${series.coverIsFallback})`);
    console.log("--------------------------------------------------");
    console.log(`Episodes:       ${episodes.length} published`);
    for (const ep of episodes) {
      console.log(`  * Ep ${ep.episodeNumber}: ${ep.title} [${ep.status}]`);
      console.log(`    Published Revision: ${ep.publishedRevisionId}`);
      console.log(`    Pages (${ep.pageCount}):`);
      for (const p of ep.pages) {
        const flag = p.isFallback ? "[FALLBACK SVG]" : "[CDN OK]";
        console.log(`      - Page ${p.pageNumber}: ${p.dimensions} (${p.byteSize} bytes) -> ${p.cloudinaryPublicId} ${flag}`);
      }
    }
    console.log("--------------------------------------------------");
    console.log(`Release Events: ${releaseEvents.length} recorded`);
    console.log("--------------------------------------------------");
    console.log("INTEGRITY & COMPLETENESS ANALYSIS:");
    console.log(`- Total Episodes:            ${analysis.totalEpisodes} (Required: 3)`);
    console.log(`- Total Pages:               ${analysis.totalPages} (Required: 12)`);
    console.log(`- Distinct Artwork URLs:     ${analysis.distinctArtworkCount} / 12`);
    console.log(`- Duplicate Artwork Detected:${analysis.hasDuplicateArtwork ? "YES (FAILED)" : "None (PASSED)"}`);
    if (analysis.duplicateUrls.length > 0) {
      for (const dup of analysis.duplicateUrls) {
        console.log(`    * ${dup}`);
      }
    }
    console.log(`- Fallback Placeholders Used:${analysis.hasFallbackPages ? "YES (FAILED)" : "None (PASSED)"}`);
    console.log(`- Cover Placeholder Used:    ${analysis.coverIsFallback ? "YES (FAILED)" : "None (PASSED)"}`);
    console.log("--------------------------------------------------");
    console.log(`Database Referential Integrity: ${res.databaseIntegrityPassed ? "PASSED" : "FAILED"}`);
    console.log(`Actual Artwork Completeness:    ${res.artworkCompletenessPassed ? "PASSED" : "FAILED"}`);
    console.log(`OVERALL READINESS STATUS:       ${res.status}`);
    console.log("--------------------------------------------------");

    if (res.issues.length > 0) {
      console.log("\nIssues flagged:");
      for (const iss of res.issues) {
        console.log(`  ! ${iss}`);
      }
    }

    if (res.status === "PASSED") {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }

  // 2. Basic structural validation
  if (options.validateSlug) {
    console.log(`Validating series: ${options.validateSlug}...`);
    const result = await validateSeries(options.validateSlug, supabase);
    if (result.valid) {
      console.log(`\nSUCCESS: Series '${options.validateSlug}' is structurally valid!`);
      console.log(JSON.stringify(result.details, null, 2));
      process.exit(0);
    } else {
      console.error(`\nFAILED: Series '${options.validateSlug}' failed structural validation:`);
      for (const err of result.errors) {
        console.error(` - ${err}`);
      }
      process.exit(1);
    }
  }

  if (options.validateBatch) {
    const targetSeries = ALL_SEED_SERIES.filter((s) => s.batchNumber === options.validateBatch);
    console.log(`Validating Batch ${options.validateBatch} (${targetSeries.length} series)...`);
    let allValid = true;
    for (const s of targetSeries) {
      const res = await validateSeries(s.slug, supabase);
      if (res.valid) {
        console.log(`  [PASS] ${s.slug} (${res.details?.episodeCount} eps)`);
      } else {
        console.error(`  [FAIL] ${s.slug}: ${res.errors.join(", ")}`);
        allValid = false;
      }
    }
    if (!allValid) {
      console.error("\nBatch validation failed.");
      process.exit(1);
    }
    console.log("\nAll series in batch passed validation!");
    process.exit(0);
  }

  // 3. Creators and studios only
  if (options.creatorsOnly) {
    console.log("Seeding shared creators and studios catalog...");
    await seedAllCreatorsAndStudios(supabase, { dryRun: options.dryRun });
    console.log("\nCreators and studios seeded successfully.");
    process.exit(0);
  }

  // 4. Single series mode
  if (options.seriesSlug) {
    const target = ALL_SEED_SERIES.find((s) => s.slug === options.seriesSlug);
    if (!target) {
      console.error(`Series slug '${options.seriesSlug}' not found in seed fixtures.`);
      process.exit(1);
    }

    console.log(`Seeding series: ${target.title} (${target.slug})...`);
    const res = await seedSingleSeries(target, supabase, { dryRun: options.dryRun });
    console.log(`\nSuccessfully seeded series: ${target.title}`);
    console.log(`Series ID: ${res.seriesId}`);
    console.log(`Episodes: ${res.episodeCount}`);
    console.log(`Total Pages: ${res.pageCount}`);

    if (!options.dryRun) {
      console.log("\nRunning deep integrity verification in Supabase...");
      const val = await verifySeriesIntegrity(target.slug, supabase);
      if (val.status === "PASSED") {
        console.log("Deep verification PASSED!");
      } else {
        console.error("Deep verification FAILED with issues:", val.issues);
      }
    }
    process.exit(0);
  }

  // 5. Batch mode
  if (options.batch) {
    if (options.batch < 1 || options.batch > 5) {
      console.error("Batch number must be between 1 and 5.");
      process.exit(1);
    }
    await seedBatch(options.batch, supabase, { dryRun: options.dryRun });
    console.log(`\nBatch ${options.batch} seeding completed.`);
    process.exit(0);
  }

  // 6. All series mode
  if (options.all) {
    console.log("Starting full 50-series seed across 5 batches...");
    await seedAllCreatorsAndStudios(supabase, { dryRun: options.dryRun });
    for (let b = 1; b <= 5; b++) {
      await seedBatch(b, supabase, { dryRun: options.dryRun });
    }
    console.log("\nAll 50 series successfully seeded!");
    process.exit(0);
  }

  // No mode selected
  printHelp();
}

main().catch((err) => {
  console.error("\nSeed runner encountered a fatal error:");
  console.error(err);
  process.exit(1);
});
