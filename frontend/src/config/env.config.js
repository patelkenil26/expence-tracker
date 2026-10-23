/**
 * =========================================================================
 * GLOBAL APPLICATION ENVIRONMENT & API CONFIGURATION
 * =========================================================================
 * Senior Architecture Pattern:
 * Centralized environment and API configuration.
 *
 * HOW TO SWITCH BETWEEN LOCAL AND PRODUCTION:
 * -------------------------------------------------------------------------
 * METHOD 1 (Quick Toggle):
 * Simply change ACTIVE_ENV below:
 *   - "local"      --> Connects to local Express backend (http://localhost:8000/api)
 *   - "production" --> Connects to live production backend
 *
 * METHOD 2 (Comment / Uncomment):
 * You can also toggle the lines directly below.
 * =========================================================================
 */

// TOGGLE HERE: Change to "production" before pushing to GitHub/Vercel
export const ACTIVE_ENV = "local";
// export const ACTIVE_ENV = "production";

export const ENV_CONFIG = {
  local: {
    API_BASE_URL: "http://localhost:8000/api",
    CLIENT_URL: "http://localhost:5173",
    NAME: "Development (Localhost)",
    IS_DEV: true,
  },
  production: {
    // Production Backend API URL:
    // Update this with your live backend service URL (Render / Railway / AWS / Vercel Serverless)
    API_BASE_URL: "https://expence-tracker-9f2m.onrender.com/api",
    CLIENT_URL: "https://expence-tracker-beta-gray.vercel.app",
    NAME: "Production (Cloud)",
    IS_DEV: false,
  },
};

/**
 * Resolved API Base URL
 * Priority:
 * 1. Explicit Vite environment variable (import.meta.env.VITE_API_BASE_URL)
 * 2. Selected ACTIVE_ENV from above
 * 3. Safe fallback to local
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  ENV_CONFIG[ACTIVE_ENV]?.API_BASE_URL ||
  ENV_CONFIG.local.API_BASE_URL;

export const APP_METADATA = {
  name: "ExpenseTracker",
  version: "2.0.0",
  currencySymbol: "₹",
  currencyCode: "INR",
};
