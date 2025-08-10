/**
 * This module configures the Progressive Web App (PWA) settings for the application.
 * It uses the `@ducanh2912/next-pwa` package to enable PWA capabilities in a Next.js app.
 *
 * PWA is disabled in development to improve build times and enabled in production.
 *
 * For more information on configuring `next-pwa`, visit:
 * https://github.com/DuCanh2912/next-pwa
 */

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // You can add more PWA-specific options here.
  // For example, to register a service worker for offline support:
  // register: true,
  // skipWaiting: true,
});

/**
 * Wraps the Next.js configuration with PWA capabilities.
 * @param {import('next').NextConfig} nextConfig - The original Next.js configuration.
 * @returns {import('next').NextConfig} The PWA-enabled Next.js configuration.
 */
module.exports = (nextConfig) => withPWA(nextConfig);
