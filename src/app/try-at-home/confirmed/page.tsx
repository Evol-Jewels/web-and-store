import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { RefreshBag } from "./refresh-bag";

export const metadata: Metadata = { title: "Request Received" };

export default async function TryAtHomeConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  return (
    <main className="luxury-container flex min-h-[70vh] items-center pb-20 pt-36 sm:pt-44">
      <RefreshBag />
      <div className="max-w-xl">
        <p className="eyebrow">Try at Home</p>
        <h1 className="mt-4 font-heading text-5xl leading-none tracking-[-0.025em] sm:text-6xl">
          Request received
        </h1>
        {reference ? <p className="mt-7 text-xs uppercase tracking-[0.16em]">Reference {reference}</p> : null}
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Thank you. Our team will review your selection and delivery details, then contact you to confirm availability and arrange your trial. No payment has been collected.
        </p>
        <Link
          href="/products"
          className={buttonVariants({ variant: "outline", className: "mt-9 h-11 rounded-none px-7 uppercase tracking-[0.16em]" })}
        >
          Continue exploring
        </Link>
      </div>
    </main>
  );
}
