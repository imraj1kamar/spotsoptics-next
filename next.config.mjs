/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '172.20.10.4',
    '172.20.10.8',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
  images: {
    // Task 1: Serve modern AVIF (preferred) with WebP fallback.
    // AVIF is ~50% smaller than WebP and significantly improves LCP.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;