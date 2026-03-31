/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // Allow Puppeteer/Chromium to be bundled correctly (Next.js 14 uses experimental prefix)
  experimental: {
    serverComponentsExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
  },
};

export default nextConfig;
