import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/storefront/reveal";

export function EditorialBand() {
  return (
    <section className="relative isolate flex min-h-[32rem] items-end overflow-hidden bg-cinematic text-white sm:min-h-[40rem] lg:min-h-[46rem]">
      <Reveal image className="absolute inset-0">
        <Image
          src="/images/home/editorial-expression.jpg"
          alt="A model wearing sculptural Evol lab-grown diamond rings and ear cuffs"
          fill
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
      </Reveal>
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/75 via-foreground/25 to-transparent" />
      <div className="luxury-container relative py-16 sm:py-20 lg:py-24">
        <Reveal className="max-w-xl">
          <p className="text-[0.64rem] font-medium uppercase tracking-[0.28em] text-white/70">
            Made to be worn
          </p>
          <h2 className="mt-6 font-heading text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
            Brilliance with a point of view.
          </h2>
          <p className="mt-7 max-w-md text-sm leading-7 text-white/80 sm:text-base">
            Diamonds that move with you, from the everyday to the unforgettable.
            Designed to be lived in, not left in the box.
          </p>
          <Link
            href="/products"
            className="link-underline mt-9 inline-flex text-[0.64rem] uppercase tracking-[0.18em] text-white"
          >
            Explore the collection
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
