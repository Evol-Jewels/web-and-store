const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

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

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, any>,
  retries = 3,
) {
  const url = `https://${domain}/admin/api/2024-01/graphql.json`;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token || "",
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
        // Cache for 1 hour (3600 seconds) to reduce API calls
        next: {
          revalidate: 3600,
        },
        // Add timeout to prevent hanging connections
        signal: AbortSignal.timeout(15000), // 15 second timeout
      } as any);

      const data = await response.json();

      if (data.errors) {
        console.error("Shopify GraphQL errors:", data.errors);
        throw new Error(`Shopify API error: ${data.errors[0]?.message}`);
      }

      return data as T;
    } catch (error: any) {
      const isLastAttempt = attempt === retries - 1;

      // Log retry info
      if (!isLastAttempt) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.warn(
          `[Shopify API] Attempt ${attempt + 1}/${retries} failed. Retrying in ${delay}ms...`,
          error.message
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error(
          `[Shopify API] All ${retries} attempts failed. Final error:`,
          error
        );
        throw error;
      }
    }
  }
}

export async function getAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query GetProducts {
      products(first: 100) {
        edges {
          node {
            id
            title
            handle
            vendor
            productType
            images(first: 2) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price
                  title
                }
              }
            }
            tags
            description
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query);

    const products = response.data.products.edges.map((edge: any) => {
      const product = edge.node;
      return {
        id: product.id,
        title: product.title,
        handle: product.handle,
        vendor: product.vendor,
        productType: product.productType,
        images:
          product.images?.edges?.map((img: any) => ({
            url: img.node.url,
            alt: img.node.altText,
          })) || [],
        variants:
          product.variants?.edges?.map((variant: any) => ({
            id: variant.node.id,
            price: variant.node.price,
            title: variant.node.title,
          })) || [],
        tags: product.tags || [],
        description: product.description,
      } as ShopifyProduct;
    });
    products.forEach((product: ShopifyProduct) => {
      console.log(
        `  - ${product.title} (Type: ${product.productType || "N/A"}, Images: ${product.images.length})`,
      );
    });

    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export async function getProductByHandle(
  handle: string,
): Promise<ShopifyProduct | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        vendor
        productType
        description
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              price
              title
              availableForSale
              selectedOptions {
                name
                value
              }
            }
          }
        }
        tags
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query, { handle });

    if (!response.data.productByHandle) {
      return null;
    }

    const product = response.data.productByHandle;
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      vendor: product.vendor,
      productType: product.productType,
      images:
        product.images?.edges?.map((img: any) => ({
          url: img.node.url,
          alt: img.node.altText,
        })) || [],
      variants:
        product.variants?.edges?.map((variant: any) => ({
          id: variant.node.id,
          price: variant.node.price,
          title: variant.node.title,
          selectedOptions: variant.node.selectedOptions?.map((opt: any) => ({
            name: opt.name,
            value: opt.value,
          })) || [],
        })) || [],
      tags: product.tags || [],
      description: product.description,
    } as ShopifyProduct;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export async function getProductCollections(
  productId: string,
): Promise<Array<{ handle: string; title: string }>> {
  const query = `
    query GetProductCollections($id: ID!) {
      product(id: $id) {
        collections(first: 10) {
          edges {
            node {
              handle
              title
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query, { id: productId });

    if (!response.data.product || !response.data.product.collections) {
      return [];
    }

    const collections = response.data.product.collections.edges.map(
      (edge: any) => ({
        handle: edge.node.handle,
        title: edge.node.title,
      }),
    );

    return collections;
  } catch (error) {
    console.error("Failed to Fetch Product Collections:", error);
    return [];
  }
}

export async function getCollectionProducts(
  collectionHandle: string,
): Promise<ShopifyProduct[]> {
  const query = `
    query GetCollectionProducts($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              vendor
              productType
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price
                    title
                  }
                }
              }
              tags
            }
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query, {
      handle: collectionHandle,
    });

    if (!response.data.collectionByHandle) {
      console.error("Collection Not Found:", collectionHandle);
      return [];
    }

    const products = response.data.collectionByHandle.products.edges.map(
      (edge: any) => {
        const product = edge.node;
        const images =
          product.images?.edges?.map((img: any) => ({
            url: img.node.url,
            alt: img.node.altText,
          })) || [];

        return {
          id: product.id,
          title: product.title,
          handle: product.handle,
          vendor: product.vendor,
          productType: product.productType,
          images,
          variants:
            product.variants?.edges?.map((variant: any) => ({
              id: variant.node.id,
              price: variant.node.price,
              title: variant.node.title,
            })) || [],
          tags: product.tags || [],
          description: product.description,
        } as ShopifyProduct;
      },
    );

    return products;
  } catch (error) {
    console.error("Failed to Fetch Collection Products:", error);
    return [];
  }
}

export async function getAllCollections(): Promise<
  Array<{
    id: string;
    handle: string;
    title: string;
    description: string;
  }>
> {
  const query = `
    query GetAllCollections {
      collections(first: 250) {
        edges {
          node {
            id
            handle
            title
            description
          }
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch<any>(query);

    const collections = response.data.collections.edges.map((edge: any) => ({
      id: edge.node.id,
      handle: edge.node.handle,
      title: edge.node.title,
      description: edge.node.description || "",
    }));

    return collections;
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return [];
  }
}
