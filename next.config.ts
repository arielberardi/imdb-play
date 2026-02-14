import { validateEnv } from "@/lib/env";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

validateEnv();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
