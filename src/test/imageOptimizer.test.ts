import { describe, it, expect } from "vitest";
import { getOptimizedImageUrl } from "@/core/utils/imageOptimizer";

describe("Image Optimizer Utility", () => {
  it("returns empty string for null or undefined input", () => {
    expect(getOptimizedImageUrl(null)).toBe("");
    expect(getOptimizedImageUrl(undefined)).toBe("");
    expect(getOptimizedImageUrl("")).toBe("");
  });

  it("preserves non-Cloudinary image URLs unmodified", () => {
    const external = "https://images.unsplash.com/photo-123456?auto=format";
    expect(getOptimizedImageUrl(external)).toBe(external);
  });

  it("injects f_auto, q_auto and width constraints into Cloudinary URLs", () => {
    const rawCloudinary = "https://res.cloudinary.com/svshyagm/image/upload/v1789716322/swaraj_portfolio/mdv76ncmpxzpc89q68n1.png";
    const optimized = getOptimizedImageUrl(rawCloudinary, {
      width: 500,
      quality: "auto",
      format: "auto",
    });

    expect(optimized).toContain("/upload/f_auto,q_auto,w_500,c_limit/");
    expect(optimized).toContain("v1789716322/swaraj_portfolio/mdv76ncmpxzpc89q68n1.png");
  });

  it("does not duplicate transformations if already applied", () => {
    const rawCloudinary = "https://res.cloudinary.com/svshyagm/image/upload/v1789716322/swaraj_portfolio/mdv76ncmpxzpc89q68n1.png";
    const once = getOptimizedImageUrl(rawCloudinary, { width: 600 });
    const twice = getOptimizedImageUrl(once, { width: 600 });
    expect(twice).toBe(once);
  });
});
