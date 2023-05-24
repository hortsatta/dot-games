/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_RAWG_MEDIA_BASE_URL,
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_MEDIA_BASE_URL,
        port: '',
        pathname: '/storage/v1/object/public/main/images/**',
      },
    ],
  },
};

module.exports = nextConfig;
