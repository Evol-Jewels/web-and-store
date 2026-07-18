import { ArrowRight, PackageCheck, ShoppingBag, Sparkles } from "lucide-react";

import { ProductGrid } from "@/components/storefront/product-grid";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { listFeaturedProducts } from "@/server/catalog/catalog.service";

export default async function Home() {
  const products = await listFeaturedProducts();

  return (
    <main className="min-h-screen bg-[#f5f0e7] text-[#211f1a]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-full bg-[#d64b2a] text-white">
            <ShoppingBag className="size-4" />
          </span>
          Common Goods
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex" aria-label="Primary navigation">
          <a href="#collection" className="transition-opacity hover:opacity-60">Shop</a>
          <a href="#story" className="transition-opacity hover:opacity-60">Our story</a>
          <a href="#journal" className="transition-opacity hover:opacity-60">Journal</a>
        </nav>
        <span className="rounded-full border border-black/15 px-4 py-2 text-sm">Cart · 0</span>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:pt-24">
        <div>
          <p className="mb-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#d64b2a]">
            <Sparkles className="size-4" /> Thoughtful objects, daily
          </p>
          <h1 className="max-w-4xl text-6xl font-semibold leading-[0.94] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
            Buy less. Keep it longer.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-black/60">
            Useful, enduring pieces selected for the rituals that make an ordinary day feel considered.
          </p>
          <a href="#collection" className={cn(buttonVariants({ size: "lg" }), "mt-9 h-12 rounded-full bg-[#211f1a] px-6 text-white hover:bg-[#d64b2a]")}>
            Browse the collection <ArrowRight />
          </a>
        </div>

        <aside className="relative min-h-72 overflow-hidden rounded-[2rem] bg-[#d64b2a] p-8 text-white lg:mt-12">
          <div className="absolute -right-12 -top-12 size-52 rounded-full border-[34px] border-white/15" />
          <PackageCheck className="mb-20 size-10" strokeWidth={1.5} />
          <p className="max-w-sm text-2xl font-medium leading-snug">Free delivery over ₹2,500. Plastic-free packing, always.</p>
        </aside>
      </section>

      <section id="collection" className="border-t border-black/10 bg-[#fffdf8] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/45">The first edit</p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Objects worth keeping</h2>
            </div>
            <p className="hidden max-w-sm text-right text-sm leading-6 text-black/50 sm:block">Demo data is served through the server layer and exposed separately at <code>/api/products</code>.</p>
          </div>
          <ProductGrid products={products} />
        </div>
      </section>
    </main>
  );
}
