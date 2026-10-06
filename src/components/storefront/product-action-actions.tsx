"use client";

import { Home } from "lucide-react";

import { whatsappConsultationUrl } from "@/lib/contact-actions";
import { MAX_BAG_ITEMS } from "@/lib/shopify/cart/limits";

import { ProductVideoCallButton } from "./product-video-call-button";
import { useStorefront } from "./storefront-provider";
import { WhatsAppIcon } from "./whatsapp-icon";

const actionButtonClass =
  "flex min-h-11 flex-col items-center justify-center gap-1 border border-border px-1.5 py-1.5 text-center transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-40";

export function ProductActionActions({
  className,
  productTitle,
  productHandle,
  variantId,
  canTryAtHome,
}: {
  className?: string;
  productTitle: string;
  productHandle: string;
  variantId: string | null;
  canTryAtHome: boolean;
}) {
  const { addToCart, cart, cartPending } = useStorefront();
  const bagFull = (cart?.totalQuantity ?? 0) >= MAX_BAG_ITEMS;
  const unavailableReason = bagFull
    ? `Your bag is full at ${MAX_BAG_ITEMS} pieces.`
    : !canTryAtHome || !variantId
      ? "Try at Home is available for ready-to-ship pieces."
      : null;
  const tryAtHomeDisabled = Boolean(unavailableReason || cartPending);

  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2.5">
        <div className="group relative min-w-0">
          <button
            type="button"
            className={`${actionButtonClass} w-full`}
            aria-disabled={tryAtHomeDisabled}
            aria-describedby={unavailableReason ? "try-at-home-tooltip" : undefined}
            onClick={() => {
              if (!tryAtHomeDisabled && variantId) void addToCart(variantId, productHandle);
            }}
            aria-label="Add selected piece to bag for Try at Home"
          >
            <Home className="size-3.5 shrink-0" />
            <span className="whitespace-nowrap text-[0.6rem] uppercase leading-4 tracking-[0.12em]">
              Try at Home
            </span>
          </button>
          {unavailableReason ? (
            <span
              id="try-at-home-tooltip"
              role="tooltip"
              className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-2 w-56 max-w-[calc(100vw-2.5rem)] border border-border bg-background px-3 py-2 text-left text-xs leading-5 text-foreground opacity-0 motion-safe:transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
            >
              {unavailableReason}
            </span>
          ) : null}
        </div>
        <a
          href={whatsappConsultationUrl(productTitle)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Live consultation on WhatsApp"
          className={actionButtonClass}
        >
          <WhatsAppIcon className="size-3.5 shrink-0" />
          <span className="whitespace-nowrap text-[0.6rem] uppercase leading-4 tracking-[0.12em]">
            Consultation
          </span>
        </a>
        <ProductVideoCallButton
          className={actionButtonClass}
          productHandle={productHandle}
        />
      </div>
    </div>
  );
}
