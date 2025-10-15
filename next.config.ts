// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://server-stv1.onrender.com/api/:path*' // Proxy to backend
      }
    ];
  }
};

module.exports = nextConfig;