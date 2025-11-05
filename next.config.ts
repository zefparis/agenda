import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Compatibilité Turbopack (Next.js 16)
  turbopack: {},
  
  // Headers pour permissions PWA
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Permissions Policy pour micro et notifications
          {
            key: 'Permissions-Policy',
            value: 'microphone=(self), notifications=(self), vibrate=(self)'
          }
        ]
      }
    ];
  }
};

// Note: next-pwa nécessite webpack, incompatible avec Turbopack
// Le Service Worker est géré manuellement via PWAProvider
// Pour production avec next-pwa, utiliser: next build (webpack par défaut)

export default nextConfig;
