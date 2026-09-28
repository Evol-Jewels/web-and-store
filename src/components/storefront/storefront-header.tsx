"use client";

import {
  Heart,
  IndianRupee,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AccountSheet } from "@/components/storefront/account-sheet";
import { CartSheet } from "@/components/storefront/cart-sheet";
import { ContactSheet } from "@/components/storefront/contact-sheet";
import { NavigationSheet } from "@/components/storefront/navigation-sheet";
import { SearchSheet } from "@/components/storefront/search-sheet";
import { WishlistSheet } from "@/components/storefront/wishlist-sheet";
import { useHeaderVisibility } from "@/components/storefront/use-header-visibility";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const utilityButtonClass =
  "size-11 rounded-none text-current hover:bg-transparent hover:text-current hover:opacity-60 aria-expanded:bg-transparent aria-expanded:text-current";

export function StorefrontHeader({ signedIn }: { signedIn: boolean }) {
  const pathname = usePathname();
  const { solid, hidden } = useHeaderVisibility(pathname);

  return (
    <header
      data-storefront-header
      inert={hidden}
      aria-hidden={hidden}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,color] duration-300 ease-out",
        solid
          ? "border-b border-border/60 bg-background/90 text-foreground backdrop-blur-md"
          : "bg-gradient-to-b from-foreground/55 via-foreground/15 to-transparent text-white",
        hidden && "pointer-events-none -translate-y-full",
      )}
    >
      <div
        className={cn(
          "overflow-hidden bg-cinematic text-center text-cinematic-foreground transition-all duration-500 ease-out",
          solid ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <p className="px-5 py-2.5 text-[0.6rem] uppercase tracking-[0.24em]">
          Complimentary insured delivery across India
        </p>
      </div>

      <div className="luxury-container grid h-16 grid-cols-[1fr_auto_1fr] items-center sm:h-20">
        <div className="flex items-center justify-self-start">
          <NavigationSheet>
            <Button
              variant="ghost"
              size="icon"
              className={utilityButtonClass}
              aria-label="Open navigation"
            >
              <Menu className="size-4" strokeWidth={1.25} />
            </Button>
          </NavigationSheet>
          <SearchSheet>
            <Button
              variant="ghost"
              className="h-11 gap-2 rounded-none px-2 text-[0.65rem] font-normal uppercase tracking-[0.17em] text-current hover:bg-transparent hover:text-current hover:opacity-60 aria-expanded:bg-transparent aria-expanded:text-current"
              aria-label="Search the collection"
            >
              <Search className="size-4" strokeWidth={1.25} />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </SearchSheet>
        </div>

        <Link
          href="/"
          aria-label="Evol Jewels home"
          className="transition-opacity hover:opacity-70"
        >
          <Image
            src="/evol-jewels-logo.png"
            alt="Evol Jewels"
            width={1262}
            height={681}
            className={cn(
              "h-auto w-24 transition-[filter] duration-500 ease-out sm:w-28",
              !solid && "brightness-0 invert",
            )}
            priority
          />
        </Link>

        <div className="flex items-center justify-self-end">
          <span className="mr-1 hidden items-center gap-1 text-[0.62rem] uppercase tracking-[0.14em] opacity-70 lg:flex">
            IN
            <IndianRupee className="size-3" strokeWidth={1.25} />
          </span>
          <ContactSheet>
            <Button
              variant="ghost"
              size="icon"
              className={cn(utilityButtonClass, "hidden sm:inline-flex")}
              aria-label="Contact client care"
            >
              <Phone className="size-4" strokeWidth={1.25} />
            </Button>
          </ContactSheet>
          <WishlistSheet>
            <Button
              variant="ghost"
              size="icon"
              className={utilityButtonClass}
              aria-label="Open wishlist"
            >
              <Heart className="size-4" strokeWidth={1.25} />
            </Button>
          </WishlistSheet>
          {signedIn ? (
            <Button
              render={<Link href="/account" />}
              variant="ghost"
              size="icon"
              className={utilityButtonClass}
              aria-label="View account"
            >
              <UserRound className="size-4" strokeWidth={1.25} />
            </Button>
          ) : (
            <AccountSheet>
              <Button
                variant="ghost"
                size="icon"
                className={utilityButtonClass}
                aria-label="Sign in"
              >
                <UserRound className="size-4" strokeWidth={1.25} />
              </Button>
            </AccountSheet>
          )}
          <CartSheet>
            <Button
              variant="ghost"
              size="icon"
              className={utilityButtonClass}
              aria-label="Open shopping bag"
            >
              <ShoppingBag className="size-4" strokeWidth={1.25} />
            </Button>
          </CartSheet>
        </div>
      </div>
    </header>
  );
}
