'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Drawer } from 'antd';
import ProductCard from '@/components/ProductCard';
import { useAllProductsInfinite } from '@/lib/hooks/useInfiniteProducts';

export default function AllMedicinesPage() {
  const [sortBy, setSortBy] = useState('asc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const infiniteScrollTrigger = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useAllProductsInfinite(sortBy);

  const allProduct = useMemo(() => data?.pages.flatMap((page) => page.products) ?? [], [data]);

  const totalProducts = useMemo(() => data?.pages[0]?.total ?? 0, [data]);

  const supplierOptions = useMemo(() => {
    const suppliers = allProduct
      .map((item) => item?.supplier?.company_name)
      .filter(Boolean) as string[];
    return [...new Set(suppliers)].sort((a, b) => a.localeCompare(b));
  }, [allProduct]);

  const categoryOptions = useMemo(() => {
    const categories = allProduct.map((item) => item?.category?.name).filter(Boolean) as string[];
    return [...new Set(categories)].sort((a, b) => a.localeCompare(b));
  }, [allProduct]);

  const filteredProducts = useMemo(() => {
    return allProduct.filter((item) => {
      const supplier = item?.supplier?.company_name;
      const category = item?.category?.name;
      const price = Number(item?.product_prices?.ecom_final_selling_price || 0);
      const bySupplier =
        selectedSuppliers.length === 0 || (supplier && selectedSuppliers.includes(supplier));
      const byCategory =
        selectedCategories.length === 0 || (category && selectedCategories.includes(category));
      const byMinPrice = minPrice === null || price >= minPrice;
      const byMaxPrice = maxPrice === null || price <= maxPrice;
      return bySupplier && byCategory && byMinPrice && byMaxPrice;
    });
  }, [allProduct, selectedSuppliers, selectedCategories, minPrice, maxPrice]);

  const activeFilterCount =
    selectedSuppliers.length +
    selectedCategories.length +
    (minPrice !== null ? 1 : 0) +
    (maxPrice !== null ? 1 : 0);

  const clearFilters = () => {
    setSelectedSuppliers([]);
    setSelectedCategories([]);
    setMinPrice(null);
    setMaxPrice(null);
  };

  useEffect(() => {
    if (!infiniteScrollTrigger.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    observer.observe(infiniteScrollTrigger.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const FilterPanel = (
    <div className="flex flex-col h-full">
      {/* Supplier */}
      <div className="pb-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Supplier</h3>
        <div className="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
          {supplierOptions.length === 0 && (
            <p className="text-xs text-gray-400">No suppliers available</p>
          )}
          {supplierOptions.map((supplier) => (
            <label
              key={supplier}
              className="flex items-center gap-2.5 text-gray-700 text-sm cursor-pointer hover:text-[#388072]"
            >
              <input
                type="checkbox"
                checked={selectedSuppliers.includes(supplier)}
                onChange={(e) =>
                  setSelectedSuppliers(
                    e.target.checked
                      ? [...selectedSuppliers, supplier]
                      : selectedSuppliers.filter((s) => s !== supplier)
                  )
                }
                className="h-4 w-4 accent-[#388072]"
              />
              <span className="truncate">{supplier}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="py-4 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
        <div className="grid gap-2 max-h-[220px] overflow-y-auto pr-1">
          {categoryOptions.length === 0 && (
            <p className="text-xs text-gray-400">No categories available</p>
          )}
          {categoryOptions.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2.5 text-gray-700 text-sm cursor-pointer hover:text-[#388072]"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={(e) =>
                  setSelectedCategories(
                    e.target.checked
                      ? [...selectedCategories, category]
                      : selectedCategories.filter((c) => c !== category)
                  )
                }
                className="h-4 w-4 accent-[#388072]"
              />
              <span className="truncate">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="py-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range (৳)</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-xs text-gray-500">
            Min
            <input
              value={minPrice ?? ''}
              onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : null)}
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#388072] focus:ring-1 focus:ring-[#388072]/20"
              min="0"
              placeholder="0"
            />
          </label>
          <label className="grid gap-1 text-xs text-gray-500">
            Max
            <input
              value={maxPrice ?? ''}
              onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : null)}
              type="number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#388072] focus:ring-1 focus:ring-[#388072]/20"
              min="0"
              placeholder="2000"
            />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <section className="w-full px-3 md:px-0 py-3 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[290px_1fr] xl:grid-cols-[290px_1fr] gap-4 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block self-start sticky top-[156px]">
          <div className="bg-white border border-gray-200 rounded-xl md:max-h-[calc(100vh-168px)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
              <h2 className="m-0 text-base font-semibold text-gray-900">Filter Medicines</h2>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  className="text-xs text-[#388072] hover:text-[#2d6a5a] font-medium"
                  onClick={clearFilters}
                >
                  Clear ({activeFilterCount})
                </button>
              )}
            </div>
            <div className="px-5 py-2 overflow-y-auto">{FilterPanel}</div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 ">
          {/* Top controls bar */}
          <div className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 mb-3 flex justify-between items-center gap-3 md:hidden">
            {/* Mobile filter button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#388072] hover:text-[#388072] transition-colors relative"
            >
              <Icon icon="mdi:filter-variant" className="w-4 h-4" />
              Filter
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#388072] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="flex gap-2 items-center">
              <label className="text-sm text-gray-600 whitespace-nowrap">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white text-gray-900 border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-[#388072]"
              >
                <option value="asc">Default</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* <div className="hidden sm:block text-sm text-gray-600 text-right">
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              /{" "}
              <span className="font-semibold text-gray-900">{totalProducts}</span>{" "}
              Total
            </div> */}
          </div>

          <div className="mb-3">
            {!isLoading && filteredProducts.length <= 0 && (
              <div className="flex justify-center items-center py-12">
                <p className="text-xl text-gray-500">No data Found!</p>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-2 gap-y-4 capitalize lg:place-items-stretch">
              {isLoading &&
                Array.from({ length: 12 }, (_, n) => (
                  <div
                    key={`skeleton-${n}`}
                    className="bg-white mb-6 border rounded-md overflow-hidden w-full max-w-[210px] animate-pulse"
                  >
                    <div className="w-full h-[209.53px] bg-gray-200" />
                    <div className="p-2">
                      <div className="mb-3">
                        <div className="h-5 w-20 bg-gray-200 rounded-lg" />
                      </div>
                      <div className="h-[40px] space-y-1.5">
                        <div className="h-3 w-full bg-gray-200 rounded" />
                        <div className="h-3 w-3/4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
            <div ref={infiniteScrollTrigger} className="h-20 flex justify-center items-center">
              {isFetchingNextPage && (
                <div className="flex items-center">
                  <Icon
                    icon="mingcute:loading-line"
                    className="h-10 w-10 animate-spin text-[#388072]"
                  />
                  <span className="ml-2">Loading more products...</span>
                </div>
              )}
              {!hasNextPage && allProduct.length > 0 && (
                <div className="text-center text-gray-500">
                  You&apos;ve reached the end of the products list.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <Icon icon="mdi:filter-variant" className="w-5 h-5 text-[#388072]" />
            <span className="font-semibold">Filter Medicines</span>
            {activeFilterCount > 0 && (
              <span className="bg-[#388072] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
        }
        placement="left"
        closable
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        width={typeof window !== 'undefined' && window.innerWidth < 768 ? '85%' : 360}
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="flex-1 border border-gray-200 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Clear All
            </button>
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="flex-1 bg-[#388072] hover:bg-[#2d6a5a] text-white rounded-lg py-2.5 text-sm font-semibold"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        }
      >
        {FilterPanel}
      </Drawer>
    </section>
  );
}
