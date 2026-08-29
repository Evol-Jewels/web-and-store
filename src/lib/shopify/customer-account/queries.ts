import "server-only";

import { customerAccountQuery } from "./client";
import type {
  CustomerAccountCustomer,
  CustomerAccountOrder,
  CustomerAccountOrderSummary,
  CustomerOrdersPage,
} from "./types";

const ADDRESS_FIELDS = `
  id name firstName lastName company address1 address2 city province zoneCode
  country territoryCode zip phoneNumber formatted(withName: true, withCompany: true)
`;

const MONEY_FIELDS = `amount currencyCode`;

const ORDER_SUMMARY_FIELDS = `
  id name number processedAt updatedAt cancelledAt financialStatus fulfillmentStatus statusPageUrl
  subtotal { ${MONEY_FIELDS} }
  totalPrice { ${MONEY_FIELDS} }
  totalShipping { ${MONEY_FIELDS} }
  totalTax { ${MONEY_FIELDS} }
  totalRefunded { ${MONEY_FIELDS} }
`;

interface RawCustomer {
  id: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string | null } | null;
  phoneNumber: { phoneNumber: string | null } | null;
  defaultAddress: CustomerAccountCustomer["defaultAddress"];
  addresses: { nodes: CustomerAccountCustomer["addresses"] };
}

interface RawOrder extends CustomerAccountOrderSummary {
  lineItems: { nodes: CustomerAccountOrder["lineItems"] };
  fulfillments: { nodes: CustomerAccountOrder["fulfillments"] };
  shippingAddress: CustomerAccountOrder["shippingAddress"];
  billingAddress: CustomerAccountOrder["billingAddress"];
}

export async function getCustomer() {
  const data = await customerAccountQuery<{ customer: RawCustomer }>(`
    query CustomerProfile {
      customer {
        id displayName firstName lastName
        emailAddress { emailAddress }
        phoneNumber { phoneNumber }
        defaultAddress { ${ADDRESS_FIELDS} }
        addresses(first: 20) { nodes { ${ADDRESS_FIELDS} } }
      }
    }
  `);
  if (!data) return null;
  return {
    id: data.customer.id,
    displayName: data.customer.displayName,
    firstName: data.customer.firstName,
    lastName: data.customer.lastName,
    email: data.customer.emailAddress?.emailAddress ?? null,
    phoneNumber: data.customer.phoneNumber?.phoneNumber ?? null,
    defaultAddress: data.customer.defaultAddress,
    addresses: data.customer.addresses.nodes,
  } satisfies CustomerAccountCustomer;
}

export async function getCustomerOrders(
  options: { first?: number; after?: string } = {},
): Promise<CustomerOrdersPage | null> {
  const first = Math.min(Math.max(options.first ?? 10, 1), 50);
  const data = await customerAccountQuery<{
    customer: {
      orders: {
        nodes: CustomerAccountOrderSummary[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
      };
    };
  }>(
    `query CustomerOrders($first: Int!, $after: String) {
      customer {
        orders(first: $first, after: $after, reverse: true) {
          nodes { ${ORDER_SUMMARY_FIELDS} }
          pageInfo { hasNextPage endCursor }
        }
      }
    }`,
    { first, after: options.after ?? null },
  );
  if (!data) return null;
  return {
    orders: data.customer.orders.nodes,
    pageInfo: data.customer.orders.pageInfo,
  };
}

export async function getCustomerOrder(id: string): Promise<CustomerAccountOrder | null> {
  if (!/^gid:\/\/shopify\/Order\/\d+$/.test(id)) return null;
  const data = await customerAccountQuery<{ order: RawOrder | null }>(
    `query CustomerOrder($id: ID!) {
      order(id: $id) {
        ${ORDER_SUMMARY_FIELDS}
        lineItems(first: 100) {
          nodes {
            id name title quantity variantTitle sku
            image { url altText width height }
            price { ${MONEY_FIELDS} }
            totalPrice { ${MONEY_FIELDS} }
          }
        }
        fulfillments(first: 20) {
          nodes {
            id status latestShipmentStatus estimatedDeliveryAt
            trackingInformation { company number url }
          }
        }
        shippingAddress { ${ADDRESS_FIELDS} }
        billingAddress { ${ADDRESS_FIELDS} }
      }
    }`,
    { id },
  );
  if (!data?.order) return null;
  return {
    ...data.order,
    lineItems: data.order.lineItems.nodes,
    fulfillments: data.order.fulfillments.nodes,
  };
}
