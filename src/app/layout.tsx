
import type { Metadata } from "next";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/providers";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.BETTER_AUTH_URL || "http://localhost:3000"
  ),

  title: {
    default: "BookNook | A Small Online Library",
    template: "%s | BookNook",
  },

  description:
    "Discover, share, and borrow books with the BookNook community.",

  applicationName: "BookNook",

  keywords: [
    "BookNook",
    "online library",
    "borrow books",
    "share books",
    "community library",
    "book collection",
  ],

  authors: [{ name: "BookNook" }],
  creator: "BookNook",
  publisher: "BookNook",
};
  
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
