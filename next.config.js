/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.catgame.top',
        port: '',
        pathname: '/**',
      },
    ],
    // Alternative: Use domains array (deprecated but still works)
    // domains: [
    //   'ui-avatars.com',
    //   'picsum.photos',
    //   'images.unsplash.com',
    //   'via.placeholder.com',
    //   'cdn.jsdelivr.net',
    //   'static.catgame.top',
    // ],
  },
  
  // Enable experimental features if needed
  experimental: {
    // Add experimental features here if needed
  },
  
  // Typescript configuration
  typescript: {
    // Enable type checking during build
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Enable ESLint during build
    ignoreDuringBuilds: false,
  },
  
  // Output configuration for static export if needed
  // output: 'export',
  // trailingSlash: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Redirects
  async redirects() {
    return [
      // 不再需要重定向到template1
    ];
  },
};

module.exports = nextConfig; 