"use client";

import { useEffect, useState } from "react";
import ProductsSection from "./ProductsSection";
import { ProductCardProps } from "@/types/product";

const Purchases = () => {
  const [products, setProducts] = useState<ProductCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users/purchases?userPurchasesLimit=4");
        if (!response.ok) throw new Error("Ошибка загрузки");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError("Не удалось загрузить ваши покупки");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) return <ProductsSection title="Покупали раньше" products={[]} loading />;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
  if (products.length === 0) return null;

  return <ProductsSection title="Покупали раньше" products={products} viewAllLink="/purchases" />;
};

export default Purchases;
