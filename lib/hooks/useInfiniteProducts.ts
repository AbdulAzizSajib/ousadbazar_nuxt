import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { apiBasePharma } from '@/lib/config';
import type { Product } from '@/types';

export const useAllProductsInfinite = (sortBy: string = 'asc') => {
  return useInfiniteQuery({
    queryKey: ['allProducts', sortBy],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(
        `${apiBasePharma}/products/best-selling-product?page=${pageParam}&paginate=20&sort_by=${sortBy}`
      );

      const newProducts: Product[] = (res.data?.data || []).map((p: Record<string, unknown>) => ({
        ...p,
        category: { name: p.category_name as string },
        supplier: { company_name: p.company_name as string },
        product_prices: {
          selling_price: p.selling_price as number,
          ecom_final_selling_price:
            (p.ecom_final_selling_price as number) || (p.selling_price as number),
          ecom_discount_percentage: (p.ecom_discount_percentage as number) || null,
          pack_quantity: 1,
          ecom_pack_name: { name: ' Pcs' },
        },
        product_images: [],
        stock_batches: p.stock ? [{ balanced_quantity: p.stock as number }] : [],
      }));

      return {
        products: newProducts,
        nextPage: pageParam + 1,
        hasMore: pageParam < (res.data?.last_page || 1),
        total: res.data?.total || 0,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
