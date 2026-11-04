/**
 * ==============================================================================
 * CORE API CLIENT
 * ==============================================================================
 * Purpose:
 *   Handles all HTTP communication with the MongoDB-backed Express server.
 *   - Local development: Uses Vite proxy (`http://localhost:5000`)
 *   - Production: Directly targets the live Render backend API
 * ==============================================================================
 */

const PRODUCTION_API_URL = "https://portfolio-backend-tjpt.onrender.com";

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // In local Vite development, use relative paths so Vite's proxy forwards to localhost:5000
  if (import.meta.env.DEV) {
    return cleanEndpoint;
  }

  // If a custom API URL is set via environment variable (e.g. Vercel deployment)
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${cleanEndpoint}`;
  }

  // When frontend & backend run together (same origin on Render, Modelence, or localhost), relative URL works automatically
  if (
    typeof window !== "undefined" &&
    (window.location.hostname.includes("onrender.com") ||
      window.location.hostname.includes("modelence") ||
      window.location.hostname === "localhost")
  ) {
    return cleanEndpoint;
  }

  // Fallback to active live Render backend API
  const baseUrl = PRODUCTION_API_URL.replace(/\/$/, "");
  return `${baseUrl}${cleanEndpoint}`;
};

export default getApiUrl;
