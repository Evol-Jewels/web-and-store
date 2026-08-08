import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeHero() {
  return (
    <section
      data-hero
      className="relative isolate flex min-h-svh items-end overflow-hidden bg-cinematic text-white sm:items-center"
    >
      <Image
        src="/images/home/hero-campaign.jpg"
        alt="A woman wearing an Evol lab-grown diamond tennis necklace and earrings"
        fill
        priority
        sizes="100vw"
        className="home-hero-image object-cover object-[72%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-foreground/20 sm:bg-gradient-to-r sm:from-foreground/70 sm:via-foreground/15 sm:to-transparent" />

      <div className="luxury-container relative pb-20 pt-28 sm:py-0">
        <div className="max-w-xl">
          <p className="home-reveal text-[0.64rem] font-medium uppercase tracking-[0.28em] text-white/70">
            Certified lab-grown diamonds
          </p>
          <h1 className="home-reveal home-reveal-delay mt-6 font-heading text-6xl leading-[0.92] tracking-[-0.04em] sm:text-7xl lg:text-[7.5rem]">
            A light of
            <br />
            your own.
          </h1>
          <p className="home-reveal home-reveal-delay-2 mt-8 max-w-md text-sm leading-7 text-white/75 sm:text-base">
            Lab-grown diamonds of exceptional clarity, set in hallmarked gold
            and shaped by hand in India. Modern heirlooms, made with intention.
          </p>
          <div className="home-reveal home-reveal-delay-2 mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/products"
              className={cn(
                buttonVariants(),
                "h-12 rounded-none bg-white px-8 text-[0.64rem] uppercase tracking-[0.18em] text-foreground hover:bg-white/85",
              )}
            >
              Explore the collection
            </Link>

            <Link
              href="/products"
              className="link-underline text-[0.64rem] uppercase tracking-[0.18em] text-white/85"
            >
              Book an appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
