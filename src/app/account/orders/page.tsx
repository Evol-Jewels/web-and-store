import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getCustomerOrders,
  hasCustomerSession,
} from "@/lib/shopify/customer-account";
import {
  AccountHeading,
  AccountNavigation,
  EmptyOrders,
  OrderSummaryRow,
} from "./order-ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Orders",
  description: "Review your Evol order history and fulfilment details.",
};

export default async function OrdersPage({ searchParams }: PageProps<"/account/orders">) {
  if (!(await hasCustomerSession())) redirect("/account/login");

  const { after } = await searchParams;
  const cursor = typeof after === "string" ? after : undefined;
  const ordersPage = await getCustomerOrders({ first: 12, after: cursor });

  if (!ordersPage) redirect("/account/login");

  const nextHref = ordersPage.pageInfo.endCursor
    ? `/account/orders?after=${encodeURIComponent(ordersPage.pageInfo.endCursor)}`
    : null;

  return (
    <main className="luxury-container pb-20 pt-36 sm:pb-28 sm:pt-44">
      <AccountHeading
        eyebrow="Purchase history"
        title="Your orders"
        description="Follow each creation from confirmation to fulfilment, and revisit the details of previous purchases."
      />

      <div className="mt-12 sm:mt-16">
        <AccountNavigation current="orders" />
      </div>

      <section aria-labelledby="orders-list-heading" className="py-14 sm:py-20">
        <div className="border-b border-border pb-5">
          <p className="eyebrow">Order ledger</p>
          <h2 id="orders-list-heading" className="sr-only">Order history</h2>
        </div>

        {ordersPage.orders.length ? (
          <>
            {ordersPage.orders.map((order) => (
              <OrderSummaryRow key={order.id} order={order} />
            ))}
            {ordersPage.pageInfo.hasNextPage && nextHref ? (
              <div className="pt-10 text-center">
                <Link
                  href={nextHref}
                  className="inline-flex min-h-12 items-center border border-border px-7 text-[0.64rem] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  View more orders
                </Link>
              </div>
            ) : null}
          </>
        ) : (
          <EmptyOrders />
        )}
      </section>
    </main>
  );
}
