import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type {
  ProductDetail,
  ProductMedia,
  ProductVideo,
} from "@/types/product";

function plainText(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function productAboutText(product: ProductDetail) {
  const paragraphs = product.descriptionHtml
    .replace(/<!--[\s\S]*?-->/g, "\n")
    .replace(/<\/(?:p|div|li)>|<br\s*\/?>/gi, "\n")
    .split("\n")
    .map(plainText)
    .filter(Boolean)
    .filter(
      (line) =>
        !/^(?:diamond|.*diamond weight|setting type|net weight|gross weight|metal|delivery timeline|sku)\s*:/i.test(
          line,
        ),
    )
    .join(" ");

  return paragraphs.length > 40
    ? paragraphs
    : `${product.title} is shaped with considered proportion and finished by hand in lab-grown diamonds and hallmarked gold for lasting wear.`;
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
    (total, match) => total + Number(match[1]),
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
    description.matchAll(/Net Weight:\s*\((\d+)KT Gold\)\s*([\d.]+)\s*g/gi),
  );
  const selectedMetalWeight =
    metalWeights.find((match) => match[1] === purityNumber) ?? metalWeights[0];

  return [
    {
      label: "Diamond weight",
      value:
        totalDiamondWeight > 0
          ? `${Number(totalDiamondWeight.toFixed(3))} carats`
          : "Not specified",
    },
    {
      label: "Diamond colour",
      value: formattedGrade(diamondGrade?.[1]?.toUpperCase()),
    },
    {
      label: "Diamond clarity",
      value: diamondGrade?.[2]?.toUpperCase() ?? "Not specified",
    },
    { label: "Metal", value: purity ?? "Gold" },
    {
      label: "Metal weight",
      value: selectedMetalWeight ? `${selectedMetalWeight[2]} g` : "Not specified",
    },
  ];
}

function isProductVideo(media: ProductMedia): media is ProductVideo {
  return "mediaContentType" in media && media.mediaContentType === "VIDEO";
}

function ProductShowcaseMedia({ product }: { product: ProductDetail }) {
  const video = product.media.find(isProductVideo);

  if (video) {
    return (
      <video
        className="h-full w-full object-cover"
        aria-label={video.altText || `${product.title} product video`}
        poster={video.previewImage?.url}
        controls
        loop
        muted
        playsInline
        preload="metadata"
      >
        {video.sources.map((source) => (
          <source key={source.url} src={source.url} type={source.mimeType} />
        ))}
      </video>
    );
  }

  if (product.featuredImage) {
    return (
      <Image
        src={product.featuredImage.url}
        alt={product.featuredImage.altText || product.title}
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        className="object-contain p-[8%]"
      />
    );
  }

  return (
    <div className="grid h-full place-items-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
      Evol
    </div>
  );
}

export function ProductDetails({ product }: { product: ProductDetail }) {
  const specifications = productSpecifications(product);
  const description = productAboutText(product);

  return (
    <section className="border-t border-border">
      <div className="luxury-container grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.85fr)] lg:gap-16 xl:gap-24">
        <div>
          <p className="eyebrow mb-5">Product showcase</p>
          <div className="relative aspect-[4/3] overflow-hidden bg-product-surface">
            <ProductShowcaseMedia product={product} />
          </div>
        </div>

        <div className="lg:pt-8">
          <div className="border-b border-border pb-9">
            <p className="eyebrow">About this product</p>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="border-b border-border py-9">
            <h2 className="font-heading text-2xl tracking-[-0.02em]">
              Product details
            </h2>
            <dl className="mt-5">
              {specifications.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[1fr_auto] gap-6 border-t border-border py-3 text-sm first:border-t-0"
                >
                  <dt className="text-muted-foreground">{item.label}</dt>
                  <dd className="text-right">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <Accordion>
            <AccordionItem value="sizing">
              <AccordionTrigger className="rounded-none py-5 text-[0.68rem] uppercase tracking-[0.16em] hover:no-underline">
                Size guide
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm leading-7 text-muted-foreground">
                Select your usual jewellery size. Our specialists can help
                confirm the most comfortable fit before your order is prepared.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
