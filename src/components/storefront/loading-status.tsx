import { LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function LoadingStatus({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span role="status" className={cn("inline-flex items-center justify-center gap-2", className)}>
      <LoaderCircle aria-hidden="true" className="size-4 shrink-0 animate-spin motion-reduce:animate-none" strokeWidth={1.5} />
      <span>{children}</span>
    </span>
  );
}
