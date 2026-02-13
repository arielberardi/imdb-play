import { Footer } from "@/components/organisms/Footer";
import { Navbar } from "@/components/organisms/Navbar";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IMDB Play",
  description: "Stream the IMDB Catalog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Trigger environment validation
  void env;

  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
