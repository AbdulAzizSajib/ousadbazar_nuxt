<template>
  <NuxtLayout>
    <section class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-2xl">
        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#388072]/10 mb-4"
          >
            <svg
              class="w-8 h-8 text-[#388072]"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-1">Order History</h1>
          <p class="text-sm text-gray-500">
            Enter your phone number to view your past orders
          </p>
        </div>

        <!-- Search Form -->
        <form @submit.prevent="fetchHistory()" class="flex gap-3 mb-8">
          <input
            type="tel"
            class="flex-1 px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#388072] transition-colors placeholder-gray-400"
            placeholder="e.g. 01XXXXXXXXX"
            v-model="phone"
            required
          />
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-[#388072] hover:bg-[#2d6960] text-white font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
          >
            <svg
              v-if="isLoading"
              class="animate-spin w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{{ isLoading ? "Loading..." : "Search" }}</span>
          </button>
        </form>

        <!-- Empty State -->
        <div
          v-if="searched && !isLoading && orders.length === 0"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-fade-in"
        >
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-5"
          >
            <svg
              class="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">No Orders Found</h3>
          <p class="text-sm text-gray-500">
            We couldn't find any orders for this phone number.
          </p>
        </div>

        <!-- Error State -->
        <div
          v-if="errorMsg"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center animate-fade-in"
        >
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-5"
          >
            <svg
              class="w-10 h-10 text-red-400"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">
            Something Went Wrong
          </h3>
          <p class="text-sm text-gray-500 mb-5">{{ errorMsg }}</p>
          <button
            @click="errorMsg = ''"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#388072] text-white text-sm font-semibold rounded-xl hover:bg-[#2d6960] transition-colors"
          >
            Try Again
          </button>
        </div>

        <!-- Orders List -->
        <div
          v-if="!isLoading && orders.length > 0"
          class="space-y-4 animate-fade-in"
        >
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <!-- Order Header -->
            <div
              class="bg-[#388072] px-5 py-3 flex items-center justify-between"
            >
              <div>
                <p
                  class="text-white/70 text-xs font-medium uppercase tracking-wider"
                >
                  Order Code
                </p>
                <p class="text-white text-lg font-bold">
                  #{{ order.sale_code }}
                </p>
              </div>
              <div class="text-right">
                <p
                  class="text-white/70 text-xs font-medium uppercase tracking-wider"
                >
                  Order Date
                </p>
                <p class="text-white text-sm font-semibold">
                  {{ formatDate(order.created_at) }}
                </p>
              </div>
            </div>

            <!-- Products -->
            <div class="divide-y divide-gray-50">
              <div
                v-for="product in order.products"
                :key="product.product_id"
                class="px-5 py-3 flex items-center justify-between"
              >
                <div class="flex-1 min-w-0 mr-3">
                  <p class="text-sm font-medium text-gray-800 truncate">
                    {{ product.name }}
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Qty: {{ product.quantity }} × ৳{{
                      Number(product.price).toFixed(2)
                    }}
                  </p>
                </div>
                <p
                  class="text-sm font-semibold text-gray-800 whitespace-nowrap"
                >
                  ৳ {{ Number(product.total).toFixed(2) }}
                </p>
              </div>
            </div>

            <!-- Total -->
            <div
              class="px-5 py-3 bg-[#388072]/5 flex items-center justify-between border-t border-gray-100"
            >
              <span class="text-sm font-bold text-gray-700">Total</span>
              <span class="text-lg font-bold text-[#388072]">
                ৳ {{ Number(order.total).toFixed(2) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { apiBasePharma } from "@/config";
import axios from "axios";

const phone = ref(localStorage.getItem("mobile")?.replace(/^88/, "") || "");
const orders = ref([]);
const isLoading = ref(false);
const errorMsg = ref("");
const searched = ref(false);

const fetchHistory = async () => {
  if (!phone.value.trim()) return;
  try {
    errorMsg.value = "";
    isLoading.value = true;
    searched.value = true;

    const fullPhone = phone.value.startsWith("88")
      ? phone.value.trim()
      : `88${phone.value.trim()}`;

    const res = await axios.get(
      `${apiBasePharma}/order/history?phone=${fullPhone}`,
    );
    orders.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    orders.value = [];
    errorMsg.value = "Something went wrong. Please try again.";
    console.error("Error fetching order history:", error.message);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

onMounted(() => {
  if (phone.value) {
    fetchHistory();
  }
});
</script>

<style lang="scss" scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
