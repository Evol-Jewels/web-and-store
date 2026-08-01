"use client";

import { CalendarDays, Eye, EyeOff, Mail, Phone } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function preventFormSubmission(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

function PasswordField() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id="account-password"
        name="password"
        type={passwordVisible ? "text" : "password"}
        autoComplete="current-password"
        placeholder="Password"
        className="h-11 rounded-none border-x-0 border-t-0 px-0 pr-10 focus-visible:ring-0"
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="absolute top-1/2 right-0 -translate-y-1/2 rounded-none text-muted-foreground hover:bg-transparent hover:text-foreground"
        aria-label={passwordVisible ? "Hide password" : "Show password"}
        onClick={() => setPasswordVisible((visible) => !visible)}
      >
        {passwordVisible ? <EyeOff strokeWidth={1.25} /> : <Eye strokeWidth={1.25} />}
      </Button>
    </div>
  );
}

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
            Sign in, create an account, or contact the Evol client care team.
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-7 pb-10 sm:px-10">
          <Tabs defaultValue="login" className="mt-4 gap-0">
            <TabsList
              variant="line"
              className="h-12 w-full justify-start gap-8 border-b border-border p-0"
            >
              <TabsTrigger
                value="login"
                className="h-full flex-none rounded-none px-0 text-[0.67rem] font-medium uppercase tracking-[0.16em]"
              >
                Sign in
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="h-full flex-none rounded-none px-0 text-[0.67rem] font-medium uppercase tracking-[0.16em]"
              >
                Create an account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="pt-10">
              <form className="space-y-7" onSubmit={preventFormSubmission}>
                <div className="space-y-2.5">
                  <Label htmlFor="account-email" className="text-xs font-normal">
                    Email address
                  </Label>
                  <Input
                    id="account-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email address"
                    className="h-11 rounded-none border-x-0 border-t-0 px-0 focus-visible:ring-0"
                    required
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="account-password" className="text-xs font-normal">
                    Password
                  </Label>
                  <PasswordField />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="h-11 w-full rounded-none text-[0.68rem] uppercase tracking-[0.18em]"
                >
                  Sign in
                </Button>
                <Link
                  href="#"
                  className="block text-center text-xs underline underline-offset-4 transition-opacity hover:opacity-60"
                >
                  Forgot your password?
                </Link>
              </form>
            </TabsContent>

            <TabsContent value="register" className="pt-10">
              <div className="space-y-7">
                <div>
                  <p className="font-heading text-3xl tracking-[-0.02em]">
                    A more personal experience
                  </p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    Save your preferred creations, review enquiries, and receive
                    considered assistance from our jewellery specialists.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="h-11 w-full rounded-none text-[0.68rem] uppercase tracking-[0.18em]"
                >
                  Create an account
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-12 border-t border-border pt-9">
            <p className="text-center text-[0.67rem] font-medium uppercase tracking-[0.2em]">
              Need assistance?
            </p>
            <div className="mt-7 grid grid-cols-3 divide-x divide-border border-y border-border py-5">
              <Link href="#" className="group flex flex-col items-center gap-2 text-center">
                <Mail className="size-4 transition-opacity group-hover:opacity-55" strokeWidth={1.25} />
                <span className="text-[0.62rem] uppercase tracking-[0.14em]">Contact us</span>
              </Link>
              <Link href="#" className="group flex flex-col items-center gap-2 text-center">
                <CalendarDays className="size-4 transition-opacity group-hover:opacity-55" strokeWidth={1.25} />
                <span className="text-[0.62rem] uppercase tracking-[0.14em]">Appointment</span>
              </Link>
              <Link href="#" className="group flex flex-col items-center gap-2 text-center">
                <Phone className="size-4 transition-opacity group-hover:opacity-55" strokeWidth={1.25} />
                <span className="text-[0.62rem] uppercase tracking-[0.14em]">Call us</span>
              </Link>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
