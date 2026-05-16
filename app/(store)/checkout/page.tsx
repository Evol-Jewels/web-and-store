import { Suspense } from "react";
import { CheckoutPageClient } from "./CheckoutPageClient";

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-evol-light-grey flex items-center justify-center">
      <div className="text-center">
        <p className="text-14px text-evol-grey">Loading Checkout...</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutPageClient />
    </Suspense>
  );
}
