/**
 * ==============================================================================
 * CORE API CLIENT
 * ==============================================================================
 * Purpose:
 *   Handles all HTTP communication with the backend API.
 *   - In local dev: Proxied via Vite (`http://localhost:5000`)
 *   - In production on Render: Relative `/api` paths served directly by Express
 * ==============================================================================
 */

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return cleanEndpoint;
};

export default getApiUrl;

