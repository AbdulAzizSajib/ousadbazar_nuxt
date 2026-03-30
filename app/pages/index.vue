<template>
  <NuxtLayout>
    <div class="px-3 md:px-0">
      <!-- Slider -->
      <div
        class="relative overflow-hidden border bg-gradient-to-r from-[#2b5f55] via-[#388072] to-[#6bb7aa] p-5 md:p-8 lg:p-10 text-white shadow-lg mb-5"
      >
        <div
          class="absolute -top-10 -right-10 w-40 h-40 md:w-56 md:h-56 rounded-full bg-white/10 blur-2xl"
        ></div>
        <div
          class="absolute -bottom-12 -left-10 w-44 h-44 md:w-60 md:h-60 rounded-full bg-[#1f4c43]/40 blur-2xl"
        ></div>

        <div
          class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
        >
          <div class="max-w-2xl">
            <p
              class="inline-block bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-3"
            >
              অনলাইন মেডিসিন ই-কমার্স
            </p>
            <h1
              class="text-xl md:text-3xl lg:text-4xl font-extrabold leading-tight"
            >
              আপনার বিশ্বস্ত অনলাইন ফার্মেসি, এখন আরও দ্রুত
            </h1>
            <p class="text-sm md:text-base text-white/90 mt-3 leading-relaxed">
              ঘরে বসেই অর্ডার করুন প্রয়োজনীয় ওষুধ, হেলথকেয়ার ও ওয়েলনেস পণ্য।
              সাশ্রয়ী দামে, সহজ পেমেন্টে এবং নির্ভরযোগ্য ডেলিভারিতে
              স্বাস্থ্যসেবাকে নিয়ে আসুন আপনার হাতের নাগালে।
            </p>
            <div
              class="flex flex-wrap items-center gap-2 mt-4 text-xs md:text-sm"
            >
              <span
                class="bg-white/15 border border-white/20 px-3 py-1 rounded-full"
                >অরিজিনাল পণ্য</span
              >
              <span
                class="bg-white/15 border border-white/20 px-3 py-1 rounded-full"
                >দ্রুত ডেলিভারি</span
              >
              <span
                class="bg-white/15 border border-white/20 px-3 py-1 rounded-full"
                >২৪/৭ সহায়তা</span
              >
            </div>
          </div>

          <div class="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
            <nuxt-link :to="{ name: 'all-medicines' }">
              <button
                class="w-full sm:w-auto bg-white text-[#2d6a5a] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#e9f5f2] transition-colors"
              >
                এখনই কেনাকাটা করুন
              </button>
            </nuxt-link>
            <nuxt-link :to="{ name: 'guest-order' }">
              <button
                class="w-full sm:w-auto bg-transparent border border-white/70 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                অর্ডার ট্র্যাক করুন
              </button>
            </nuxt-link>
          </div>
        </div>
      </div>

      <!-- Best Selling Products -->
      <div class="flex justify-between items-center my-4">
        <div>
          <h2
            class="text-base md:text-xl font-bold capitalize !mb-0 text-[#388072]"
          >
            Best Selling Products
          </h2>
        </div>
        <div>
          <nuxt-link
            :to="{
              name: 'all-medicines',
            }"
          >
            <button
              class="bg-white dark:bg-gray-800 border-primary text-primary hover:text-white hover:bg-[#388072] px-2 md:px-6 py-0.5 md:py-2 rounded"
            >
              View All <ArrowRightOutlined class="align-middle" />
            </button>
          </nuxt-link>
        </div>
      </div>

      <!-- Products -->
      <div class="mb-3">
        <div
          v-if="!loading && allProduct.length <= 0"
          class="flex justify-center items-center"
        >
          <p class="text-xl">No data Found!</p>
        </div>

        <div
          class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-5 capitalize lg:place-items-center"
        >
          <!-- Skeleton Loading Cards -->
          <template v-if="loading && currentPage === 1">
            <div
              v-for="n in 14"
              :key="'skeleton-' + n"
              class="bg-white dark:bg-gray-800 mb-6 border dark:border-gray-700 rounded-md overflow-hidden md:w-[209.53px] animate-pulse"
            >
              <!-- Image Skeleton -->
              <div class="w-full h-[209.53px] bg-gray-200"></div>
              <!-- Content Skeleton -->
              <div class="p-2 md:px-2 md:pb-2">
                <!-- Category badge -->
                <div class="mb-1">
                  <div class="h-5 w-20 bg-gray-200 rounded-lg"></div>
                </div>
                <!-- Title -->
                <div class="h-[40px] space-y-1.5">
                  <div class="h-3 w-full bg-gray-200 rounded"></div>
                  <div class="h-3 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <!-- Stock info -->
                <div class="flex items-center mt-1">
                  <div class="w-2 h-2 rounded-full bg-gray-200 mr-2"></div>
                  <div class="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                <!-- Price and button -->
                <div class="flex items-end justify-between mt-2">
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
                {{
                  Number(
                    item?.product_prices?.ecom_discount_percentage,
                  ).toFixed(0)
                }}% off
              </p>
            </div>
            <nuxt-link
              :to="{ name: 'product-id', params: { id: item?.id } }"
              class="w-full block"
            >
              <!-- Image Container -->
              <div
                class="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 flex justify-center bg-white dark:bg-gray-800"
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
            <div class="p-2 md:px-2 md:pb-2">
              <nuxt-link
                :to="{ name: 'product-id', params: { id: item?.id } }"
                class="w-full block"
              >
                <div class="mb-1">
                  <span
                    class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-800 dark:text-blue-300 text-xs font-medium px-3 rounded-lg border border-blue-200 dark:border-blue-700"
                    :title="item?.category?.name"
                  >
                    {{ item?.category?.name }}
                  </span>
                </div>

                <h3
                  class="font-bold text-xs lg:text-sm text-gray-800 dark:text-gray-200 leading-tight transition-colors duration-300 h-[40px]"
                  :title="item?.name"
                >
                  {{ item?.name }}
                </h3>

                <!-- Stock Info and Price -->
                <div class="flex items-center">
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
                      <span class="dark:text-gray-200"
                        >( {{ formatNumber(stockQuantity(item)) }})</span
                      >
                    </span>
                    <span
                      v-else
                      class="text-[12px] font-medium text-red-600 dark:text-gray-200"
                      >Stock Out
                      <span class="dark:text-gray-200"
                        >( {{ formatNumber(stockQuantity(item)) }})</span
                      ></span
                    >
                  </div>
                </div>
              </nuxt-link>
              <div class="flex items-end justify-between">
                <nuxt-link
                  :to="{ name: 'product-id', params: { id: item?.id } }"
                  class="w-full block"
                >
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
                        Number(item?.product_prices?.selling_price).toFixed(2)
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
                </nuxt-link>

                <!-- btn -->
                <div class="">
                  <a-dropdown
                    :placement="bottomRight"
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
                      @click.stop="calculateStockQuantity(item)"
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
                        v-if="showCartQtyOverlayId == item?.id"
                        class="max-h-48 overflow-y-auto"
                        @mouseleave="clearStockQuantity"
                      >
                        <a-menu-item
                          v-for="i in no_of_available_pack"
                          :key="i"
                          @click="
                            handleAddToCart(
                              item,
                              i * (item?.product_prices?.pack_quantity || 1),
                              i,
                            )
                          "
                          :disabled="loadingItemId === item?.id"
                        >
                          <!-- Dynamically calculate the pack number and price -->
                          <span
                            class=""
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
                              "( " +
                              Number(i) +
                              item?.product_prices?.ecom_pack_name?.name +
                              " )"
                            }}
                            {{
                              item?.category?.name
                                .toLowerCase()
                                .includes("cap") ||
                              item?.category?.name.toLowerCase().includes("tab")
                                ? Number(item?.product_prices?.pack_quantity) *
                                  Number(i)
                                : Number(item?.product_prices?.pack_quantity)
                            }}
                            {{ item?.category?.name }}
                            <br />

                            {{
                              Number(
                                Number(i) *
                                  Number(
                                    item?.product_prices
                                      ?.ecom_final_selling_price,
                                  ) *
                                  Number(item?.product_prices?.pack_quantity),
                              ).toFixed(2)
                            }}
                            ৳
                          </span>
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>
            </div>
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
  </NuxtLayout>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import gif from "@/assets/images/Yellow.gif";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import slider_image from "@/assets/images/banner/slider-1.png";
import banner_small from "@/assets/images/banner/small-1.png";
import banner_small_2 from "@/assets/images/banner/small-2.png";

import { useCartStore } from "@/stores/cart";

// Products data
const allProduct = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(20);
const hasMore = ref(true);
const totalProducts = ref(0);
const infiniteScrollTrigger = ref(null);

// Add missing imports
import { ref, computed, onMounted, onUnmounted } from "vue";

import { storeToRefs } from "pinia";
import axios from "axios";
import { Icon } from "@iconify/vue";

const cartStore = useCartStore();
const { cartProduct } = storeToRefs(cartStore);
const { getCart } = cartStore;

const sliders = [{ image: slider_image }];
import default_img from "@/assets/images/default.jpg";
const modules = [Autoplay, Navigation];

import { apiBasePharma, formatNumber, imgBasePharma } from "@/config";

// Fetch products
const getAllProduct = async () => {
  if (loading.value || !hasMore.value) return;

  try {
    loading.value = true;

    const res = await axios.get(
      `${apiBasePharma}/products/best-selling-product?page=${currentPage.value}&paginate=${pageSize.value}`,
    );

    if (res.data) {
      const products = (res?.data?.data || []).map((p) => ({
        ...p,
        category: { name: p.category_name },
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
        allProduct.value = products;
      } else {
        allProduct.value = [...allProduct.value, ...products];
      }

      totalProducts.value = res.data.total || 0;
      hasMore.value = currentPage.value < (res.data.last_page || 1);
      currentPage.value++;
    }
  } catch (error) {
    loading.value = false;
  } finally {
    loading.value = false;
  }
};

// Calculate stock - cached per product via computed map
const stockMap = computed(() => {
  const map = {};
  for (const item of allProduct.value) {
    if (!item?.stock_batches?.length) {
      map[item.id] = 0;
    } else {
      map[item.id] =
        item.stock_batches.reduce(
          (sum, batch) => sum + parseFloat(batch.balanced_quantity || 0),
          0,
        ) || 0;
    }
  }
  return map;
});
const stockQuantity = (item) => stockMap.value[item?.id] ?? 0;

const no_of_available_pack = ref("");
const showCartQtyOverlayId = ref("");
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

// Intersection Observer for infinite scroll
let observer = null;

onMounted(async () => {
  await getAllProduct();

  // Set up intersection observer
  if (infiniteScrollTrigger.value) {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading.value && hasMore.value) {
          getAllProduct();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(infiniteScrollTrigger.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});

// Update handleAddToCart to also handle loading
const handleAddToCart = (products, quantity, singleQty) => {
  loadingItemId.value = products?.id;

  try {
    getCart(products, quantity, singleQty);
    // showNotification("success", `${products.name} added to cart!`);

    // Clear the dropdown after successful add
    clearStockQuantity();
    dropdownStates.value[products?.id] = false;
  } finally {
    loadingItemId.value = null;
  }
};
</script>

<style>
.swiper-button-next,
.swiper-button-prev {
  color: #ffffff !important;
}

@media (max-width: 768px) {
  .swiper-button-next,
  .swiper-button-prev {
    transform: scale(0.5) !important;
  }
}

.category-menu {
  width: 250px;
  border: 1px solid #ddd;
  background: white;
}

.category-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cat-item {
  padding: 8px 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  user-select: none;
}

.cat-item:hover {
  background: #f0f0f0;
}

.cat-item.selected {
  background: #e6f7ff;
  color: #1890ff;
}

.my-dropdown .ant-dropdown-menu {
  max-height: 280px !important;
  /* max-width: 200px !important; */
  overflow-y: auto !important;
  background-color: #ebf2f0 !important;
}
</style>
