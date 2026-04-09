import axios from "axios";
import { apiBasePharma } from "@/lib/config";
import { getQueryClient } from "@/lib/queryClient";

// Server-side prefetch function for static generation
export async function prefetchProduct(id: string | number) {
  const queryClient = getQueryClient();

  return queryClient.prefetchQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`${apiBasePharma}/products/${id}`);
      const data = Array.isArray(res?.data) ? res.data[0] : res.data;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export async function prefetchProductIds(maxPages: number = 500) {
  const queryClient = getQueryClient();

  return queryClient.prefetchQuery({
    queryKey: ["productIds", maxPages],
    queryFn: async () => {
      const ids = new Set<string>();
      let page = 1;

      while (page <= maxPages) {
        try {
          const res = await axios.get(
            `${apiBasePharma}/products/all-products-paginated?page=${page}&paginate=100`
          );

          const data = Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.data)
              ? res.data.data
              : Array.isArray(res?.data?.products)
                ? res.data.products
                : [];

          if (data.length === 0) break;

          for (const item of data) {
            if (item?.id !== undefined && item?.id !== null) {
              ids.add(String(item.id));
            }
          }

          page += 1;
        } catch {
          break;
        }
      }

      return Array.from(ids);
    },
  });
}

export async function prefetchAllProducts(page: number = 1, paginate: number = 100) {
  const queryClient = getQueryClient();

  return queryClient.prefetchQuery({
    queryKey: ["products", page, paginate],
    queryFn: async () => {
      const res = await axios.get(
        `${apiBasePharma}/products/all-products-paginated?page=${page}&paginate=${paginate}`
      );
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.products)
            ? res.data.products
            : [];
      return data;
    },
  });
}
