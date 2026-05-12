import { getRelatedProducts } from '@/lib/api/shopifyServerUtils';
import { ShopifyProductGridClient } from '@/components/store/product-listing/ShopifyProductGridClient';
import type { ShopifyProduct } from '@/lib/types';

interface RelatedProductsProps {
  shopifyProduct: ShopifyProduct;
}

export async function RelatedProducts({ shopifyProduct }: RelatedProductsProps) {
  try {
    // Fetch related products using server utility
    const relatedProducts = await getRelatedProducts(shopifyProduct, 4);

    if (relatedProducts.length === 0) {
      return null;
    }

    return (
      <div className="w-full bg-evol-light-grey py-16 md:py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center text-gray-900 mb-12">
            You May Also Like
          </h2>

          <ShopifyProductGridClient products={relatedProducts} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load related products:', error);
    return null;
  }
}
