import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductNotFound() {
  return (
    <main className="luxury-container grid min-h-[65vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow">Piece unavailable</p>
        <h1 className="mt-6 font-heading text-6xl tracking-[-0.04em]">
          This piece cannot be found
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-muted-foreground">
          It may have moved or is no longer part of the current collection.
        </p>
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "luxury", size: "lg" }),
            "mt-9 h-12 rounded-md px-8",
          )}
        >
          Return to the collection
        </Link>
      </div>
    </main>
  );
}
