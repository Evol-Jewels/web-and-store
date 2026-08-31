export interface CustomerAccountMoney {
  amount: string;
  currencyCode: string;
}

export interface CustomerAccountAddress {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zoneCode: string | null;
  country: string | null;
  territoryCode: string | null;
  zip: string | null;
  phoneNumber: string | null;
  formatted: string[];
}

export interface CustomerAccountCustomer {
  id: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  defaultAddress: CustomerAccountAddress | null;
  addresses: CustomerAccountAddress[];
}

export interface CustomerAccountImage {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
}

export interface CustomerAccountLineItem {
  id: string;
  name: string;
  title: string;
  quantity: number;
  image: CustomerAccountImage | null;
  variantTitle: string | null;
  sku: string | null;
  price: CustomerAccountMoney | null;
  totalPrice: CustomerAccountMoney | null;
}

export interface CustomerAccountTrackingInformation {
  company: string | null;
  number: string | null;
  url: string | null;
}

export interface CustomerAccountFulfillment {
  id: string;
  status: string | null;
  latestShipmentStatus: string | null;
  estimatedDeliveryAt: string | null;
  trackingInformation: CustomerAccountTrackingInformation[];
}

export interface CustomerAccountOrderSummary {
  id: string;
  name: string;
  number: number;
  processedAt: string;
  updatedAt: string;
  cancelledAt: string | null;
  financialStatus: string | null;
  fulfillmentStatus: string;
  statusPageUrl: string;
  subtotal: CustomerAccountMoney | null;
  totalPrice: CustomerAccountMoney;
  totalShipping: CustomerAccountMoney;
  totalTax: CustomerAccountMoney | null;
  totalRefunded: CustomerAccountMoney;
}

export interface CustomerAccountOrder extends CustomerAccountOrderSummary {
  lineItems: CustomerAccountLineItem[];
  fulfillments: CustomerAccountFulfillment[];
  shippingAddress: CustomerAccountAddress | null;
  billingAddress: CustomerAccountAddress | null;
}

export interface CustomerOrdersPage {
  orders: CustomerAccountOrderSummary[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}
