'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Dropdown } from 'antd';
import { Icon } from '@iconify/react';
import { useCartStore } from '@/stores/cartStore';
import { formatNumber, imgBasePharma, asset } from '@/lib/config';
import { stockQuantity } from '@/lib/stockUtils';
import type { Product } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
  item: Product;
}

export default function ProductCard({ item }: ProductCardProps) {
  const getCart = useCartStore((s) => s.getCart);
  const [loadingItemId, setLoadingItemId] = useState<string | number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [noOfAvailablePack, setNoOfAvailablePack] = useState(0);

  const stock = stockQuantity(item);
  const packQty = item?.packsize_quantity || item?.product_prices?.pack_quantity || 1;
  const packPrice = Number(
    item?.product_prices?.ecom_final_selling_price || item?.selling_price || 0
  );
  const finalPrice = packPrice / Number(packQty); // ৳525 / 30 = ৳17.50

  const sellingPrice = Number(item?.product_prices?.selling_price || item?.selling_price || 0);
  const perPieceSellingPrice = sellingPrice / Number(packQty);
  const hasDiscount = perPieceSellingPrice > finalPrice;
  const discountPct = hasDiscount
    ? Math.round(((perPieceSellingPrice - finalPrice) / perPieceSellingPrice) * 100)
    : 0;
  const packName = item?.product_prices?.ecom_pack_name?.name || item?.packsize_name || 'Pcs';
  const categoryName = item?.category?.name || item?.category_name || '';

  const isTabCap =
    categoryName.toLowerCase().includes('cap') || categoryName.toLowerCase().includes('tab');

  const calculateStockQuantity = () => {
    setNoOfAvailablePack(Math.floor(stock / packQty));
    setDropdownOpen(true);
  };

  const handleAddToCart = (quantity: number, singleQty: number) => {
    setLoadingItemId(item.id);
    try {
      getCart(item, quantity, singleQty);
      setDropdownOpen(false);
    } finally {
      setLoadingItemId(null);
    }
  };

  const itemsPerGroup = 1; // ১০টা করে group
  const totalGroups = Math.floor(stock / itemsPerGroup); // কতগুলো ১০-এর গ্রুপ আছে

  const menuItems = Array.from({ length: totalGroups }, (_, i) => {
    const qty = (i + 1) * itemsPerGroup; // 10, 20, 30...
    const totalPrice = (qty * finalPrice).toFixed(2); // 10 * 17.50 = 175
    return {
      key: qty,
      label: (
        <div className="flex items-center justify-between gap-6 py-0.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {qty} {categoryName}
          </span>
          <span className="text-xs font-medium font-mono tabular-nums dark:text-gray-200">
            ৳{totalPrice}
          </span>
        </div>
      ),
      onClick: () => handleAddToCart(qty, qty),
    };
  });
  return (
    <div className="group relative flex h-full w-full max-w-[230px] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600">
      {/* Image */}
      <Link href={`/product?id=${item?.id}`} className="block w-full">
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-700">
          <Image
            width={220}
            height={220}
            loading="lazy"
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
            src={`${imgBasePharma}/${item?.path}`}
            alt={item?.name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = asset('/images/default.jpg');
            }}
          />

          {/* Category badge — overlaid on image */}
          <span className="absolute left-2 top-2 rounded-full border border-white/60 bg-white/80 px-2.5 py-0.5 text-[10px] font-medium text-gray-600 backdrop-blur-sm dark:border-gray-600/60 dark:bg-gray-800/80 dark:text-gray-300">
            {categoryName}
          </span>

          {/* Discount badge */}
          {hasDiscount && (
            <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
              {discountPct}% off
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 px-3 pb-3 pt-2.5">
        <Link href={`/product?id=${item?.id}`} className="block">
          {/* Name */}
          <h3
            className="line-clamp-2 min-h-[36px] text-[13px] font-medium leading-snug text-gray-800 dark:text-gray-100"
            title={item?.name}
          >
            {item?.name}
          </h3>

          {/* Stock */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
              }`}
            />
            <span
              className={`text-[11px] ${
                stock > 0 ? 'text-gray-400 dark:text-gray-500' : 'text-red-500 dark:text-red-400'
              }`}
            >
              {stock > 0 ? `In stock (${formatNumber(stock)})` : `Out of stock`}
            </span>
          </div>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-[15px] font-medium tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
              ৳{finalPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="font-mono text-[11px] tabular-nums text-gray-400 line-through dark:text-gray-500">
                ৳{perPieceSellingPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] text-gray-400">/pcs</span>
          </div>
        </Link>

        {/* Add to cart */}
        <div className="mt-auto">
          <Dropdown
            menu={{
              items: menuItems,
              className: 'min-w-[180px]',
            }}
            trigger={['click']}
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            placement="top"
            overlayClassName="my-dropdown"
          >
            <button
              disabled={stock < packQty}
              onClick={(e) => {
                e.preventDefault();
                calculateStockQuantity();
              }}
              className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-[12px] font-medium tracking-wide transition-all duration-150
                ${
                  stock >= packQty
                    ? 'hover:bg-[#13a89e] border border-primary text-[#13a89e]  hover:text-white  active:scale-[0.98]'
                    : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                }`}
            >
              {loadingItemId === item?.id ? (
                <Icon className="h-3.5 w-3.5 animate-spin" icon="mingcute:loading-line" />
              ) : stock >= packQty ? (
                <>
                  <Icon className="h-3.5 w-3.5" icon="mingcute:shopping-cart-1-line" />
                  Add to cart
                </>
              ) : (
                'Unavailable'
              )}
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
