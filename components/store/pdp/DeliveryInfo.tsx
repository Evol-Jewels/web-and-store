"use client";

interface DeliveryInfoProps {
  deliveryDays: number;
}

export function DeliveryInfo({ deliveryDays }: DeliveryInfoProps) {
  return (
    <div className="py-6 border-t border-evol-grey">
      <p className="font-body text-sm text-gray-600">
        <strong>Delivery Timeframe:</strong> {deliveryDays}-20 business days
      </p>
    </div>
  );
}
