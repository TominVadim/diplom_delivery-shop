import ProductCard from "@/components/ProductCard";
import ViewAllButton from "@/components/ViewAllButton";

interface ProductsSectionProps {
  title: string;
  products: any[];
  viewAllButton?: { text: string; href: string };
  compact?: boolean;
}

const ProductsSection = ({ title, products, viewAllButton, compact = false }: ProductsSectionProps) => {
  if (!products || products.length === 0) return null;

  const displayProducts = compact ? products.slice(0, 4) : products;

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllButton && <ViewAllButton btnText={viewAllButton.text} href={viewAllButton.href} />}
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
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
