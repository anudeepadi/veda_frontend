/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.REACT_APP_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '${process.env.REACT_APP_API_URL}/:path*',
      },
    ]
  },
}

module.exports = nextConfig