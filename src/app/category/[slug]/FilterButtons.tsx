"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FILTERS = [
  { key: "our_production", label: "Товары нашего производства" },
  { key: "healthy_food", label: "Полезное питание" },
  { key: "non_gmo", label: "Без ГМО" },
];

const FilterButtons = ({ basePath }: { basePath: string }) => {
  const searchParams = useSearchParams();
  const currentFilters = searchParams.getAll("filter");

  const buildFilterLink = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentFilters.includes(filterKey)) {
      params.delete("filter");
      currentFilters
        .filter((f) => f !== filterKey)
        .forEach((f) => params.append("filter", f));
    } else {
      params.append("filter", filterKey);
    }

    params.delete("page");

    const queryString = params.toString();
    return queryString ? `${basePath}?${queryString}` : basePath;
  };

  return (
    <div className="flex flex-row flex-wrap gap-4 justify-center">
      {FILTERS.map((filter) => {
        const isActive = currentFilters.includes(filter.key);
        return (
          <Link
            key={filter.key}
            href={buildFilterLink(filter.key)}
            className={`h-8 px-4 rounded text-xs flex justify-center items-center duration-300 ${
              isActive
                ? "bg-[#70c05b] text-white"
                : "bg-[#f3f2f1] text-[#606060] hover:bg-[#70c05b] hover:text-white"
            }`}
          >
            {filter.label}
          </Link>
        );
      })}
    </div>
  );
};

export default FilterButtons;
