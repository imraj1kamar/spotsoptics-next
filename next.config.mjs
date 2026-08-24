/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '172.20.10.4',
    '172.20.10.8',
    'localhost:3000',
    '127.0.0.1:3000',
  ],
};

export default nextConfig;