import ProductCard from "@/components/ProductCard";
import { ProductCardProps } from "@/types/product";
import ViewAllButton from "@/components/ViewAllButton";

const AllUserPurchases = async () => {
  let purchases: ProductCardProps[] = [];
  let error = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/users/purchases`
    );
    if (!res.ok) throw new Error("Ошибка загрузки");
    const data = await res.json();
    purchases = data.products || [];
  } catch (err) {
    error = "Ошибка получения всех купленных продуктов";
    console.error("Ошибка в компоненте AllUserPurchases:", err);
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  return (
    <section>
      <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col mt-20">
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            Покупали раньше
          </h2>
          <ViewAllButton btnText="На главную" href="/" />
        </div>
        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 xl:gap-10 justify-items-center">
          {purchases.map((item) => (
            <li key={item.id}>
              <ProductCard {...item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AllUserPurchases;
