<template>
  <NuxtLayout>
    <section class="w-full min-h-screen py-6 px-3 md:px-0">
      <!-- Results Info -->
      <div
        v-if="
          searchStore.searchQuery &&
          !searchStore.searchLoading &&
          searchStore.hasSearched
        "
        class="mb-4"
      >
        <h2 class="text-lg text-gray-700">
          Showing results for
          <span class="font-bold text-gray-900"
            >"{{ searchStore.searchQuery }}"</span
          >
          <span class="text-sm text-gray-500 ml-2"
            >({{ searchStore.searchData.length }} items found)</span
          >
        </h2>
      </div>

      <!-- Loading Skeleton -->
      <div
        v-if="searchStore.searchLoading"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
      >
        <div
          v-for="n in 10"
          :key="'skeleton-' + n"
          class="bg-white border rounded-lg overflow-hidden animate-pulse"
        >
          <div class="w-full h-[180px] bg-gray-200"></div>
          <div class="p-3 space-y-2">
            <div class="h-4 w-20 bg-gray-200 rounded"></div>
            <div class="h-4 w-full bg-gray-200 rounded"></div>
            <div class="h-4 w-3/4 bg-gray-200 rounded"></div>
            <div class="flex justify-between items-center mt-2">
              <div class="h-5 w-16 bg-gray-200 rounded"></div>
              <div class="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Results Grid -->
      <div
        v-if="!searchStore.searchLoading && searchStore.searchData.length > 0"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 capitalize"
      >
        <div
          v-for="item in searchStore.searchData"
          :key="item.id"
          class="group bg-white border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg relative"
        >
          <!-- Discount Badge -->
          <div
            v-if="
              item?.product_prices?.ecom_discount_percentage &&
              item?.product_prices?.selling_price !==
                item?.product_prices?.ecom_discount_percentage
            "
            class="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 rounded-lg text-xs font-semibold z-10"
          >
            {{ item?.product_prices?.ecom_discount_percentage }}% off
          </div>

          <!-- Product Image -->
          <nuxt-link :to="`/product/${item?.id}`" class="block">
            <div
              class="relative overflow-hidden bg-gray-50 flex justify-center items-center h-[180px]"
            >
              <a-image
                v-if="item?.product_images?.length > 0"
                :width="180"
                :height="180"
                loading="lazy"
                :src="`${imgBasePharma}/${item?.product_images[0]?.path}`"
                :fallback="default_img"
                class="object-cover"
              />
              <a-image
                v-else-if="item?.path"
                :width="180"
                :height="180"
                loading="lazy"
                :src="`${imgBasePharma}/${item?.path}`"
                :fallback="default_img"
                class="object-cover"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center"
              >
                <Icon
                  icon="hugeicons:image-not-found-01"
                  class="w-12 h-12 text-gray-300"
                />
              </div>
            </div>
          </nuxt-link>

          <!-- Product Info -->
          <div class="p-3">
            <!-- Category -->
            <div class="mb-2">
              <span
                class="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-lg border border-blue-200"
              >
                {{ item?.category?.name }}
              </span>
            </div>

            <!-- Name -->
            <nuxt-link :to="`/product/${item?.id}`">
              <h3
                class="font-bold text-xs lg:text-sm text-gray-800 mb-2 line-clamp-2 leading-tight group-hover:text-[#388072] transition-colors h-[40px]"
                :title="item?.name"
              >
                {{ item?.name }}
              </h3>
            </nuxt-link>

            <!-- Supplier -->
            <p class="text-xs text-gray-400 truncate mb-2">
              {{ item?.supplier?.company_name }}
            </p>

            <!-- Stock Info -->
            <div class="flex items-center mb-2">
              <div
                class="w-2 h-2 rounded-full mr-2"
                :class="{
                  'bg-[#388072]': stockQuantity(item) > 0,
                  'bg-red-600': stockQuantity(item) <= 0,
                }"
              ></div>
              <span
                v-if="stockQuantity(item) > 0"
                class="text-xs font-medium text-gray-600"
              >
                In Stock ({{ formatNumber(stockQuantity(item)) }})
              </span>
              <span v-else class="text-xs font-medium text-red-600">
                Stock Out
              </span>
            </div>

            <!-- Price & Add Button -->
            <div class="flex items-end justify-between">
              <div class="flex flex-col">
                <span
                  v-if="
                    item?.product_prices?.selling_price &&
                    Number(item?.product_prices?.selling_price) !==
                      Number(item?.product_prices?.ecom_final_selling_price)
                  "
                  class="text-xs text-gray-400 line-through"
                >
                  {{ Number(item?.product_prices?.selling_price).toFixed(2) }} ৳
                </span>
                <span class="text-sm font-bold text-gray-900">
                  {{
                    Number(
                      item?.product_prices?.ecom_final_selling_price,
                    ).toFixed(2)
                  }}
                  ৳
                </span>
              </div>

              <a-dropdown
                :trigger="['click']"
                v-model:open="dropdownStates[item?.id]"
                placement="bottom"
              >
                <button
                  :class="{
                    'opacity-50 cursor-not-allowed':
                      stockQuantity(item) <
                      item?.product_prices?.pack_quantity,
                  }"
                  :disabled="
                    stockQuantity(item) < item?.product_prices?.pack_quantity
                  "
                  type="button"
                  class="bg-[#388072] px-4 py-1.5 text-white rounded text-xs font-medium hover:bg-[#2d6a5a] transition-colors"
                  @click.prevent="calculateStockQuantity(item)"
                >
                  <Icon
                    class="animate-spin size-4"
                    v-if="loadingItemId === item?.id"
                    icon="mingcute:loading-line"
                  />
                  <span v-else>Add</span>
                </button>

                <template #overlay>
                  <a-menu
                    class="max-h-48 overflow-y-auto"
                    v-if="showCartQtyOverlayId === item?.id"
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
                    >
                      <span class="text-xs">
                        {{
                          '(' +
                          Number(i) +
                          ' ' +
                          (item?.product_prices?.ecom_pack_name?.name ||
                            'Pcs') +
                          ')'
                        }}
                        {{
                          Number(item?.product_prices?.pack_quantity || 1) *
                          Number(i)
                        }}
                        {{ item?.category?.name }} - ৳
                        {{
                          Number(
                            Number(i) *
                              Number(
                                item?.product_prices?.ecom_final_selling_price,
                              ) *
                              Number(item?.product_prices?.pack_quantity || 1),
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
      </div>

      <!-- No Results -->
      <div
        v-if="
          !searchStore.searchLoading &&
          searchStore.searchData.length === 0 &&
          searchStore.hasSearched
        "
        class="flex flex-col items-center justify-center py-20"
      >
        <Icon
          icon="mdi:magnify-close"
          class="w-16 h-16 text-gray-300 mb-4"
        />
        <p class="text-lg text-gray-500">No products found</p>
        <p class="text-sm text-gray-400 mt-1">Try a different search term</p>
      </div>

      <!-- Initial State -->
      <div
        v-if="!searchStore.searchLoading && !searchStore.hasSearched"
        class="flex flex-col items-center justify-center py-20"
      >
        <Icon
          icon="mingcute:search-line"
          class="w-16 h-16 text-gray-300 mb-4"
        />
        <p class="text-lg text-gray-500">Search for products</p>
        <p class="text-sm text-gray-400 mt-1">
          Type a product name to get started
        </p>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";
import { formatNumber, imgBasePharma } from "@/config";
import default_img from "@/assets/images/default.jpg";
import { useCartStore } from "@/stores/cart";
import { useSearchStore } from "@/stores/search";

const route = useRoute();
const cartStore = useCartStore();
const { getCart } = cartStore;
const searchStore = useSearchStore();

// Cart related
const loadingItemId = ref(null);
const dropdownStates = ref({});
const no_of_available_pack = ref("");
const showCartQtyOverlayId = ref("");

const stockQuantity = (item) => {
  if (!item?.stock_batches?.length) return 0;
  return item.stock_batches.reduce(
    (sum, batch) => sum + parseFloat(batch.balanced_quantity || 0),
    0,
  );
};

const calculateStockQuantity = (item) => {
  showCartQtyOverlayId.value = "";
  no_of_available_pack.value = "";
  const stock = stockQuantity(item);
  no_of_available_pack.value = Math.floor(
    stock / (item?.product_prices?.pack_quantity || 1),
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

const handleAddToCart = (products, quantity, i) => {
  loadingItemId.value = products?.id;
  try {
    getCart(products, quantity, i);
    clearStockQuantity();
    dropdownStates.value[products?.id] = false;
  } finally {
    loadingItemId.value = null;
  }
};

onMounted(() => {
  const q = route.query.q;
  if (q) {
    searchStore.search(q);
  }
});
</script>
