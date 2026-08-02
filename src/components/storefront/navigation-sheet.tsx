import Link from "next/link";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationLinks = [
  { href: "/", label: "Jewellery" },
  { href: "/#collection", label: "Collections" },
  { href: "/products", label: "All creations" },
  { href: "/#", label: "Our world" },
];

export function NavigationSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent side="left" className="data-[side=left]:w-full data-[side=left]:sm:max-w-[28rem]">
        <SheetHeader className="border-b border-border px-7 py-6 text-center sm:px-10">
          <SheetTitle className="font-sans text-xs font-medium uppercase tracking-[0.22em]">
            Explore Evol
          </SheetTitle>
          <SheetDescription className="sr-only">
            Browse the Evol fine jewellery collection and stories.
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Menu" className="flex flex-col px-7 py-8 sm:px-10">
          {navigationLinks.map((link) => (
            <SheetClose
              key={link.label}
              render={
                <Link
                  href={link.href}
                  className="border-b border-border py-5 font-heading text-3xl tracking-[-0.02em] transition-opacity hover:opacity-55"
                />
              }
            >
              {link.label}
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
