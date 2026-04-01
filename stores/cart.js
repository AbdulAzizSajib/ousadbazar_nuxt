import { showNotification } from "@/util/notification";
import { defineStore } from "pinia";
export const useCartStore = defineStore("cartStore", {
  state: () => ({
    isLoading: false,
    cartProduct: [],
    cuPon: 0,
    isOrderDone: false,
    totalPrice: 0,
  }),

  getters: {},

  actions: {
    calculatePreviousTotal(actual_price, quantity) {
      return actual_price * quantity;
    },
    // ....................................
    calculateTotal() {
      this.totalPrice = this.cartProduct?.reduce((sum, product) => {
        return sum + (product?.total_price || 0);
      }, 0);

      // this.totalPrice = Math.round(this.totalPrice);
    },

    getCart(product, quantity, singleQty) {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        showNotification("warning", "Please login first to add items to cart");
        return false;
      }

      // Normalize product_images so cart always has image data
      if (
        (!product?.product_images || product.product_images.length === 0) &&
        product?.path
      ) {
        product = { ...product, product_images: [{ path: product.path }] };
      }

      const price = Number(
        product?.product_prices?.ecom_final_selling_price || 0
      );
      const actual_price = Number(product?.product_prices?.selling_price || 0);

      const total_previous_price = this.calculatePreviousTotal(
        actual_price,
        quantity
      );

      const index = this.cartProduct?.findIndex(
        (item) => item?.id == product?.id
      );
      if (index != -1) {
        showNotification("info", `${product?.name} updated to cart!`);
        this.cartProduct[index].quantity = quantity;
        this.cartProduct[index].singleQty = singleQty;
        this.cartProduct[index].total_quantity = quantity;
        this.cartProduct[index].price = price;
        this.cartProduct[index].total_price = price * quantity;
        this.cartProduct[index].total_previous_price = total_previous_price;
        this.cartProduct[index].selectedQuantity = quantity;
      } else {
        this.cartProduct = [
          {
            ...product,
            quantity: quantity,
            singleQty: singleQty,
            total_quantity: quantity,
            price: price,
            total_price: price * quantity,
            total_previous_price: total_previous_price,

            selectedQuantity: quantity,
          },

          ...this.cartProduct,
        ];

        showNotification("success", `${product?.name} added to cart!`);
      }

      this.calculateTotal();
    },

    removeProductFromCart(index) {
      this.cartProduct.splice(index, 1);
      this.calculateTotal();
      showNotification("success", "Item removed from cart!");
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
