"use client";

import Image from "next/image";
import { columnsUsersList } from "@/data/columnsUsersList";

interface TableHeaderProps {
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string, direction: "asc" | "desc") => void;
}

const TableHeader = ({ sortBy, sortDirection, onSort }: TableHeaderProps) => {
  const handleIconClick = (
    e: React.MouseEvent,
    field: string,
    direction: "asc" | "desc"
  ) => {
    e.stopPropagation();
    onSort(field, direction);
  };

  const getSpanClass = (key: string): string => {
    const spans: Record<string, string> = {
      userId: "md:col-span-1",
      person: "md:col-span-2",
      age: "md:col-span-1",
      email: "md:col-span-2",
      phone: "md:col-span-2",
      role: "md:col-span-2",
      register: "md:col-span-2",
    };
    return spans[key] || "md:col-span-1";
  };

  return (
    <div className="hidden md:grid grid-cols-12 gap-2 p-3 bg-[#f3f2f1] rounded-t-lg border-b border-gray-300">
      {columnsUsersList.map(({ key, label, sortable }) => {
        const isActiveSort = sortBy === key;

        return (
          <div
            key={key}
            className={`${getSpanClass(key)} text-xs font-semibold ${
              sortable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            } duration-300`}
          >
            <div className="flex items-center gap-1">
              <span>{label}</span>
              {sortable && (
                <div className="flex flex-col">
                  <Image
                    src="/icons-header/icon-arrow.svg"
                    alt="Asc"
                    width={10}
                    height={10}
                    className={`transform -rotate-90 ${
                      isActiveSort && sortDirection === "asc"
                        ? "opacity-100"
                        : "opacity-40 hover:opacity-80"
                    }`}
                    onClick={(e) => handleIconClick(e, key, "asc")}
                  />
                  <Image
                    src="/icons-header/icon-arrow.svg"
                    alt="Desc"
                    width={10}
                    height={10}
                    className={`transform rotate-90 -mt-1 ${
                      isActiveSort && sortDirection === "desc"
                        ? "opacity-100"
                        : "opacity-40 hover:opacity-80"
                    }`}
                    onClick={(e) => handleIconClick(e, key, "desc")}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TableHeader;
