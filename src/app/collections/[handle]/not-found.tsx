import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function CollectionNotFound() {
  return (
    <main className="luxury-container flex min-h-[70svh] flex-col items-center justify-center py-32 text-center">
      <p className="eyebrow">Collection unavailable</p>
      <h1 className="mt-5 font-heading text-5xl tracking-[-0.035em] sm:text-7xl">
        This collection has moved
      </h1>
      <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground">
        Explore the complete Evol collection to find another expression.
      </p>
      <Link
        href="/collections"
        className={buttonVariants({
          variant: "luxury",
          className: "mt-9 h-12 rounded-none px-8 text-[0.62rem]",
        })}
      >
        View all collections
      </Link>
    </main>
  );
}
