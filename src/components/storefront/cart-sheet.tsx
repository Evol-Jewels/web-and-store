"use client";

import { LoaderCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useStorefront } from "./storefront-provider";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartPending,
    cartMessage,
    refreshCart,
    updateCartQuantity,
    removeFromCart,
    applyDiscountCode,
  } = useStorefront();
  const [discountCode, setDiscountCode] = useState("");

  function onOpenChange(open: boolean) {
    setCartOpen(open);
    if (open) void refreshCart();
  }

  const lines = cart?.lines.nodes ?? [];
  const populatedCart = lines.length > 0 ? cart : null;

  return (
    <Sheet open={cartOpen} onOpenChange={onOpenChange}>
      <SheetTrigger render={children as React.ReactElement} />
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[34rem]">
        <SheetHeader className="border-b border-border px-7 py-6 sm:px-10">
          <SheetTitle className="font-sans text-xs font-medium uppercase tracking-[0.22em]">
            Shopping bag{cart?.totalQuantity ? ` · ${cart.totalQuantity}` : ""}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Products currently in your shopping bag.
          </SheetDescription>
        </SheetHeader>

        {cartPending && !cart ? (
          <div className="grid flex-1 place-items-center" role="status">
            <LoaderCircle className="size-5 animate-spin" strokeWidth={1.25} />
            <span className="sr-only">Loading shopping bag</span>
          </div>
        ) : !populatedCart ? (
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
                onClick={() => setCartOpen(false)}
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
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-7 sm:px-10">
              <ul className="divide-y divide-border">
                {lines.map((line) => {
                  const image =
                    line.merchandise.image ?? line.merchandise.product.featuredImage;
                  const options = line.merchandise.selectedOptions.filter(
                    ({ name, value }) =>
                      name !== "Title" && value !== "Default Title",
                  );

                  return (
                    <li key={line.id} className="grid grid-cols-[6.5rem_1fr] gap-5 py-7">
                      <Link
                        href={`/products/${line.merchandise.product.handle}`}
                        onClick={() => setCartOpen(false)}
                        className="relative aspect-[4/5] overflow-hidden bg-muted"
                      >
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || line.merchandise.product.title}
                            fill
                            sizes="104px"
                            className="object-cover"
                          />
                        ) : null}
                      </Link>

                      <div className="flex min-w-0 flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link
                              href={`/products/${line.merchandise.product.handle}`}
                              onClick={() => setCartOpen(false)}
                              className="font-heading text-xl leading-tight hover:opacity-65"
                            >
                              {line.merchandise.product.title}
                            </Link>
                            {options.length ? (
                              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                {options.map(({ value }) => value).join(" · ")}
                              </p>
                            ) : null}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            disabled={cartPending}
                            onClick={() => removeFromCart(line.id)}
                            className="-mr-2 rounded-none text-muted-foreground hover:text-foreground"
                            aria-label={`Remove ${line.merchandise.product.title}`}
                          >
                            <Trash2 className="size-3.5" strokeWidth={1.25} />
                          </Button>
                        </div>

                        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                          <div className="flex h-9 items-center border border-border">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={cartPending || line.quantity <= 1}
                              onClick={() =>
                                updateCartQuantity(line.id, line.quantity - 1)
                              }
                              className="h-full rounded-none"
                              aria-label={`Decrease ${line.merchandise.product.title} quantity`}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="min-w-8 text-center text-xs" aria-live="polite">
                              {line.quantity}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              disabled={cartPending || line.quantity >= 99}
                              onClick={() =>
                                updateCartQuantity(line.id, line.quantity + 1)
                              }
                              className="h-full rounded-none"
                              aria-label={`Increase ${line.merchandise.product.title} quantity`}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          <p className="text-sm font-medium">
                            {formatMoney(line.cost.totalAmount)}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-border px-7 py-6 sm:px-10">
              <form
                className="flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void applyDiscountCode(discountCode);
                }}
              >
                <Input
                  value={discountCode}
                  onChange={(event) => setDiscountCode(event.target.value)}
                  placeholder="Discount code"
                  aria-label="Discount code"
                  className="h-10 rounded-none"
                />
                <Button
                  type="submit"
                  variant="outline"
                  disabled={cartPending || !discountCode.trim()}
                  className="h-10 rounded-none px-5 text-[0.62rem] uppercase tracking-[0.16em]"
                >
                  Apply
                </Button>
              </form>

              {populatedCart.discountCodes.length ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  {populatedCart.discountCodes
                    .map(
                      ({ code, applicable }) =>
                        `${code}${applicable ? " applied" : " could not be applied"}`,
                    )
                    .join(" · ")}
                </p>
              ) : null}

              {cartMessage ? (
                <p role="status" className="mt-3 text-xs leading-5 text-destructive">
                  {cartMessage}
                </p>
              ) : null}

              <div className="mt-6 flex items-center justify-between border-t border-border pt-5">
                <div>
                  <p className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Subtotal
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
                <p className="text-base font-medium">
                  {formatMoney(populatedCart.cost.subtotalAmount)}
                </p>
              </div>

              <Link
                href="/api/cart/checkout"
                aria-disabled={cartPending}
                className={cn(
                  buttonVariants({ variant: "luxury" }),
                  "mt-6 h-13 w-full rounded-none text-[0.68rem]",
                  cartPending && "pointer-events-none opacity-50",
                )}
              >
                Checkout securely
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
