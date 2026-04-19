'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import axios from 'axios';
import { apiBasePharma, formatNumber, imgBasePharma } from '@/lib/config';
import { useCartStore } from '@/stores/cartStore';
import ProductCard from '@/components/ProductCard';
import HeroCarousel from '@/components/HeroCarousel';
import type { Product } from '@/types';

export default function HomePage() {
  const [allProduct, setAllProduct] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const infiniteScrollTrigger = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);

  const getAllProduct = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${apiBasePharma}/products/best-selling-product?page=${pageRef.current}&paginate=20`
      );
      if (res.data) {
        const products: Product[] = (res.data.data || []).map((p: Record<string, unknown>) => ({
          ...p,
          category: { name: p.category_name as string },
          product_prices: {
            selling_price: p.selling_price as number,
            ecom_final_selling_price: p.selling_price as number,
            ecom_discount_percentage: null,
            pack_quantity: 1,
            ecom_pack_name: { name: ' Pcs' },
          },
          product_images: [],
          stock_batches: p.stock ? [{ balanced_quantity: p.stock as number }] : [],
        }));
        setAllProduct((prev) => (pageRef.current === 1 ? products : [...prev, ...products]));
        setHasMore(pageRef.current < (res.data.last_page || 1));
        pageRef.current++;
        setCurrentPage(pageRef.current);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllProduct();
  }, []);

  useEffect(() => {
    if (!infiniteScrollTrigger.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) getAllProduct();
      },
      { threshold: 0.1 }
    );
    observer.observe(infiniteScrollTrigger.current);
    return () => observer.disconnect();
  }, [loading, hasMore, getAllProduct]);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OusadBazar',
    url: 'https://ousadbazar.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ousadbazar.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="px-3 md:px-0 bg-[#f9fafb]">
      {/* Website JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Best Selling Products Header */}
      <div className="flex justify-between items-center my-8 ">
        <h2 className="text-base md:text-2xl font-bold capitalize">Best Selling</h2>
        <Link href="/best-selling">
          <button className=" dark:bg-gray-800  text-primary px-2 md:px-6 py-0.5 md:py-2">
            See All <Icon icon="ant-design:arrow-right-outlined" className="inline align-middle" />
          </button>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="mb-3">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-x-0 gap-y-4 capitalize place-items-center md:place-items-start">
          {/* Skeleton */}
          {!loading &&
            currentPage === 1 &&
            Array.from({ length: 18 }, (_, n) => (
              <div
                key={`skeleton-${n}`}
                className="bg-white dark:bg-gray-800 mb-6 border dark:border-gray-700 rounded-md overflow-hidden w-full max-w-[210px] animate-pulse"
              >
                <div className="w-full h-[209.53px] bg-gray-200" />
                <div className="p-2 md:px-2 md:pb-2">
                  <div className="mb-1">
                    <div className="h-5 w-20 bg-gray-200 rounded-lg" />
                  </div>
                  <div className="h-[40px] space-y-1.5">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-3/4 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-gray-200 mr-2" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-end justify-between mt-2">
                    <div className="space-y-1">
                      <div className="h-3 w-12 bg-gray-200 rounded" />
                      <div className="h-4 w-16 bg-gray-300 rounded" />
                    </div>
                    <div className="h-8 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}

          {allProduct.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>

        {/* Infinite Scroll Trigger */}
        <div ref={infiniteScrollTrigger} className="h-20 flex justify-center items-center">
          {loading && currentPage > 1 && (
            <div className="flex items-center">
              <Icon
                icon="mingcute:loading-line"
                className="h-10 w-10 animate-spin text-[#388072]"
              />
              <span className="ml-2">Loading more products...</span>
            </div>
          )}
          {!hasMore && allProduct.length > 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              You&apos;ve reached the end of the products list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
