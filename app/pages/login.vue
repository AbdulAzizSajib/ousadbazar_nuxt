<template>
  <NuxtLayout>
    <div>
      <section class="flex mt-28 justify-center items-center p-4 min-h-screen">
        <div
          class="w-full max-w-lg bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded-lg p-6 md:p-8"
        >
          <div class="mb-6 text-center">
            <h1 class="text-3xl font-bold mb-2">Login</h1>
          </div>
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-4">
              <!-- Email -->
              <div>
                <input
                  v-model="email"
                  type="email"
                  name="email"
                  placeholder="Email "
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-green-200 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <!-- Password -->
              <div>
                <input
                  v-model="password"
                  type="password"
                  name="password"
                  placeholder=" password"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring focus:ring-green-200 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
              <!-- <div class="flex items-center justify-between">
                <div class="flex justify-center items-center gap-1">
                  <input type="checkbox" id="remember" name="remember" />
                  <label
                    for="remember"
                    class="lg:ml-2 lg:text-sm text-xs text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
                <router-link
                  to="/forgotPassword"
                  class="text-xs text-green-700 hover:underline"
                  >Forgot password?</router-link
                >
              </div> -->
            </div>

            <div class="space-y-4">
              <button
                type="submit"
                class="w-full px-4 py-2 font-semibold text-white bg-green-700 rounded-lg hover:bg-green-600 transition-all flex justify-center gap-2"
              >
                <span>{{ isLoading ? "Processing ..." : "Login" }}</span>
                <Icon
                  v-if="isLoading"
                  class="size-5 animate-spin"
                  icon="icon-park-outline:loading"
                />
              </button>
              <p class="text-sm text-center text-gray-600">
                Don't have an account yet?
                <router-link
                  to="/register"
                  class="items-center px-1 text-green-700 capitalize hover:underline"
                >
                  Register
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { HomeOutlined, RightOutlined } from "@ant-design/icons-vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

import axios from "axios";
import { apiBasePharma } from "@/config";
import { Icon } from "@iconify/vue";
import { showNotification } from "@/util/notification";

const router = useRouter();
const isLoading = ref(false);

const email = ref("");
const password = ref("");

const handleLogin = async () => {
  if (!email.value) {
    return showNotification("warning", "email required");
  }
  if (!password.value) {
    return showNotification("warning", "password required");
  }
  isLoading.value = true;
  try {
    const res = await axios.post(`${apiBasePharma}/user-login`, {
      email: email.value,
      password: password.value,
    });

    console.log("Response:", res.data); // Log the entire response

    isLoading.value = false;
    if (res?.data?.status === "success") {
      localStorage.setItem("token", res?.data?.token);
      localStorage.setItem("user", JSON.stringify(res?.data?.user));
      showNotification("success", res?.data?.message);
      setTimeout(() => {
        router.push("/");
      }, 500);
    } else if (res?.data?.status === "error") {
      showNotification("error", res?.data?.message);
      isLoading.value = false;
    } else {
      showNotification("error", "Unexpected response format");
      isLoading.value = false;
    }
  } catch (error) {
    isLoading.value = false;
    console.error("Error occurred: ", error); // Log the full error for debugging

    if (error.response) {
      console.log("API error response:", error.response.data);
      showNotification(
        "error",
        error.response.data.message || "An unexpected error occurred"
      );
    } else {
      showNotification("error", "Network or server error");
    }
  }
};
</script>

<style lang="scss" scoped></style>
