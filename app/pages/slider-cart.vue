<template>
  <NuxtLayout>
    <div class="min-h-screen">
      <!-- Enhanced Breadcrumb -->
      <div class="bg-white dark:bg-gray-900">
        <div class="container mx-auto">
          <nav class="flex items-center space-x-2 text-sm">
            <nuxt-link
              to="/"
              class="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Icon class="w-4 h-4 mr-2" icon="mdi:home" />
              Home
            </nuxt-link>
            <Icon icon="mdi:chevron-right" class="w-4 h-4 text-gray-400" />
            <span class="text-gray-800 dark:text-gray-200 font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div class="mx-auto my-4 px-3 md:px-0">
        <!-- Page Header -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-8"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
            >
              <Icon icon="mdi:shopping-cart" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">My Shopping Cart</h1>
              <p class="text-sm text-gray-500">
                Review your items and proceed to checkout
              </p>
            </div>
          </div>
        </div>

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column: Cart Products -->
          <div class="lg:col-span-2">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <!-- Cart Header -->
              <div class="px-6 py-2 border-b border-gray-200 bg-gray-50">
                <h2
                  class="text-lg font-semibold text-gray-900 flex items-center"
                >
                  <Icon
                    icon="mdi:format-list-bulleted"
                    class="w-5 h-5 mr-2 text-gray-600"
                  />
                  Cart Items ({{ cartProduct.length }})
                </h2>
              </div>

              <!-- Empty Cart State -->
              <div v-if="cartProduct.length === 0" class="p-12 text-center">
                <div class="flex flex-col items-center space-y-4">
                  <div
                    class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center"
                  >
                    <Icon
                      icon="mdi:cart-outline"
                      class="w-10 h-10 text-gray-400"
                    />
                  </div>
                  <div>
                    <h3 class="text-xl font-medium text-gray-900 dark:text-gray-100">
                      Your cart is empty
                    </h3>
                    <p class="text-gray-500 mt-2">
                      Add some products to get started
                    </p>
                  </div>
                  <nuxt-link
                    to="/"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
                    Continue Shopping
                  </nuxt-link>
                </div>
              </div>

              <!-- Cart Items -->
              <div v-else class="divide-y divide-gray-200">
                <div
                  v-for="(product, index) in cartProduct"
                  :key="index"
                  class="p-2 transition-colors rounded-lg"
                >
                  <div class="flex items-start space-x-4">
                    <!-- Product Image -->
                    <div class="flex-shrink-0">
                      <div
                        class="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden"
                      >
                        <a-image
                          v-if="product?.product_images?.length > 0"
                          :width="80"
                          :height="80"
                          class="w-full h-full object-cover"
                          :src="`${imgBasePharma}/${product?.product_images[0]?.path}`"
                          :fallback="default_img"
                        />
                        <a-image
                          v-else-if="product?.path"
                          :width="80"
                          :height="80"
                          class="w-full h-full object-cover"
                          :src="`${imgBasePharma}/${product?.path}`"
                          :fallback="default_img"
                        />
                        <div
                          v-else
                          class="w-full h-full flex items-center justify-center"
                        >
                          <Icon
                            icon="mdi:image-off"
                            class="w-8 h-8 text-gray-400"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <!-- Product Name & Price -->
                        <div class="md:col-span-2">
                          <h3
                            class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate"
                            :title="product?.name"
                          >
                            {{
                              product?.name?.length > 30
                                ? product?.name?.slice(0, 30) + "..."
                                : product?.name
                            }}
                          </h3>

                          <p class="text-sm text-gray-500">
                            Available Qty :
                            {{
                              product?.stock_batches[0]?.balanced_quantity || 0
                            }}
                          </p>
                          <div class="flex items-center space-x-2">
                            <Icon
                              icon="mdi:currency-bdt"
                              class="w-4 h-4 text-gray-500"
                            />
                            <span class="text-lg font-semibold text-blue-600">
                              {{
                                Number(
                                  product?.product_prices?.selling_price
                                ).toFixed(2)
                              }}
                            </span>
                            <span class="text-sm text-gray-500">per unit</span>
                          </div>
                        </div>

                        <!-- Quantity Selector -->
                        <div class="flex flex-col space-y-2">
                          <label class="text-sm font-medium text-gray-700"
                            >Strip</label
                          >
                          <a-select
                            class="w-[180px] md:w-[200px]"
                            v-model:value="selectedQuantity"
                            placeholder="Select Quantity"
                            @change="
                              handleQuantityChange(product, selectedQuantity)
                            "
                          >
                            <a-select-option
                              v-for="i in Math.floor(
                                calculateStock(product) /
                                  (product?.product_prices?.pack_quantity || 1)
                              )"
                              :key="i"
                              :value="
                                i *
                                (product?.product_prices?.pack_quantity || 1)
                              "
                            >
                              {{ Number(i) }} x
                              {{
                                Number(product?.product_prices?.pack_quantity)
                              }}
                              {{ product?.category?.name }} - ৳
                              {{
                                Number(
                                  i *
                                    product?.product_prices?.selling_price *
                                    product?.product_prices?.pack_quantity
                                ).toFixed(0)
                              }}
                            </a-select-option>
                          </a-select>
                        </div>

                        <!-- Total & Actions -->
                        <div class="flex flex-col justify-between space-y-4">
                          <div class="text-right">
                            <div class="text-sm text-gray-500 mb-1">
                              Total Qty: {{ product.quantity }}
                            </div>
                            <div class="text-xl font-bold text-gray-900 dark:text-gray-100">
                              ৳{{ formatNumber(product?.total_price) }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- Remove Button -->
                    <div class="flex justify-end mt-2">
                      <a-popconfirm
                        title="Remove this item from cart?"
                        ok-text="Yes"
                        cancel-text="No"
                        @confirm="cartProduct.splice(index, 1)"
                      >
                        <button
                          class="inline-flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Icon icon="mdi:delete" class="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </a-popconfirm>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Cart Summary -->
          <div class="lg:col-span-1">
            <div
              class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-4"
            >
              <!-- Summary Header -->
              <div class="flex items-center space-x-3 mb-6">
                <Icon icon="mdi:calculator" class="w-6 h-6 text-blue-600" />
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Order Summary</h2>
              </div>

              <!-- Price Breakdown -->
              <div class="space-y-4 mb-6">
                <div
                  class="flex justify-between items-center py-2 border-b border-gray-200"
                >
                  <span class="text-gray-600">Subtotal:</span>
                  <span class="text-lg font-semibold text-gray-900">
                    ৳{{ formatNumber(total_price || 0) }}
                  </span>
                </div>

                <!-- <div
                  class="flex justify-between items-center py-2 border-b border-gray-200"
                >
                  <span class="text-gray-600">Shipping:</span>
                  <span class="text-lg font-semibold text-green-600">Free</span>
                </div> -->

                <div class="flex justify-between items-center pt-4">
                  <span class="text-lg font-bold text-gray-900">Total:</span>
                  <span class="text-2xl font-bold text-blue-600">
                    ৳{{ formatNumber(total_price || 0) }}
                  </span>
                </div>
              </div>

              <!-- Checkout Button -->
              <nuxt-link to="/checkout">
                <button
                  @click="checkoutHandler"
                  class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
                  :disabled="cartProduct.length === 0"
                  :class="{
                    'opacity-50 cursor-not-allowed': cartProduct.length === 0,
                  }"
                >
                  <Icon icon="mdi:credit-card" class="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>
              </nuxt-link>

              <!-- Continue Shopping -->
              <nuxt-link to="/">
                <button
                  class="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon icon="mdi:arrow-left" class="w-4 h-4" />
                  <span>Continue Shopping</span>
                </button>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useCartStore } from "@/stores/cart";
import { storeToRefs } from "pinia";
import default_img from "@/assets/images/Banner/default.jpg";
import { formatNumber, imgBasePharma } from "@/config";
import { showNotification } from "@/util/notification";
const cartStore = useCartStore();
const { cartProduct, total_price } = storeToRefs(cartStore);
const { calculateTotal } = cartStore;

const calculateStock = (item) => {
  if (!item?.stock_batches?.length) return 0;
  const stock = item?.stock_batches?.reduce((sum, batch) => {
    return sum + parseFloat(batch.balanced_quantity || 0);
  }, 0);
  return stock || 0;
};
const selectedQuantity = ref(null);
const handleQuantityChange = (product, selectedQuantity) => {
  let stock = calculateStock(product);

  if (selectedQuantity > stock) {
    showNotification(
      "error",
      `Only ${stock} items available in stock. Please select a lower quantity.`
    );
    return;
  }
  product.total_price = Number(selectedQuantity) * Number(product?.price || 0);
  product.quantity = Number(selectedQuantity);
  product.total_quantity = Number(selectedQuantity);

  calculateTotal();
};

const checkoutHandler = (e) => {
  if (total_price.value <= 0) {
    e.preventDefault();
    showNotification(
      "error",
      "Your cart is empty. Please add items to proceed to checkout."
    );
  }
};
</script>

<style scoped>
/* Custom input styling */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Button hover effects */
button {
  transition: all 0.2s ease-in-out;
}

/* Sticky summary positioning */
.sticky {
  position: sticky;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid.grid-cols-1.md\\:grid-cols-5 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
