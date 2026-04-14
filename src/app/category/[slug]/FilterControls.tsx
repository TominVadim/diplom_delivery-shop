"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface FilterControlsProps {
  basePath: string;
}

const FilterControls = ({ basePath }: FilterControlsProps) => {
  const searchParams = useSearchParams();
  const currentFilters = searchParams.getAll("filter");
  const activeFilterCount = currentFilters.length;
  
  const minPrice = searchParams.get("priceFrom");
  const maxPrice = searchParams.get("priceTo");
  const hasPriceFilter = !!(minPrice || maxPrice);

  const buildClearFiltersLink = () => {
    const params = new URLSearchParams();

    const page = searchParams.get("page");
    if (page) params.set("page", page);

    const itemsPerPage = searchParams.get("itemsPerPage");
    if (itemsPerPage) params.set("itemsPerPage", itemsPerPage);

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const buildClearPriceFilterLink = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("priceFrom");
    params.delete("priceTo");
    params.delete("page");

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  const totalActiveFilters = activeFilterCount + (hasPriceFilter ? 1 : 0);
  const hasAnyFilters = totalActiveFilters > 0;

  return (
    <div className="flex flex-row flex-wrap gap-x-6 gap-y-3">
      {hasAnyFilters && (
        <div className="h-8 p-2 rounded text-xs flex justify-center items-center gap-x-2 bg-[#70c05b] text-white">
          <span>Фильтр{totalActiveFilters > 1 ? `ы ${totalActiveFilters}` : totalActiveFilters === 1 ? " 1" : ""}</span>
        </div>
      )}
      
      {hasPriceFilter && (
        <div className="h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-[#70c05b] text-white">
          <Link
            href={buildClearPriceFilterLink()}
            className="flex items-center gap-x-2"
          >
            Цена {minPrice !== null ? `от ${minPrice}` : ""}{" "}
            {maxPrice !== null ? `до ${maxPrice}` : ""}
            <Image
              src="/icons-products/icon-closer.svg"
              alt="Очистить фильтр по цене"
              width={24}
              height={24}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>
      )}
      
      {activeFilterCount > 0 && (
        <div className="h-8 p-2 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-[#70c05b] text-white">
          <Link
            href={buildClearFiltersLink()}
            className="flex items-center gap-x-2"
          >
            Очистить фильтры
            <Image
              src="/icons-products/icon-closer.svg"
              alt="Очистить фильтры"
              width={24}
              height={24}
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default FilterControls;
