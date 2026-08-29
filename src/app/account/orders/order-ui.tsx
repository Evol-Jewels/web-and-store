import { ArrowRight, PackageCheck } from "lucide-react";
import Link from "next/link";

import type {
  CustomerAccountMoney,
  CustomerAccountOrderSummary,
} from "@/lib/shopify/customer-account";

export function formatMoney(money: CustomerAccountMoney) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: money.currencyCode,
      maximumFractionDigits: 2,
    }).format(Number(money.amount));
  } catch {
    return `${money.currencyCode} ${money.amount}`;
  }
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function formatStatus(value?: string | null) {
  if (!value) return "Pending";

  return value
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function orderHref(id: string) {
  return `/account/orders/${encodeURIComponent(id)}`;
}

export function AccountHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="max-w-2xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-heading text-5xl leading-none tracking-[-0.035em] sm:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
        {description}
      </p>
    </header>
  );
}

export function AccountNavigation({ current }: { current: "profile" | "orders" }) {
  const links = [
    { href: "/account", label: "Profile", id: "profile" },
    { href: "/account/orders", label: "Orders", id: "orders" },
  ] as const;

  return (
    <nav aria-label="Customer account" className="border-y border-border">
      <div className="flex gap-8">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            aria-current={current === link.id ? "page" : undefined}
            className={`relative flex min-h-14 items-center text-[0.64rem] font-medium uppercase tracking-[0.18em] transition-colors ${
              current === link.id
                ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function OrderSummaryRow({ order }: { order: CustomerAccountOrderSummary }) {
  return (
    <article className="grid gap-7 border-b border-border py-8 sm:grid-cols-[1.2fr_1fr_auto] sm:items-center sm:gap-10">
      <div>
        <p className="text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
          {formatOrderDate(order.processedAt)}
        </p>
        <h2 className="mt-2 font-heading text-3xl tracking-[-0.02em]">
          {order.name}
        </h2>
      </div>
      <dl className="grid grid-cols-2 gap-5 text-xs">
        <div>
          <dt className="text-muted-foreground">Payment</dt>
          <dd className="mt-1.5">{formatStatus(order.financialStatus)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Fulfilment</dt>
          <dd className="mt-1.5">{formatStatus(order.fulfillmentStatus)}</dd>
        </div>
      </dl>
      <div className="flex items-center justify-between gap-8 sm:block sm:text-right">
        <p className="text-sm font-medium">{formatMoney(order.totalPrice)}</p>
        <Link
          href={orderHref(order.id)}
          aria-label={`View ${order.name}`}
          className="group mt-0 inline-flex min-h-11 items-center gap-2 text-[0.64rem] uppercase tracking-[0.16em] sm:mt-3"
        >
          View order
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.25} />
        </Link>
      </div>
    </article>
  );
}

export function EmptyOrders() {
  return (
    <div className="border-y border-border py-20 text-center sm:py-24">
      <PackageCheck className="mx-auto size-5" strokeWidth={1.25} aria-hidden="true" />
      <h2 className="mt-6 font-heading text-3xl tracking-[-0.025em]">
        Your order story begins here
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted-foreground">
        Purchases made with this Shopify customer account will appear here.
      </p>
      <Link
        href="/products"
        className="link-underline mt-7 inline-flex min-h-11 items-center text-[0.64rem] uppercase tracking-[0.18em]"
      >
        Explore the collection
      </Link>
    </div>
  );
}
