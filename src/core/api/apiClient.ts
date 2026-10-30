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

const PRODUCTION_API_URL = "https://swaraj-portfolio-backend.onrender.com";

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // In local Vite development, use relative paths so Vite's proxy forwards to localhost:5000
  if (import.meta.env.DEV) {
    return cleanEndpoint;
  }

  // In production, communicate directly with the live Render backend
  const baseUrl = (import.meta.env.VITE_API_URL || PRODUCTION_API_URL).replace(/\/$/, "");
  return `${baseUrl}${cleanEndpoint}`;
};

export default getApiUrl;
