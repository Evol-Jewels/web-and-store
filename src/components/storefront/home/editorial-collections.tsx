import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/storefront/reveal";

type Tile = {
  name: string;
  handle: string;
  image: string;
  alt: string;
  className: string;
};

const tiles: Tile[] = [
  {
    name: "Rings",
    handle: "rings",
    image: "/images/home/editorial-rings.jpg",
    alt: "Evol lab-grown diamond engagement rings worn on two hands",
    className:
      "col-span-2 aspect-[5/4] lg:col-span-4 lg:col-start-5 lg:row-span-2 lg:row-start-1 lg:aspect-auto",
  },
  {
    name: "Earrings",
    handle: "earrings",
    image: "/images/home/editorial-earrings.jpg",
    alt: "A woman wearing an Evol lab-grown diamond halo earring in profile",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:aspect-auto",
  },
  {
    name: "Bracelets",
    handle: "bracelets",
    image: "/images/home/editorial-wrist.jpg",
    alt: "Evol lab-grown diamond tennis bracelet worn on the wrist",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:aspect-auto",
  },
  {
    name: "Pendants",
    handle: "pendants",
    image: "/images/home/editorial-pendants.jpg",
    alt: "Layered Evol lab-grown diamond pendants worn over a black jacket",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:aspect-auto",
  },
  {
    name: "Necklaces",
    handle: "necklaces",
    image: "/images/home/editorial-necklace.jpg",
    alt: "Evol lab-grown diamond tennis necklace worn at the neckline",
    className:
      "aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:row-start-2 lg:aspect-auto",
  },
];

export function EditorialCollections() {
  return (
    <section id="collections" className="border-y border-border py-24 sm:py-32">
      <Reveal className="luxury-container text-center">
        <p className="eyebrow">Explore Evol</p>
        <h2 className="mt-5 font-heading text-5xl tracking-[-0.035em] sm:text-7xl">
          Find your expression
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-muted-foreground">
          Considered collections of lab-grown brilliance, from quiet everyday
          signatures to defining statement forms.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-2 gap-px bg-border sm:mt-18 lg:h-[48rem] lg:grid-cols-12 lg:grid-rows-2">
        {tiles.map((tile) => (
          <Link
            key={tile.handle}
            href={`/products?collection=${tile.handle}`}
            className={`group relative overflow-hidden bg-product-surface ${tile.className}`}
          >
            <Image
              src={tile.image}
              alt={tile.alt}
              fill
              sizes="(max-width: 1024px) 50vw, 34vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5 text-background sm:p-7">
              <span className="text-[0.67rem] font-medium uppercase tracking-[0.24em]">
                {tile.name}
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
