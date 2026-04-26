import type { MetadataRoute } from "next";
import { apiBasePharma } from "@/lib/config";

const SITE_URL = "https://ousadbazar.com";

type ApiProduct = {
  id: number | string;
  updated_at?: string;
};

async function fetchAllProducts(): Promise<ApiProduct[]> {
  const products: ApiProduct[] = [];
  try {
    let page = 1;
    let lastPage = 1;
    do {
      const res = await fetch(
        `${apiBasePharma}/products/best-selling-product?page=${page}&paginate=100`,
        { cache: "no-store" }
      );
      if (!res.ok) break;
      const json = await res.json();
      const data: ApiProduct[] = json?.data || [];
      products.push(...data);
      lastPage = Number(json?.last_page || 1);
      page++;
    } while (page <= lastPage); // ✅ এই line টি ছিল missing!
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    // swallow errors so sitemap still builds with static routes
  }
  return products;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/ousadbazar/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/ousadbazar/all-medicines/`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ousadbazar/search/`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/ousadbazar/cart/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/ousadbazar/checkout/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/ousadbazar/wishlist/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/ousadbazar/order-tracking/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/ousadbazar/guest-order/`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  const products = await fetchAllProducts();
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/ousadbazar/product/?id=${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}

// Static export এর জন্য force-static যোগ করুন
export const dynamic = 'force-static';