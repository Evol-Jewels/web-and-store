"use client";

import { Button } from "@/components/ui/button";

export default function StorefrontError({ unstable_retry }: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <main className="luxury-container flex min-h-[70vh] items-center justify-center pb-20 pt-36 text-center sm:pt-44">
      <div className="max-w-lg border-y border-border py-16">
        <h1 className="font-heading text-4xl tracking-[-0.03em]">We could not load this page</h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          Please try again in a moment.
        </p>
        <Button type="button" onClick={unstable_retry} variant="luxury" className="mt-8 min-h-11 rounded-none px-6 text-[0.64rem]">
          Try again
        </Button>
      </div>
    </main>
  );
}
