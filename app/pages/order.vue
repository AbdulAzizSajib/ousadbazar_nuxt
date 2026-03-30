<template>
  <NuxtLayout>
    <section class="p-4 min-h-screen">
      <div class="container mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
          <div class="text-gray-500 flex items-center gap-4 justify-center">
            <icon class="size-4 animate-spin" icon="mdi-light:loading" />
            <p>Loading your orders...</p>
          </div>
        </div>

        <!-- Orders List -->
        <div v-else-if="orderData.length > 0" class="space-y-3">
          <!-- Mobile Cards View -->
          <div class="md:hidden space-y-3 mt-10">
            <div
              v-for="item in orderData"
              :key="item?.id"
              class="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <!-- v-if="item.verify_status === 1" -->

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
                    >{{ Math.round(item?.total) }} BD</span
                  >
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-600">Payment:</span>
                  <span
                    :class="
                      item?.paid_amount ? 'text-green-600' : 'text-red-600'
                    "
                    class="text-xs"
                  >
                    {{ item?.paid_amount ? "Paid" : "Unpaid" }}
                  </span>
                </div>

                <div class="flex justify-between items-center pt-2 border-t">
                  <span class="text-xs text-gray-600">{{
                    item?.payment_method?.name
                  }}</span>

                  <a-popconfirm
                    title="Cancel this order?"
                    :disabled="
                      item.verify_status == 1 || item.verify_status == 2
                    "
                    @confirm="handleCancel(item.id)"
                    placement="top"
                  >
                    <button
                      :disabled="
                        item.verify_status == 1 || item.verify_status == 2
                      "
                      class="px-3 py-1 rounded text-xs border transition-colors flex items-center gap-1"
                      :class="{
                        'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100':
                          item?.verify_status == 0 ||
                          item?.verify_status == null,
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
                      <Icon
                        v-if="
                          item?.verify_status == 0 ||
                          item?.verify_status == null
                        "
                        class="w-3 h-3"
                        icon="hugeicons:cancel-01"
                      />
                    </button>
                  </a-popconfirm>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Table View -->
          <div
            class="hidden md:block bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden"
          >
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
                  <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">
                    Total Amount
                  </th>
                  <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">
                    Payment Method
                  </th>
                  <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th class="text-left p-3 font-medium text-gray-700 dark:text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in orderData"
                  :key="item?.id"
                  class="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td class="p-3">
                    <router-link
                      v-if="
                        item.verify_status == 1 ||
                        item.verify_status == 0 ||
                        item?.verify_status == null
                      "
                      :to="{
                        path: `/order-tracking`,
                        query: { sale_code: item?.sale_code },
                      }"
                      class="text-blue-600 font-medium hover:underline"
                    >
                      #{{ item?.sale_code }}
                    </router-link>
                    <span
                      v-else
                      class="text-gray-400 font-medium text-sm cursor-not-allowed"
                    >
                      #{{ item?.sale_code }}
                    </span>
                  </td>

                  <td class="p-3 text-gray-600">
                    {{ formatDate(item?.sale_date) }}
                  </td>

                  <td class="p-3">
                    <div class="text-xs text-gray-700 space-y-1 max-w-xs">
                      <div
                        v-for="(
                          productItem, index
                        ) in item?.sale_products.slice(0, 3)"
                        :key="index"
                      >
                        {{ productItem?.product_name }}
                      </div>
                      <div
                        v-if="item?.sale_products.length > 3"
                        class="text-gray-500"
                      >
                        +{{ item?.sale_products.length - 3 }} more...
                      </div>
                    </div>
                  </td>

                  <td class="p-3 font-medium">
                    {{ Math.round(item?.total) }} ৳
                  </td>

                  <td class="p-3 text-xs text-gray-600">
                    {{ item?.payment_method?.name }}
                  </td>

                  <td class="p-3">
                    <span
                      :class="
                        item?.paid_amount === '0.0'
                          ? 'text-red-600 bg-red-50'
                          : 'text-green-600 bg-green-50'
                      "
                      class="text-xs px-2 py-1 rounded"
                    >
                      {{ item?.paid_amount === "0.0" ? "UnPaid" : "paid" }}
                    </span>
                  </td>

                  <td class="p-3">
                    <a-popconfirm
                      title="Cancel this order?"
                      :disabled="
                        item.verify_status == 1 || item.verify_status == 2
                      "
                      @confirm="handleCancel(item.id)"
                      placement="top"
                    >
                      <button
                        :disabled="
                          item.verify_status == 1 || item.verify_status == 2
                        "
                        class="px-3 py-1 rounded text-xs border transition-colors flex items-center gap-1"
                        :class="{
                          'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100':
                            item?.verify_status == 0 ||
                            item?.verify_status == null,
                          'bg-green-50 text-green-700 border-green-200 cursor-not-allowed':
                            item?.verify_status == 1,
                          'bg-red-50 text-red-700 border-red-200 cursor-not-allowed':
                            item?.verify_status == 2,
                        }"
                      >
                        {{
                          item?.verify_status == 0 ||
                          item?.verify_status == null
                            ? "Order Pending"
                            : item?.verify_status == 1
                            ? "Order Confirmed"
                            : "Order Cancelled"
                        }}
                        <Icon
                          v-if="
                            item?.verify_status == 0 ||
                            item?.verify_status == null
                          "
                          class="w-3 h-3"
                          icon="hugeicons:cancel-01"
                        />
                      </button>
                    </a-popconfirm>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-start pt-4">
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
        <div v-else class="text-center py-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg p-8">
            <div class="text-gray-400 mb-2 flex justify-center item-center">
              <img :src="onOrder" alt="" />
            </div>
            <h3 class="text-lg font-medium text-gray-600 mb-1">
              No Orders Yet
            </h3>
            <p class="text-sm text-gray-500 mb-4">
              You haven't placed any orders
            </p>
            <router-link
              to="/"
              class="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup>
import { apiBasePharma, getTokenConfig } from "@/config";
import axios from "axios";
import onOrder from "../../assets/images/noOrder.webp";
import { Icon } from "@iconify/vue";
import { showNotification } from "@/util/notification";

const loading = ref(false);
const orderData = ref([]);
const backupData = ref();
const currentPage = ref(1);
const pageSize = ref(15);

const paginationInfo = ref();

const getOrderInfo = async () => {
  try {
    loading.value = true;
    const res = await axios.get(
      `${apiBasePharma}/all-order-list-paginated?page=${currentPage.value}&search=&paginate=${pageSize.value}`,
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
  await getOrderInfo();
});
</script>

<style lang="scss" scoped></style>
