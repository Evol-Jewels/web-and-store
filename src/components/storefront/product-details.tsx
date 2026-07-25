import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductDetail } from "@/types/product";

function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formattedGrade(value: string | undefined) {
  if (!value) return "Not specified";
  return value.length === 2 && !value.includes("-")
    ? `${value[0]}-${value[1]}`
    : value;
}

function productSpecifications(product: ProductDetail) {
  const description = plainText(product.descriptionHtml);
  const diamondGrade = description.match(
    /Diamond:\s*([A-Z-]+)\s+([A-Z0-9-]+)/i,
  );
  const diamondWeights = Array.from(
    description.matchAll(
      /Diamond Weight:\s*([\d.]+)\s*cts?\s*\((\d+)\s*piece/gi,
    ),
  );
  const totalDiamondWeight = diamondWeights.reduce(
    (total, match) => total + Number(match[1]) * Number(match[2]),
    0,
  );
  const firstVariant =
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0];
  const purity =
    firstVariant?.selectedOptions.find(({ name }) =>
      /purity|karat|metal/i.test(name),
    )?.value ??
    product.options.find(({ name }) => /purity|karat/i.test(name))?.values[0];
  const purityNumber = purity?.match(/\d+/)?.[0];
  const metalWeights = Array.from(
    description.matchAll(
      /Net Weight:\s*\((\d+)KT Gold\)\s*([\d.]+)\s*g/gi,
    ),
  );
  const selectedMetalWeight =
    metalWeights.find((match) => match[1] === purityNumber) ?? metalWeights[0];

  return {
    clarity: diamondGrade?.[2]?.toUpperCase() ?? "Not specified",
    colour: formattedGrade(diamondGrade?.[1]?.toUpperCase()),
    diamondWeight:
      totalDiamondWeight > 0
        ? `${Number(totalDiamondWeight.toFixed(3))} Carats`
        : "Not specified",
    metal: purity ?? "Gold",
    metalWeight: selectedMetalWeight
      ? `${selectedMetalWeight[2]} g`
      : "Not specified",
  };
}

function SpecificationCard({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <dl className="grid gap-8 border border-border px-6 py-8 sm:grid-cols-3 sm:px-8">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-[0.65rem] uppercase tracking-[0.08em] text-muted-foreground">
            {item.label}
          </dt>
          <dd className="mt-2 text-base">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductDetails({ product }: { product: ProductDetail }) {
  const specifications = productSpecifications(product);

  return (
    <section className="border-t border-border">
      <div className="luxury-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <div className="space-y-10">
          <p className="eyebrow">Product details</p>

          <div>
            <div className="mb-3 flex items-end justify-between gap-4">
              <h2 className="text-sm uppercase tracking-[0.12em]">
                Diamond details
              </h2>
              <span className="text-xs underline underline-offset-4">
                Guide to 4Cs
              </span>
            </div>
            <SpecificationCard
              items={[
                {
                  label: "Total weight",
                  value: specifications.diamondWeight,
                },
                { label: "Colour", value: specifications.colour },
                { label: "Clarity", value: specifications.clarity },
              ]}
            />
          </div>

          <div>
            <h2 className="mb-3 text-sm uppercase tracking-[0.12em]">
              Metal details
            </h2>
            <SpecificationCard
              items={[
                { label: "Metal weight", value: specifications.metalWeight },
                { label: "Purity", value: specifications.metal },
              ]}
            />
          </div>
        </div>

        <Accordion>
          <AccordionItem value="sizing">
            <AccordionTrigger className="rounded-none py-5 text-[0.68rem] uppercase tracking-[0.16em] hover:no-underline">
              Size guide
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
              Select your usual jewellery size. Our specialists can help confirm
              the most comfortable fit before your order is prepared.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="delivery">
            <AccordionTrigger className="rounded-none py-5 text-[0.68rem] uppercase tracking-[0.16em] hover:no-underline">
              Delivery & returns
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
              Complimentary insured delivery. Timing and return eligibility are
              confirmed by our client care team before dispatch.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="care">
            <AccordionTrigger className="rounded-none py-5 text-[0.68rem] uppercase tracking-[0.16em] hover:no-underline">
              Care & services
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
              Every piece is accompanied by considered care guidance and access
              to our jewellery services.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
