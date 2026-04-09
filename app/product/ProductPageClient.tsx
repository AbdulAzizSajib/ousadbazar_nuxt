"use client";

import { useSearchParams } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

export default function ProductPageClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return <ProductDetailClient id={id} />;
}
