import Image from "next/image";
import { Article } from "@/types/articles";
import ViewAllButton from "@/components/ViewAllButton";

const AllArticles = async () => {
  let articles: Article[] = [];
  let error = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL!}/api/articles`
    );
    if (!res.ok) throw new Error("Ошибка загрузки");
    const data = await res.json();
    articles = data.articles || [];
  } catch (err) {
    error = "Ошибка получения всех статей";
    console.error("Ошибка в компоненте AllArticles:", err);
  }

  if (error) {
    return <div className="text-red-500">Ошибка: {error}</div>;
  }

  return (
    <section>
      <div className="px-[max(12px,calc((100%-1208px)/2))] flex flex-col mt-20">
        <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
          <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
            Все статьи
          </h2>
          <ViewAllButton btnText="На главную" href="/" />
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-10">
          {articles.map((article) => (
            <li key={article.id}>
              <article className="bg-white h-full flex flex-col rounded overflow-hidden shadow hover:shadow-lg duration-300">
                <div className="relative h-48 w-full">
                  <Image
                    src={article.img}
                    alt={article.title}
                    fill
                    className="object-cover"
                    quality={100}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col gap-y-2">
                  <time className="text-xs text-gray-400">
                    {new Date(article.created_at).toLocaleDateString("ru-RU")}
                  </time>
                  <h3 className="text-[#414141] text-base font-bold xl:text-lg line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#414141] line-clamp-3 text-sm xl:text-base">
                    {article.text}
                  </p>
                  <button className="rounded mt-auto w-full sm:w-auto px-4 py-2 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-[#70C05B] hover:text-white transition-colors duration-300 cursor-pointer">
                    Подробнее
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AllArticles;
