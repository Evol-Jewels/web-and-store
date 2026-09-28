import "server-only";

import type { Cart } from "@/lib/shopify/cart/types";

export type TryAtHomeDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pinCode: string;
};

type DraftOrderResult = {
  draftOrderCreate: {
    draftOrder: { name: string } | null;
    userErrors: Array<{ message: string }>;
  };
};

const CREATE_DRAFT_ORDER = `#graphql
  mutation CreateTryAtHomeDraft($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder { name }
      userErrors { message }
    }
  }
`;

export async function createTryAtHomeDraft(cart: Cart, details: TryAtHomeDetails) {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const version = process.env.SHOPIFY_ADMIN_API_VERSION;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain || !version || !token) {
    throw new Error("Shopify Admin API is not configured.");
  }

  const response = await fetch(`https://${domain}/admin/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({
      query: CREATE_DRAFT_ORDER,
      variables: {
        input: {
          email: details.email,
          phone: details.phone,
          shippingAddress: {
            firstName: details.firstName,
            lastName: details.lastName,
            address1: details.address1,
            address2: details.address2 || undefined,
            city: details.city,
            provinceCode: details.state,
            zip: details.pinCode,
            countryCode: "IN",
            phone: details.phone,
          },
          lineItems: cart.lines.nodes.map((line) => ({
            variantId: line.merchandise.id,
            quantity: line.quantity,
          })),
          tags: ["Try at Home", "Pending review"],
          note: "Try at Home request. Confirm eligibility and stock before arranging delivery. No payment has been collected.",
        },
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Shopify Admin API failed (${response.status}).`);

  const result = (await response.json()) as {
    data?: DraftOrderResult;
    errors?: Array<{ message: string }>;
  };
  const draft = result.data?.draftOrderCreate;

  if (result.errors?.length || draft?.userErrors.length || !draft?.draftOrder) {
    throw new Error(
      result.errors?.[0]?.message ??
        draft?.userErrors[0]?.message ??
        "Shopify did not create the trial request.",
    );
  }

  return draft.draftOrder.name;
}
