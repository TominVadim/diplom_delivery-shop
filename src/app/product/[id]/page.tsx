import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getReviewsWord } from "@/utils/reviewsWord";
import Bonuses from "./_components/Bonuses";
import CartButton from "./_components/CartButton";
import ImagesBlock from "./_components/ImagesBlock";
import ProductOffer from "./_components/ProductOffer";
import ShareButton from "./_components/ShareButton";
import AdditionalInfo from "./_components/AdditionalInfo";
import SimilarProducts from "./_components/SimilarProducts";
import SameBrandProducts from "./_components/SameBrandProducts";
import ReviewsWrapper from "./_components/ReviewsWrapper";
import StarRating from "@/components/StarRating";
import pool from "@/lib/pg";

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ desc?: string }>;
}

async function getProduct(id: number) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT 
        id, name, description, base_price, discount_percent,
        rating_rate, rating_count, rating_distribution, article, 
        manufacturer, brand, country,
        img, weight, quantity, tags
      FROM products 
      WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
}

async function getUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user");
  
  if (!userCookie?.value) return null;
  
  try {
    const user = JSON.parse(userCookie.value);
    return user;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(parseInt(id));
  
  if (!product) {
    return { title: "Товар не найден" };
  }
  
  return {
    title: product.name,
    description: product.description || `${product.name} в интернет-магазине Северяночка`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id);
  
  if (isNaN(productId)) {
    notFound();
  }
  
  const product = await getProduct(productId);
  const user = await getUser();
  
  if (!product) {
    notFound();
  }
  
  const discountPercent = product.discount_percent || 0;
  const discountedPrice = product.base_price * (1 - discountPercent / 100);
  const cardPrice = discountedPrice * (1 - (6 / 100));
  const bonusAmount = product.base_price * 0.05;
  
  const rating = product.rating_rate || 5.0;
  const reviewCount = product.rating_count || 0;
  const reviewWord = getReviewsWord(reviewCount);
  
  const firstCategory = product.tags?.[0] || "";
  
  // Подготовка данных для отзывов
  const distribution = product.rating_distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Левая колонка - изображения */}
        <div className="lg:w-1/2">
          <ImagesBlock product={product} />
        </div>
        
        {/* Правая колонка - информация */}
        <div className="lg:w-1/2">
          {/* Артикул */}
          {product.article && (
            <p className="text-sm text-gray-500 mb-2">Арт. {product.article}</p>
          )}
          
          {/* Заголовок */}
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
          
          {/* Рейтинг и отзывы */}
          <div className="flex items-center gap-4 mb-6">
            <StarRating rating={rating} />
            <span className="text-sm text-gray-600">
              {reviewCount} {reviewWord}
            </span>
          </div>
          
          {/* Цены и предложение */}
          <ProductOffer 
            discountedPrice={discountedPrice}
            cardPrice={cardPrice}
          />
          
          {/* Бонусы */}
          <Bonuses bonus={bonusAmount} />
          
          {/* Кнопка в корзину */}
          <CartButton />
          
          {/* Кнопка поделиться */}
          <ShareButton title={product.name} className="mt-4" />
          
          {/* Дополнительная информация (бренд, производитель, вес) */}
          <AdditionalInfo 
            brand={product.brand}
            manufacturer={product.manufacturer || product.country}
            weight={product.weight}
          />
          
          {/* Описание */}
          {product.description && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Описание</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Отзывы */}
      <ReviewsWrapper productId={productId} />
      
      {/* Похожие товары */}
      {firstCategory && (
        <SimilarProducts productId={productId} category={firstCategory} />
      )}
      
      {/* Товары того же бренда */}
      {product.brand && (
        <SameBrandProducts brand={product.brand} productId={productId} />
      )}
    </div>
  );
}
