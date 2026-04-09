export default function CatalogLoading() {
  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] py-20 text-center">
      <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500">Загрузка каталога...</p>
    </div>
  );
}
