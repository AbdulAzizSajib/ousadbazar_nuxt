<template>
  <div class="">
    <!-- Header -->
    <div class="w-full bg-white">
      <div class="bg-[#388072] font-bold py-2">
        <div
          class="flex items-center justify-between border-x border-white px-2 max-w-6xl mx-auto text-white"
        >
          <h2>Welcome to Ousad Bazar</h2>
          <div class="flex items-center gap-3">
            <h2>Contact Us</h2>
            <h2>About Us</h2>
          </div>
        </div>
      </div>
      <nav
        class="z-[999] max-w-6xl mx-auto transition-all duration-500 ease-in-out dark:bg-gray-900"
      >
        <div class="px-4">
          <div class="flex justify-between items-center h-[64px]">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <nuxt-link to="/" class="flex items-center group">
                <img
                  class="h-10 w-32 md:w-full transition-transform duration-300 group-hover:scale-105"
                  :src="logo"
                  alt="Logo"
                />
              </nuxt-link>
            </div>

            <!-- Desktop Navigation -->
            <div
              class="hidden md:flex items-center justify-end flex-1 space-x-6 lg:space-x-8"
            >
              <!-- Search Bar -->
              <div class="flex-1 ml-[75px] max-w-xl">
                <!-- Real input on search page -->
                <div
                  v-if="route.path === '/search'"
                  class="flex items-center bg-white border-2 border-[#388072] rounded-full overflow-hidden shadow-sm"
                >
                  <div class="pl-4">
                    <Icon
                      v-if="!searchStore.searchLoading"
                      icon="mingcute:search-line"
                      class="text-[#388072] size-5"
                    />
                    <Icon
                      v-else
                      icon="ep:loading"
                      class="text-[#388072] size-5 animate-spin"
                    />
                  </div>
                  <input
                    ref="navSearchInput"
                    type="text"
                    :value="searchStore.searchQuery"
                    @input="searchStore.search($event.target.value)"
                    placeholder="Search products..."
                    class="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                  />
                  <button
                    v-if="searchStore.searchQuery"
                    @click="searchStore.clearSearch()"
                    type="button"
                    class="px-3"
                  >
                    <Icon
                      icon="mdi:close-circle"
                      class="text-gray-300 size-5 hover:text-gray-500 transition-colors"
                    />
                  </button>
                </div>
                <!-- Fake clickable bar on other pages -->
                <div
                  v-else
                  @click="$router.push('/search')"
                  class="flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 cursor-pointer hover:border-[#388072] hover:bg-white transition-all duration-300 group"
                >
                  <Icon
                    icon="mingcute:search-line"
                    class="text-gray-400 size-5 group-hover:text-[#388072] transition-colors"
                  />
                  <span class="ml-3 text-gray-400 text-sm">Search products...</span>
                </div>
              </div>
              <!-- Navigation Links -->
              <div class="flex items-center space-x-1">
                <div v-if="isShopRoute" class="relative group">
                  <span
                    @click="showMenu = !showMenu"
                    class="text-gray-700 dark:text-gray-200 font-medium cursor-pointer border md:py-1.5 md:px-4 rounded bg-[#388072] hidden"
                  >
                    Categories
                  </span>
                </div>
              </div>

              <!-- Divider -->
              <div class="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>

              <!-- Right Side Actions -->
              <div class="flex items-center space-x-3">
                <!-- Cart -->
                <a-badge
                  :number-style="{
                    backgroundColor: '#388072',
                    color: '#fff',
                    boxShadow: '0 2px 8px rgba(56,128,114,0.4)',
                  }"
                  :count="cartProduct?.length"
                  :offset="[-5, 5]"
                >
                  <button
                    @click="showDrawer"
                    class="p-2.5 rounded-xl hover:bg-[#388072]/10 transition-all duration-300 group active:scale-95"
                  >
                    <Icon
                      class="w-[22px] h-[22px] text-gray-600 dark:text-gray-300 group-hover:text-[#388072] transition-colors duration-300"
                      icon="solar:cart-large-2-outline"
                    />
                  </button>
                </a-badge>

                <!-- <Icon class="size-5" icon="mdi:bangladeshi-taka" /> -->

                <span class="text-xl text-gray-900 dark:text-gray-100">
                  ৳ {{ formatNumber(totalPrice || 0) }}
                </span>

                <!-- Login / Logout Button -->
                <button
                  v-if="!isLoggedIn"
                  @click="showModal"
                  class="px-5 py-2 bg-[#388072] text-white text-sm font-semibold rounded-lg hover:bg-[#2d6a5a] transition-all duration-300 shadow-md shadow-[#388072]/20 active:scale-95"
                >
                  Login
                </button>
                <button
                  v-else
                  @click="handleLogout($router)"
                  class="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 active:scale-95"
                >
                  <Icon icon="solar:logout-2-outline" class="size-4" />
                  Logout
                </button>
              </div>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center space-x-1">
              <!-- Mobile Cart -->
              <a-badge
                :count="cartProduct?.length"
                :offset="[-5, 5]"
                :number-style="{
                  backgroundColor: '#388072',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(56,128,114,0.4)',
                }"
              >
                <button
                  @click="showDrawer"
                  class="p-2.5 rounded-xl hover:bg-[#388072]/10 transition-all duration-300 active:scale-95"
                >
                  <Icon
                    class="w-6 h-6 text-gray-600 dark:text-gray-300"
                    icon="solar:cart-large-2-outline"
                  />
                </button>
              </a-badge>

              <!-- Mobile Menu Toggle -->
              <button
                @click="isMenuOpen = !isMenuOpen"
                class="p-2.5 rounded-xl hover:bg-[#388072]/10 transition-all duration-300 active:scale-95"
              >
                <Icon
                  v-if="!isMenuOpen"
                  class="w-6 h-6 text-gray-700 dark:text-gray-200"
                  icon="solar:hamburger-menu-outline"
                />
                <Icon
                  v-else
                  class="w-6 h-6 text-gray-700 dark:text-gray-200"
                  icon="solar:close-circle-outline"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform -translate-y-2 opacity-0"
          enter-to-class="transform translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform translate-y-0 opacity-100"
          leave-to-class="transform -translate-y-2 opacity-0"
        >
          <div
            v-show="isMenuOpen"
            class="md:hidden bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-[#388072]/10 shadow-lg"
          >
            <div class="px-4 pt-3 pb-4 space-y-1">
              <!-- Mobile Navigation Links -->
              <nuxt-link
                :to="{ name: 'all-medicines' }"
                @click="isMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-[#388072] hover:bg-[#388072]/10 transition-all duration-200"
              >
                <Icon icon="solar:shop-outline" class="w-5 h-5" />
                Shop
              </nuxt-link>

              <nuxt-link
                :to="isLoggedIn ? '/order' : '/guest-order'"
                @click="isMenuOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-[#388072] hover:bg-[#388072]/10 transition-all duration-200"
              >
                <Icon icon="solar:bag-check-outline" class="w-5 h-5" />
                My Orders
              </nuxt-link>

              <div class="pt-3 px-1">
                <button
                  v-if="!isLoggedIn"
                  type="button"
                  @click="showModal"
                  class="w-full bg-[#388072] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#2d6a5a] transition-all duration-300 shadow-md shadow-[#388072]/20 active:scale-[0.98]"
                >
                  Login
                </button>
                <button
                  v-else
                  @click="handleLogout($router)"
                  class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 font-semibold hover:bg-red-50 transition-all duration-200"
                >
                  <Icon icon="solar:logout-2-outline" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </transition>
        <!-- Mobile Search -->
        <div
          class="md:hidden bg-white dark:bg-gray-800 relative z-[998] px-3 pb-2"
        >
          <!-- Real input on search page -->
          <div
            v-if="route.path === '/search'"
            class="flex items-center bg-white border-2 border-[#388072] rounded-full overflow-hidden shadow-sm"
          >
            <div class="pl-4">
              <Icon
                v-if="!searchStore.searchLoading"
                icon="mingcute:search-line"
                class="text-[#388072] size-[18px]"
              />
              <Icon
                v-else
                icon="ep:loading"
                class="text-[#388072] size-[18px] animate-spin"
              />
            </div>
            <input
              ref="mobileSearchInput"
              type="text"
              :value="searchStore.searchQuery"
              @input="searchStore.search($event.target.value)"
              placeholder="Search medicines..."
              class="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400"
            />
            <button
              v-if="searchStore.searchQuery"
              @click="searchStore.clearSearch()"
              type="button"
              class="px-3"
            >
              <Icon
                icon="mdi:close-circle"
                class="text-gray-300 size-[18px] hover:text-gray-500 transition-colors"
              />
            </button>
          </div>
          <!-- Fake clickable bar on other pages -->
          <div
            v-else
            @click="$router.push('/search')"
            class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 px-4 py-2.5 cursor-pointer hover:border-[#388072] transition-all duration-300"
          >
            <Icon
              icon="mingcute:search-line"
              class="text-gray-400 size-[18px]"
            />
            <span class="ml-3 text-gray-400 text-sm">Search medicines...</span>
          </div>
        </div>
      </nav>
      <div class="border-y border-[#e8e8e8] py-4 hidden md:block">
        <div
          class="flex items-center justify-between px-2 max-w-6xl mx-auto text-black"
        >
          <div class="flex items-center font-semibold text-gray-600 gap-3">
            <nuxt-link to="/" active-class="active-link">
              <div
                class="relative group px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#388072]/10"
              >
                <span
                  class="text-gray-700 dark:text-gray-200 font-semibold text-[15px] tracking-wide transition-colors duration-200 group-hover:text-[#388072]"
                >
                  Home
                </span>
              </div>
            </nuxt-link>
            <nuxt-link to="/all-medicines" active-class="active-link">
              <div
                class="relative group px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#388072]/10"
              >
                <span
                  class="text-gray-700 dark:text-gray-200 font-semibold text-[15px] tracking-wide transition-colors duration-200 group-hover:text-[#388072]"
                >
                  All Medicines
                </span>
              </div>
            </nuxt-link>
            <!-- <h2>Orders</h2> -->
            <nuxt-link to="/order-tracking" active-class="active-link">
              <div
                class="relative group px-4 py-2 rounded-full transition-all duration-300 hover:bg-[#388072]/10"
              >
                <span
                  class="text-gray-700 dark:text-gray-200 font-semibold text-[15px] tracking-wide transition-colors duration-200 group-hover:text-[#388072]"
                >
                  Order Tracking
                </span>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <main class="">
      <div class="bg-[#f9fafb] dark:bg-gray-900">
        <div class="max-w-6xl mx-auto">
          <slot></slot>
        </div>

        <div class="bg-[#388072]">
          <footer class="text-white pt-5 leading-tight max-w-6xl mx-auto">
            <div class="px-2">
              <div class="md:flex items-center justify-between gap-3">
                <!-- Left Side: Logo, Title, Short Description, Address, and Contact -->
                <div class="md:w-1/2">
                  <!-- Logo and Title -->
                  <!-- <div
                    class="flex items-center justify-start md:justify-start gap-2 w-[150px] md:w-[190px] bg-white/80 py-2 rounded mb-4"
                  >
                    <img class="" :src="logo" alt="" />
                  </div> -->
                  <!-- Short Description -->
                  <h2 class="md:text-lg font-semibold">
                    বাংলাদেশের বিশ্বস্ত অনলাইন ফার্মেসি
                  </h2>
                  <h2
                    class="font-semibold text-gray-300 text-sm md:text-lg max-w-[500px] text-justify leading-tight"
                  >
                    উন্নতমানের ওষুধ, স্বাস্থ্য সুরক্ষা পণ্য এবং দৈনন্দিন
                    স্বাস্থ্যসেবা সামগ্রী দ্রুত ডেলিভারি ও সাশ্রয়ী
                    মূল্যে—বাংলাদেশে আপনার দোরগোড়ায় সুবিধাজনক স্বাস্থ্যসেবা
                    পৌঁছে দিচ্ছি।
                  </h2>
                </div>
                <div class="md:w-1/2 mb-3">
                  <h2 class="md:text-lg font-semibold">যোগাযোগ করুন</h2>

                  <div class="mt-3">
                    <HomeOutlined class="align-baseline" />
                    <span class="text-white text-sm md:text-lg leading-7 pl-2">
                      বাড়ি-৩৭, ব্লক-এফ, সেক্টর-১, আফতাবনগর, ঢাকা-১২১২
                    </span>
                  </div>

                  <div class="flex items-center mr-3 mt-1">
                    <PhoneFilled />
                    <span class="text-white text-sm md:text-lg leading-7 ml-2">
                      ০১৯১৫৬০৬০৯০
                    </span>
                  </div>

                  <div class="flex items-center mt-1">
                    <Icon icon="mdi:web" />
                    <span class="text-white leading-7 ml-2">
                      https://ousadbazar.com
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr class="my-1 border-white" />

            <!-- Footer Bottom: Copyright and Social Links -->

            <div class="flex items-center justify-center">
              <!-- Copyright Text -->
              <div class="">
                <p class="text-white md:text-left">
                  &copy; ২০২৫ ঔষধবাজার.কম সর্বস্বত্ব সংরক্ষিত।
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  </div>
  <!-- footer -->
  <a-drawer
    :title="`Your Cart (${cartProduct.length})`"
    placement="right"
    :closable="true"
    v-model:visible="visible"
    @close="onClose"
    :width="windowWidth < 768 ? '100%' : 400"
  >
    <!-- Empty Cart State -->
    <div v-if="cartProduct.length === 0" class="p-6 sm:p-12 text-center">
      <div class="flex flex-col items-center space-y-4">
        <div
          class="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <Icon
            icon="mdi:cart-outline"
            class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
          />
        </div>
        <div>
          <h3 class="text-lg sm:text-xl font-medium text-gray-900">
            Your cart is empty
          </h3>
          <p class="text-sm sm:text-base text-gray-500 mt-2">
            Add some products to get started
          </p>
        </div>
        <button
          @click="handleGoHome"
          class="inline-flex items-center px-3 py-2 sm:px-4 bg-[#388072] text-white rounded-lg hover:bg-[#2d6a5a] transition-colors text-sm sm:text-base"
        >
          <Icon icon="mdi:arrow-left" class="w-4 h-4 mr-2" />
          Continue Shopping
        </button>
      </div>
    </div>

    <!-- Cart Items -->
    <div v-else class="flex flex-col h-full">
      <!-- Products List -->
      <div class="flex-1 overflow-y-auto">
        <ul class="space-y-3 pb-4">
          <li
            v-for="(product, index) in cartProduct"
            :key="index"
            class="bg-gray-50 rounded-lg p-3"
          >
            <div class="flex gap-3">
              <!-- Product Image -->
              <div class="flex-shrink-0">
                <a-image
                  v-if="product?.product_images?.length > 0"
                  :width="80"
                  :height="80"
                  loading="lazy"
                  class="object-cover rounded-md"
                  :src="`${imgBasePharma}/${product?.product_images[0]?.path}`"
                  :fallback="default_img"
                />
                <div v-else class="w-20 h-20 bg-gray-200 rounded-md"></div>
              </div>

              <!-- Product Details -->
              <div class="flex-1 min-w-0">
                <!-- Title and Price Row -->
                <div class="flex justify-between gap-2 mb-2">
                  <div class="flex-1 min-w-0">
                    <h3
                      class="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate"
                      :title="product?.name"
                    >
                      {{ product?.name }}
                    </h3>
                    <p
                      class="bg-gradient-to-r from-red-500 to-pink-500 text-white px-1.5 rounded-lg text-[11px] font-semibold z-10 uppercase text-center w-1/3"
                      v-if="
                        product?.product_prices?.selling_price !== null &&
                        product?.product_prices?.ecom_discount_percentage !==
                          null &&
                        product?.product_prices?.selling_price !==
                          product?.product_prices?.ecom_discount_percentage
                      "
                    >
                      {{
                        Number(
                          product?.product_prices?.ecom_discount_percentage,
                        ).toFixed(0)
                      }}% off
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                      Stock:{{ calculateStock(product) }}
                    </p>

                    <div class="flex items-center gap-2">
                      <p
                        class="text-base sm:text-lg font-semibold text-gray-600 line-through"
                      >
                        ৳{{
                          formatNumber(
                            calculatePreviousTotal(
                              product?.product_prices?.selling_price,
                              product?.quantity,
                            ),
                          )
                        }}
                      </p>
                      <p
                        class="text-base sm:text-lg font-semibold text-[#388072]"
                      >
                        ৳{{ formatNumber(product?.total_price) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <!-- Delete Button -->
                    <a-popconfirm
                      title="Remove from cart?"
                      ok-text="Yes"
                      cancel-text="No"
                      placement="topRight"
                      @confirm="removeProductFromCart(index, product)"
                    >
                      <button
                        type="button"
                        class="p-2 rounded-md hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <Icon class="w-5 h-5" icon="mdi:delete-outline" />
                      </button>
                    </a-popconfirm>
                  </div>
                </div>

                <!-- Quantity Controls -->
                <div class="flex items-center gap-2">
                  <!-- Mobile Quantity Selector -->

                  <!-- Desktop Quantity Dropdown -->
                  <a-select
                    class="flex-1"
                    v-model:value="product.selectedQuantity"
                    placeholder="Select Quantity"
                    size="small"
                    :popupClassName="'cart-qty-dropdown'"
                    @change="
                      handleQuantityChange(product, product.selectedQuantity)
                    "
                  >
                    <a-select-option
                      v-for="i in Math.floor(
                        calculateStock(product) /
                          (product?.product_prices?.pack_quantity || 1),
                      )"
                      :key="i"
                      :value="i * (product?.product_prices?.pack_quantity || 1)"
                    >
                      {{ "( " + Number(i) + (product?.product_prices?.ecom_pack_name?.name || " X") + " )" }}
                      {{
                        product?.category?.name?.toLowerCase().includes("cap") ||
                        product?.category?.name?.toLowerCase().includes("tab")
                          ? Number(product?.product_prices?.pack_quantity) *
                            Number(i)
                          : Number(product?.product_prices?.pack_quantity)
                      }}
                      {{ product?.category?.name }}
                      -
                      {{
                        Number(
                          Number(i) *
                            Number(
                              product?.product_prices?.ecom_final_selling_price,
                            ) *
                            Number(product?.product_prices?.pack_quantity),
                        ).toFixed(2)
                      }}
                      ৳
                    </a-select-option>
                  </a-select>
                </div>

                <!-- Mobile: Total Quantity Display -->
                <div class="mt-2 text-xs text-gray-600 sm:hidden">
                  Total: {{ product.quantity }} items
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Cart Summary - Fixed at Bottom -->
      <div
        class="border-t dark:border-gray-700 bg-white dark:bg-gray-800 pt-4 mt-auto"
      >
        <!-- Total -->
        <div class="mb-4 px-3">
          <div class="flex justify-between items-center">
            <span class="text-gray-600">Total Price</span>
            <span class="text-xl font-bold text-gray-900 dark:text-gray-100">
              ৳{{ formatNumber(totalPrice || 0) }}
            </span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-2 px-3 pb-3">
          <nuxt-link to="/checkout" class="block">
            <button
              @click="checkoutHandler"
              class="w-full flex items-center justify-center py-3 bg-[#388072] text-white rounded-lg hover:bg-[#2d6a5a] transition-colors font-medium"
              :disabled="cartProduct.length === 0"
              :class="{
                'opacity-50 cursor-not-allowed': cartProduct.length === 0,
              }"
            >
              <Icon icon="mdi:cart-check" class="w-5 h-5 mr-2" />
              Proceed to Checkout
            </button>
          </nuxt-link>

          <button
            @click="handleGoHome"
            class="w-full py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </a-drawer>

  <!-- ...............login modal -->
  <a-modal
    width="900px"
    v-model:open="open"
    title=""
    :footer="null"
    @cancel="handleCancel"
    :bodyStyle="{ padding: 0 }"
    centered
  >
    <div
      class="w-full bg-white flex flex-col md:flex-row overflow-hidden"
    >
      <!-- Left Image Section -->
      <div class="hidden md:flex w-1/2 bg-[#f0faf7] flex-col items-center justify-center p-8">
        <img class="w-[85%] max-w-[320px]" :src="loginMedi" alt="Login Image" />
        <div class="text-center mt-6">
          <h3 class="text-lg font-bold text-gray-800">Quick & easy ordering process</h3>
          <p class="text-sm text-gray-500 mt-2 max-w-[280px] mx-auto">
            Now you can order your medicine from Ousad Bazar. We provide all the medicines you need.
          </p>
        </div>
        <!-- Carousel Dots -->
        <div class="flex items-center gap-2 mt-5">
          <span class="w-6 h-2 rounded-full bg-[#388072]"></span>
          <span class="w-2 h-2 rounded-full bg-[#388072]/30"></span>
          <span class="w-2 h-2 rounded-full bg-[#388072]/30"></span>
        </div>
      </div>

      <!-- Right Form Section -->
      <div class="flex-1 p-6 md:p-10">
        <div class="mb-5">
          <h1 class="text-2xl text-[#388072] font-bold mb-2">Login</h1>
          <p class="text-sm text-gray-500">
            Login to make an order, access your orders, special offers, health tips, and more!
          </p>
        </div>

        <form @submit.prevent="otpSent ? handleVerifyOtp() : handleLogin()" class="space-y-5">
          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div class="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#388072]/30 focus-within:border-[#388072] transition-all">
              <div class="flex items-center gap-1.5 px-3 bg-[#388072] text-white text-sm font-medium shrink-0">
                <span>(+88)</span>
                <span>BD</span>
                <Icon icon="mdi:chevron-down" class="size-4" />
              </div>
              <input
                v-model="phone"
                type="text"
                maxlength="11"
                :disabled="otpSent"
                placeholder="01XXXXXXXXX"
                class="flex-1 px-4 py-3 outline-none text-sm text-gray-700 placeholder-gray-400 bg-white"
                :class="{ 'opacity-60 cursor-not-allowed': otpSent }"
                @input="phone = $event.target.value.replace(/\D/g, '').slice(0, 11)"
              />
            </div>
            <!-- Change number link -->
            <p v-if="otpSent" class="text-xs text-[#388072] mt-1 cursor-pointer hover:underline" @click="resetOtp">
              Change number
            </p>
          </div>

          <!-- OTP Input (appears after sending phone) -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
          >
            <div v-if="otpSent">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
              <p class="text-xs text-gray-400 mb-3">A 6-digit code has been sent to +88{{ phone }}</p>
              <div class="flex justify-between gap-2">
                <input
                  v-for="(_, i) in 6"
                  :key="i"
                  :ref="el => { if (el) otpRefs[i] = el }"
                  type="text"
                  maxlength="1"
                  :value="otpDigits[i]"
                  @input="handleOtpInput($event, i)"
                  @keydown.backspace="handleOtpBackspace($event, i)"
                  @paste="handleOtpPaste($event)"
                  class="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-lg bg-white text-gray-700 outline-none focus:ring-2 focus:ring-[#388072]/30 focus:border-[#388072] transition-all"
                />
              </div>
              <!-- Resend OTP -->
              <div class="flex items-center justify-between mt-3">
                <p class="text-xs text-gray-400">Didn't receive the code?</p>
                <button
                  type="button"
                  :disabled="resendTimer > 0"
                  @click="handleLogin"
                  class="text-xs font-semibold transition-colors"
                  :class="resendTimer > 0 ? 'text-gray-300 cursor-not-allowed' : 'text-[#388072] hover:underline'"
                >
                  {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP' }}
                </button>
              </div>
            </div>
          </transition>

          <!-- Send / Verify Button -->
          <button
            type="submit"
            class="w-full py-3 font-semibold text-white bg-[#388072] rounded-lg hover:bg-[#2d6a5a] transition-all duration-300 flex justify-center items-center gap-2 shadow-md shadow-[#388072]/20"
          >
            <span>{{ isLoading ? "Processing ..." : (otpSent ? "Verify OTP" : "Send") }}</span>
            <Icon
              v-if="isLoading"
              class="size-5 animate-spin"
              icon="icon-park-outline:loading"
            />
          </button>

          <!-- Terms -->
          <p class="text-xs text-center text-gray-400 leading-relaxed">
            By continuing you agree to
            <span class="text-[#388072] font-medium cursor-pointer hover:underline">Terms & Conditions</span>,
            <span class="text-[#388072] font-medium cursor-pointer hover:underline">Privacy Policy</span>
            &
            <span class="text-[#388072] font-medium cursor-pointer hover:underline">Refund-Return Policy</span>
          </p>
        </form>
      </div>
    </div>
  </a-modal>


  <a-back-top />
</template>

<script setup>
import { Icon } from "@iconify/vue";
import logo from "@/assets/images/Banner/ousadbazar.svg";
import loginMedi from "../../assets/images/loginmedi.svg";
import default_img from "@/assets/images/Banner/default.jpg";

const isLoggedIn = ref(localStorage.getItem("token"));

const isMenuOpen = ref(false);
import { useCartStore } from "@/stores/cart";
import { useSearchStore } from "@/stores/search";

import { storeToRefs } from "pinia";
import { apiBasePharma, formatNumber, imgBasePharma } from "@/config";
import axios from "axios";
import { showNotification } from "@/util/notification";
const cartStore = useCartStore();
const { cartProduct } = storeToRefs(cartStore);
const searchStore = useSearchStore();
const navSearchInput = ref(null);
const mobileSearchInput = ref(null);

const handleCancel = () => {
  phone.value = "";
  otpSent.value = false;
  otpDigits.value = ["", "", "", "", "", ""];
  if (resendInterval) clearInterval(resendInterval);
  resendTimer.value = 0;
};

const handleLogout = (router) => {
  localStorage.clear();
  isLoggedIn.value = "";
  showNotification("success", "Logged Out!");
  router.push("/");
};

onMounted(async () => {
  updateWindowWidth();
  window.addEventListener("resize", updateWindowWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWindowWidth);
});

// Drawer
import { useRoute, useRouter } from "nuxt/app";
const route = useRoute();

watch(
  () => route.path,
  (path) => {
    if (path === "/search") {
      setTimeout(() => {
        navSearchInput.value?.focus();
        mobileSearchInput.value?.focus();
      }, 100);
    }
  },
  { immediate: true },
);

const handleGoHome = () => {
  if (route.path === "/") {
    visible.value = false;
  } else {
    router.push("/");
  }
};

const visible = ref(false);

const showDrawer = () => {
  visible.value = true;
};

const onClose = () => {
  visible.value = false;
};

const { totalPrice } = storeToRefs(cartStore);
const { calculateTotal, calculatePreviousTotal } = cartStore;

const removeProductFromCart = (index) => {
  cartStore.removeProductFromCart(index); // Call the action from Pinia store
};

const calculateStock = (item) => {
  if (!item?.stock_batches?.length) return 0;
  const stock = item?.stock_batches?.reduce((sum, batch) => {
    return sum + parseFloat(batch.balanced_quantity || 0);
  }, 0);
  return stock || 0;
};
const handleQuantityChange = (product, selectedQuantity) => {
  let stock = calculateStock(product);

  if (selectedQuantity > stock) {
    showNotification(
      "error",
      `Only ${stock} items available in stock. Please select a lower quantity.`,
    );
    return;
  }

  // Calculate the singleQty based on pack_quantity
  const packQuantity = product?.product_prices?.pack_quantity || 1;
  const singleQty = selectedQuantity / packQuantity;

  product.total_price =
    Number(selectedQuantity) *
    Number(product?.product_prices?.ecom_final_selling_price || 0);

  product.quantity = Number(selectedQuantity);
  product.total_quantity = Number(selectedQuantity);
  product.singleQty = singleQty;

  calculateTotal();
};

const checkoutHandler = (e) => {
  if (totalPrice.value <= 0) {
    e.preventDefault();
    showNotification(
      "error",
      "Your cart is empty. Please add items to proceed to checkout.",
    );
  }
};

// modal.............................

const open = ref(false);
const showModal = () => {
  open.value = true;
};

const router = useRouter();
const isLoading = ref(false);

const phone = ref("");
const otpSent = ref(false);
const otpDigits = ref(["", "", "", "", "", ""]);
const otpRefs = ref([]);
const resendTimer = ref(0);
let resendInterval = null;

const startResendTimer = () => {
  resendTimer.value = 60;
  if (resendInterval) clearInterval(resendInterval);
  resendInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) clearInterval(resendInterval);
  }, 1000);
};

const handleOtpInput = (e, index) => {
  const val = e.target.value.replace(/\D/g, "");
  otpDigits.value[index] = val.slice(0, 1);
  e.target.value = otpDigits.value[index];
  if (val && index < 5) {
    otpRefs.value[index + 1]?.focus();
  }
};

const handleOtpBackspace = (e, index) => {
  if (!otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus();
  }
};

const handleOtpPaste = (e) => {
  e.preventDefault();
  const paste = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
  paste.split("").forEach((char, i) => {
    otpDigits.value[i] = char;
  });
  const nextIndex = Math.min(paste.length, 5);
  otpRefs.value[nextIndex]?.focus();
};

const resetOtp = () => {
  otpSent.value = false;
  otpDigits.value = ["", "", "", "", "", ""];
  if (resendInterval) clearInterval(resendInterval);
  resendTimer.value = 0;
};

// Step 1: Send phone number to get OTP
const handleLogin = async () => {
  if (!phone.value) {
    return showNotification("warning", "Phone number required");
  }
  isLoading.value = true;
  try {
    const res = await axios.post(`${apiBasePharma}/send-otp`, {
      phone: `88${phone.value}`,
    });

    isLoading.value = false;
    if (res?.data?.message) {
      showNotification("success", res?.data?.message);
      otpSent.value = true;
      startResendTimer();
    } else {
      showNotification("error", "Failed to send OTP");
    }
  } catch (error) {
    isLoading.value = false;
    if (error.response) {
      showNotification("error", error.response.data.message || "An unexpected error occurred");
    } else {
      showNotification("error", "Network or server error");
    }
  }
};

// Step 2: Verify OTP
const handleVerifyOtp = async () => {
  const otp = otpDigits.value.join("");
  if (otp.length < 6) {
    return showNotification("warning", "Please enter the full 6-digit OTP");
  }
  isLoading.value = true;
  try {
    const res = await axios.post(`${apiBasePharma}/verify-otp`, {
      phone: `88${phone.value}`,
      otp: otp,
    });

    isLoading.value = false;
    if (res?.data?.status === "success") {
      localStorage.setItem("token", res?.data?.token);
      showNotification("success", res?.data?.message);
      open.value = false;
      phone.value = "";
      otpSent.value = false;
      otpDigits.value = ["", "", "", "", "", ""];
      isLoggedIn.value = res?.data?.token;
    } else if (res?.data?.status === "error") {
      showNotification("error", res?.data?.message);
    } else {
      showNotification("error", "Unexpected response format");
    }
  } catch (error) {
    isLoading.value = false;
    if (error.response) {
      showNotification("error", error.response.data.message || "An unexpected error occurred");
    } else {
      showNotification("error", "Network or server error");
    }
  }
};

// Reactive window width
const windowWidth = ref(0);

// Update window width
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

const showMenu = ref(false);
// const route = useRoute();
const isShopRoute = route.path === "/shop";
</script>

<style>
.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

/* Remove bottom borders from menu items */
.ant-menu-item,
.ant-menu-submenu,
.ant-menu-submenu-inline,
.ant-menu-submenu-title,
.ant-menu-item-only-child {
  border-bottom: none !important;
  border-radius: 0 !important;
}

/* Remove bottom borders on hover */
.ant-menu-item:hover::after,
.ant-menu-submenu:hover::after {
  border-bottom: none !important;
  transition: none !important;
}

/* Remove bottom borders when selected */
.ant-menu-item-selected::after,
.ant-menu-item-active::after {
  border-bottom: none !important;
  transition: none !important;
}

/* Style for the active link */
.active-link span {
  color: #388072 !important;
  font-weight: 700;
}

.active-link .relative {
  background-color: rgba(56, 128, 114, 0.1);
}

.active-link .absolute {
  transform: scale(1) !important;
}

.ant-menu.ant-menu-root.ant-menu-inline.ant-menu-light.css-dev-only-do-not-override-1p3hq3p {
  background-color: #f3f4f6;
}

.rc-virtual-list-holder {
  max-height: 450px !important;
}

.cart-qty-dropdown .rc-virtual-list-holder {
  max-height: 200px !important;
}

/* Navbar search bar styling */
.nav-search .ant-select-selector {
  border-radius: 50px !important;
  border: 1.5px solid rgba(56, 128, 114, 0.2) !important;
  background: rgba(56, 128, 114, 0.04) !important;
  padding-left: 18px !important;
  transition: all 0.3s ease !important;
}

.nav-search .ant-select-selector:hover,
.nav-search.ant-select-focused .ant-select-selector {
  border-color: #388072 !important;
  background: white !important;
  box-shadow: 0 0 0 3px rgba(56, 128, 114, 0.1) !important;
}

.nav-search .ant-select-selection-placeholder {
  color: #9ca3af !important;
}

.ant-select-single .ant-select-selector {
  border-radius: 0%;
}
</style>
