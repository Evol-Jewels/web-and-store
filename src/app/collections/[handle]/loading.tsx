import { LoadingStatus } from "@/components/storefront/loading-status";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <main aria-busy="true">
            <section
        data-hero
        className="relative isolate min-h-[31rem] overflow-hidden bg-cinematic sm:min-h-[38rem]"
      >
        <div className="absolute inset-0 bg-product-surface" aria-hidden="true" />
        <div className="absolute inset-0 bg-cinematic/70" />
        <div className="luxury-container relative flex min-h-[31rem] flex-col items-center justify-center px-5 pb-16 pt-28 sm:min-h-[38rem]">
          <LoadingStatus className="mb-6 text-xs text-cinematic-foreground">Loading collection</LoadingStatus>
          <Skeleton className="h-2 w-28 bg-cinematic-foreground/30 motion-reduce:animate-none" />
          <Skeleton className="mt-7 h-12 w-[min(75vw,30rem)] bg-cinematic-foreground/30 sm:h-16 sm:w-[min(70vw,48rem)] motion-reduce:animate-none" />
          <Skeleton className="mt-3 h-12 w-[min(60vw,22rem)] bg-cinematic-foreground/30 sm:hidden motion-reduce:animate-none" />
          <Skeleton className="mt-7 h-4 w-[min(65vw,32rem)] bg-cinematic-foreground/25 motion-reduce:animate-none" />
        </div>
      </section>

      <div className="border-b border-border" aria-hidden="true">
        <div className="luxury-container flex h-16 items-center gap-8 overflow-hidden">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-2 w-20 shrink-0 rounded-none motion-reduce:animate-none" />
          ))}
        </div>
      </div>

      <section className="luxury-container py-16 sm:py-20 lg:py-24" aria-hidden="true">
        <Skeleton className="h-2 w-36 rounded-none motion-reduce:animate-none" />
        <Skeleton className="mt-5 h-10 w-64 max-w-full rounded-none motion-reduce:animate-none" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="aspect-[4/5] rounded-none motion-reduce:animate-none" />
          ))}
        </div>
      </section>
    </main>
  );
}
