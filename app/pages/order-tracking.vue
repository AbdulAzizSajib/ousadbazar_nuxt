<template>
  <NuxtLayout>
    <section class="min-h-screen bg-gray-50 py-8">
      <div class="container mx-auto px-4 max-w-2xl">
        <!-- Search Section -->
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-1">
            Track Your Order
          </h1>
          <p class="text-sm text-gray-500">
            Enter your order code to check the delivery status
          </p>
        </div>

        <!-- Search Form -->
        <form @submit.prevent="trackOrder()" class="flex gap-3 mb-8">
          <input
            type="text"
            class="flex-1 px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#388072] transition-colors placeholder-gray-400"
            placeholder="e.g. 2602224134"
            v-model="sale_code"
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
            <span>{{ isLoading ? "Tracking..." : "Track" }}</span>
          </button>
        </form>

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
          <h3 class="text-lg font-bold text-gray-800 mb-2">Order Not Found</h3>
          <p class="text-sm text-gray-500 mb-5">
            We couldn't find any order with that code. Please double-check and
            try again.
          </p>
          <button
            @click="sale_code = ''; errorMsg = '';"
            class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#388072] text-white text-sm font-semibold rounded-xl hover:bg-[#2d6960] transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
              />
            </svg>
            Try Again
          </button>
        </div>

        <!-- Order Results -->
        <div v-if="!isLoading && orderStatus" class="space-y-5 animate-fade-in">
          <!-- Order Info Header -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div
              class="bg-[#388072] px-5 py-4 flex items-center justify-between"
            >
              <div>
                <p
                  class="text-white/70 text-xs font-medium uppercase tracking-wider"
                >
                  Order Code
                </p>
                <p class="text-white text-lg font-bold">
                  #{{ orderStatus.sale_code }}
                </p>
              </div>
              <div class="text-right">
                <p
                  class="text-white/70 text-xs font-medium uppercase tracking-wider"
                >
                  Order Date
                </p>
                <p class="text-white text-sm font-semibold">
                  {{ formatDate(orderStatus.sale_date) }}
                </p>
              </div>
            </div>

            <!-- Status Badge -->
            <div
              class="px-5 py-4 flex items-center justify-between border-b border-gray-100"
            >
              <span class="text-sm text-gray-500">Current Status</span>
              <span
                :class="getStatusBadgeClass(orderStatus.delivery_status)"
                class="px-3 py-1 rounded-full text-xs font-semibold"
              >
                {{ getStatusText(orderStatus.delivery_status) }}
              </span>
            </div>

            <!-- Payment & Total -->
            <div
              class="px-5 py-3 flex items-center justify-between border-b border-gray-100"
            >
              <span class="text-sm text-gray-500">Payment</span>
              <span class="text-sm font-medium text-gray-700">
                {{ orderStatus.payment_method?.name }}
              </span>
            </div>
            <div class="px-5 py-3 flex items-center justify-between">
              <span class="text-sm text-gray-500">Total Amount</span>
              <span class="text-lg font-bold text-[#388072]">
                ৳ {{ Number(orderStatus.total).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Progress Timeline -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <h3
              class="text-sm font-semibold text-gray-700 mb-5 uppercase tracking-wider"
            >
              Delivery Progress
            </h3>
            <div class="flex items-center justify-between">
              <template v-for="(step, index) in steps" :key="index">
                <!-- Step -->
                <div class="flex flex-col items-center" style="min-width: 60px">
                  <div
                    :class="[
                      'w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300',
                      index <= getCurrentStep()
                        ? 'bg-[#388072] text-white shadow-md shadow-[#388072]/30'
                        : 'bg-gray-100 text-gray-400',
                    ]"
                  >
                    <svg
                      v-if="index < getCurrentStep()"
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span v-else class="text-xs font-bold">{{
                      index + 1
                    }}</span>
                  </div>
                  <p
                    class="mt-2 text-[10px] font-medium text-center leading-tight"
                    :class="
                      index <= getCurrentStep()
                        ? 'text-[#388072]'
                        : 'text-gray-400'
                    "
                  >
                    {{ step }}
                  </p>
                </div>
                <!-- Connector Line -->
                <div
                  v-if="index < steps.length - 1"
                  class="flex-1 h-[3px] mx-1 rounded-full transition-all duration-500"
                  :class="
                    index < getCurrentStep() ? 'bg-[#388072]' : 'bg-gray-200'
                  "
                ></div>
              </template>
            </div>
          </div>

          <!-- Products List -->
          <div
            class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div class="px-5 py-4 border-b border-gray-100">
              <h3
                class="text-sm font-semibold text-gray-700 uppercase tracking-wider"
              >
                Ordered Items ({{ orderStatus.sale_products?.length }})
              </h3>
            </div>

            <div class="divide-y divide-gray-50">
              <div
                v-for="product in orderStatus.sale_products"
                :key="product.id"
                class="px-5 py-3 flex items-center justify-between"
              >
                <div class="flex-1 min-w-0 mr-3">
                  <p class="text-sm font-medium text-gray-800 truncate">
                    {{ product.product_name }}
                  </p>
                  <p class="text-xs text-gray-400 mt-0.5">
                    Qty: {{ product.total_quantity }} | ৳{{
                      Number(product.ecom_final_selling_price).toFixed(2)
                    }}/unit
                    <span class="text-[#388072] font-medium">
                      ({{
                        Number(product.ecom_discount_percentage).toFixed(0)
                      }}% off)
                    </span>
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
              class="px-5 py-4 bg-[#388072]/5 flex items-center justify-between"
            >
              <span class="text-sm font-bold text-gray-700">Total</span>
              <span class="text-lg font-bold text-[#388072]">
                ৳ {{ Number(orderStatus.total).toFixed(2) }}
              </span>
            </div>
          </div>

          <!-- Shipping Address -->
          <div
            v-if="orderStatus.billing_address"
            class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
          >
            <h3
              class="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3"
            >
              Shipping Address
            </h3>
            <div class="flex items-start gap-3">
              <div
                class="w-8 h-8 rounded-full bg-[#388072]/10 flex items-center justify-center flex-shrink-0 mt-0.5"
              >
                <svg
                  class="w-4 h-4 text-[#388072]"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800">
                  {{ orderStatus.billing_address.full_name }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ orderStatus.billing_address.address }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ orderStatus.billing_address.mobile }}
                </p>
              </div>
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

const route = useRoute();

const sale_code = ref(route.query.sale_code || "");
const orderStatus = ref(null);
const isLoading = ref(false);
const errorMsg = ref("");

const steps = ["Order Placed", "Store Arrived", "On The Way", "Delivered"];

const trackOrder = async () => {
  if (!sale_code.value.trim()) return;
  try {
    errorMsg.value = "";
    isLoading.value = true;
    const res = await axios.get(
      `${apiBasePharma}/order/order-tracking?sale_code=${sale_code.value.trim()}`,
    );
    if (res.data?.status === "error") {
      orderStatus.value = null;
      errorMsg.value = res.data?.message || "Order not found. Please check your order code.";
    } else {
      orderStatus.value = res.data;
    }
  } catch (error) {
    orderStatus.value = null;
    errorMsg.value = "Something went wrong. Please try again.";
    console.error("Error fetching order data:", error.message);
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

const getStatusText = (status) => {
  const statusMap = {
    null: "Processing",
    1: "Store Arrived",
    2: "On The Way",
    3: "Delivered",
    4: "Not Reachable",
    5: "Not Received",
  };
  return statusMap[status] || "Processing";
};

const getStatusBadgeClass = (status) => {
  const classMap = {
    null: "bg-blue-50 text-blue-600",
    1: "bg-yellow-50 text-yellow-600",
    2: "bg-orange-50 text-orange-600",
    3: "bg-green-50 text-green-600",
    4: "bg-red-50 text-red-600",
    5: "bg-red-50 text-red-600",
  };
  return classMap[status] || "bg-blue-50 text-blue-600";
};

const getCurrentStep = () => {
  const stepMap = { null: 0, 1: 1, 2: 2, 3: 3, 4: 2, 5: 2 };
  return stepMap[orderStatus.value?.delivery_status] ?? 0;
};

onMounted(async () => {
  if (sale_code.value) {
    await trackOrder();
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
