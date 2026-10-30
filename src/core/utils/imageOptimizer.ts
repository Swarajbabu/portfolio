/**
 * ==============================================================================
 * CORE UTILITY: Image Optimizer
 * ==============================================================================
 * Dynamically injects Cloudinary transformations for high-performance delivery:
 * - `f_auto`: Delivers modern WebP / AVIF based on browser support
 * - `q_auto`: Perceptual quality compression reducing payload up to 95%
 * - `w_<px>` & `c_limit`: Resizes to display boundaries without upscaling
 * ==============================================================================
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:good" | "auto:best" | "auto:eco" | "auto:low" | number;
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  crop?: "limit" | "fill" | "scale" | "fit" | "thumb";
  gravity?: "auto" | "face" | "center";
}

/**
 * Returns an optimized image URL. If the image is hosted on Cloudinary,
 * dynamic parameters are injected; otherwise, the original URL is preserved.
 */
export const getOptimizedImageUrl = (
  url?: string | null,
  options: ImageOptimizationOptions = {}
): string => {
  if (!url || typeof url !== "string") return "";

  // Cloudinary URL Optimization
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const {
      width,
      height,
      quality = "auto",
      format = "auto",
      crop = "limit",
      gravity,
    } = options;

    const parts: string[] = [];
    if (format) parts.push(`f_${format}`);
    if (quality) parts.push(`q_${quality}`);
    if (width) parts.push(`w_${width}`);
    if (height) parts.push(`h_${height}`);
    if (width || height) parts.push(`c_${crop}`);
    if (gravity) parts.push(`g_${gravity}`);

    const transformStr = parts.join(",");

    const uploadPrefix = "/upload/";
    const uploadIndex = url.indexOf(uploadPrefix);
    if (uploadIndex !== -1) {
      const prefix = url.substring(0, uploadIndex + uploadPrefix.length);
      const rest = url.substring(uploadIndex + uploadPrefix.length);

      // Avoid duplicate transformation injection
      if (rest.startsWith(transformStr + "/")) {
        return url;
      }

      return `${prefix}${transformStr}/${rest}`;
    }
  }

  return url;
};

