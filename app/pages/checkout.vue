<template>
  <NuxtLayout>
    <div class="min-h-screen py-6">
      <div class="max-w-2xl mx-auto px-4 md:px-0">
        <!-- Billing Details -->
        <section class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-5 border-b pb-3">
            Billing details
          </h2>

          <div class="space-y-4">
            <!-- Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Your Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                class="w-full bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-[#388072] focus:border-[#388072] outline-none transition"
                placeholder="আপনার নাম"
                v-model="address.full_name"
              />
            </div>

            <!-- Country -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Country / Region <span class="text-red-500">*</span>
              </label>
              <p class="font-semibold text-gray-900">Bangladesh</p>
            </div>

            <!-- Address -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Your Full Address <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                class="w-full bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-[#388072] focus:border-[#388072] outline-none transition"
                placeholder="আপনার পূর্ণ ঠিকানা"
                v-model="address.address"
                :readonly="!!storedUser"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Your Phone Number <span class="text-red-500">*</span>
              </label>
              <input
                @input="onlyNumber"
                type="tel"
                class="w-full bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-[#388072] focus:border-[#388072] outline-none transition"
                :class="{
                  'border-red-400 focus:ring-red-400 focus:border-red-400':
                    !isValidMobile && address.mobile,
                }"
                placeholder="আপনার মোবাইল নম্বর"
                v-model="address.mobile"
              />
              <p
                v-if="!isValidMobile && address.mobile"
                class="text-red-500 text-xs mt-1"
              >
                {{ validationError }}
              </p>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <input
                class="w-full bg-white text-gray-900 border border-gray-300 rounded px-4 py-3 text-sm focus:ring-2 focus:ring-[#388072] focus:border-[#388072] outline-none transition"
                placeholder="অর্ডার নোট..."
                v-model="address.note"
              />
            </div>
          </div>
        </section>

        <!-- Shipping -->
        <section class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-5 border-b pb-3">
            Shipping
          </h2>

          <div class="border border-gray-200 rounded overflow-hidden">
            <div
              class="flex items-center justify-between px-4 py-3 bg-orange-50"
            >
              <div class="flex items-center gap-3">
                <Icon icon="mdi:truck-delivery" class="w-5 h-5 text-orange-500" />
                <span class="text-sm text-gray-800">ডেলিভারি চার্জ:</span>
              </div>
              <span class="text-sm font-semibold text-gray-900">৳ 60.00</span>
            </div>
          </div>
        </section>

        <!-- Your Order -->
        <section class="mb-8">
          <h2 class="text-xl font-bold text-gray-900 mb-5 border-b pb-3">
            Your order
          </h2>

          <div class="border border-gray-200 rounded overflow-hidden">
            <!-- Header -->
            <div
              class="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200"
            >
              <span class="text-sm font-semibold text-gray-700">Product</span>
              <span class="text-sm font-semibold text-gray-700">Subtotal</span>
            </div>

            <!-- Items -->
            <div
              v-for="(item, index) in cartProduct"
              :key="index"
              class="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-4"
            >
              <div class="flex items-center gap-4 flex-1 min-w-0">
                <div
                  class="w-16 h-16 flex-shrink-0 bg-gray-50 rounded border border-gray-200 overflow-hidden"
                >
                  <a-image
                    v-if="item?.product_images?.length > 0"
                    :width="64"
                    :height="64"
                    class="w-full h-full object-cover"
                    :src="`${imgBasePharma}/${item?.product_images[0]?.path}`"
                    :fallback="default_img"
                  />
                  <div
                    v-else
                    class="w-full h-full flex items-center justify-center"
                  >
                    <Icon icon="mdi:image-off" class="w-6 h-6 text-gray-400" />
                  </div>
                </div>
                <div class="min-w-0">
                  <p class="text-sm text-gray-800 truncate">
                    {{ item?.name }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    × {{ item?.singleQty || 1 }}
                  </p>
                </div>
              </div>
              <span class="text-sm font-medium text-gray-900 whitespace-nowrap">
                ৳ {{ Number(item?.total_price || 0).toFixed(2) }}
              </span>
            </div>

            <!-- Subtotal -->
            <div
              class="flex justify-between items-center px-4 py-3 border-b border-dashed border-gray-300"
            >
              <span class="text-sm text-[#388072] font-medium">Subtotal</span>
              <span class="text-sm font-semibold text-gray-900">
                ৳ {{ Number(totalPrice || 0).toFixed(2) }}
              </span>
            </div>

            <!-- Shipping -->
            <div
              class="flex justify-between items-center px-4 py-3 border-b border-dashed border-gray-300"
            >
              <span class="text-sm text-gray-600">Shipping</span>
              <span class="text-sm font-semibold text-gray-900">
                ৳ {{ Number(ShippingCost || 0).toFixed(2) }}
              </span>
            </div>

            <!-- Total -->
            <div class="flex justify-between items-center px-4 py-3 bg-gray-50">
              <span class="text-base font-bold text-gray-900">Total</span>
              <span class="text-lg font-bold text-[#388072]">
                ৳
                {{
                  Number(
                    (Number(totalPrice) || 0) + (Number(ShippingCost) || 0),
                  ).toFixed(2)
                }}
              </span>
            </div>
          </div>
        </section>

        <!-- Payment Method -->
        <section class="mb-8">
          <div v-for="method in paymentMethod" :key="method.id" class="mb-2">
            <div
              @click="formData.payment_method_id = method.id"
              class="flex items-center gap-3 px-4 py-3 border rounded cursor-pointer transition"
              :class="
                formData.payment_method_id === method.id
                  ? 'border-[#388072] bg-[#388072]/5'
                  : 'border-gray-200'
              "
            >
              <input
                type="radio"
                name="payment"
                v-model="formData.payment_method_id"
                :value="method.id"
                class="w-4 h-4 accent-[#388072]"
              />
              <span class="text-sm font-medium text-gray-800"
                >{{ method.name }} ( Pay with cash upon delivery.)
              </span>
            </div>
            <!-- <div
              v-if="formData.payment_method_id === method.id && method.id === 1"
              class="bg-gray-100 px-4 py-3 text-sm text-gray-600 border-x border-b border-gray-200 rounded-b"
            >
              Pay with cash upon delivery.
            </div> -->
          </div>
        </section>

        <!-- Place Order Button -->
        <button
          type="button"
          class="w-full bg-[#388072] text-white font-bold py-4 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-base active:scale-[0.98]"
          @click="submit_Order"
        >
          <Icon icon="mdi:lock" class="w-5 h-5" />
          <span>
            Place Order ৳
            {{
              Number(
                (Number(totalPrice) || 0) + (Number(ShippingCost) || 0),
              ).toFixed(2)
            }}
          </span>
          <Icon
            v-if="isOrderloading"
            icon="nonicons:loading-16"
            class="w-5 h-5 animate-spin"
          />
        </button>
      </div>
    </div>
  </NuxtLayout>

  <!-- Order Success Modal -->
  <a-modal
    v-model:open="open"
    :title="null"
    :footer="null"
    :centered="true"
    :width="500"
    @cancel="handleCancel"
  >
    <div
      class="flex flex-col items-center justify-center py-8 px-4 text-center"
    >
      <div
        class="w-20 h-20 rounded-full border-4 border-[#388072] flex items-center justify-center mb-6"
      >
        <Icon
          icon="material-symbols:check"
          class="text-[#388072] size-14"
        ></Icon>
      </div>

      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        Your Order is Confirmed!
      </h1>

      <p v-if="sale_code" class="text-gray-600 text-lg mb-4">
        Order ID: <span class="font-bold text-[#388072]">#{{ sale_code }}</span>
      </p>

      <button
        @click="handleCheckStatus"
        class="bg-[#388072] text-white font-semibold py-3 px-8 rounded-md transition-colors duration-200 uppercase tracking-wide"
      >
        Check status your order
      </button>
    </div>
  </a-modal>
</template>

<script setup>
import { apiBasePharma, getTokenConfig, imgBasePharma } from "@/config";
import { useCartStore } from "@/stores/cart";
import default_img from "@/assets/images/Banner/default.jpg";

import axios from "axios";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();
const storedUser = JSON.parse(localStorage.getItem("user"));

const { totalPrice, cartProduct } = storeToRefs(cartStore);

const isOrderloading = ref(false);

import { showNotification } from "@/util/notification";
import { Icon } from "@iconify/vue";

const ShippingCost = ref(60);

const address = ref({
  full_name: storedUser?.name || "",
  mobile: storedUser?.phone || "",
  address: "",
  country_id: 1,
  city_id: 1,
  area_id: 1,
  note: "",
});

const formData = ref({
  sale_products: [],
  sub_total: totalPrice.value,
  total: totalPrice.value,
  shipping_cost: ShippingCost.value,
  billing_address: address.value,
  payment_method_id: 1,
  user: { id: 0 },
});

const paymentMethod = ref([{ id: 1, name: "Cash on delivery" }]);

const validationError = ref("");
const validateMobile = (value) => {
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
  validationError.value = validateMobile(address.value.mobile);
  return validationError.value === "";
});

const onlyNumber = (e) => {
  let inputValue = e.target.value.replace(/\D/g, "");
  if (inputValue.length > 11) {
    inputValue = inputValue.slice(0, 11);
  }
  address.value.mobile = inputValue;
};


const token = ref();
const open = ref(false);
const sale_code = ref("");

const submit_Order = async () => {
  isOrderloading.value = true;
  if (!address.value.full_name) {
    isOrderloading.value = false;
    return showNotification("warning", "Name is required");
  }
  if (!address.value.mobile) {
    isOrderloading.value = false;
    return showNotification("warning", "Mobile number is required");
  }
  if (!address.value.address) {
    isOrderloading.value = false;
    return showNotification("warning", "Address is required");
  }
  if (!formData.value.payment_method_id) {
    isOrderloading.value = false;
    return showNotification("warning", "Payment method is required");
  }

  try {
    const payload = {
      sale_products: cartProduct.value.map((item) => ({
        product_id: item?.id || "",
        product_name: item?.name || "",
        price: Number(
          item?.product_prices?.ecom_final_selling_price || item?.price || 0,
        ),
        quantity: item?.singleQty || 1,
        pack_size_id:
          item?.product_prices?.pack_size_id || item?.pack_size?.id || "",
        pack_size_quantity: Number(
          item?.product_prices?.pack_quantity || item?.pack_size?.quantity || 1,
        ),
        total_quantity: Number(item?.quantity || 0),
        total: Number(item?.total_price || 0),
      })),
      sub_total: Number(totalPrice.value || 0),
      total: Number(totalPrice.value || 0) + Number(ShippingCost.value || 0),
      shipping_cost: Number(ShippingCost.value || 0),
      billing_address: {
        full_name: address.value.full_name,
        mobile: address.value.mobile,
        address: address.value.address,
        country_id: address.value.country_id,
        city_id: address.value.city_id,
        area_id: address.value.area_id,
        note: address.value.note,
      },
      user: storedUser ? { id: storedUser.id } : { id: 1 },
      payment_method_id: formData.value.payment_method_id,
    };

    const config = { headers: { Authorization: `Bearer ${token.value}` } };
    const res = await axios.post(
      `${apiBasePharma}/order/create-order`,
      payload,
      config,
    );
    isOrderloading.value = false;

    if (res.data?.message) {
      sale_code.value = res.data?.saleCode || res.data?.sale_code || "";
      showModal();
      cartStore.$reset();
    }
  } catch (error) {
    console.log(error);
    isOrderloading.value = false;
  }
};

const showModal = () => {
  open.value = true;
};

const handleCancel = () => {
  router.push("/");
};

const handleCheckStatus = () => {
  router.push("/order-tracking");
};

onMounted(async () => {
  // Fetch countries on component mount
});
</script>

<style lang="scss" scoped></style>
