export interface ArticleCardProps {
  id: number;           // было _id: string (у нас будет number)
  img: string;
  title: string;
  text: string;
  createdAt: string | Date;
}
