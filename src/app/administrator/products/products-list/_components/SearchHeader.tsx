import Link from "next/link";

const SearchHeader = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-6 text-main-text">
        <Link
          href="/administrator"
          className="flex items-center gap-2 hover:underline"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад в панель управления
        </Link>

        <Link
          href="/administrator/products/add-product"
          className="bg-primary hover:shadow-button-default active:shadow-button-active rounded text-white cursor-pointer duration-300 px-4 py-2 flex flex-row gap-2 items-center justify-center"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Добавить товар
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Поиск товаров</h1>
    </>
  );
};

export default SearchHeader;
