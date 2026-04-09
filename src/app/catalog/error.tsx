"use client";

import { useEffect } from "react";

export default function CatalogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Ошибка каталога:", error);
  }, [error]);

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] py-20 text-center">
      <h2 className="text-xl text-red-600 mb-4">Что-то пошло не так</h2>
      <p className="text-gray-600 mb-6">Не удалось загрузить каталог</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
      >
        Попробовать снова
      </button>
    </div>
  );
}
