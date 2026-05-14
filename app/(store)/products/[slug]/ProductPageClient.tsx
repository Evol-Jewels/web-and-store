"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Heart,
  Shield,
  Truck,
  RotateCcw,
  Loader2,
  Check,
  Info,
} from "lucide-react";
import { ImageGallery } from "@/components/store/product-details/ImageGallery";
import { ExpertConsultation } from "@/components/store/product-details/ExpertConsultation";
import { RingSizeGuide } from "@/components/store/product-details/RingSizeGuide";
import { CartDrawer } from "@/components/store/CartDrawer";
import { useWishlistStore } from "@/lib/stores/wishlistStore";
import { useCartStore } from "@/lib/stores/cartStore";
import {
  getConfiguratorSections,
  METAL_COLORS,
  PURITY_OPTIONS,
} from "@/lib/utils/configurators";
import type { ShopifyProduct, AddToCartStatus } from "@/lib/types";

interface ProductPageClientProps {
  shopifyProduct: ShopifyProduct;
}

// Find matching variant based on selected options
const findMatchingVariant = (
  variants: ShopifyProduct["variants"],
  selectedOptions: Record<string, any>,
) => {
  return variants.find((variant) => {
    if (!variant.selectedOptions) return false;

    // Create a map of option names to values (case-insensitive)
    const variantOptions = new Map(
      variant.selectedOptions.map((opt) => [
        opt.name.toLowerCase(),
        opt.value.toLowerCase(),
      ]),
    );

    // Check each selected option against variant
    for (const [key, value] of Object.entries(selectedOptions)) {
      if (value === null || value === undefined) continue;

      const variantValue = variantOptions.get(key.toLowerCase());
      if (!variantValue) continue;

      // Convert selected value to string for comparison
      const selectedValueStr = String(value).toLowerCase().trim();

      // Check if variant value matches
      if (
        !variantValue.includes(selectedValueStr) &&
        variantValue !== selectedValueStr
      ) {
        return false;
      }
    }

    return true;
  });
};

export function ProductPageClient({ shopifyProduct }: ProductPageClientProps) {
  const { isInWishlist, toggle: toggleWishlist } = useWishlistStore();
  const { add: addToCart, setOpen: setCartOpen } = useCartStore();
  const [cartStatus, setCartStatus] = useState<AddToCartStatus>("idle");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showCustomizationRequest, setShowCustomizationRequest] =
    useState(false);

  // Get configurator sections for this product category
  const configuratorSections = useMemo(
    () => getConfiguratorSections(shopifyProduct.productType || ""),
    [shopifyProduct.productType],
  );

  // Dynamic configurator state - map section ID to selected value
  const [selectedOptions, setSelectedOptions] = useState<Record<string, any>>(
    () => {
      const initial: Record<string, any> = {};
      configuratorSections.forEach((section) => {
        initial[section.id] = section.defaultValue || section.options[0]?.value;
      });
      return initial;
    },
  );

  const isFavorite = isInWishlist(shopifyProduct.id);
  const basePrice = parseInt(shopifyProduct.variants[0]?.price || "0");
  const imageUrls = shopifyProduct.images.map((img) => img.url);

  // Calculate total price with modifiers
  const totalPrice = useMemo(() => {
    let price = basePrice;

    configuratorSections.forEach((section) => {
      const selectedValue = selectedOptions[section.id];
      const option = section.options.find((opt) => opt.value === selectedValue);
      if (option?.priceModifier) {
        price += option.priceModifier;
      }
    });

    return Math.max(0, price);
  }, [basePrice, selectedOptions, configuratorSections]);

  // Check if current variant combination is available
  const matchingVariant = useMemo(
    () => findMatchingVariant(shopifyProduct.variants, selectedOptions),
    [selectedOptions, shopifyProduct.variants],
  );

  const isVariantAvailable = !!matchingVariant;

  const handleAddToCart = async () => {
    if (!isVariantAvailable) {
      setShowCustomizationRequest(true);
      return;
    }

    setCartStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setCartStatus("success");
    await new Promise((resolve) => setTimeout(resolve, 400));
    setCartStatus("added");

    // Get metal label for cart
    const metalSection = configuratorSections.find((s) => s.id === "metal");
    const metalOption = metalSection?.options.find(
      (opt) => opt.value === selectedOptions.metal,
    );
    const metalLabel = metalOption?.label || "Metal";

    addToCart({
      productId: shopifyProduct.id,
      name: shopifyProduct.title,
      image: imageUrls[0],
      price: totalPrice,
      metal: metalLabel,
      carat: selectedOptions.carat,
      size: selectedOptions.ringSize,
      quantity: 1,
    });

    setCartOpen(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setCartStatus("idle");
  };

  return (
    <div className="min-h-screen bg-evol-light-grey">
      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-8 lg:gap-12">
          {/* Left column - Image Gallery */}
          <div className="h-fit">
            <ImageGallery
              images={imageUrls}
              productName={shopifyProduct.title}
            />
          </div>

          {/* Right column - Product Info (sticky on desktop) */}
          <div className="h-fit lg:sticky lg:top-20">
            <div className="space-y-8">
              {/* Header Block */}
              <div className="space-y-4">
                <p className="font-sans text-sm tracking-wider text-gray-500 uppercase">
                  {shopifyProduct.productType || "Rings"}
                </p>

                <h1 className="font-serif text-3xl md:text-4xl text-gray-900 leading-tight">
                  {shopifyProduct.title}
                </h1>

                {/* Certification Badge */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-full border border-evol-grey hover:border-gray-400 transition-colors">
                    <Shield className="w-4 h-4 text-gray-600" />
                    <span className="font-sans text-sm text-gray-600">
                      IGI Certified
                    </span>
                  </button>
                </div>

                {/* Price */}
                <motion.div
                  key={totalPrice}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-sans font-medium text-3xl text-gray-900">
                    ₹{totalPrice.toLocaleString("en-IN")}
                  </p>
                  <p className="font-body text-sm text-gray-600 mt-1">
                    Inclusive Of All Taxes · Free Insured Shipping
                  </p>
                </motion.div>
              </div>

              {/* Configurator - Dynamic based on product category */}
              <div className="space-y-6">
                {configuratorSections.map((section) => {
                  const selectedValue = selectedOptions[section.id];

                  // Render based on section type
                  if (section.type === "swatch") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-3">
                          {section.label}
                        </label>
                        <div className="flex gap-4">
                          {section.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className="flex flex-col items-center gap-2 transition-transform"
                            >
                              <motion.div
                                animate={{
                                  scale:
                                    selectedValue === option.value ? 1.1 : 1,
                                }}
                                className={`w-9 h-9 rounded-full border-2 transition-all ${
                                  selectedValue === option.value
                                    ? "border-gray-900"
                                    : "border-gray-300"
                                }`}
                                style={{
                                  background: option.imageUrl,
                                }}
                              />
                              <span className="font-sans text-sm text-gray-600">
                                {option.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === "toggle") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-3">
                          {section.label}
                        </label>
                        <div className="flex gap-2">
                          {section.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className={`px-6 py-2 rounded-full border font-sans text-sm transition-all ${
                                selectedValue === option.value
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "border-evol-grey text-gray-600 hover:border-gray-400"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === "chips") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-3">
                          {section.label}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {section.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className={`px-4 py-2 rounded-full border font-sans text-sm transition-all ${
                                selectedValue === option.value
                                  ? "bg-gray-900 text-white border-gray-900"
                                  : "border-evol-grey text-gray-600 hover:border-gray-400"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  if (section.type === "dropdown") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-3">
                          {section.label}
                        </label>
                        <select
                          value={selectedValue || ""}
                          onChange={(e) =>
                            setSelectedOptions((prev) => ({
                              ...prev,
                              [section.id]: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 rounded-lg border border-evol-grey font-sans text-sm text-gray-600 focus:outline-none focus:border-gray-400"
                        >
                          {section.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }

                  if (section.type === "cards") {
                    return (
                      <div key={section.id}>
                        <label className="font-sans text-sm tracking-wider text-gray-500 uppercase block mb-3">
                          {section.label}
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {section.options.map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [section.id]: option.value,
                                }))
                              }
                              className={`px-4 py-2 rounded-lg border-2 font-sans text-sm transition-all ${
                                selectedValue === option.value
                                  ? "border-gray-900 bg-gray-50"
                                  : "border-evol-grey hover:border-gray-400"
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Ring Size Guide Link - Show only for rings */}
                {configuratorSections.some((s) => s.id === "ringSize") && (
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="font-sans text-sm text-evolRed hover:opacity-80 transition-opacity"
                  >
                    Not Sure Of Your Size? Find It Here →
                  </button>
                )}
              </div>

              {/* CTA Block */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={cartStatus !== "idle"}
                  whileHover={{
                    backgroundColor: isVariantAvailable ? "#7A0208" : "#666666",
                  }}
                  className={`w-full h-13 text-white font-serif text-base rounded flex items-center justify-center transition-colors disabled:opacity-75 ${
                    isVariantAvailable ? "bg-evolRed" : "bg-gray-600"
                  }`}
                >
                  {cartStatus === "idle" &&
                    (isVariantAvailable ? "Place Order" : "Place Request")}
                  {cartStatus === "loading" && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  {cartStatus === "success" && <Check className="w-5 h-5" />}
                  {cartStatus === "added" && "Added"}
                </motion.button>

                <button
                  onClick={() => toggleWishlist(shopifyProduct.id)}
                  className={`w-full h-12 rounded border-2 font-sans font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    isFavorite
                      ? "border-evolRed text-evolRed"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorite ? "fill-evolRed" : "fill-none"
                    }`}
                  />
                  {isFavorite ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>

              {/* Trust Signals */}
              <div className="flex items-center justify-between pt-4 border-t border-evol-grey">
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <span className="font-body text-sm text-gray-600">
                    IGI Certified Diamond
                  </span>
                </div>
                <div className="w-px h-5 bg-evol-grey" />
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <span className="font-body text-sm text-gray-600">
                    Free Insured Delivery
                  </span>
                </div>
                <div className="w-px h-5 bg-evol-grey" />
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-gray-600" />
                  <span className="font-body text-sm text-gray-600">
                    30-Day Easy Returns
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expert Consultation Section */}
      <ExpertConsultation />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Ring Size Guide Modal */}
      {configuratorSections.some((s) => s.id === "ringSize") && (
        <RingSizeGuide open={showSizeGuide} onOpenChange={setShowSizeGuide} />
      )}
    </div>
  );
}
