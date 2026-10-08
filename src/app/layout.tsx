import type { Metadata } from "next";
import localFont from "next/font/local";

import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontProvider } from "@/components/storefront/storefront-provider";
import { WhatsAppSupportButton } from "@/components/storefront/whatsapp-support-button";
import { hasCustomerSession } from "@/lib/shopify/customer-account";

import "./globals.css";
import { CurrencyProvider } from "@/components/storefront/currency-provider";
import { CurrencyPicker } from "@/components/storefront/currency-picker";
import { FloatingStorefrontControls } from "@/components/storefront/floating-storefront-controls";
import { getCurrencySettings } from "@/server/currency";

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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [signedIn, currencySettings] = await Promise.all([hasCustomerSession(), getCurrencySettings()]);

  return (
    <html
      lang="en"
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CurrencyProvider {...currencySettings}>
          <StorefrontProvider>
            <StorefrontHeader signedIn={signedIn} />
            {children}
            <StorefrontFooter />
            <FloatingStorefrontControls>
              <WhatsAppSupportButton />
              <CurrencyPicker />
            </FloatingStorefrontControls>
          </StorefrontProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
