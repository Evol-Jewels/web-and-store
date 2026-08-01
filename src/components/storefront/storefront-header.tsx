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
import { useEffect, useRef, useState } from "react";

import { AccountSheet } from "@/components/storefront/account-sheet";
import { CartSheet } from "@/components/storefront/cart-sheet";
import { ContactSheet } from "@/components/storefront/contact-sheet";
import { NavigationSheet } from "@/components/storefront/navigation-sheet";
import { WishlistSheet } from "@/components/storefront/wishlist-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const utilityButtonClass =
  "size-11 rounded-none text-foreground hover:bg-transparent hover:opacity-55";

export function StorefrontHeader() {
  const [navigationHidden, setNavigationHidden] = useState(false);
  const previousScrollPosition = useRef(0);

  useEffect(() => {
    previousScrollPosition.current = window.scrollY;

    function handleScroll() {
      const currentScrollPosition = window.scrollY;
      const scrollDifference =
        currentScrollPosition - previousScrollPosition.current;

      if (currentScrollPosition < 80) {
        setNavigationHidden(false);
      } else if (Math.abs(scrollDifference) > 6) {
        setNavigationHidden(scrollDifference > 0);
      }

      previousScrollPosition.current = currentScrollPosition;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="bg-cinematic px-5 py-2 text-center text-[0.6rem] uppercase tracking-[0.2em] text-cinematic-foreground">
        Complimentary insured delivery across India
      </div>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-out",
          navigationHidden && "-translate-y-full",
        )}
      >
        <div className="luxury-container grid h-20 grid-cols-[1fr_auto_1fr] items-center sm:h-24">
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
            <Button
              variant="ghost"
              className="hidden h-11 rounded-none px-1 text-[0.65rem] font-normal uppercase tracking-[0.17em] hover:bg-transparent hover:opacity-55 sm:flex"
              aria-label="Search the collection"
            >
              <Search className="size-4" strokeWidth={1.25} />
              Search
            </Button>
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
              className="h-auto w-24 sm:w-32"
              preload
            />
          </Link>

          <div className="flex items-center justify-self-end">
            <span className="mr-1 hidden items-center gap-1 text-[0.62rem] uppercase tracking-[0.14em] text-muted-foreground lg:flex">
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
            <AccountSheet>
              <Button
                variant="ghost"
                size="icon"
                className={utilityButtonClass}
                aria-label="Open account"
              >
                <UserRound className="size-4" strokeWidth={1.25} />
              </Button>
            </AccountSheet>
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
    </>
  );
}
