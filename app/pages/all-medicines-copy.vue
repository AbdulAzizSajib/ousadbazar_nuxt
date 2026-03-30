<template>
  <NuxtLayout>
    <section class="w-full rounded-lg px-3 md:px-0">
      <div>
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
            <h2 class="text-gray-700">
              <span class="font-semibold text-gray-900">{{ totalProducts }}</span> Results
              Found
            </h2>
          </div>

          <!-- Products grid -->
          <div class="mb-3">
            <div
              v-if="!loading && allProduct.length <= 0"
              class="flex justify-center items-center"
            >
              <p class="text-xl">No data Found!</p>
            </div>

            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-2 capitalize lg:place-items-center"
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
                v-for="item in allProduct"
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
import { ref, onMounted, onUnmounted, nextTick } from "vue";
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

<style lang="scss" scoped></style>
