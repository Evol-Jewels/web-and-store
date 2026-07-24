import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <main className="luxury-container grid gap-12 py-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(22rem,0.75fr)] lg:gap-16">
      <Skeleton className="aspect-[4/5] rounded-none bg-product-surface" />
      <div className="space-y-7 pt-8">
        <Skeleton className="h-3 w-28 rounded-none" />
        <Skeleton className="h-20 w-full rounded-none" />
        <Skeleton className="h-4 w-32 rounded-none" />
        <Skeleton className="h-px w-full rounded-none" />
        <Skeleton className="h-12 w-full rounded-none" />
      </div>
    </main>
  );
}
