"use client";

import { CalendarDays, Mail } from "lucide-react";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const serviceLinkClass =
  "flex min-h-12 items-center justify-center gap-4 text-xs font-medium uppercase tracking-[0.18em] transition-opacity hover:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function AccountSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-[30rem]">
        <SheetHeader className="px-7 py-7 text-center sm:px-10">
          <SheetTitle className="font-sans text-lg font-normal uppercase tracking-[0.18em]">
            Log in
          </SheetTitle>
          <SheetDescription className="sr-only">
            Log in or sign up with your mobile number through Shopify.
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-7 pb-10 sm:px-10">
          <div className="pt-16 text-center sm:pt-20">
            <p className="mx-auto max-w-xs text-sm leading-7 text-muted-foreground">
              Use your mobile number to access your Evol account.
            </p>
            <Link
              href="/account/login"
              className="mt-8 flex min-h-14 w-full items-center justify-center border border-foreground px-5 text-xs font-medium uppercase tracking-[0.18em] transition-colors hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Log in / Sign up
            </Link>
          </div>

          <div className="mt-auto pt-20 text-center">
            <h2 className="text-lg font-normal uppercase tracking-[0.18em]">
              Any questions?
            </h2>
            <p className="mx-auto mt-6 max-w-xs text-sm leading-7 text-muted-foreground">
              Our client care team is here to help.
            </p>
            <div className="mt-8 flex flex-col items-center gap-1">
              <a href="mailto:hello@evoljewels.com" className={serviceLinkClass}>
                <Mail className="size-4" strokeWidth={1.25} aria-hidden="true" />
                Contact us
              </a>
              <a
                href="mailto:hello@evoljewels.com?subject=Private%20appointment%20request"
                className={serviceLinkClass}
              >
                <CalendarDays className="size-4" strokeWidth={1.25} aria-hidden="true" />
                Request an appointment
              </a>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
