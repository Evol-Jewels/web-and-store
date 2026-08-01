import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function CartSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-[34rem]">
        <SheetHeader className="border-b border-border px-7 py-6 sm:px-10">
          <SheetTitle className="font-sans text-xs font-medium uppercase tracking-[0.22em]">
            Shopping bag
          </SheetTitle>
          <SheetDescription className="sr-only">
            Products currently in your shopping bag.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 place-items-center px-7 py-16 text-center sm:px-10">
          <div className="max-w-xs">
            <ShoppingBag className="mx-auto size-6" strokeWidth={1.1} />
            <p className="mt-6 font-heading text-3xl tracking-[-0.02em]">
              Your bag is empty
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Discover pieces shaped for everyday rituals and defining moments.
            </p>
            <Link
              href="/products"
              className={buttonVariants({
                variant: "outline",
                className:
                  "mt-8 h-11 rounded-none px-7 text-[0.64rem] uppercase tracking-[0.18em]",
              })}
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
