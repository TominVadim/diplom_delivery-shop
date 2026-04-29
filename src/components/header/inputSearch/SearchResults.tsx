"use client";

import Image from "next/image";
import Link from "next/link";
import HighlightText from "../HighlightText";

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  img: string;
  tags: string[];
}

interface SearchResultsProps {
  isLoading: boolean;
  query: string;
  results: Product[];
  resetSearch: () => void;
}

const SearchResults = ({
  isLoading,
  query,
  results,
  resetSearch,
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="text-[#8f8f8f]">Поиск...</div>
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="p-2 flex flex-col gap-2 text-[#414141] max-h-96 overflow-y-auto">
        {results.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer transition-colors"
            onClick={resetSearch}
          >
            {product.img && (
              <div className="w-12 h-12 relative flex-shrink-0">
                <Image
                  src={product.img}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <HighlightText text={product.name} highlight={query} />
              <p className="text-sm text-gray-500 truncate">
                {product.description?.slice(0, 60)}...
              </p>
              <div className="text-sm font-bold text-[#ff6633]">
                {product.basePrice} ₽
                {product.discountPercent > 0 && (
                  <span className="text-xs text-gray-400 line-through ml-2">
                    {Math.round(product.basePrice * (1 + product.discountPercent / 100))} ₽
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (query.length >= 2) {
    return (
      <div className="text-[#8f8f8f] py-2 px-4 text-center">
        Ничего не найдено
      </div>
    );
  }

  return (
    <div className="p-4 text-[#8f8f8f] text-center">
      Введите 2 и более символов для поиска
    </div>
  );
};

export default SearchResults;
