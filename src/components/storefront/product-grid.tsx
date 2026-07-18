import { ArrowUpRight } from "lucide-react";

import type { Product } from "@/types/product";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {products.map((product, index) => (
        <article key={product.id} className="group">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] p-6" style={{ backgroundColor: product.color }}>
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: product.accent }}>{String(index + 1).padStart(2, "0")}</span>
            <div className="absolute inset-x-8 bottom-10 h-2/5 rounded-[50%_50%_42%_42%] border-[16px] opacity-75 transition-transform duration-500 group-hover:-translate-y-3 group-hover:rotate-3" style={{ borderColor: product.accent }} />
            <ArrowUpRight className="absolute right-6 top-6 size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: product.accent }} />
          </div>
          <div className="flex items-start justify-between gap-4 px-1 pt-4">
            <div><h3 className="font-semibold">{product.name}</h3><p className="mt-1 text-sm text-black/45">{product.category}</p></div>
            <p className="text-sm font-medium">{money.format(product.price)}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
