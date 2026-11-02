import { v2 as cloudinary } from "cloudinary";

function configureCloudinary() {
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (apiKey && apiSecret && cloudName) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }
}

// Initial configuration attempt on module load
configureCloudinary();

export interface UploadSignatureResponse {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  tags: string;
}

/**
 * Generate a signature for client-side direct signed upload to Cloudinary.
 * This keeps the API secret securely on the server.
 */
export function generateUploadSignature(
  folder: string = "pageprowl/episodes",
  tags: string[] = ["pageprowl"]
): UploadSignatureResponse {
  configureCloudinary();

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    throw new Error("Missing Cloudinary server-side credentials.");
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const tagsString = tags.join(",");
  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
    tags: tagsString,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
    tags: tagsString,
  };
}

/**
 * Safely delete an asset from Cloudinary when no longer referenced.
 */
export async function deleteAsset(publicId: string): Promise<boolean> {
  configureCloudinary();

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing Cloudinary server credentials.");
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Failed to delete Cloudinary asset:", error);
    return false;
  }
}
