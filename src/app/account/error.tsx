"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AccountError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <main className="luxury-container flex min-h-[70vh] items-center justify-center pb-20 pt-36 text-center sm:pt-44">
      <div className="max-w-lg border-y border-border py-16">
        <p className="eyebrow">Customer account</p>
        <h1 className="mt-4 font-heading text-4xl tracking-[-0.03em]">We could not open your account</h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Your information remains secure. Please try again, or return to the collection.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            type="button"
            onClick={() => unstable_retry()}
            variant="luxury"
            className="min-h-11 rounded-none px-6 text-[0.64rem]"
          >
            Try again
          </Button>
          <Link href="/products" className="inline-flex min-h-11 items-center border border-border px-6 text-[0.64rem] uppercase tracking-[0.18em]">
            View jewellery
          </Link>
        </div>
      </div>
    </main>
  );
}
