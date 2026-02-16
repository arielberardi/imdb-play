import { validateEnv } from "@/lib/env";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

validateEnv();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**/*",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
