"use client";

import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCardProps } from "@/types/product";
import ProductsSection from "@/components/ProductsSection";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/search-full?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Не удалось получить результаты:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-5 md:py-20">
      <Breadcrumbs />

      <h1 className="text-2xl font-bold mb-6 text-[#414141]">
        Результаты поиска по запросу{" "}
        <span className="text-[#ff6633]">"{query}"</span>
      </h1>

      {products.length === 0 ? (
        <p className="text-[#8f8f8f]">По вашему запросу "{query}" ничего не найдено</p>
      ) : (
        <ProductsSection
          title=""
          products={products}
          applyIndexStyles={false}
          marginBottom={24}
        />
      )}
    </div>
  );
}
