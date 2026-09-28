"use client";

import { CalendarClock } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { videoCallBookingEmbedUrl } from "@/lib/contact-actions";

export function ProductVideoCallButton({
  className,
  productHandle,
}: {
  className: string;
  productHandle: string;
}) {
  return (
    <Popover>
      <PopoverTrigger className={className} aria-label="Schedule a video call">
        <CalendarClock className="size-3.5 shrink-0" strokeWidth={1.25} />
        <span className="whitespace-nowrap text-[0.6rem] uppercase leading-4 tracking-[0.12em]">
          Video Call
        </span>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="h-[32rem] w-[min(24rem,calc(100vw-2.5rem))] p-0"
      >
        <iframe
          src={videoCallBookingEmbedUrl(productHandle)}
          title="Schedule a video call with a jewellery specialist"
          className="h-full w-full border-none"
        />
      </PopoverContent>
    </Popover>
  );
}
