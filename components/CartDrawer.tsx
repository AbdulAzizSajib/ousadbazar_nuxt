'use client';

import { Drawer, Popconfirm } from 'antd';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/stores/cartStore';
import { formatNumber, imgBasePharma, asset } from '@/lib/config';
import { calculateStock } from '@/lib/stockUtils';
import { useRouter, usePathname } from 'next/navigation';
import type { CartProduct } from '@/types';

interface CartDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function CartDrawer({ visible, onClose }: CartDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const cartProduct = useCartStore((s) => s.cartProduct);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const removeProductFromCart = useCartStore((s) => s.removeProductFromCart);
  const calculateTotal = useCartStore((s) => s.calculateTotal);

  const handleGoHome = () => {
    if (pathname === '/') {
      onClose();
    } else {
      router.push('/');
    }
  };

  const handleIncrease = (product: CartProduct, index: number) => {
    const stock = calculateStock(product);
    const currentQty = product.quantity || 1;
    if (currentQty >= stock) return;

    const newQty = currentQty + 1;
    const packQty = Number(
      product?.packsize_quantity || product?.product_prices?.pack_quantity || 1
    );
    const packPrice = Number(
      product?.product_prices?.ecom_final_selling_price || product?.selling_price || 0
    );
    const perPiecePrice = packPrice / packQty;

    const updatedCart = [...cartProduct];
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: newQty,
      total_quantity: newQty,
      selectedQuantity: newQty,
      price: perPiecePrice,
      total_price: perPiecePrice * newQty,
    };
    useCartStore.setState({ cartProduct: updatedCart });
    calculateTotal();
  };

  const handleDecrease = (product: CartProduct, index: number) => {
    const currentQty = product.quantity || 1;
    if (currentQty <= 1) {
      removeProductFromCart(index);
      return;
    }

    const newQty = currentQty - 1;
    const packQty = Number(
      product?.packsize_quantity || product?.product_prices?.pack_quantity || 1
    );
    const packPrice = Number(
      product?.product_prices?.ecom_final_selling_price || product?.selling_price || 0
    );
    const perPiecePrice = packPrice / packQty;

    const updatedCart = [...cartProduct];
    updatedCart[index] = {
      ...updatedCart[index],
      quantity: newQty,
      total_quantity: newQty,
      selectedQuantity: newQty,
      price: perPiecePrice,
      total_price: perPiecePrice * newQty,
    };
    useCartStore.setState({ cartProduct: updatedCart });
    calculateTotal();
  };

  const checkoutHandler = () => {
    if (totalPrice <= 0) return;
    onClose();
    router.push('/checkout');
  };

  return (
    <Drawer
      title={`Your Cart (${cartProduct.length})`}
      placement="right"
      closable
      open={visible}
      onClose={onClose}
      width={typeof window !== 'undefined' && window.innerWidth < 768 ? '100%' : 400}
    >
      {cartProduct.length === 0 ? (
        <div className="p-6 sm:p-12 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center">
              <Icon icon="mdi:cart-outline" className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900">Your cart is empty</h3>
              <p className="text-sm sm:text-base text-gray-500 mt-2">
                Add some products to get started
              </p>
            </div>
            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-3 py-2 sm:px-4 bg-[#388072] text-white rounded-lg hover:bg-[#2d6a5a] transition-colors text-sm sm:text-base"
            >
              <Icon icon="mdi:arrow-left" className="w-4 h-4 mr-2" />
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            <ul className="space-y-3 pb-4">
              {cartProduct.map((product, index) => {
                const stock = calculateStock(product);
                const qty = product.quantity || 1;
                const packQty = Number(
                  product?.packsize_quantity || product?.product_prices?.pack_quantity || 1
                );
                const packPrice = Number(
                  product?.product_prices?.ecom_final_selling_price || product?.selling_price || 0
                );
                const perPiecePrice = packPrice / packQty;
                const totalItemPrice = perPiecePrice * qty;

                return (
                  <li key={index} className="bg-gray-50 rounded-xl p-3">
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        {product?.product_images && product.product_images.length > 0 ? (
                          <img
                            width={72}
                            height={72}
                            className="w-[72px] h-[72px] object-cover rounded-lg"
                            src={`${imgBasePharma}/${product.product_images[0]?.path}`}
                            alt={product.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = asset('/images/default.jpg');
                            }}
                          />
                        ) : (
                          <div className="w-[72px] h-[72px] bg-gray-200 rounded-lg" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h3
                            className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug"
                            title={product?.name}
                          >
                            {product?.name}
                          </h3>
                          <Popconfirm
                            title="Remove from cart?"
                            okText="Yes"
                            cancelText="No"
                            placement="topRight"
                            onConfirm={() => removeProductFromCart(index)}
                          >
                            <button
                              type="button"
                              className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Icon className="w-4 h-4" icon="mdi:close" />
                            </button>
                          </Popconfirm>
                        </div>

                        <p className="text-[11px] text-gray-400 mt-0.5">
                          ৳{perPiecePrice.toFixed(2)}/pcs · Stock: {stock}
                        </p>

                        {/* Counter + Price row */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Counter */}
                          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                            <button
                              onClick={() => handleDecrease(product, index)}
                              className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Icon
                                icon={qty <= 1 ? 'mdi:delete-outline' : 'mingcute:minus-line'}
                                className="h-3.5 w-3.5"
                              />
                            </button>
                            <span className="w-8 text-center text-[13px] font-medium text-gray-800">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleIncrease(product, index)}
                              disabled={qty >= stock}
                              className="flex h-7 w-7 items-center justify-center text-gray-500 hover:bg-[#13a89e]/10 hover:text-[#13a89e] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Icon icon="mingcute:add-line" className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Total price */}
                          <span className="font-mono text-[15px] font-semibold text-[#388072] tabular-nums">
                            ৳{totalItemPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Footer */}
          <div className="border-t bg-white pt-4 mt-auto">
            <div className="mb-4 px-1">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Total</span>
                <span className="text-xl font-bold text-gray-900">
                  ৳{formatNumber(totalPrice || 0)}
                </span>
              </div>
            </div>
            <div className="space-y-2 pb-3">
              <button
                onClick={checkoutHandler}
                disabled={cartProduct.length === 0}
                className="w-full flex items-center justify-center py-3 bg-[#388072] text-white rounded-xl hover:bg-[#2d6a5a] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icon icon="mdi:cart-check" className="w-5 h-5 mr-2" />
                Proceed to Checkout
              </button>
              <button
                onClick={handleGoHome}
                className="w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-600 font-medium text-sm"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
