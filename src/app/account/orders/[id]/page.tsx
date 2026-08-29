import { ExternalLink, PackageCheck, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  getCustomerOrder,
  hasCustomerSession,
} from "@/lib/shopify/customer-account";
import {
  formatMoney,
  formatOrderDate,
  formatStatus,
} from "../order-ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order Details",
  description: "Review your Evol order details and fulfilment status.",
};

export default async function OrderDetailsPage({ params }: PageProps<"/account/orders/[id]">) {
  if (!(await hasCustomerSession())) redirect("/account/login");

  const { id } = await params;
  const order = await getCustomerOrder(id);

  if (!order) notFound();

  const refunded = Number(order.totalRefunded.amount) > 0;

  return (
    <main className="luxury-container pb-20 pt-36 sm:pb-28 sm:pt-44">
      <Link
        href="/account/orders"
        className="link-underline inline-flex min-h-11 items-center text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
      >
        Back to orders
      </Link>

      <header className="mt-7 grid gap-8 border-b border-border pb-10 sm:grid-cols-[1fr_auto] sm:items-end sm:pb-12">
        <div>
          <p className="eyebrow">Confirmed {formatOrderDate(order.processedAt)}</p>
          <h1 className="mt-4 font-heading text-5xl leading-none tracking-[-0.035em] sm:text-6xl">
            {order.name}
          </h1>
          {order.cancelledAt ? (
            <p className="mt-4 text-sm text-destructive">
              Cancelled {formatOrderDate(order.cancelledAt)}
            </p>
          ) : null}
        </div>
        <div className="sm:text-right">
          <p className="text-xl font-medium">{formatMoney(order.totalPrice)}</p>
          <a
            href={order.statusPageUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-[0.62rem] uppercase tracking-[0.16em] underline decoration-border underline-offset-8"
          >
            Shopify order status
            <ExternalLink className="size-3.5" strokeWidth={1.25} />
          </a>
        </div>
      </header>

      <section aria-labelledby="status-heading" className="grid border-b border-border sm:grid-cols-2">
        <h2 id="status-heading" className="sr-only">Order status</h2>
        <div className="flex gap-4 py-7 sm:border-r sm:border-border sm:pr-8">
          <PackageCheck className="mt-0.5 size-5 shrink-0" strokeWidth={1.25} aria-hidden="true" />
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">Payment</p>
            <p className="mt-1.5 text-sm">{formatStatus(order.financialStatus)}</p>
          </div>
        </div>
        <div className="flex gap-4 border-t border-border py-7 sm:border-t-0 sm:pl-8">
          <Truck className="mt-0.5 size-5 shrink-0" strokeWidth={1.25} aria-hidden="true" />
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">Fulfilment</p>
            <p className="mt-1.5 text-sm">{formatStatus(order.fulfillmentStatus)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-16 py-14 lg:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.7fr)] lg:gap-24 lg:py-20">
        <section aria-labelledby="pieces-heading">
          <p className="eyebrow">Your selection</p>
          <h2 id="pieces-heading" className="mt-3 font-heading text-3xl tracking-[-0.025em]">Order pieces</h2>
          <div className="mt-8 divide-y divide-border border-y border-border">
            {order.lineItems.map((item) => (
              <article key={item.id} className="grid grid-cols-[5.5rem_1fr] gap-5 py-6 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-7">
                <div className="relative aspect-square overflow-hidden bg-product-surface">
                  {item.image ? (
                    <Image
                      src={item.image.url}
                      alt={item.image.altText ?? item.title}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <h3 className="font-heading text-2xl leading-tight">{item.title}</h3>
                  {item.variantTitle ? <p className="mt-2 text-xs text-muted-foreground">{item.variantTitle}</p> : null}
                  {item.sku ? <p className="mt-1 text-xs text-muted-foreground">SKU {item.sku}</p> : null}
                  <p className="mt-3 text-xs">Quantity {item.quantity}</p>
                </div>
                <p className="col-start-2 text-sm font-medium sm:col-auto sm:text-right">
                  {item.totalPrice ? formatMoney(item.totalPrice) : item.price ? formatMoney(item.price) : "—"}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-12" aria-label="Order totals and delivery">
          <section aria-labelledby="summary-heading">
            <p className="eyebrow">Payment summary</p>
            <h2 id="summary-heading" className="sr-only">Payment summary</h2>
            <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
              {order.subtotal ? <TotalRow label="Subtotal" value={formatMoney(order.subtotal)} /> : null}
              <TotalRow label="Shipping" value={formatMoney(order.totalShipping)} />
              {order.totalTax ? <TotalRow label="Tax" value={formatMoney(order.totalTax)} /> : null}
              {refunded ? <TotalRow label="Refunded" value={`−${formatMoney(order.totalRefunded)}`} /> : null}
              <TotalRow label="Total" value={formatMoney(order.totalPrice)} strong />
            </dl>
          </section>

          {order.shippingAddress ? (
            <AddressBlock title="Delivery address" lines={order.shippingAddress.formatted} phone={order.shippingAddress.phoneNumber} />
          ) : null}

          {order.fulfillments.length ? (
            <section aria-labelledby="delivery-heading">
              <p className="eyebrow">Delivery</p>
              <h2 id="delivery-heading" className="sr-only">Delivery and tracking</h2>
              <div className="mt-6 space-y-7 border-t border-border pt-5">
                {order.fulfillments.map((fulfillment) => (
                  <div key={fulfillment.id} className="text-sm">
                    <p>{formatStatus(fulfillment.latestShipmentStatus ?? fulfillment.status)}</p>
                    {fulfillment.estimatedDeliveryAt ? (
                      <p className="mt-1 text-xs text-muted-foreground">Estimated {formatOrderDate(fulfillment.estimatedDeliveryAt)}</p>
                    ) : null}
                    {fulfillment.trackingInformation.map((tracking, index) => tracking.url ? (
                      <a
                        key={`${tracking.number ?? "tracking"}-${index}`}
                        href={tracking.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex min-h-11 items-center gap-2 text-[0.62rem] uppercase tracking-[0.16em] underline decoration-border underline-offset-8"
                      >
                        Track with {tracking.company ?? "the carrier"}
                        <ExternalLink className="size-3.5" strokeWidth={1.25} />
                      </a>
                    ) : null)}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </aside>
      </div>
    </main>
  );
}

function TotalRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between gap-6 py-4 ${strong ? "font-medium" : ""}`}>
      <dt className={strong ? undefined : "text-muted-foreground"}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function AddressBlock({ title, lines, phone }: { title: string; lines: string[]; phone?: string | null }) {
  return (
    <section>
      <p className="eyebrow">{title}</p>
      <address className="mt-6 border-t border-border pt-5 text-sm not-italic leading-7">
        {lines.map((line) => <span key={line} className="block">{line}</span>)}
        {phone ? <span className="mt-2 block text-muted-foreground">{phone}</span> : null}
      </address>
    </section>
  );
}
