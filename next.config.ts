export default {
  experimental: {
    ppr: true,
    inlineCss: true,
    useCache: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      // Placeholder images used by the built-in demo catalog (demo mode).
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};
