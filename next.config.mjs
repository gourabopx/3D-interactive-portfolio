/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "unpkg.com",
        pathname: "/**",
      },
    ],
  },
  // Ensure TypeScript is enabled and build errors are not ignored
  typescript: {
    // Setting this to false makes Next.js fail the build on type errors.
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
