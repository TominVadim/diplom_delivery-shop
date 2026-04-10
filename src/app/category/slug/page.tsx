import { Suspense } from "react";
import Loader from "@/components/Loader";
import ProductsSection from "@/components/ProductsSection";
import Breadcrumbs from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; inStock?: string; priceFrom?: string; priceTo?: string }>;
}

async function getCategoryBySlug(slug: string) {
  const { query } = await import("@/utils/db");
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
  const inStock = resolvedSearchParams.inStock === "true";
  const priceFrom = resolvedSearchParams.priceFrom;
  const priceTo = resolvedSearchParams.priceTo;

  return (
    <div className="px-[max(12px,calc((100%-1208px)/2))] py-6 md:py-10">
      <Breadcrumbs 
        items={[
          { title: "Главная", href: "/" },
          { title: "Каталог", href: "/catalog" },
          { title: category.title }
        ]} 
      />
      <h1 className="text-2xl md:text-3xl xl:text-4xl font-bold text-[#414141] mb-6 md:mb-8">
        {category.title}
      </h1>
      <ProductsSection
        tag={slug}
        page={page}
        inStock={inStock}
        priceFrom={priceFrom ? parseInt(priceFrom) : undefined}
        priceTo={priceTo ? parseInt(priceTo) : undefined}
        applyIndexStyles={false}
        marginBottom={false}
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
