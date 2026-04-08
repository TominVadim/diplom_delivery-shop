import ProductCard from "@/components/ProductCard";
import GenericListPage from "@/components/GenericListPage";

interface PageProps {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}

const AllNew = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const itemsPerPage = parseInt(params.itemsPerPage || "4");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?tag=new&page=${page}&limit=${itemsPerPage}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Ошибка загрузки");
    const data = await res.json();

    return (
      <GenericListPage
        items={data.products || []}
        totalCount={data.totalCount || 0}
        currentPage={page}
        basePath="new"
        title="Все новинки"
        contentType="products"
        renderItem={(product) => <ProductCard {...product} />}
      />
    );
  } catch (error) {
    console.error("Ошибка в AllNew:", error);
    return (
      <div className="text-red-500 text-center py-20">
        Ошибка загрузки новинок
      </div>
    );
  }
};

export default AllNew;
