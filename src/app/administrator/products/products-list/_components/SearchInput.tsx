interface SearchInputProps {
  searchTerm: string;
  loading: boolean;
  onSearchTermChange: (value: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
}

const SearchInput = ({
  searchTerm,
  loading,
  onSearchTermChange,
  onSearch,
  onKeyPress,
}: SearchInputProps) => {
  return (
    <div className="mb-6">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Введите название товара или артикул..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={onKeyPress}
            className="w-full pl-10 pr-4 py-2 rounded outline-none border-1 border-primary bg-white focus:shadow-button-default duration-300"
          />
        </div>
        <button
          onClick={onSearch}
          disabled={loading || searchTerm.trim().length < 3}
          className="bg-primary hover:shadow-button-default active:shadow-button-active rounded text-white duration-300 px-4 py-2 flex flex-row gap-2 items-center justify-center disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          Найти
        </button>
      </div>

      <p className="text-sm mt-2">
        {searchTerm.trim().length === 0 ? (
          <span className="text-main-text">
            Введите минимум 3 символа для поиска
          </span>
        ) : searchTerm.trim().length < 3 ? (
          <span className="text-[#ff6633]">
            Введите еще {3 - searchTerm.trim().length} символ(а, ов) для поиска
          </span>
        ) : (
          <span className="text-[#008c49]">✓ Можно выполнить поиск</span>
        )}
      </p>
    </div>
  );
};

export default SearchInput;
