/**
 * API Helper for Backend Communication
 * Supports both Local Dev (Vite proxy) and Production (Vercel + Render split deployment)
 * 
 * In Vercel, set the environment variable:
 * VITE_API_URL=https://your-backend.onrender.com
 */
const BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return BASE_URL ? `${BASE_URL}${cleanEndpoint}` : cleanEndpoint;
};

export default getApiUrl;
