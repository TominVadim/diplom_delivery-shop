import { AddProductFormData } from "@/types/addProduct";

export const initialProductData: AddProductFormData = {
  title: "",
  description: "",
  basePrice: "",
  discountPercent: "",
  weight: "",
  quantity: "",
  article: "",
  brand: "",
  manufacturer: "",
  isHealthyFood: false,
  isNonGMO: false,
  categories: [],
  tags: [],
};
