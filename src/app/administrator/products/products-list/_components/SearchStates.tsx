interface SearchStatesProps {
  hasSearched: boolean;
  loading: boolean;
  searchTerm: string;
}

const SearchStates = ({ hasSearched, loading }: SearchStatesProps) => {
  if (!hasSearched && !loading) {
    return (
      <div className="text-center py-12 text-main-text">
        <svg className="w-12 h-12 mx-auto mb-4 text-[#bfbfbf]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p className="text-lg">Введите запрос для поиска товаров</p>
        <p className="text-sm">Найдите товары по названию или артикулу</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <svg className="w-8 h-8 mx-auto animate-spin text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p className="mt-2">Поиск товаров...</p>
      </div>
    );
  }

  return null;
};

export default SearchStates;
