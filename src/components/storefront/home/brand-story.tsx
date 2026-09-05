import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/storefront/reveal";
import { buttonVariants } from "@/components/ui/button";

const assurances = [
  ["IGI / SGL", "Certified"],
  ["14K & 18K", "Hallmarked gold"],
  ["India", "Handcrafted"],
  ["For life", "Annual care"],
];

export function BrandStory() {
  return (
    <section className="bg-secondary" aria-labelledby="story-title">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[34rem] overflow-hidden sm:min-h-[44rem] lg:min-h-[50rem]">
          <Reveal image className="absolute inset-0">
            <Image
              src="/images/home/editorial-portrait.jpg"
              alt="A woman wearing an Evol lab-grown diamond halo earring in profile"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </Reveal>
        </div>
        <div className="flex items-center px-5 py-20 sm:px-12 sm:py-28 lg:px-20 xl:px-28">
          <Reveal className="max-w-xl">
            <p className="eyebrow">Born from possibility</p>
            <h2
              id="story-title"
              className="mt-6 font-heading text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl"
            >
              The same brilliance. A new beginning.
            </h2>
            <p className="mt-8 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              Independently certified lab-grown diamonds, set in hallmarked gold
              and handcrafted in India with care that continues for life.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
              {assurances.map(([value, label]) => (
                <div key={label}>
                  <dt className="font-heading text-2xl tracking-[-0.02em]">{value}</dt>
                  <dd className="mt-1 text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "luxury",
                  className: "h-12 rounded-md px-8 text-[0.62rem]",
                })}
              >
                Explore our diamonds
              </Link>
              <Link
                href="/products"
                className="link-underline inline-flex text-[0.65rem] uppercase tracking-[0.2em]"
              >
                Find your piece
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
