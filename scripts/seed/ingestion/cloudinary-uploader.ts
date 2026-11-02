import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
import {
  getAllRequiredArtworkAssets,
  type ArtworkAssetItem,
} from "./artwork-manifest.ts";

export interface UploadedAssetRecord {
  assetKey: string;
  type: string;
  cloudinaryPublicId: string;
  secureUrl: string;
  format: string;
  width: number;
  height: number;
  byteSize: number;
  uploadedAt: string;
}

export interface ArtworkLedger {
  version: string;
  updatedAt: string;
  assets: Record<string, UploadedAssetRecord>;
}

const LEDGER_PATH = path.resolve(process.cwd(), "scripts/seed/.artwork-state.json");

export function loadArtworkLedger(): ArtworkLedger {
  if (fs.existsSync(LEDGER_PATH)) {
    try {
      const content = fs.readFileSync(LEDGER_PATH, "utf-8");
      return JSON.parse(content);
    } catch {
      // Fallback on empty ledger
    }
  }
  return {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    assets: {},
  };
}

export function saveArtworkLedger(ledger: ArtworkLedger) {
  ledger.updatedAt = new Date().toISOString();
  fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), "utf-8");
}

export function configureCloudinary(): boolean {
  // If not loaded into process.env, load from .env.local
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath) && typeof (process as any).loadEnvFile === "function") {
    try {
      (process as any).loadEnvFile(envLocalPath);
    } catch {
      // ignore
    }
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("Missing Cloudinary configuration. Please verify .env.local.");
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return true;
}

export async function uploadSingleAsset(
  item: ArtworkAssetItem,
  options: { dryRun?: boolean } = {}
): Promise<UploadedAssetRecord | null> {
  const ledger = loadArtworkLedger();

  // If already uploaded, return cached record
  if (ledger.assets[item.assetKey]) {
    return ledger.assets[item.assetKey];
  }

  if (!fs.existsSync(item.fullLocalPath)) {
    console.warn(`Local file not found for ${item.assetKey}: ${item.fullLocalPath}`);
    return null;
  }

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would upload ${item.assetKey} to ${item.cloudinaryFolder}`);
    return {
      assetKey: item.assetKey,
      type: item.type,
      cloudinaryPublicId: `${item.cloudinaryFolder}/${path.basename(item.localRelativePath, path.extname(item.localRelativePath))}`,
      secureUrl: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${item.cloudinaryFolder}/${path.basename(item.localRelativePath)}`,
      format: "png",
      width: 1200,
      height: item.aspectRatio === "9:16" ? 2133 : item.aspectRatio === "16:9" ? 675 : 1200,
      byteSize: fs.statSync(item.fullLocalPath).size,
      uploadedAt: new Date().toISOString(),
    };
  }

  const configured = configureCloudinary();
  if (!configured) {
    throw new Error("Cloudinary not configured.");
  }

  const publicIdStem = path.basename(item.localRelativePath, path.extname(item.localRelativePath));

  try {
    const uploadResult = await cloudinary.uploader.upload(item.fullLocalPath, {
      public_id: publicIdStem,
      folder: item.cloudinaryFolder,
      tags: item.cloudinaryTags,
      overwrite: true,
      resource_type: "image",
    });

    const record: UploadedAssetRecord = {
      assetKey: item.assetKey,
      type: item.type,
      cloudinaryPublicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      byteSize: uploadResult.bytes,
      uploadedAt: new Date().toISOString(),
    };

    ledger.assets[item.assetKey] = record;
    saveArtworkLedger(ledger);

    return record;
  } catch (error: any) {
    console.error(`Failed to upload ${item.assetKey} to Cloudinary:`, error?.message || error);
    throw error;
  }
}

export async function uploadArtworkBatch(options: {
  batchNumber?: number;
  type?: string;
  limit?: number;
  dryRun?: boolean;
} = {}) {
  const allAssets = getAllRequiredArtworkAssets();
  let filtered = allAssets;

  if (options.batchNumber) {
    filtered = filtered.filter(
      (a) => a.batchNumber === options.batchNumber || a.type === "avatar" || a.type === "logo"
    );
  }

  if (options.type) {
    filtered = filtered.filter((a) => a.type === options.type);
  }

  if (options.limit && options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  const ledger = loadArtworkLedger();
  const pending = filtered.filter((a) => !ledger.assets[a.assetKey] && fs.existsSync(a.fullLocalPath));

  console.log(`Target assets: ${filtered.length}. Ready for upload: ${pending.length}. Already uploaded: ${filtered.length - pending.length}.`);

  const results: UploadedAssetRecord[] = [];
  for (let i = 0; i < pending.length; i++) {
    const asset = pending[i];
    console.log(`[${i + 1}/${pending.length}] Uploading ${asset.assetKey}...`);
    const record = await uploadSingleAsset(asset, { dryRun: options.dryRun });
    if (record) {
      results.push(record);
    }
  }

  return {
    processed: results.length,
    totalInScope: filtered.length,
    results,
  };
}

export async function deleteCloudinaryAssets(
  publicIds: string[],
  options: { dryRun?: boolean } = {}
): Promise<{ deleted: string[]; failed: string[] }> {
  if (publicIds.length === 0) {
    return { deleted: [], failed: [] };
  }

  // Safety invariant: Ensure every public ID strictly resides in the pageprowl/seed namespace
  for (const id of publicIds) {
    if (!id.startsWith("pageprowl/seed/")) {
      throw new Error(`Safety violation: refusing to delete asset outside 'pageprowl/seed/': ${id}`);
    }
  }

  if (options.dryRun) {
    console.log(`[DRY-RUN] Would delete ${publicIds.length} Cloudinary assets:`);
    for (const id of publicIds) {
      console.log(`  - ${id}`);
    }
    return { deleted: publicIds, failed: [] };
  }

  const configured = configureCloudinary();
  if (!configured) {
    throw new Error("Cloudinary not configured.");
  }

  console.log(`Deleting ${publicIds.length} specific Cloudinary assets...`);
  const deleted: string[] = [];
  const failed: string[] = [];

  // Cloudinary allows up to 100 resources per delete call
  const chunkSize = 100;
  for (let i = 0; i < publicIds.length; i += chunkSize) {
    const chunk = publicIds.slice(i, i + chunkSize);
    try {
      const res = await cloudinary.api.delete_resources(chunk);
      for (const [id, status] of Object.entries(res.deleted || {})) {
        if (status === "deleted" || status === "not_found") {
          deleted.push(id);
        } else {
          failed.push(id);
        }
      }
    } catch (err: any) {
      console.error("Cloudinary delete_resources error:", err?.message || err);
      failed.push(...chunk);
    }
  }

  // Clean ledger
  const ledger = loadArtworkLedger();
  for (const [key, asset] of Object.entries(ledger.assets)) {
    if (deleted.includes(asset.cloudinaryPublicId)) {
      delete ledger.assets[key];
    }
  }
  saveArtworkLedger(ledger);

  return { deleted, failed };
}

export async function purgeSeedCloudinaryAssets(options: {
  dryRun?: boolean;
  confirm?: boolean;
  seriesSlug?: string;
  batchNumber?: number;
} = {}) {
  const ledger = loadArtworkLedger();
  let targetPublicIds: string[] = [];

  if (options.seriesSlug) {
    // 1. Single Series: Only delete assets owned by this series
    for (const [key, asset] of Object.entries(ledger.assets)) {
      if (
        key === `cover:${options.seriesSlug}` ||
        key.startsWith(`page:${options.seriesSlug}:`)
      ) {
        targetPublicIds.push(asset.cloudinaryPublicId);
      }
    }
    console.log(`Found ${targetPublicIds.length} assets exclusively owned by series '${options.seriesSlug}'`);
  } else if (options.batchNumber) {
    // 2. Batch: Only delete assets belonging to series in this batch
    const allAssets = getAllRequiredArtworkAssets();
    const batchAssetKeys = new Set(
      allAssets.filter((a) => a.batchNumber === options.batchNumber).map((a) => a.assetKey)
    );
    for (const [key, asset] of Object.entries(ledger.assets)) {
      if (batchAssetKeys.has(key)) {
        targetPublicIds.push(asset.cloudinaryPublicId);
      }
    }
    console.log(`Found ${targetPublicIds.length} assets owned by Batch ${options.batchNumber}`);
  } else {
    // 3. Full purge: requires explicit confirmation flag
    if (!options.dryRun && !options.confirm) {
      throw new Error(
        "Full Cloudinary seed purge requires explicit --confirm flag to prevent accidental deletion."
      );
    }
    targetPublicIds = Object.values(ledger.assets).map((a) => a.cloudinaryPublicId);
    console.log(`Full Cloudinary seed purge targeting ${targetPublicIds.length} total registered assets.`);
  }

  return deleteCloudinaryAssets(targetPublicIds, { dryRun: options.dryRun });
}
