import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Evol Fine Jewellery",
    template: "%s | Evol",
  },
  description:
    "Fine jewellery shaped by light, material and moments that endure.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <StorefrontHeader />
        {children}
        <StorefrontFooter />
      </body>
    </html>
  );
}
