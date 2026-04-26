"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { useSearchProducts } from "@/lib/hooks/useProducts";
import { useSearchStore } from "@/stores/searchStore";
import ProductCard from "@/components/ProductCard";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { data: searchData = [], isLoading } = useSearchProducts(query);
  const { search } = useSearchStore();

  useEffect(() => {
    search(query);
  }, [query]);

  return (
    <section className="w-full min-h-screen py-6 px-3 md:px-0">
      {query && !isLoading && (
        <div className="mb-4">
          <h2 className="text-lg text-gray-700">
            Showing results for <span className="font-bold text-gray-900">&quot;{query}&quot;</span>
            <span className="text-sm text-gray-500 ml-2">({searchData.length} items found)</span>
          </h2>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
          {Array.from({ length: 10 }, (_, n) => (
            <div key={`skeleton-${n}`} className="bg-white border rounded-lg overflow-hidden animate-pulse">
              <div className="w-full h-[180px] bg-gray-200" />
              <div className="p-3 space-y-2"><div className="h-4 w-20 bg-gray-200 rounded" /><div className="h-4 w-full bg-gray-200 rounded" /><div className="h-4 w-3/4 bg-gray-200 rounded" /></div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && searchData.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 capitalize place-items-stretch">
          {searchData.map((item : any) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isLoading && searchData.length === 0 && query && (
        <div className="flex flex-col items-center justify-center py-20">
          <Icon icon="mdi:magnify-close" className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg text-gray-500">No products found</p>
          <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
        </div>
      )}

      {!query && (
        <div className="flex flex-col items-center justify-center py-20">
          <Icon icon="mingcute:search-line" className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg text-gray-500">Search for products</p>
          <p className="text-sm text-gray-400 mt-1">Type a product name to get started</p>
        </div>
      )}
    </section>
  );
}
