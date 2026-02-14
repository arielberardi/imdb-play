import { validateEnv } from "@/lib/env";
import type { NextConfig } from "next";

validateEnv();

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
