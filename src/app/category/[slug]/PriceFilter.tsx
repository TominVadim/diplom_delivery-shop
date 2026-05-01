"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { CONFIG } from "@/config/config";
import MiniLoader from "@/components/MiniLoader";
import ErrorComponent from "@/components/ErrorComponent";
import PriceFilterHeader from "./PriceFilterHeader";
import PriceInputs from "./PriceInputs";
import PriceRangeSlider from "./PriceRangeSlider";
import InStockToggle from "./InStockToggle";

interface PriceFilterProps {
  basePath: string;
  category: string;
  setIsFilterOpenAction?: (value: boolean) => void;
}

const PriceFilterContent = ({ basePath, category, setIsFilterOpenAction }: PriceFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlPriceFrom = searchParams.get("priceFrom") || "";
  const urlPriceTo = searchParams.get("priceTo") || "";
  const urlInStock = searchParams.get("inStock") === "true";

  const [inputValues, setInputValues] = useState({
    from: urlPriceFrom,
    to: urlPriceTo,
  });
  const [priceRange, setPriceRange] = useState(CONFIG.FALLBACK_PRICE_RANGE);
  const [inStock, setInStock] = useState(urlInStock);
  const [error, setError] = useState<{
    error: Error;
    userMessage: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPriceData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentCategory = category || searchParams.get("category");
      if (!currentCategory) return;

      const params = new URLSearchParams();
      params.set("slug", currentCategory);
      params.set("getPriceRangeOnly", "true");

      const response = await fetch(`/api/category?${params.toString()}`);

      if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

      const data = await response.json();
      const receivedRange = data.priceRange || CONFIG.FALLBACK_PRICE_RANGE;

      const roundedRange = {
        min: Math.floor(Number(receivedRange.min)),
        max: Math.ceil(Number(receivedRange.max)),
      };

      setPriceRange(roundedRange);

      setInputValues({
        from: urlPriceFrom || roundedRange.min.toString(),
        to: urlPriceTo || roundedRange.max.toString(),
      });
    } catch (error) {
      setError({
        error: error instanceof Error ? error : new Error("Неизвестная ошибка"),
        userMessage: "Не удалось загрузить диапазон цен",
      });
      setPriceRange(CONFIG.FALLBACK_PRICE_RANGE);
      setInputValues({
        from: CONFIG.FALLBACK_PRICE_RANGE.min.toString(),
        to: CONFIG.FALLBACK_PRICE_RANGE.max.toString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [category, searchParams, urlPriceFrom, urlPriceTo]);

  useEffect(() => {
    fetchPriceData();
  }, [fetchPriceData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    applyPriceFilter();
    if (setIsFilterOpenAction) setIsFilterOpenAction(false);
  };

  const applyPriceFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    let fromValue = Math.max(
      priceRange.min,
      parseInt(inputValues.from) || priceRange.min
    );
    let toValue = Math.min(
      priceRange.max,
      parseInt(inputValues.to) || priceRange.max
    );

    if (fromValue > toValue) [fromValue, toValue] = [toValue, fromValue];

    params.set("priceFrom", fromValue.toString());
    params.set("priceTo", toValue.toString());
    params.set("inStock", inStock.toString());
    params.delete("page");

    router.push(`${basePath}?${params.toString()}`);
  }, [searchParams, priceRange, inputValues, inStock, router, basePath]);

  const sliderValues: [number, number] = [
    parseInt(inputValues.from) || priceRange.min,
    parseInt(inputValues.to) || priceRange.max,
  ];

  const handleSliderChange = useCallback((values: [number, number]) => {
    setInputValues({
      from: values[0].toString(),
      to: values[1].toString(),
    });
  }, []);

  const resetPriceFilter = useCallback(() => {
    setInputValues({
      from: priceRange.min.toString(),
      to: priceRange.max.toString(),
    });
    setInStock(false);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("inStock");
    params.delete("page");

    router.push(`${basePath}?${params.toString()}`);
  }, [basePath, priceRange, router, searchParams]);

  if (isLoading) {
    return <MiniLoader />;
  }

  if (error) {
    return <ErrorComponent error={error.error} userMessage={error.userMessage} />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-10 text-[#414141]">
      <PriceFilterHeader onResetAction={resetPriceFilter} />
      <PriceInputs
        from={inputValues.from}
        to={inputValues.to}
        min={priceRange.min}
        max={priceRange.max}
        onFromChangeAction={(value: string) =>
          setInputValues((prev) => ({ ...prev, from: value }))
        }
        onToChangeAction={(value: string) =>
          setInputValues((prev) => ({ ...prev, to: value }))
        }
      />
      <PriceRangeSlider
        min={priceRange.min}
        max={priceRange.max}
        values={sliderValues}
        onChangeAction={handleSliderChange}
      />
      <InStockToggle checked={inStock} onChangeAction={(checked) => setInStock(checked)} />
      <button
        type="submit"
        className="bg-[#ff6633] text-white hover:shadow-lg active:shadow-md h-10 rounded justify-center items-center duration-300 cursor-pointer"
      >
        Применить
      </button>
    </form>
  );
};

const PriceFilter = (props: PriceFilterProps) => {
  return (
    <Suspense fallback={<MiniLoader />}>
      <PriceFilterContent {...props} />
    </Suspense>
  );
};

export default PriceFilter;
