/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-666ffca9921d4b79b6738f62abc3af39.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'luminaverse.sk',
      },
      {
        protocol: 'https',
        hostname: 'image.pollinations.ai',
      },
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'melliobrien.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
    ],
  },
};

module.exports = nextConfig;

