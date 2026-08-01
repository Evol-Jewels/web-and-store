import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="bg-cinematic text-cinematic-foreground">
      <div className="grid min-h-[42rem] lg:min-h-[calc(100svh-7.5rem)] lg:grid-cols-[0.43fr_0.57fr]">
        <div className="relative z-10 flex items-center px-6 py-20 sm:px-12 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            <p className="home-reveal text-3xl font-light leading-none tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              At the heart of
            </p>
            <h1 className="home-reveal home-reveal-delay mt-1 font-heading text-[5.25rem] leading-[0.8] tracking-[-0.055em] sm:text-[8rem] lg:text-[9.5rem] xl:text-[11rem]">
              Jewellery
            </h1>
            <p className="home-reveal home-reveal-delay-2 mt-9 max-w-md text-sm leading-7 text-cinematic-foreground/65 sm:text-base">
              Certified lab-grown diamonds, shaped into modern heirlooms and
              handcrafted in India.
            </p>
            <Link
              href="/products"
              className={buttonVariants({
                variant: "outline",
                className:
                  "home-reveal home-reveal-delay-2 mt-9 h-12 rounded-none border-cinematic-foreground bg-cinematic-foreground px-8 text-[0.64rem] uppercase tracking-[0.18em] text-cinematic hover:bg-cinematic-foreground/85 hover:text-cinematic",
              })}
            >
              Explore the collection
            </Link>
          </div>
        </div>

        <div className="relative min-h-[28rem] overflow-hidden sm:min-h-[36rem] lg:min-h-[inherit]">
          <Image
            src="/images/home/hero-01.webp"
            alt="A woman wearing Evol diamond necklaces and rings"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 57vw"
            className="home-hero-image object-cover object-right"
          />
        </div>
      </div>
    </section>
  );
}
