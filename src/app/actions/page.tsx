import ProductCard from "@/components/ProductCard";
import GenericListPage from "@/components/GenericListPage";

interface PageProps {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}

const AllActions = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const itemsPerPage = parseInt(params.itemsPerPage || "4");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?tag=actions&page=${page}&limit=${itemsPerPage}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Ошибка загрузки");
    const data = await res.json();

    return (
      <GenericListPage
        items={data.products || []}
        totalCount={data.totalCount || 0}
        currentPage={page}
        basePath="actions"
        title="Все акции"
        contentType="products"
        renderItem={(product) => <ProductCard {...product} />}
      />
    );
  } catch (error) {
    console.error("Ошибка в AllActions:", error);
    return (
      <div className="text-red-500 text-center py-20">
        Ошибка загрузки акций
      </div>
    );
  }
};

export default AllActions;
