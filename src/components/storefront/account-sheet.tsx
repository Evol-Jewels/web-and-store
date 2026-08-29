"use client";

import { ArrowRight, UserRound } from "lucide-react";
import Link from "next/link";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const accountActionClass =
  "flex min-h-12 w-full items-center justify-between border border-foreground bg-foreground px-5 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-background transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function AccountSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-[30rem]">
        <SheetHeader className="border-b border-border px-7 py-6 text-center sm:px-10">
          <SheetTitle className="font-sans text-xs font-medium uppercase tracking-[0.22em]">
            Your account
          </SheetTitle>
          <SheetDescription className="sr-only">
            Sign in to your Shopify customer account or view your profile and orders.
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-7 pb-10 sm:px-10">
          <section className="pt-12" aria-labelledby="account-sheet-title">
            <UserRound className="size-5" strokeWidth={1.25} aria-hidden="true" />
            <p className="eyebrow mt-8">Private client area</p>
            <h2
              id="account-sheet-title"
              className="mt-3 max-w-sm font-heading text-4xl leading-[1.02] tracking-[-0.025em]"
            >
              Your jewellery, considered personally
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Sign in securely through Shopify to review your profile, saved addresses,
              and every order placed with Evol.
            </p>

            <div className="mt-9 space-y-3">
              <Link href="/account/login" className={accountActionClass}>
                Sign in or create an account
                <ArrowRight className="size-4" strokeWidth={1.25} aria-hidden="true" />
              </Link>
              <Link
                href="/account"
                className="flex min-h-12 w-full items-center justify-between border border-border px-5 text-[0.68rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                View my account
                <ArrowRight className="size-4" strokeWidth={1.25} aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-5 text-xs leading-6 text-muted-foreground">
              Shopify uses a one-time verification code, so there is no password to
              remember.
            </p>
          </section>

          <div className="mt-14 border-y border-border py-8 text-center">
            <p className="text-[0.67rem] font-medium uppercase tracking-[0.2em]">
              Need assistance?
            </p>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Client Care is available from the phone icon in the header.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
