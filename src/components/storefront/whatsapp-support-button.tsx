"use client";

import { buttonVariants } from "@/components/ui/button";
import { whatsappSupportUrl } from "@/lib/contact-actions";
import { cn } from "@/lib/utils";

import { WhatsAppIcon } from "./whatsapp-icon";

export function WhatsAppSupportButton() {
  return (
    <a
      href={whatsappSupportUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      title="Chat with us on WhatsApp"
      className={cn(
        buttonVariants({ size: "icon", variant: "ghost" }),
        "fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 size-12 rounded-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp hover:text-whatsapp-foreground hover:opacity-90 motion-reduce:transition-none sm:right-7 sm:bottom-[calc(1.75rem+env(safe-area-inset-bottom))]",
      )}
    >
      <WhatsAppIcon className="size-6" />
    </a>
  );
}
