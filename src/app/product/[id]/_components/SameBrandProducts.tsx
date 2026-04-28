"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product";

interface SameBrandProductsProps {
  brand: string;
  productId: number;
}

const SameBrandProducts = ({ brand, productId }: SameBrandProductsProps) => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const res = await fetch(
          `/api/products/brand?brand=${encodeURIComponent(brand)}&productId=${productId}&limit=4`
        );
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Ошибка загрузки товаров бренда:", error);
      } finally {
        setLoading(false);
      }
    };

    if (brand) {
      fetchBrandProducts();
    } else {
      setLoading(false);
    }
  }, [brand, productId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">С этим товаром покупают</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default SameBrandProducts;
