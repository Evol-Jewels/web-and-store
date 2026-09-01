import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <main className="pt-20">
      <div className="grid min-h-[32rem] bg-cinematic lg:grid-cols-2">
        <div className="flex items-center px-6 py-20 sm:px-12 lg:px-20">
          <div className="w-full max-w-xl space-y-6">
            <Skeleton className="h-3 w-32 bg-background/15" />
            <Skeleton className="h-20 w-full bg-background/15" />
            <Skeleton className="h-16 w-4/5 bg-background/15" />
          </div>
        </div>
        <Skeleton className="min-h-[28rem] rounded-none" />
      </div>
      <div className="luxury-container grid grid-cols-2 gap-3 py-20 sm:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/5] rounded-none" />
        ))}
      </div>
    </main>
  );
}
