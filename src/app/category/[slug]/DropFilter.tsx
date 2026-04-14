"use client";

import Image from "next/image";
import { useState } from "react";
import FilterButtons from "./FilterButtons";
import FilterControls from "./FilterControls";
import PriceFilter from "./PriceFilter";

interface DropFilterProps {
  basePath: string;
  category: string;
}

const DropFilter = ({ basePath, category }: DropFilterProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="xl:hidden">
      <button
        onClick={() => setIsFilterOpen(true)}
        className="ml-3 xl:hidden h-8 p-2 w-32 rounded text-xs flex justify-center items-center duration-300 gap-x-2 bg-[#70c05b] text-white hover:shadow-md active:shadow-sm cursor-pointer"
      >
        Фильтр
      </button>

      <div
        className={`
          xl:hidden flex flex-col gap-y-10
          fixed top-0 left-0 h-screen w-full max-w-[360px] bg-white z-50 p-4 overflow-y-auto shadow-lg text-[#414141]
          transform origin-left
          transition-all duration-300 ease-in-out
          ${isFilterOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}
        `}
      >
        <div className="flex justify-between items-center mb-4 bg-[#f3f2f1] h-11 rounded text-base font-bold p-2.5">
          <h3 className="flex justify-start items-center">Фильтр</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-2xl cursor-pointer"
          >
            <Image
              src="/icons-products/icon-closer.svg"
              alt="Закрыть фильтры"
              width={24}
              height={24}
            />
          </button>
        </div>

        <FilterButtons basePath={basePath} />
        <FilterControls basePath={basePath} />
        <PriceFilter
          basePath={basePath}
          category={category}
          setIsFilterOpenAction={setIsFilterOpen}
        />
      </div>
    </div>
  );
};

export default DropFilter;
