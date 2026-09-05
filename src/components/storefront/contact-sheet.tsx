import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function ContactSheet({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-[30rem]">
        <SheetHeader className="border-b border-border px-7 py-6 text-center sm:px-10">
          <SheetTitle className="font-sans text-xs font-medium uppercase tracking-[0.22em]">
            Client care
          </SheetTitle>
          <SheetDescription className="sr-only">
            Contact Evol client care by phone, appointment, or email.
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-7 pb-10 sm:px-10">
          <p className="mx-auto max-w-sm py-9 text-center text-sm leading-7 text-muted-foreground">
            Our jewellery specialists are at your service through your preferred
            method of contact.
          </p>

          <Accordion defaultValue={["call"]}>
            <AccordionItem value="call" className="border-t border-border">
              <AccordionTrigger className="rounded-md py-5 text-[0.67rem] font-medium uppercase tracking-[0.18em] hover:no-underline">
                Call us
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  Share your details and a specialist will call at a time that
                  suits you.
                </p>
                <Link
                  href="#"
                  className="mt-5 flex min-h-12 items-center gap-3 rounded-md bg-muted px-4 text-xs no-underline! transition-colors hover:bg-accent"
                >
                  <Phone className="size-4" strokeWidth={1.25} />
                  Request a call
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="meet">
              <AccordionTrigger className="rounded-md py-5 text-[0.67rem] font-medium uppercase tracking-[0.18em] hover:no-underline">
                Meet us
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  Reserve a private consultation to discover the collection at
                  your own pace.
                </p>
                <Link href="#" className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em]">
                  <CalendarDays className="size-4" strokeWidth={1.25} />
                  Book an appointment
                </Link>
                <Link href="#" className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.14em]">
                  <MapPin className="size-4" strokeWidth={1.25} />
                  Find a boutique
                </Link>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="write">
              <AccordionTrigger className="rounded-md py-5 text-[0.67rem] font-medium uppercase tracking-[0.18em] hover:no-underline">
                Write to us
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  Tell us how we may assist, and a specialist will respond with
                  considered guidance.
                </p>
                <Link href="#" className="mt-5 flex items-center gap-3 text-xs uppercase tracking-[0.14em]">
                  <Mail className="size-4" strokeWidth={1.25} />
                  Contact us
                </Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Link
            href="#"
            className="mt-7 block text-center text-xs underline underline-offset-4 transition-opacity hover:opacity-60"
          >
            Frequently asked questions
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
