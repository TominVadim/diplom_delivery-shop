"use client";

import { Suspense } from "react";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCardProps } from "@/types/product";
import ProductsSection from "@/components/ProductsSection";
import Breadcrumbs from "@/components/Breadcrumbs";

const SearchContentInner = () => {
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

      {products.length > 0 ? (
        <ProductsSection
          products={products}
          title=""
          showViewAll={false}
          columnsLayout="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        />
      ) : (
        <p className="text-gray-500">Ничего не найдено</p>
      )}
    </div>
  );
};

export default function SearchContent() {
  return (
    <Suspense fallback={<Loader />}>
      <SearchContentInner />
    </Suspense>
  );
}
