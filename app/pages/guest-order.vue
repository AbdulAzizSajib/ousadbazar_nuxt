<template>
  <NuxtLayout>
    <section class="p-4 min-h-screen">
      <!-- Search Section -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
        <h2 class="text-lg font-medium mb-3 text-gray-800 dark:text-gray-100">
          Enter your mobile number to find your orders
        </h2>
        <div class="flex gap-3">
          <input
            @input="onlyNumber"
            type="tel"
            v-model="mobile"
            placeholder="Enter mobile number"
            class="w-1/2 px-4 py-1 border border-[#388072] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#388072] focus:border-green-400 transition"
            :class="{ 'border-red-400': !isValidMobile && mobile }"
            @keyup.enter="getOrderInfo"
          />
          <button
            @click="getOrderInfo"
            class="bg-[#388072] text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            :disabled="!isValidMobile || loading"
            :class="{
              'opacity-50 cursor-not-allowed': !isValidMobile || loading,
            }"
          >
            <!-- Show logo when loading -->
            <Icon
              v-if="loading"
              icon="mdi:loading"
              class="w-5 h-5 inline mr-2 animate-spin"
            />
            <!-- Show the text -->
            <span>{{ loading ? "Searching..." : "Search" }}</span>
          </button>
        </div>
        <p v-if="!isValidMobile && mobile" class="text-red-500 text-xs mt-1">
          {{ validationError }}
        </p>
      </div>

      <!-- Orders List -->
      <div v-if="orderData.length > 0" class="space-y-3">
        <h3 class="text-lg font-medium text-gray-800">Your Orders</h3>

        <!-- Mobile Cards View -->
        <div class="md:hidden space-y-3">
          <div
            v-for="item in orderData"
            :key="item?.id"
            class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4"
          >
            <div class="flex justify-between items-start mb-2">
              <router-link
                :to="{
                  path: `/order-tracking`,
                  query: { sale_code: item?.sale_code },
                }"
                class="text-blue-600 font-medium text-sm"
              >
                #{{ item?.sale_code }}
              </router-link>
              <span class="text-xs text-gray-500">{{
                formatDate(item?.sale_date)
              }}</span>
            </div>

            <div class="space-y-2 text-sm">
              <div>
                <span class="text-gray-600">Products:</span>
                <div class="text-xs text-gray-700 mt-1">
                  <span
                    v-for="(productItem, index) in item?.sale_products"
                    :key="index"
                    class="block"
                  >
                    • {{ productItem?.product_name }}
                  </span>
                </div>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600">Total:</span>
                <span class="font-medium"
                  >{{ Math.round(item?.total) }} BDT</span
                >
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600">Payment:</span>
                <span
                  :class="
                    item?.paid_amount === '0.0'
                      ? 'text-red-600'
                      : 'text-green-600'
                  "
                >
                  {{ item?.paid_amount === "0.0" ? "UnPaid" : "paid" }}
                </span>
              </div>

              <div class="flex justify-between items-center pt-2">
                <span class="text-xs text-gray-600">{{
                  item?.payment_method?.name
                }}</span>

                <button
                  :disabled="item.verify_status == 1 || item.verify_status == 2"
                  class="px-3 py-1 rounded text-xs border transition-colors"
                  :class="{
                    'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100':
                      item?.verify_status == 0 || item?.verify_status == null,
                    'bg-green-50 text-green-700 border-green-200 cursor-not-allowed':
                      item?.verify_status == 1,
                    'bg-red-50 text-red-700 border-red-200 cursor-not-allowed':
                      item?.verify_status == 2,
                  }"
                >
                  {{
                    item?.verify_status == 0 || item?.verify_status == null
                      ? "Pending"
                      : item?.verify_status == 1
                      ? "Confirmed"
                      : "Cancelled"
                  }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden md:block bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">
                  Track Order ID
                </th>
                <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Date</th>
                <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">
                  Products
                </th>
                <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Total</th>
                <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Payment</th>
                <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="loading">
                <td colspan="6" class="text-center p-6 text-gray-500">
                  Loading orders...
                </td>
              </tr>

              <tr
                v-for="item in orderData"
                :key="item?.id"
                class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="p-3">
                  <router-link
                    :to="{
                      path: `/order-tracking`,
                      query: { sale_code: item?.sale_code },
                    }"
                    class="text-blue-600 font-medium hover:underline"
                  >
                    #{{ item?.sale_code }}
                  </router-link>
                </td>

                <td class="p-3 text-gray-600">
                  {{ formatDate(item?.sale_date) }}
                </td>

                <td class="p-3">
                  <div class="text-xs text-gray-700 space-y-1">
                    <div
                      v-for="(productItem, index) in item?.sale_products"
                      :key="index"
                    >
                      {{ productItem?.product_name }}
                    </div>
                  </div>
                </td>

                <td class="p-3 font-medium">
                  {{ Math.round(item?.total) }} BDT
                </td>

                <td class="p-3">
                  <div class="space-y-1">
                    <div class="text-xs text-gray-600">
                      {{ item?.payment_method?.name }}
                    </div>
                    <span
                      :class="
                        item?.paid_amount === '0.0'
                          ? 'text-red-600'
                          : 'text-green-600'
                      "
                      class="text-xs"
                    >
                      {{ item?.paid_amount === "0.0" ? "UnPaid" : "paid" }}
                    </span>
                  </div>
                </td>

                <td class="p-3">
                  <button
                    class="px-3 py-1 rounded text-xs border transition-colors flex items-center gap-1"
                    :class="{
                      'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100':
                        item?.verify_status == 0 || item?.verify_status == null,
                      'bg-green-50 text-green-700 border-green-200 cursor-not-allowed':
                        item?.verify_status == 1,
                      'bg-red-50 text-red-700 border-red-200 cursor-not-allowed':
                        item?.verify_status == 2,
                    }"
                  >
                    {{
                      item?.verify_status == 0 || item?.verify_status == null
                        ? "Pending"
                        : item?.verify_status == 1
                        ? "Confirmed"
                        : "Cancelled"
                    }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center pt-4">
          <a-pagination
            v-model:current="currentPage"
            :total="backupData?.total"
            :show-size-changer="false"
            v-model:pageSize="pageSize"
            :show-total="(total) => `${total} orders`"
            @change="pagination"
            size="small"
            class="text-sm"
          />
        </div>
      </div>

      <!-- No Orders State -->
      <div v-else-if="!loading" class="text-center py-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-8">
          <div class="text-gray-400 mb-2 flex item-center justify-center">
            <img :src="onOrder" alt="" />
          </div>
          <h3 class="text-lg font-medium text-gray-600 mb-1">
            No Orders Found
          </h3>
          <p class="text-sm text-gray-500">
            Enter your mobile number to find your orders
          </p>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { apiBasePharma, getTokenConfig } from "@/config";
import axios from "axios";
import { Icon } from "@iconify/vue";
import onOrder from "../../assets/images/noOrder.webp";
import { showNotification } from "@/util/notification";

const loading = ref(false);
const orderData = ref([]);
const backupData = ref();
const currentPage = ref(1);
const pageSize = ref(15);

const paginationInfo = ref();
const mobile = ref("");
const validationError = ref("");

// Enhanced validation function
const validateMobile = (value) => {
  // const cleanedValue = value.trim;
  const cleanedValue = String(value ?? "").trim();

  if (!cleanedValue) {
    return "Mobile number is required";
  }

  if (!cleanedValue.startsWith("01")) {
    return "Mobile number must start with 01";
  }

  if (!/^\d+$/.test(cleanedValue)) {
    return "Mobile number must contain only digits";
  }

  if (cleanedValue.length > 11) {
    return "Mobile number cannot exceed 11 digits";
  }

  if (cleanedValue.length < 11) {
    return "Mobile number must be 11 digits";
  }

  return "";
};

const isValidMobile = computed(() => {
  validationError.value = validateMobile(mobile.value);
  return validationError.value === "";
});

const onlyNumber = (e) => {
  let inputValue = e.target.value.replace(/\D/g, ""); // remove non-digits
  if (inputValue.length > 11) {
    inputValue = inputValue.slice(0, 11); // limit to 11 digits
  }
  mobile.value = inputValue; // sync with v-model
};

const getOrderInfo = async () => {
  if (!isValidMobile.value) {
    showNotification(
      "warning",
      validationError.value || "Please enter a valid mobile number"
    );
    return;
  }
  try {
    loading.value = true;
    const res = await axios.get(
      `${apiBasePharma}/all-guest-order-list-paginated?page=${currentPage.value}&search=&paginate=${pageSize.value}&mobile=${mobile.value}`,
      getTokenConfig()
    );
    loading.value = false;

    orderData.value = res?.data?.data;
    backupData.value = res.data;

    console.log(paginationInfo.value);
  } catch (error) {
    loading.value = false;
    console.log(error.message);
  }
};

const pagination = async (page) => {
  currentPage.value = page;
  await getOrderInfo();
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${day}-${month}-${year}`;
};

const handleCancel = async (id) => {
  try {
    const res = await axios.post(
      `${apiBasePharma}/sale/request-to-suspend/${id}`
    );
    if (res.data) {
      showNotification("success", res.data.message);
      await getOrderInfo();
    }
  } catch (error) {
    console.log(error.message);
  }
};

onMounted(async () => {
  // await getOrderInfo();
});
</script>

<style lang="scss" scoped></style>
