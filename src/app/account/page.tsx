import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getCustomer,
  getCustomerOrders,
  hasCustomerSession,
} from "@/lib/shopify/customer-account";
import {
  AccountHeading,
  AccountNavigation,
  EmptyOrders,
  OrderSummaryRow,
} from "@/app/account/orders/order-ui";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Account",
  description: "Review your Evol profile, addresses, and recent orders.",
};

export default async function AccountPage() {
  if (!(await hasCustomerSession())) redirect("/account/login");

  const [customer, ordersPage] = await Promise.all([
    getCustomer(),
    getCustomerOrders({ first: 3 }),
  ]);

  if (!customer || !ordersPage) redirect("/account/login");

  const addresses = customer.addresses.length
    ? customer.addresses
    : customer.defaultAddress
      ? [customer.defaultAddress]
      : [];

  return (
    <main className="luxury-container pb-20 pt-36 sm:pb-28 sm:pt-44">
      <AccountHeading
        eyebrow="Private client area"
        title={`Welcome${customer.firstName ? `, ${customer.firstName}` : ""}`}
        description="Your details and order history are securely held by Shopify and available here whenever you need them."
      />

      <div className="mt-12 sm:mt-16">
        <AccountNavigation current="profile" />
      </div>

      <div className="grid gap-16 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] lg:gap-24 lg:py-20">
        <section aria-labelledby="profile-heading">
          <p className="eyebrow">Profile</p>
          <h2 id="profile-heading" className="mt-3 font-heading text-3xl tracking-[-0.025em]">
            Personal details
          </h2>
          <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
            <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-muted-foreground">Name</dt>
              <dd>{customer.displayName}</dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{customer.email ?? "Not provided"}</dd>
            </div>
            <div className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{customer.phoneNumber ?? "Not provided"}</dd>
            </div>
          </dl>

          <form action="/account/logout" method="post" className="mt-7">
            <Button
              type="submit"
              variant="ghost"
              className="min-h-11 rounded-none px-0 text-[0.64rem] font-medium uppercase tracking-[0.18em] underline decoration-border underline-offset-8 hover:bg-transparent hover:opacity-60"
            >
              Sign out
            </Button>
          </form>
        </section>

        <section aria-labelledby="addresses-heading">
          <p className="eyebrow">Address book</p>
          <h2 id="addresses-heading" className="mt-3 font-heading text-3xl tracking-[-0.025em]">
            Saved addresses
          </h2>
          {addresses.length ? (
            <div className="mt-8 space-y-8">
              {addresses.map((address, index) => (
                <address key={address.id} className="border-t border-border pt-5 text-sm not-italic leading-7">
                  <p className="mb-2 text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
                    {address.id === customer.defaultAddress?.id ? "Default address" : `Address ${index + 1}`}
                  </p>
                  {address.formatted.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                  {address.phoneNumber ? <span className="mt-2 block text-muted-foreground">{address.phoneNumber}</span> : null}
                </address>
              ))}
            </div>
          ) : (
            <p className="mt-8 border-y border-border py-8 text-sm leading-7 text-muted-foreground">
              No saved address is available yet. Shopify Checkout can securely save one with your next order.
            </p>
          )}
        </section>
      </div>

      <section aria-labelledby="recent-orders-heading" className="pt-4 sm:pt-8">
        <div className="flex items-end justify-between gap-6 border-b border-border pb-5">
          <div>
            <p className="eyebrow">Purchase history</p>
            <h2 id="recent-orders-heading" className="mt-3 font-heading text-3xl tracking-[-0.025em] sm:text-4xl">
              Recent orders
            </h2>
          </div>
          {ordersPage.orders.length ? (
            <Link href="/account/orders" className="link-underline min-h-11 shrink-0 content-center text-[0.62rem] uppercase tracking-[0.16em]">
              View all
            </Link>
          ) : null}
        </div>
        {ordersPage.orders.length ? ordersPage.orders.map((order) => (
          <OrderSummaryRow key={order.id} order={order} />
        )) : <EmptyOrders />}
      </section>
    </main>
  );
}
