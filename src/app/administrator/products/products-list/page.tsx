"use client";

import { useCallback, useState } from "react";
import SearchHeader from "./_components/SearchHeader";
import SearchInput from "./_components/SearchInput";
import SearchStates from "./_components/SearchStates";
import SearchProductResult from "./_components/SearchProductsResult";
import { DeleteConfirmationModal } from "./_components/DeleteConfirmationModal";

interface Product {
  id: number;
  name: string;
  article: string;
  base_price: number;
  quantity: number;
  categories: string[];
}

export default function ProductsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; title: string } | null>(null);

  const handleSearch = useCallback(async () => {
    const query = searchTerm.trim();
    if (query.length < 3) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search-products?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Ошибка поиска");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim().length >= 3) {
      handleSearch();
    }
  };

  const handleClearResults = () => {
    setProducts([]);
    setHasSearched(false);
    setSearchTerm("");
  };

  const handleOpenDeleteModal = (productId: number, productTitle: string) => {
    setProductToDelete({ id: productId, title: productTitle });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    setDeletingId(productToDelete.id);
    try {
      const response = await fetch("/api/delete-product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productToDelete.id }),
      });
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productToDelete.id));
        if (products.length === 1) {
          setHasSearched(false);
        }
      } else {
        alert("Ошибка при удалении товара");
      }
    } catch (error) {
      alert("Ошибка при удалении товара");
    } finally {
      setDeletingId(null);
      handleCloseModal();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchHeader />
      <SearchInput
        searchTerm={searchTerm}
        loading={loading}
        onSearchTermChange={setSearchTerm}
        onSearch={handleSearch}
        onKeyPress={handleKeyPress}
      />
      <SearchStates hasSearched={hasSearched} loading={loading} searchTerm={searchTerm} />
      {hasSearched && !loading && (
        <SearchProductResult
          products={products}
          deletingId={deletingId}
          onClearResults={handleClearResults}
          onOpenDeleteModal={handleOpenDeleteModal}
        />
      )}
      <DeleteConfirmationModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        productTitle={productToDelete?.title || ""}
        isDeleting={deletingId !== null}
      />
    </div>
  );
}
