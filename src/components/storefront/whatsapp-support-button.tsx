"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { whatsappSupportUrl } from "@/lib/contact-actions";
import { cn } from "@/lib/utils";

import { WhatsAppIcon } from "./whatsapp-icon";

export function WhatsAppSupportButton() {
  const pathname = usePathname();
  const [visiblePath, setVisiblePath] = useState<string | null>(null);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const updateVisibility = () => {
      const heroBounds = hero?.getBoundingClientRect();
      const visibleHeroHeight = heroBounds
        ? Math.max(
            0,
            Math.min(heroBounds.bottom, window.innerHeight) -
              Math.max(heroBounds.top, 0),
          )
        : 0;

      setVisiblePath(
        visibleHeroHeight < window.innerHeight / 2 ? pathname : null,
      );
    };

    const frame = window.requestAnimationFrame(updateVisibility);
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, [pathname]);

  if (visiblePath !== pathname) return null;

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
