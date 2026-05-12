import { getProductByHandle } from '@/lib/api/shopify';
import { ProductPageClient } from './ProductPageClient';
import { RelatedProducts } from '@/components/store/product-details/RelatedProducts';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params: paramsPromise }: ProductPageProps) {
  const { slug } = await paramsPromise;

  // Fetch product from Shopify
  const product = await getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductPageClient shopifyProduct={product} />
      <RelatedProducts shopifyProduct={product} />
    </>
  );
}
