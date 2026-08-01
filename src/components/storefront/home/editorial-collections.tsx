import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    name: "Necklaces",
    image: "/images/home/rings.jpg",
    alt: "Diamond necklaces layered at the neckline",
    className:
      "col-span-2 aspect-[5/4] lg:col-span-4 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:aspect-auto",
    position: "object-center",
  },
  {
    name: "Bracelets",
    image: "/images/home/bracelets.jpg",
    alt: "Diamond tennis bracelet worn on the wrist",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:aspect-auto",
    position: "object-center",
  },
  {
    name: "Rings",
    image: "/images/home/earrings.jpg",
    alt: "Diamond rings styled on two hands",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:aspect-auto",
    position: "object-center",
  },
  {
    name: "Earrings",
    image: "/images/home/necklaces.jpg",
    alt: "Diamond earrings worn in profile",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:aspect-auto",
    position: "object-center",
  },
  {
    name: "Pendants",
    image: "/images/home/pendants.jpg",
    alt: "Two oval diamond pendants layered over a black jacket",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:aspect-auto",
    position: "object-center",
  },
];

export function EditorialCollections() {
  return (
    <section id="collections" className="border-y border-border py-24 sm:py-32">
      <div className="luxury-container text-center">
        <p className="eyebrow">Explore Evol</p>
        <h2 className="mt-5 font-heading text-5xl tracking-[-0.035em] sm:text-7xl">
          Find your expression
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-muted-foreground">
          Five ways to make brilliance your own, from quiet signatures to
          defining forms.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-px bg-border sm:mt-18 lg:h-[48rem] lg:grid-cols-12 lg:grid-rows-2">
        {collections.map((collection) => (
          <Link
            key={collection.name}
            href="/products"
            className={`group relative overflow-hidden bg-product-surface ${collection.className}`}
          >
            <Image
              src={collection.image}
              alt={collection.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 34vw"
              className={`object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none ${collection.position}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5 text-background sm:p-7">
              <span className="text-[0.67rem] font-medium uppercase tracking-[0.24em]">
                {collection.name}
              </span>
              <span className="grid size-10 shrink-0 place-items-center border border-background/50 transition-colors group-hover:bg-background group-hover:text-foreground">
                <ArrowUpRight className="size-4" strokeWidth={1.25} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
