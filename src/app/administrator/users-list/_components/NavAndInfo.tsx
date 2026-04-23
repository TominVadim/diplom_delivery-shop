"use client";

import Link from "next/link";
import Image from "next/image";

interface NavAndInfoProps {
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (size: number) => void;
  totalCount: number;
}

const NavAndInfo = ({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  totalCount,
}: NavAndInfoProps) => {
  return (
    <div className="mb-6 lg:mb-8">
      <Link
        href="/administrator"
        className="hover:underline mb-3 lg:mb-4 flex flex-row items-center gap-3 text-sm lg:text-base text-[#414141] hover:text-[#ff6633] duration-300"
      >
        <Image
          src="/icons-header/icon-arrow-right.svg"
          alt="Назад"
          width={16}
          height={16}
          className="rotate-180"
        />
        Назад в панель управления
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-lg lg:text-2xl font-bold text-[#414141] mb-2">
            Список пользователей
          </h1>
          <p className="text-sm lg:text-base text-[#414141]">
            Всего пользователей: {totalCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-sm text-gray-600 whitespace-nowrap"
          >
            Пользователей на странице:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#ff6633] cursor-pointer"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default NavAndInfo;
