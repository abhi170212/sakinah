/**
 * Backend API configuration
 * Defaults to the live Render deployment: https://sakinah-m527.onrender.com
 */
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'https://sakinah-m527.onrender.com';
