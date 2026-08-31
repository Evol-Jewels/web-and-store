import Link from "next/link";

export default function OrderNotFound() {
  return (
    <main className="luxury-container flex min-h-[70vh] items-center justify-center pb-20 pt-36 text-center sm:pt-44">
      <div className="max-w-lg border-y border-border py-16">
        <p className="eyebrow">Order details</p>
        <h1 className="mt-4 font-heading text-4xl tracking-[-0.03em]">This order is not available</h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">
          It may belong to a different customer account, or the link may no longer be valid.
        </p>
        <Link href="/account/orders" className="mt-8 inline-flex min-h-11 items-center border border-foreground bg-foreground px-6 text-[0.64rem] uppercase tracking-[0.18em] text-background">
          Return to my orders
        </Link>
      </div>
    </main>
  );
}
