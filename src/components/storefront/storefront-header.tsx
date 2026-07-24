import { Menu, Search, UserRound } from "lucide-react";
import Link from "next/link";

export function StorefrontHeader() {
  return (
    <>
      <div className="bg-cinematic px-5 py-2.5 text-center text-[0.62rem] uppercase tracking-[0.18em] text-cinematic-foreground">
        Complimentary insured delivery across India
      </div>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="luxury-container grid h-20 grid-cols-[1fr_auto_1fr] items-center">
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-8 text-[0.68rem] uppercase tracking-[0.18em] md:flex"
          >
            <Link href="/" className="transition-opacity hover:opacity-55">
              Jewellery
            </Link>
            <Link href="/#collection" className="transition-opacity hover:opacity-55">
              Collections
            </Link>
            <span className="transition-opacity hover:opacity-55">
              Our world
            </span>
          </nav>

          <button
            type="button"
            aria-label="Open navigation"
            className="justify-self-start p-2 md:hidden"
          >
            <Menu className="size-4" strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className="font-heading text-2xl uppercase tracking-[0.3em]"
          >
            Evol
          </Link>

          <div className="flex items-center justify-self-end gap-1">
            <button
              type="button"
              aria-label="Search"
              className="grid size-10 place-items-center transition-opacity hover:opacity-55"
            >
              <Search className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Account"
              className="hidden size-10 place-items-center transition-opacity hover:opacity-55 sm:grid"
            >
              <UserRound className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
