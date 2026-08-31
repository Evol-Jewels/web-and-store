import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <main className="luxury-container pb-20 pt-36 sm:pb-28 sm:pt-44" aria-busy="true" aria-label="Loading account">
      <Skeleton className="h-3 w-28 rounded-none" />
      <Skeleton className="mt-5 h-14 w-full max-w-md rounded-none" />
      <Skeleton className="mt-6 h-5 w-full max-w-xl rounded-none" />
      <div className="mt-14 border-y border-border py-7">
        <Skeleton className="h-3 w-40 rounded-none" />
      </div>
      <div className="grid gap-14 py-14 lg:grid-cols-2 lg:gap-24">
        {[0, 1].map((section) => (
          <div key={section}>
            <Skeleton className="h-4 w-28 rounded-none" />
            <Skeleton className="mt-5 h-9 w-52 rounded-none" />
            <Skeleton className="mt-8 h-44 w-full rounded-none" />
          </div>
        ))}
      </div>
    </main>
  );
}
