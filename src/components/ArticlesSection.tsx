import Image from "next/image";
import Link from "next/link";
import { ArticleCardProps } from "@/types/articles";
import ViewAllButton from "@/components/ViewAllButton";

interface ArticlesSectionProps {
  title: string;
  articles: ArticleCardProps[];
  viewAllButton?: {
    text: string;
    href: string;
  };
}

const ArticlesSection = ({ title, articles, viewAllButton }: ArticlesSectionProps) => {
  if (!articles.length) return null;

  return (
    <section>
      <div className="mb-4 md:mb-8 xl:mb-10 flex flex-row justify-between">
        <h2 className="text-2xl xl:text-4xl text-left font-bold text-[#414141]">
          {title}
        </h2>
        {viewAllButton && (
          <ViewAllButton
            btnText={viewAllButton.text}
            href={viewAllButton.href}
          />
        )}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-10">
        {articles.map((article) => (
          <li key={article._id || article.id} className="h-75 md:h-105">
            <article className="bg-white h-full flex flex-col rounded overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)] duration-300">
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
              <div className="p-2.5 flex-1 flex flex-col gap-y-2.5 leading-[1.5]">
                <time className="text-[8px] text-[#8f8f8f]">
                  {new Date(article.createdAt).toLocaleDateString("ru-RU")}
                </time>
                <h3 className="text-[#414141] text-base font-bold xl:text-lg line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-[#414141] line-clamp-3 text-xs xl:text-base">
                  {article.text}
                </p>
                <Link
                  href={`/articles/${article.id}`}
                  className="rounded mt-auto w-37.5 h-10 bg-[#E5FFDE] text-base text-[#70C05B] hover:bg-[#f15c20] hover:text-white active:shadow-inner duration-300 cursor-pointer flex items-center justify-center"
                >
                  Подробнее
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ArticlesSection;
