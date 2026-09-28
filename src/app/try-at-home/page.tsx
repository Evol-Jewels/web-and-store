import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";

import { RequestForm } from "@/app/try-at-home/request-form";
import { buttonVariants } from "@/components/ui/button";
import { CART_COOKIE } from "@/lib/shopify/cart/cookie";
import { getCart } from "@/lib/shopify/cart/server";
import { MAX_BAG_ITEMS } from "@/lib/shopify/cart/limits";

export const metadata: Metadata = {
  title: "Try at Home",
  description: "Request to experience selected Evol pieces at home.",
};

export default async function TryAtHomePage() {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  const cart = cartId ? await getCart(cartId) : null;

  return (
    <main className="luxury-container pb-20 pt-36 sm:pb-28 sm:pt-44">
      <div className="max-w-3xl">
        <p className="eyebrow">Private appointment</p>
        <h1 className="mt-4 font-heading text-5xl leading-none tracking-[-0.025em] sm:text-6xl">
          Try at Home
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
          Review your selection and share where we can reach you. Our team will confirm availability and arrange the next steps. No payment is taken with this request.
        </p>
      </div>

      {cart && cart.totalQuantity > MAX_BAG_ITEMS ? (
        <p className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
          Your bag has more than {MAX_BAG_ITEMS} pieces. Remove some pieces before requesting Try at Home.
        </p>
      ) : cart?.totalQuantity ? (
        <RequestForm cart={cart} />
      ) : (
        <div className="mt-14 max-w-xl border-t border-border pt-8">
          <p className="text-sm text-muted-foreground">Your bag is empty.</p>
          <Link
            href="/products"
            className={buttonVariants({ variant: "outline", className: "mt-7 h-11 rounded-none px-7 uppercase tracking-[0.16em]" })}
          >
            Explore the collection
          </Link>
        </div>
      )}
    </main>
  );
}
