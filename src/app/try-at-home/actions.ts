"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CART_COOKIE } from "@/lib/shopify/cart/cookie";
import { MAX_BAG_ITEMS } from "@/lib/shopify/cart/limits";
import { getCart } from "@/lib/shopify/cart/server";
import { createTryAtHomeDraft } from "@/lib/shopify/draft-order/server";
import { indiaStates } from "@/lib/india-states";
import { canRequestTryAtHome } from "@/lib/try-at-home/eligibility";

export type RequestState = { error: string | null };

function formText(formData: FormData, name: string, maxLength: number) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function submitTryAtHomeRequest(
  _state: RequestState,
  formData: FormData,
): Promise<RequestState> {
  const firstName = formText(formData, "firstName", 60);
  const lastName = formText(formData, "lastName", 60);
  const email = formText(formData, "email", 254);
  const phone = formText(formData, "phone", 20);
  const address1 = formText(formData, "address1", 120);
  const address2 = formText(formData, "address2", 120);
  const city = formText(formData, "city", 80);
  const state = formText(formData, "state", 2).toUpperCase();
  const pinCode = formText(formData, "pinCode", 6);

  if (
    !firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^[0-9]{10}$/.test(phone) || !address1 || !city ||
    !indiaStates.some(([code]) => code === state) || !/^[0-9]{6}$/.test(pinCode) ||
    formData.get("understood") !== "yes"
  ) {
    return { error: "Complete your contact and delivery details and acknowledge the request terms." };
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) return { error: "Your bag is empty. Add a piece before requesting Try at Home." };

  let reference: string;
  try {
    const cart = await getCart(cartId);
    if (!cart || cart.totalQuantity < 1 || cart.totalQuantity > MAX_BAG_ITEMS) {
      return { error: `Your bag must contain between one and ${MAX_BAG_ITEMS} pieces.` };
    }
    if (!(await canRequestTryAtHome(cart))) {
      return { error: "One or more pieces are not available for Try at Home. Please update your bag." };
    }

    reference = await createTryAtHomeDraft(cart, {
      firstName,
      lastName,
      email,
      phone: `+91${phone}`,
      address1,
      address2,
      city,
      state,
      pinCode,
    });
  } catch (error) {
    console.error("Try at Home request failed:", error);
    return { error: "We could not send your request. Please try again or contact us." };
  }

  cookieStore.delete(CART_COOKIE);
  redirect(`/try-at-home/confirmed?reference=${encodeURIComponent(reference)}`);
}
