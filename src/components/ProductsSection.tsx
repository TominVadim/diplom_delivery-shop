import ProductCard from "@/components/ProductCard";
import ViewAllButton from "@/components/ViewAllButton";

interface ProductsSectionProps {
  title: string;
  products: any[];
  viewAllLink?: string;
  viewAllButton?: { text: string; href: string };
  compact?: boolean;
  marginBottom?: number;
  applyIndexStyles?: boolean;
  loading?: boolean;
}

const ProductsSection = ({
  title,
  products,
  viewAllLink,
  viewAllButton,
  compact = false,
  marginBottom = 0,
  applyIndexStyles = true,
  loading = false,
}: ProductsSectionProps) => {
  if (loading) {
    return (
      <section style={{ marginBottom: `${marginBottom}px` }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 w-full"></div>
              <div className="h-4 bg-gray-200 rounded mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mt-2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  const displayProducts = compact ? products.slice(0, 4) : products;

  return (
    <section style={{ marginBottom: `${marginBottom}px` }}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllLink && <ViewAllButton btnText="Смотреть все" href={viewAllLink} />}
        {viewAllButton && <ViewAllButton btnText={viewAllButton.text} href={viewAllButton.href} />}
      </div>
      <ul className={`grid gap-4 ${
        applyIndexStyles
          ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-2 md:grid-cols-4 xl:grid-cols-5"
      }`}>
        {displayProducts.map((item) => (
          <li key={item.id}>
            <ProductCard {...item} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProductsSection;
