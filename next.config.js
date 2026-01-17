/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
        // Remove console.log in production for cleaner performance
        removeConsole: process.env.NODE_ENV === "production" ? { exclude: ['error', 'warn'] } : false,
    },
};

module.exports = nextConfig;
