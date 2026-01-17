import { fileURLToPath } from "url"
import { dirname } from "path"

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Turbopack from picking the wrong workspace root when other lockfiles exist in parent folders.
  turbopack: {
    root: __dirname,
  },
  typescript: {
    // ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
