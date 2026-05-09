import { getProductCollections, getCollectionProducts } from '@/lib/shopify';
import { ShopifyProductGridClient } from '@/components/store/plp/ShopifyProductGridClient';

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  productType?: string;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  variants: Array<{
    id: string;
    price: string;
    title: string;
  }>;
  tags?: string[];
  description?: string;
}

interface RelatedProductsProps {
  shopifyProduct: ShopifyProduct;
}

export async function RelatedProducts({ shopifyProduct }: RelatedProductsProps) {
  try {
    // Get the collections this product belongs to
    const collections = await getProductCollections(shopifyProduct.id);

    if (collections.length === 0) {
      return null;
    }

    // Get the product type (e.g., "Necklace", "Ring", "Earring")
    const productType = shopifyProduct.productType?.toLowerCase() || '';

    // Fetch products from all collections and filter by same type
    let relatedProducts: ShopifyProduct[] = [];

    for (const collection of collections) {
      const collectionProducts = await getCollectionProducts(collection.handle);
      const sameTypeProducts = collectionProducts.filter(
        (p) => p.id !== shopifyProduct.id &&
               p.productType?.toLowerCase() === productType
      );
      relatedProducts.push(...sameTypeProducts);

      // Stop if we have enough products
      if (relatedProducts.length >= 4) break;
    }

    // If we don't have enough same-type products, fill with other products from the same collection
    if (relatedProducts.length < 4) {
      const firstCollectionProducts = await getCollectionProducts(collections[0].handle);
      const otherProducts = firstCollectionProducts.filter(
        (p) => p.id !== shopifyProduct.id &&
               !relatedProducts.find(rp => rp.id === p.id)
      );
      relatedProducts.push(...otherProducts);
    }

    relatedProducts = relatedProducts.slice(0, 4);

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
    console.error('Failed To Load Related Products:', error);
    return null;
  }
}
