import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import debounce from "lodash.debounce";
import { apiBasePharma } from "@/config";

export const useSearchStore = defineStore("search", () => {
  const searchQuery = ref("");
  const searchData = ref([]);
  const searchLoading = ref(false);
  const hasSearched = ref(false);

  const doSearch = debounce(async (query) => {
    if (!query || query.trim() === "") {
      searchData.value = [];
      searchLoading.value = false;
      return;
    }

    searchLoading.value = true;
    hasSearched.value = true;

    try {
      const res = await axios.get(
        `${apiBasePharma}/products/search?q=${encodeURIComponent(query)}`,
      );

      if (res?.data) {
        const results = Array.isArray(res.data)
          ? res.data
          : res.data.products || res.data.data || [];

        searchData.value = results.map((item) => {
          const product = item._source || item;
          return {
            id: product.id,
            name: product.name,
            generic_name: product.generic_name,
            category: {
              name: product.category_name || product.category?.name || "N/A",
            },
            supplier: {
              company_name:
                product.company_name ||
                product.supplier?.company_name ||
                "N/A",
            },
            product_prices: {
              selling_price:
                product.selling_price ||
                product.product_prices?.selling_price ||
                0,
              ecom_final_selling_price:
                product.selling_price ||
                product.product_prices?.ecom_final_selling_price ||
                0,
              ecom_discount_percentage:
                product.product_prices?.ecom_discount_percentage || null,
              pack_quantity: product.product_prices?.pack_quantity || 1,
              ecom_pack_name: product.product_prices?.ecom_pack_name || {
                name: "Pcs",
              },
            },
            product_images: product.product_images || [],
            path: product.path || null,
            stock_batches: product.stock
              ? [{ balanced_quantity: product.stock }]
              : product.stock_batches || [],
          };
        });
      }
    } catch (error) {
      searchData.value = [];
    } finally {
      searchLoading.value = false;
    }
  }, 400);

  const search = (query) => {
    searchQuery.value = query;
    doSearch(query);
  };

  const clearSearch = () => {
    searchQuery.value = "";
    searchData.value = [];
    hasSearched.value = false;
  };

  return {
    searchQuery,
    searchData,
    searchLoading,
    hasSearched,
    search,
    clearSearch,
  };
});
