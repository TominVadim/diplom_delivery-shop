import { CatalogProps } from "./catalog";

export interface CategoryBlockProps {
  category: CatalogProps;
  isEditing: boolean;
  isDragging: boolean;
  isOvered: boolean;
  onDragStart: (category: CatalogProps) => void;
  onDragOver: (e: React.DragEvent, categoryId: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, categoryId: number) => void;
}
