import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { toExcerpt } from "@/lib/text";
import type { CollectionCardData } from "@/types/collection";

export function CollectionCard({
  collection,
  priority = false,
}: {
  collection: CollectionCardData;
  priority?: boolean;
}) {
  return (
    <article className="group min-w-0">
      <Link
        href={"/collections/" + collection.handle}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-product-surface">
          {collection.image ? (
            <Image
              src={collection.image.url}
              alt={collection.image.altText}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-[9%] transition-transform duration-1000 ease-out group-hover:scale-[1.025] motion-reduce:transition-none"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Evol
            </div>
          )}
          <span className="absolute right-4 bottom-4 grid size-10 place-items-center border border-foreground/20 bg-background/85 transition-colors group-hover:bg-foreground group-hover:text-background">
            <ArrowUpRight className="size-4" strokeWidth={1.25} />
          </span>
        </div>
        <div className="py-4 sm:py-5">
          <h2 className="font-heading text-xl leading-tight tracking-[-0.015em] sm:text-2xl">
            {collection.title}
          </h2>
          {collection.description ? (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {toExcerpt(collection.description, 180)}
            </p>
          ) : (
            <p className="mt-2 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Explore the collection
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
