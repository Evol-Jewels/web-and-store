import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export function CatalogNextLink({
  pathname,
  endCursor,
  hasNextPage,
}: {
  pathname: string;
  endCursor: string | null;
  hasNextPage: boolean;
}) {
  if (!hasNextPage || !endCursor) return null;

  return (
    <div className="mt-16 flex justify-center border-t border-border pt-12 sm:mt-20">
      <Link
        href={{ pathname, query: { after: endCursor } }}
        className={buttonVariants({
          variant: "outline",
          className:
            "h-12 rounded-none px-8 text-[0.62rem] uppercase tracking-[0.18em]",
        })}
      >
        View the next pieces
        <ArrowRight className="size-4" strokeWidth={1.25} />
      </Link>
    </div>
  );
}
