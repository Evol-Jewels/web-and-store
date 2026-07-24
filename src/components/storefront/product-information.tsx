import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { formatPriceRange } from "@/lib/format";
import type { ProductDetail } from "@/types/product";

import { ProductOptions } from "./product-options";

export function ProductInformation({ product }: { product: ProductDetail }) {
  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <p className="eyebrow">
        {product.productType || product.vendor || "Fine jewellery"}
      </p>
      <h1 className="mt-5 max-w-lg font-heading text-5xl leading-[0.96] tracking-[-0.03em] sm:text-6xl lg:text-[4rem]">
        {product.title}
      </h1>
      <p className="mt-6 text-base">{formatPriceRange(product.priceRange)}</p>

      <Separator className="my-8" />

      <ProductOptions options={product.options} variants={product.variants} />

      <div className="mt-8 border-y border-border py-5 text-center">
        <p className="text-[0.65rem] uppercase tracking-[0.18em]">
          Private appointments
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover this piece with a jewellery specialist.
        </p>
      </div>

      <Accordion className="mt-8">
        <AccordionItem value="story">
          <AccordionTrigger className="rounded-none py-5 text-[0.68rem] uppercase tracking-[0.16em] hover:no-underline">
            The piece
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
            {product.descriptionHtml ? (
              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p>
                A considered composition of precious material, proportion and
                light.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="delivery">
          <AccordionTrigger className="rounded-none py-5 text-[0.68rem] uppercase tracking-[0.16em] hover:no-underline">
            Delivery & returns
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
            <p>
              Complimentary insured delivery. Timing and return eligibility are
              confirmed by our client care team before dispatch.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="care">
          <AccordionTrigger className="rounded-none py-5 text-[0.68rem] uppercase tracking-[0.16em] hover:no-underline">
            Care & services
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
            <p>
              Every piece is accompanied by considered care guidance and access
              to our jewellery services.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
