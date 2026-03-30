<template>
  <NuxtLayout>
    <section class="w-full rounded-lg px-3 md:px-0 py-3">
      <div
        class="grid grid-cols-1 md:grid-cols-[320px_1fr] xl:grid-cols-[290px_1fr] gap-4"
      >
        <!-- Filters Sidebar -->
        <aside
          class="md:sticky md:top-[84px] h-fit md:max-h-[calc(100vh-96px)]"
        >
          <div
            class="border border-[#d7e9e5] dark:border-[#35564f] dark:from-[#1f2f2c] dark:to-[#111827] p-4 md:p-5 md:min-h-[calc(100vh-96px)] md:overflow-y-auto"
          >
            <div class="flex justify-between items-center mb-3">
              <h2
                class="m-0 text-lg md:text-xl font-medium text-[#2b5e55] dark:text-[#b6ddd5]"
              >
                Filter Medicines
              </h2>
              <button
                type="button"
                class="border border-[#8fbdb4] dark:border-[#436b63] text-[#2d6f63] dark:text-[#b6ddd5] bg-[#ecf6f4] dark:bg-[#203532] rounded-full px-3.5 py-2 text-sm transition-all duration-200 hover:bg-[#d8ece8] dark:hover:bg-[#294542]"
                @click="clearFilters"
              >
                Clear
              </button>
            </div>

            <div class="mb-3 md:hidden">
              <button
                type="button"
                class="border border-[#8fbdb4] dark:border-[#436b63] text-[#2d6f63] dark:text-[#b6ddd5] bg-[#ecf6f4] dark:bg-[#203532] rounded-full px-3.5 py-2 text-sm transition-all duration-200 hover:bg-[#d8ece8] dark:hover:bg-[#294542]"
                @click="isFilterOpen = !isFilterOpen"
              >
                {{ isFilterOpen ? "Hide Filters" : "Show Filters" }}
              </button>
            </div>

            <div :class="[isFilterOpen ? 'block' : 'hidden', 'md:block']">
              <div
                class="border-t border-dashed border-[#cde0dc] dark:border-[#35564f] pt-3 mt-3"
              >
                <h3
                  class="m-0 mb-2 text-sm md:text-base font-medium text-[#2b5e55] dark:text-[#9ccfc4]"
                >
                  Supplier
                </h3>
                <div class="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
                  <label
                    v-for="supplier in supplierOptions"
                    :key="supplier"
                    class="flex items-center gap-2 text-[#3d5f58] dark:text-[#9ab5af] text-sm"
                  >
                    <input
                      type="checkbox"
                      :value="supplier"
                      v-model="selectedSuppliers"
                      class="h-4 w-4 rounded border border-[#7faea4] bg-[#f3faf8] text-[#388072] accent-[#388072] checked:bg-[#388072] checked:border-[#388072] focus:ring-2 focus:ring-[#388072]/30 dark:border-[#5f8f86] dark:bg-[#1b2624] dark:checked:bg-[#4ea595] dark:checked:border-[#4ea595]"
                    />
                    <span>{{ supplier }}</span>
                  </label>
                </div>
              </div>

              <div
                class="border-t border-dashed border-[#cde0dc] dark:border-[#35564f] pt-3 mt-3"
              >
                <h3
                  class="m-0 mb-2 text-sm md:text-base font-medium text-[#2b5e55] dark:text-[#9ccfc4]"
                >
                  Category
                </h3>
                <div class="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
                  <label
                    v-for="category in categoryOptions"
                    :key="category"
                    class="flex items-center gap-2 text-[#3d5f58] dark:text-[#9ab5af] text-sm"
                  >
                    <input
                      type="checkbox"
                      :value="category"
                      v-model="selectedCategories"
                      class="h-4 w-4 rounded border border-[#7faea4] bg-[#f3faf8] text-[#388072] accent-[#388072] checked:bg-[#388072] checked:border-[#388072] focus:ring-2 focus:ring-[#388072]/30 dark:border-[#5f8f86] dark:bg-[#1b2624] dark:checked:bg-[#4ea595] dark:checked:border-[#4ea595]"
                    />
                    <span>{{ category }}</span>
                  </label>
                </div>
              </div>

              <div
                class="border-t border-dashed border-[#cde0dc] dark:border-[#35564f] pt-3 mt-3"
              >
                <h3
                  class="m-0 mb-2 text-sm md:text-base font-medium text-[#2b5e55] dark:text-[#9ccfc4]"
                >
                  Price Range (৳)
                </h3>
                <div class="grid grid-cols-2 gap-2">
                  <label
                    class="grid gap-1 text-sm text-[#3d5f58] dark:text-[#9ab5af]"
                  >
                    Min
                    <input
                      v-model.number="minPrice"
                      type="number"
                      class="w-full border border-[#b9d4ce] dark:border-[#436b63] bg-white dark:bg-[#1b2624] text-gray-900 dark:text-gray-100 rounded-lg px-2.5 py-2 outline-none focus:border-[#388072] focus:ring-2 focus:ring-[#388072]/20"
                      min="0"
                      placeholder="0"
                    />
                  </label>
                  <label
                    class="grid gap-1 text-sm text-[#3d5f58] dark:text-[#9ab5af]"
                  >
                    Max
                    <input
                      v-model.number="maxPrice"
                      type="number"
                      class="w-full border border-[#b9d4ce] dark:border-[#436b63] bg-white dark:bg-[#1b2624] text-gray-900 dark:text-gray-100 rounded-lg px-2.5 py-2 outline-none focus:border-[#388072] focus:ring-2 focus:ring-[#388072]/20"
                      min="0"
                      placeholder="2000"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="overflow-y-auto flex-1">
          <!-- Sort and results count -->
          <div class="p-2 flex justify-between items-center">
            <div class="flex gap-2 items-center">
              <h2 class="text-gray-700">Sort By:</h2>
              <select
                v-model="sort_by"
                @change="resetAndGetData"
                class="bg-white text-gray-900 border rounded"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <h2 class="text-gray-700 text-sm md:text-base text-right">
              <span class="font-semibold text-gray-900">{{
                filteredProducts.length
              }}</span>
              Filtered
              <span class="mx-1">/</span>
              <span class="font-semibold text-gray-900">{{
                totalProducts
              }}</span>
              Total
            </h2>
          </div>

          <!-- Products grid -->
          <div class="mb-3">
            <div
              v-if="!loading && filteredProducts.length <= 0"
              class="flex justify-center items-center"
            >
              <p class="text-xl">No data Found!</p>
            </div>

            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-x-2 capitalize lg:place-items-center"
            >
              <!-- Skeleton Loading Cards -->
              <template v-if="loading && currentPage === 1">
                <div
                  v-for="n in 12"
                  :key="'skeleton-' + n"
                  class="bg-white dark:bg-gray-800 mb-6 border dark:border-gray-700 rounded-md overflow-hidden md:w-[209.53px] animate-pulse"
                >
                  <!-- Image Skeleton -->
                  <div class="w-full h-[209.53px] bg-gray-200"></div>
                  <!-- Content Skeleton -->
                  <div class="p-2 md:px-2 md:pb-2">
                    <!-- Category badge -->
                    <div class="mb-3">
                      <div class="h-5 w-20 bg-gray-200 rounded-lg"></div>
                    </div>
                    <!-- Title -->
                    <div class="h-[40px] space-y-1.5">
                      <div class="h-3 w-full bg-gray-200 rounded"></div>
                      <div class="h-3 w-3/4 bg-gray-200 rounded"></div>
                    </div>
                    <!-- Stock info -->
                    <div class="flex items-center mb-2 mt-1">
                      <div class="w-2 h-2 rounded-full bg-gray-200 mr-2"></div>
                      <div class="h-3 w-16 bg-gray-200 rounded"></div>
                    </div>
                    <!-- Price and button -->
                    <div class="flex items-end justify-between">
                      <div class="space-y-1">
                        <div class="h-3 w-12 bg-gray-200 rounded"></div>
                        <div class="h-4 w-16 bg-gray-300 rounded"></div>
                      </div>
                      <div class="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </template>
              <!-- Product cards -->

              <div
                class="group bg-white dark:bg-gray-800 mb-6 border dark:border-gray-700 brounded-md overflow-hidden transition-all duration-300 transform relative md:w-[209.53px]"
                v-for="item in filteredProducts"
                :key="item.id"
              >
                <!-- Product Image and Discount Section -->
                <div
                  class="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 rounded-lg text-sm font-semibold z-10 uppercase"
                >
                  <p
                    v-if="
                      item?.product_prices?.selling_price !== null &&
                      item?.product_prices?.ecom_discount_percentage !== null &&
                      item?.product_prices?.selling_price !==
                        item?.product_prices?.ecom_discount_percentage
                    "
                  >
                    {{ item?.product_prices?.ecom_discount_percentage }}% off
                  </p>
                </div>
                <nuxt-link
                  :to="{ name: 'product-id', params: { id: item?.id } }"
                  class="w-full block"
                >
                  <!-- Image Container -->
                  <div
                    class="relative mb-2 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex justify-center bg-white dark:bg-gray-800"
                  >
                    <a-image
                      :width="209.53"
                      :height="209.53"
                      loading="lazy"
                      :src="`${imgBasePharma}/${item?.path}`"
                      :fallback="default_img"
                    />
                  </div>
                </nuxt-link>

                <!-- Product Content Section -->
                <nuxt-link
                  :to="{ name: 'product-id', params: { id: item?.id } }"
                  class="w-full block"
                >
                  <div class="p-2 md:px-2 md:pb-2">
                    <div class="mb-3">
                      <span
                        class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-3 rounded-lg border border-blue-200 dark:border-blue-700"
                        :title="item?.category?.name"
                      >
                        {{ item?.category?.name }}
                      </span>
                    </div>
                    <h3
                      class="font-bold text-xs lg:text-sm text-gray-800 dark:text-gray-200 mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300 h-[40px]"
                      :title="item?.name"
                    >
                      {{ item?.name }}
                    </h3>
                    <!-- Stock Info and Price -->
                    <div class="flex items-center mb-2">
                      <div class="flex items-center space-x-2">
                        <div
                          class="w-2 h-2 rounded-full"
                          :class="{
                            'bg-[#388072]': stockQuantity(item) > 0,
                            'bg-red-600': stockQuantity(item) <= 0,
                          }"
                        ></div>
                        <span
                          v-if="stockQuantity(item) > 0"
                          class="md:text-sm text-[12px] font-medium dark:text-gray-200"
                          >In Stock
                          <span
                            >( {{ formatNumber(stockQuantity(item)) }})</span
                          >
                        </span>
                        <span
                          v-else
                          class="text-[12px] font-medium text-red-600 dark:text-gray-200"
                          >Stock Out
                          <span
                            >( {{ formatNumber(stockQuantity(item)) }})</span
                          ></span
                        >
                      </div>
                    </div>

                    <div class="flex items-end justify-between">
                      <div class="flex flex-col">
                        <span
                          v-if="
                            item?.product_prices?.selling_price !== null &&
                            item?.product_prices?.ecom_discount_percentage !==
                              null &&
                            item?.product_prices?.selling_price !==
                              item?.product_prices?.ecom_discount_percentage
                          "
                          class="text-sm text-gray-400 line-through"
                        >
                          {{
                            Number(item?.product_prices?.selling_price).toFixed(
                              2,
                            )
                          }}
                          ৳
                        </span>
                        <span class="text-base font-bold dark:text-gray-200">
                          {{
                            Number(
                              item?.product_prices?.ecom_final_selling_price,
                            ).toFixed(2)
                          }}
                          ৳
                        </span>
                      </div>
                      <!-- btn -->
                      <div class="">
                        <a-dropdown
                          :trigger="['click']"
                          v-model:open="dropdownStates[item?.id]"
                          overlay-class-name="my-dropdown"
                          placement="bottom"
                        >
                          <button
                            :class="{
                              'opacity-50 cursor-not-allowed':
                                stockQuantity(item) <
                                item?.product_prices?.pack_quantity,
                            }"
                            :disabled="
                              stockQuantity(item) <
                              item?.product_prices?.pack_quantity
                            "
                            type="button"
                            class="bg-[#388072] px-4 py-1.5 text-white w-full rounded uppercase flex items-center justify-center relative border-transparent transition-all duration-200"
                            @click.prevent="calculateStockQuantity(item)"
                          >
                            <!-- Loading spinner -->
                            <Icon
                              class="animate-spin size-4"
                              v-if="loadingItemId === item?.id"
                              icon="mingcute:loading-line"
                            />

                            <!-- Text when not loading -->
                            <span
                              v-else
                              class="relative z-10 drop-shadow-sm tracking-wide md:text-xs font-light text-[12px]"
                            >
                              Add
                            </span>
                          </button>

                          <template #overlay>
                            <a-menu
                              class="max-h-48 overflow-y-auto"
                              v-if="showCartQtyOverlayId == item?.id"
                              @mouseleave="clearStockQuantity"
                            >
                              <a-menu-item
                                v-for="i in no_of_available_pack"
                                :key="i"
                                @click="
                                  handleAddToCart(
                                    item,
                                    i *
                                      (item?.product_prices?.pack_quantity ||
                                        1),
                                    i,
                                  )
                                "
                                :disabled="loadingItemId === item?.id"
                              >
                                <!-- Dynamically calculate the pack number and price -->
                                <span
                                  class="text-xs"
                                  :class="{
                                    'opacity-50': loadingItemId === item?.id,
                                  }"
                                >
                                  <!-- {{
                                    item?.category?.name
                                      .toLowerCase()
                                      .includes("cap") ||
                                    item?.category?.name
                                      .toLowerCase()
                                      .includes("tab")
                                      ? "(" + Number(i) + " Strip)"
                                      : Number(i) + " X"
                                  }} -->

                                  {{
                                    "(" +
                                    Number(i) +
                                    " " +
                                    item?.product_prices?.ecom_pack_name?.name +
                                    ")"
                                  }}
                                  {{
                                    item?.category?.name
                                      .toLowerCase()
                                      .includes("cap") ||
                                    item?.category?.name
                                      .toLowerCase()
                                      .includes("tab")
                                      ? Number(
                                          item?.product_prices?.pack_quantity,
                                        ) * Number(i)
                                      : Number(
                                          item?.product_prices?.pack_quantity,
                                        )
                                  }}
                                  {{ item?.category?.name }}
                                  - ৳
                                  {{
                                    Number(
                                      Number(i) *
                                        Number(
                                          item?.product_prices
                                            ?.ecom_final_selling_price,
                                        ) *
                                        Number(
                                          item?.product_prices?.pack_quantity,
                                        ),
                                    ).toFixed(2)
                                  }}
                                </span>
                              </a-menu-item>
                            </a-menu>
                          </template>
                        </a-dropdown>
                      </div>
                    </div>
                  </div>
                </nuxt-link>
              </div>
            </div>

            <!-- Infinite Scroll Trigger -->
            <div
              ref="infiniteScrollTrigger"
              class="h-20 flex justify-center items-center"
            >
              <div v-if="loading && currentPage > 1" class="flex items-center">
                <img class="h-10" :src="gif" alt="Loading..." />
                <span class="ml-2">Loading more products...</span>
              </div>
              <div
                v-else-if="!hasMore && allProduct.length > 0"
                class="text-center text-gray-500 dark:text-gray-400"
              >
                You've reached the end of the products list.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { apiBasePharma, formatNumber, imgBasePharma } from "@/config";
import axios from "axios";
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import gif from "@/assets/images/Yellow.gif";
import default_img from "@/assets/images/default.jpg";
import { Icon } from "@iconify/vue";
import { useCartStore } from "@/stores/cart";

// Cart store
const cartStore = useCartStore();
const { getCart } = cartStore;

// Products data
const allProduct = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const hasMore = ref(true);
const totalProducts = ref(0);

// Sort
const sort_by = ref("asc");

// Filters
const isFilterOpen = ref(false);
const selectedSuppliers = ref([]);
const selectedCategories = ref([]);
const minPrice = ref(null);
const maxPrice = ref(null);

const getProductPrice = (item) =>
  Number(item?.product_prices?.ecom_final_selling_price || 0);

const supplierOptions = computed(() => {
  const suppliers = allProduct.value
    .map((item) => item?.supplier?.company_name)
    .filter(Boolean);
  return [...new Set(suppliers)].sort((a, b) => a.localeCompare(b));
});

const categoryOptions = computed(() => {
  const categories = allProduct.value
    .map((item) => item?.category?.name)
    .filter(Boolean);
  return [...new Set(categories)].sort((a, b) => a.localeCompare(b));
});

const filteredProducts = computed(() => {
  return allProduct.value.filter((item) => {
    const supplier = item?.supplier?.company_name;
    const category = item?.category?.name;
    const price = getProductPrice(item);

    const bySupplier =
      selectedSuppliers.value.length === 0 ||
      selectedSuppliers.value.includes(supplier);
    const byCategory =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.includes(category);
    const byMinPrice = minPrice.value === null || price >= minPrice.value;
    const byMaxPrice = maxPrice.value === null || price <= maxPrice.value;

    return bySupplier && byCategory && byMinPrice && byMaxPrice;
  });
});

const clearFilters = () => {
  selectedSuppliers.value = [];
  selectedCategories.value = [];
  minPrice.value = null;
  maxPrice.value = null;
};

// Infinite scroll trigger ref
const infiniteScrollTrigger = ref(null);
let observer = null;

// Fetch products
const getAlldata = async (reset = false) => {
  if (loading.value) return;

  try {
    if (reset) {
      currentPage.value = 1;
      allProduct.value = [];
      hasMore.value = true;
    }

    loading.value = true;

    const res = await axios.get(
      `${apiBasePharma}/products/all-products-paginated?page=${currentPage.value}&paginate=${pageSize.value}&sort_by=${sort_by.value || ""}`,
    );

    loading.value = false;

    if (res.data) {
      const newProducts = (res?.data?.data || []).map((p) => ({
        ...p,
        category: { name: p.category_name },
        supplier: { company_name: p.company_name },
        product_prices: {
          selling_price: p.selling_price,
          ecom_final_selling_price: p.selling_price,
          ecom_discount_percentage: null,
          pack_quantity: 1,
          ecom_pack_name: { name: " Pcs" },
        },
        product_images: [],
        stock_batches: p.stock ? [{ balanced_quantity: p.stock }] : [],
      }));

      if (currentPage.value === 1) {
        allProduct.value = newProducts;
      } else {
        allProduct.value = [...allProduct.value, ...newProducts];
      }

      totalProducts.value = res?.data?.total || 0;
      hasMore.value = currentPage.value < (res.data.last_page || 1);
    }
  } catch (error) {
    loading.value = false;
    console.error("Error fetching products:", error);
  }
};

// Reset and fetch data
const resetAndGetData = () => {
  getAlldata(true);
};

// Load more data
const loadMore = () => {
  if (hasMore.value && !loading.value) {
    currentPage.value += 1;
    getAlldata();
  }
};

// Setup Intersection Observer for infinite scroll
const setupInfiniteScroll = () => {
  if (!infiniteScrollTrigger.value) return;

  // Create intersection observer
  observer = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMore();
      }
    },
    {
      root: null, // viewport
      rootMargin: "100px", // Start loading 100px before the element is visible
      threshold: 0.1, // Trigger when 10% of the element is visible
    },
  );

  // Start observing
  observer.observe(infiniteScrollTrigger.value);
};

// Add to cart
const handleAddToCart = (products, quantity, i) => {
  loadingItemId.value = products?.id;

  try {
    getCart(products, quantity, i);
    // showNotification("success", `${products.name} added to cart!`);

    // Clear the dropdown after successful add
    clearStockQuantity();
    dropdownStates.value[products?.id] = false;
  } finally {
    loadingItemId.value = null;
  }
};
// Calculate stock
const stockQuantity = (item) => {
  if (!item?.stock_batches?.length) return 0;
  const stock = item?.stock_batches?.reduce((sum, batch) => {
    return sum + parseFloat(batch.balanced_quantity || 0);
  }, 0);
  return stock || 0;
};

const no_of_available_pack = ref("");
const showCartQtyOverlayId = ref("");
// Add this ref for tracking loading state per item
const loadingItemId = ref(null);
const dropdownStates = ref({});

// Update the calculateStockQuantity function
const calculateStockQuantity = (item) => {
  showCartQtyOverlayId.value = "";
  no_of_available_pack.value = "";

  const stock_quantity = stockQuantity(item);
  no_of_available_pack.value = Math.floor(
    stock_quantity / (item?.product_prices?.pack_quantity || 1),
  );

  showCartQtyOverlayId.value = item?.id;
  dropdownStates.value[item?.id] = true;
};
const clearStockQuantity = () => {
  showCartQtyOverlayId.value = "";
  no_of_available_pack.value = "";
  Object.keys(dropdownStates.value).forEach((key) => {
    dropdownStates.value[key] = false;
  });
};

// Lifecycle hooks
onMounted(async () => {
  await getAlldata(true);

  // Setup infinite scroll after data is loaded
  await nextTick();
  setupInfiniteScroll();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>
