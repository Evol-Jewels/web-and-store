const whatsappNumber = "9100071181";
const videoCallBookingUrl = "https://calendly.com/mayank-evol/30min";

function productUrl(productHandle: string) {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.evoljewels.com";

  return new URL(`/products/${productHandle}`, origin).toString();
}

export function whatsappConsultationUrl(productTitle: string) {
  const text = `Hi I want to talk about ${productTitle}`;

  return `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(text)}&type=phone_number&app_absent=0`;
}

export function videoCallBookingEmbedUrl(productHandle: string) {
  const params = new URLSearchParams({
    hide_gdpr_banner: "1",
    utm_content: productUrl(productHandle),
  });

  return `${videoCallBookingUrl}?${params.toString()}`;
}
