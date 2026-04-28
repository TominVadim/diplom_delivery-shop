import Link from "next/link";

interface ProductSearchResult {
  id: number;
  name: string;
  article: string;
  base_price: number;
  quantity: number;
}

interface SearchProductResultProps {
  products: ProductSearchResult[];
  deletingId: number | null;
  onClearResults: () => void;
  onOpenDeleteModal: (productId: number, productTitle: string) => void;
}

const SearchProductResult = ({
  products,
  deletingId,
  onClearResults,
  onOpenDeleteModal
}: SearchProductResultProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-main-text">
          Найдено товаров: {products.length}
        </p>
        {products.length > 0 && (
          <button
            onClick={onClearResults}
            className="bg-primary hover:shadow-button-default active:shadow-button-active px-4 py-2 text-sm text-white cursor-pointer rounded"
          >
            Очистить результаты
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">Товары не найдены</p>
            <p className="text-sm">Попробуйте изменить поисковый запрос</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <p>Артикул: {product.article || "-"}</p>
                  <p>Цена: {product.base_price} руб.</p>
                  <p>Остаток: {product.quantity} шт.</p>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Link
                  href={`/administrator/products/edit-product/${product.id}`}
                  className="bg-primary hover:shadow-button-default active:shadow-button-active rounded text-white cursor-pointer duration-300 px-4 py-2 flex flex-row gap-2 items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Редактировать
                </Link>

                <button
                  onClick={() => onOpenDeleteModal(product.id, product.name)}
                  disabled={deletingId === product.id}
                  className="bg-[#d80000] text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchProductResult;
