import ProductCard from "./ProductCard";
import { ProductCardProps } from "@/types/product";
import ViewAllButton from "./ViewAllButton";

const NewProducts = async () => {
  let products: ProductCardProps[] = [];
  let error = null;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?tag=new&randomLimit=4`
    );
    if (!res.ok) throw new Error("Ошибка загрузки");
    products = await res.json();
  } catch (err) {
    error = "Ошибка получения новых продуктов";
    console.error("Ошибка в компоненте NewProducts:", err);
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  return (
    <section>
      <div className="flex flex-col ">
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            Новинки
          </h2>
          <ViewAllButton btnText="Все новинки" href="new" />
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
          {products.map((item) => (
            <li key={item.id}>
              <ProductCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default NewProducts;
