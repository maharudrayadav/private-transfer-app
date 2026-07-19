/**
 * Central API base URL.
 * Reads from NEXT_PUBLIC_API_URL at build time.
 * Falls back to the production Render backend if the env var is missing.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://privateproject-r0ry.onrender.com';
