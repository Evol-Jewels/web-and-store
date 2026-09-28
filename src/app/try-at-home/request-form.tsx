"use client";

import Image from "next/image";
import { useActionState } from "react";

import { submitTryAtHomeRequest } from "@/app/try-at-home/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/format";
import { indiaStates } from "@/lib/india-states";
import { MAX_BAG_ITEMS } from "@/lib/shopify/cart/limits";
import type { Cart } from "@/lib/shopify/cart/types";

const inputClass = "mt-2 h-12 rounded-none border-border bg-background px-4 text-sm";

function TextField({
  label,
  name,
  autoComplete,
  required = true,
  ...props
}: {
  label: string;
  name: string;
  autoComplete?: string;
  required?: boolean;
} & React.ComponentProps<"input">) {
  return (
    <div>
      <Label htmlFor={name} className="text-xs font-medium">{label}</Label>
      <Input
        id={name}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className={inputClass}
        {...props}
      />
    </div>
  );
}

function SelectionSummary({ cart }: { cart: Cart }) {
  return (
    <aside className="border-t border-border pt-7 lg:sticky lg:top-32 lg:self-start">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-3xl tracking-[-0.02em]">Your selection</h2>
        <span className="text-xs text-muted-foreground">{cart.totalQuantity} / {MAX_BAG_ITEMS} pieces</span>
      </div>
      <ul className="mt-6 divide-y divide-border">
        {cart.lines.nodes.map((line) => {
          const image = line.merchandise.image ?? line.merchandise.product.featuredImage;
          const options = line.merchandise.selectedOptions.filter(
            ({ name, value }) => name !== "Title" && value !== "Default Title",
          );

          return (
            <li key={line.id} className="grid grid-cols-[4.5rem_1fr] gap-4 py-5">
              <div className="relative aspect-[4/5] bg-muted">
                {image ? <Image src={image.url} alt={image.altText || line.merchandise.product.title} fill sizes="72px" className="object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <p className="font-heading text-xl leading-tight">{line.merchandise.product.title}</p>
                {options.length ? <p className="mt-1 text-xs text-muted-foreground">{options.map(({ value }) => value).join(" · ")}</p> : null}
                <div className="mt-3 flex justify-between gap-3 text-xs">
                  <span>Quantity {line.quantity}</span>
                  <span>{formatMoney(line.cost.totalAmount)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center justify-between border-t border-border pt-5 text-sm">
        <span>Selection value</span>
        <span className="font-medium">{formatMoney(cart.cost.subtotalAmount)}</span>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Shown for reference. No payment is due when you submit this request.
      </p>
    </aside>
  );
}

export function RequestForm({ cart }: { cart: Cart }) {
  const [state, formAction, pending] = useActionState(submitTryAtHomeRequest, { error: null });

  return (
    <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(19rem,0.75fr)] lg:gap-20">
      <form action={formAction} className="space-y-10">
        <section aria-labelledby="contact-heading">
          <p className="eyebrow">01 / Contact</p>
          <h2 id="contact-heading" className="mt-3 font-heading text-3xl tracking-[-0.02em]">Your details</h2>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <TextField label="First name" name="firstName" autoComplete="given-name" maxLength={60} />
            <TextField label="Last name" name="lastName" autoComplete="family-name" maxLength={60} />
            <TextField label="Email" name="email" type="email" autoComplete="email" maxLength={254} />
            <TextField label="Mobile number" name="phone" type="tel" autoComplete="tel-national" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} placeholder="10-digit mobile number" />
          </div>
        </section>

        <section aria-labelledby="delivery-heading" className="border-t border-border pt-10">
          <p className="eyebrow">02 / Delivery</p>
          <h2 id="delivery-heading" className="mt-3 font-heading text-3xl tracking-[-0.02em]">Where to reach you</h2>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">Available in India, subject to confirmation by our team.</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><TextField label="Address" name="address1" autoComplete="address-line1" maxLength={120} /></div>
            <div className="sm:col-span-2"><TextField label="Apartment, suite, or landmark" name="address2" autoComplete="address-line2" maxLength={120} required={false} /></div>
            <TextField label="City" name="city" autoComplete="address-level2" maxLength={80} />
            <div>
              <Label htmlFor="state" className="text-xs font-medium">State or union territory</Label>
              <select id="state" name="state" required defaultValue="" autoComplete="address-level1" className="mt-2 h-12 w-full rounded-none border border-border bg-background px-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30">
                <option value="" disabled>Select a state</option>
                {indiaStates.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
              </select>
            </div>
            <TextField label="PIN code" name="pinCode" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} />
          </div>
        </section>

        <div className="border-t border-border pt-8">
          <label className="flex items-start gap-3 text-xs leading-6">
            <input type="checkbox" name="understood" value="yes" required className="mt-1 size-4 accent-foreground" />
            <span>I understand this is a request. The team will confirm availability and arrangements before any pieces are sent. No payment is collected now.</span>
          </label>
          {state.error ? <p role="alert" className="mt-5 text-sm text-destructive">{state.error}</p> : null}
          <Button type="submit" variant="luxury" size="lg" disabled={pending} className="mt-7 h-13 w-full rounded-none px-8 text-xs sm:w-auto">
            {pending ? "Sending request" : "Send Try at Home request"}
          </Button>
        </div>
      </form>

      <SelectionSummary cart={cart} />
    </div>
  );
}
