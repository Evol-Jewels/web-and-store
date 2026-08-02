import Image from "next/image";
import Link from "next/link";

export function BrandStory() {
  return (
    <section className="bg-secondary" aria-labelledby="story-title">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[34rem] overflow-hidden sm:min-h-[44rem] lg:min-h-[50rem]">
          <Image
            src="/images/home/pendants.jpg"
            alt="Diamond pendant worn close to the skin"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
        </div>
        <div className="flex items-center px-5 py-20 sm:px-12 sm:py-28 lg:px-20 xl:px-28">
          <div className="max-w-xl">
            <p className="eyebrow">Born from possibility</p>
            <h2
              id="story-title"
              className="mt-6 font-heading text-5xl leading-[0.98] tracking-[-0.035em] sm:text-7xl"
            >
              The same brilliance. A new beginning.
            </h2>
            <p className="mt-8 text-sm leading-7 text-muted-foreground sm:text-base">
              Evol specialises in lab-grown diamonds: physically, chemically,
              and optically identical to mined diamonds, created through human
              ingenuity and chosen with complete clarity.
            </p>
            <p className="mt-5 text-sm leading-7 text-muted-foreground sm:text-base">
              Every stone is independently certified. Every setting is made in
              hallmarked gold. Every piece is handcrafted in India and cared
              for long after it leaves us.
            </p>
            <Link
              href="/products"
              className="link-underline mt-9 inline-flex text-[0.65rem] uppercase tracking-[0.2em]"
            >
              Discover our diamonds
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
