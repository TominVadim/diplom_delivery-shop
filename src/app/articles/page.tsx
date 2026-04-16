import Image from "next/image";
import { ArticleCardProps } from "@/types/articles";
import GenericListPage from "../../components/GenericListPage";

interface PageProps {
  searchParams: Promise<{ page?: string; itemsPerPage?: string }>;
}

const AllArticles = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const itemsPerPage = parseInt(params.itemsPerPage || "3");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/articles?page=${page}&limit=${itemsPerPage}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Ошибка загрузки");
    const data = await res.json();

    const renderArticle = (article: ArticleCardProps) => (
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
            {new Date(article.createdAt).toLocaleDateString("ru-RU")}
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
    );

    return (
      <GenericListPage
        items={data.articles || []}
        totalCount={data.totalCount || 0}
        currentPage={page}
        basePath="articles"
        title="Все статьи"
        contentType="articles"
        renderItem={renderArticle}
      />
    );
  } catch (error) {
    console.error("Ошибка в AllArticles:", error);
    return (
      <div className="text-red-500 text-center py-20">
        Ошибка загрузки статей
      </div>
    );
  }
};

export default AllArticles;
