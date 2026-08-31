import type { Money } from "@/types/product";

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: Array<{
      name: string;
      value: string;
    }>;
    image: {
      url: string;
      altText: string | null;
      width: number;
      height: number;
    } | null;
    product: {
      title: string;
      handle: string;
      featuredImage: {
        url: string;
        altText: string | null;
        width: number;
        height: number;
      } | null;
    };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    nodes: CartLine[];
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  discountCodes: Array<{
    code: string;
    applicable: boolean;
  }>;
};

export type CartNotice = {
  code?: string;
  message: string;
};

export type CartResponse = {
  cart: Cart | null;
  warnings?: CartNotice[];
};

