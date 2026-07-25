import type { Metadata } from "next";
import localFont from "next/font/local";

import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";

import "./globals.css";

const manrope = localFont({
  src: "./fonts/manrope-variable.ttf",
  variable: "--font-manrope",
  weight: "200 800",
});

const cormorant = localFont({
  src: "./fonts/cormorant-garamond-variable.ttf",
  variable: "--font-cormorant",
  weight: "300 700",
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
