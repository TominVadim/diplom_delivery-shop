"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product";

interface SimilarProductsProps {
  productId: number;
  category: string;
}

const SimilarProducts = ({ productId, category }: SimilarProductsProps) => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilar = async () => {
      try {
        const res = await fetch(
          `/api/products/similar-products?productId=${productId}&category=${encodeURIComponent(category)}&limit=4`
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Ошибка загрузки похожих товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [productId, category]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Похожие товары</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
