"use client";

import { useEffect, useState } from "react";
import fetchPurchases from "../app/purchases/fetchPurchases";
import ProductsSection from "./ProductsSection";
import ErrorComponent from "./ErrorComponent";
import { ProductCardProps } from "@/types/product";
import Loader from "./Loader";

const Purchases = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<ProductCardProps[]>([]);

  useEffect(() => {
    const checkAccessAndFetchData = async () => {
      try {
        // Проверяем авторизацию и роль
        const userStr = localStorage.getItem("user");
        let hasAccess = false;
        
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            const role = user.role || "user";
            hasAccess = role === "user";
          } catch {
            hasAccess = false;
          }
        }
        
        setShouldShow(hasAccess);

        if (hasAccess) {
          const result = await fetchPurchases({
            userPurchasesLimit: 10, // CONFIG.ITEMS_PER_PAGE_MAIN_PRODUCTS
          });
          setItems(result.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetchData();
  }, []);

  if (!shouldShow) return null;

  if (loading) return <Loader />;

  if (error) {
    return (
      <ErrorComponent
        error={error}
        userMessage="Не удалось загрузить Ваши покупки"
      />
    );
  }

  return (
    <ProductsSection
      title="Покупали раньше"
      viewAllButton={{ text: "Все покупки", href: "/purchases" }}
      products={items}
    />
  );
};

export default Purchases;
