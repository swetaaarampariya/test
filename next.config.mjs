/** @type {import('next').NextConfig} */

import path from 'path';
const nextConfig = {
  sassOptions: {
    includePaths: [path.join('scss')]
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'medi-cart.s3.eu-north-1.amazonaws.com',
        port: '',
        pathname: '/**'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  output: 'standalone'
};

export default nextConfig;
