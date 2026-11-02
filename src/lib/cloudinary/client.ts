/**
 * Client-safe Cloudinary image delivery and transformation helpers.
 * Never exposes Cloudinary API secret to the client.
 */

export interface CloudinaryImageOptions {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "limit" | "thumb" | "scale";
  quality?: "auto" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
}

export function getOptimizedImageUrl(
  publicIdOrUrl: string,
  options: CloudinaryImageOptions = {}
): string {
  if (!publicIdOrUrl) return "/images/artwork-fallback.svg";

  // If already a full URL and not a cloudinary URL, return as-is
  if (publicIdOrUrl.startsWith("http://") || publicIdOrUrl.startsWith("https://")) {
    if (!publicIdOrUrl.includes("cloudinary.com")) {
      return publicIdOrUrl;
    }
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "pageprowl";
  const { width, height, crop = "limit", quality = "auto", format = "auto" } = options;

  const transformations: string[] = [`f_${format}`, `q_${quality}`];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop && (width || height)) transformations.push(`c_${crop}`);

  const transformString = transformations.join(",");
  const cleanPublicId = publicIdOrUrl.replace(/^https?:\/\/[^/]+\/[^/]+\/[^/]+\/(?:v\d+\/)?/, "");

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${cleanPublicId}`;
}
