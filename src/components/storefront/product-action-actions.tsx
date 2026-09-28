import { Home } from "lucide-react";
import type { ComponentType } from "react";

import { whatsappConsultationUrl } from "@/lib/contact-actions";

import { ProductVideoCallButton } from "./product-video-call-button";
import { WhatsAppIcon } from "./whatsapp-icon";

type ProductAction = {
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const tryAtHomeAction: ProductAction = { label: "Try at Home", icon: Home };

const actionButtonClass =
  "flex min-h-11 flex-col items-center justify-center gap-1 border border-border px-1.5 py-1.5 text-center transition-colors hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function ProductActionButton({ action }: { action: ProductAction }) {
  const Icon = action.icon;

  return (
    <button type="button" className={actionButtonClass}>
      <Icon className="size-3.5 shrink-0" />
      <span className="whitespace-nowrap text-[0.6rem] uppercase leading-4 tracking-[0.12em]">
        {action.label}
      </span>
    </button>
  );
}

export function ProductActionActions({
  className,
  productTitle,
  productHandle,
}: {
  className?: string;
  productTitle: string;
  productHandle: string;
}) {
  return (
    <div className={className}>
      <div className="grid grid-cols-3 gap-2.5">
        <ProductActionButton action={tryAtHomeAction} />
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
