/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig


module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rshop-next-ecommerce.s3.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
      ,
      {
        protocol: 'https',
        hostname: 'i.ibb.co'
      }
    ]
  }
};

