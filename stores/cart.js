import { showNotification } from "@/util/notification";
import { defineStore } from "pinia";
import { message } from "ant-design-vue";
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
        message.info(`${product?.name} updated to cart!`, 1);
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

        message.success(`${product?.name} added to cart!`, 2);
      }

      this.calculateTotal();
    },

    removeProductFromCart(index) {
      this.cartProduct.splice(index, 1);
      this.calculateTotal();
      message.success(`Item removed from cart!`, 2);
    },
  },
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
});
