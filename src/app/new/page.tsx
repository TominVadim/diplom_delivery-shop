import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import GenericListPage from "@/components/GenericListPage";
import Loader from "@/components/Loader";

interface PageProps {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}

async function NewContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const itemsPerPage = parseInt(params.itemsPerPage || "4");

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
}

export default async function AllNew({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<Loader />}>
      <NewContent searchParams={searchParams} />
    </Suspense>
  );
}
