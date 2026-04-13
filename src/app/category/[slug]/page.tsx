import { Suspense } from "react";
import Loader from "@/components/Loader";
import GenericListPage from "@/components/GenericListPage";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";
import { fetchProductsByCategory } from "./fetchCategoryProducts";
import { CONFIG } from "../../../../config/config";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; itemsPerPage?: string; inStock?: string; priceFrom?: string; priceTo?: string }>;
}

async function getCategoryBySlug(slug: string) {
  const { query } = await import("../../../../utils/db");
  const result = await query(
    "SELECT id, title, slug FROM catalog WHERE slug = $1",
    [slug]
  );
  return result.rows[0] || null;
}

async function CategoryContent({ slug, searchParams }: { slug: string; searchParams: any }) {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  let limit = resolvedSearchParams.itemsPerPage 
    ? parseInt(resolvedSearchParams.itemsPerPage) 
    : CONFIG.ITEMS_PER_PAGE_CATEGORY;
  
  if (isNaN(limit) || limit < 1) limit = CONFIG.ITEMS_PER_PAGE_CATEGORY;
  
  const inStock = resolvedSearchParams.inStock === "true";
  const priceFrom = resolvedSearchParams.priceFrom ? parseInt(resolvedSearchParams.priceFrom) : undefined;
  const priceTo = resolvedSearchParams.priceTo ? parseInt(resolvedSearchParams.priceTo) : undefined;

  const { items, totalCount } = await fetchProductsByCategory(slug, {
    page,
    limit,
    inStock,
    priceFrom,
    priceTo,
  });

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] py-6 md:py-10">
      <Breadcrumbs />
      <GenericListPage
        items={items}
        totalCount={totalCount}
        currentPage={page}
        basePath={`category/${slug}`}
        title={category.title}
        contentType="category"
        renderItem={(item) => <ProductCard {...item} />}
      />
    </div>
  );
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params;

  return (
    <Suspense fallback={<Loader />}>
      <CategoryContent slug={resolvedParams.slug} searchParams={searchParams} />
    </Suspense>
  );
}
