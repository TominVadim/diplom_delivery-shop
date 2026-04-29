"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  discountPercent: number;
  img: string;
  tags: string[];
}

const InputBlock = ({
  onFocusChangeAction,
}: {
  onFocusChangeAction: (focused: boolean) => void;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (query.length >= 2) {
        try {
          setIsLoading(true);
          setError(null);
          const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
          
          if (!response.ok) {
            throw new Error("Ошибка поиска");
          }
          
          const data = await response.json();
          setResults(data);
        } catch (error) {
          setError("Не удалось выполнить поиск");
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    };
    
    const debounceTimer = setTimeout(fetchSearchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleInputFocus = () => {
    setIsOpen(true);
    onFocusChangeAction(true);
  };

  const resetSearch = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      resetSearch();
    }
  };

  const handleInputBlur = () => {
    onFocusChangeAction(false);
  };

  return (
    <div className="relative min-w-[261px] flex-grow" ref={searchRef}>
      <SearchInput
        query={query}
        setQuery={setQuery}
        handleSearch={handleSearch}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
      />

      {isOpen && (query.length >= 2 || isLoading) && (
        <div className="absolute -mt-0.5 left-0 right-0 z-100 max-h-[400px] overflow-y-auto bg-white rounded-b border border-gray-200 shadow-lg">
          {error ? (
            <div className="p-2 text-red-500 text-sm">
              {error}
              <button
                onClick={() => {
                  setError(null);
                  const fetchData = async () => {
                    if (query.length >= 2) {
                      try {
                        setIsLoading(true);
                        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
                        if (response.ok) {
                          const data = await response.json();
                          setResults(data);
                        }
                      } finally {
                        setIsLoading(false);
                      }
                    }
                  };
                  fetchData();
                }}
                className="text-blue-500 hover:text-blue-700 cursor-pointer ml-2"
              >
                Повторить
              </button>
            </div>
          ) : (
            <SearchResults
              isLoading={isLoading}
              query={query}
              results={results}
              resetSearch={resetSearch}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InputBlock;
