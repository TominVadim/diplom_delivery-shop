"use client";

import { useState, useRef, useCallback } from "react";

interface ImageUploaderProps {
  onImageUploadAction: (file: File) => void;
  maxSize?: number;
}

export default function ImageUploader({
  onImageUploadAction,
  maxSize = 5 * 1024 * 1024,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [converting, setConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertToJpeg = useCallback(async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Ошибка конвертации"));
            resolve(
              new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                type: "image/jpeg",
              })
            );
          },
          "image/jpeg",
          0.9
        );
      };

      img.onerror = () => reject(new Error("Ошибка загрузки изображения"));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        return setError("Разрешены только изображения (JPG, PNG, WebP, GIF)");
      }
      if (file.size > maxSize) {
        return setError(
          `Файл слишком большой. Максимум ${maxSize / 1024 / 1024}MB`
        );
      }

      setError("");
      setConverting(true);

      try {
        const finalFile = file.type.includes("image/jpeg")
          ? file
          : await convertToJpeg(file);
        onImageUploadAction(finalFile);
      } catch {
        setError("Ошибка при обработке изображения");
      } finally {
        setConverting(false);
      }
    },
    [convertToJpeg, maxSize, onImageUploadAction]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-primary bg-green-50"
            : "border-gray-300 hover:border-primary"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleInputChange}
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          className="hidden"
        />
        <svg
          className="w-12 h-12 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <p className="text-sm text-gray-600">
          {converting
            ? "Конвертация изображения..."
            : "Перетащите изображение или нажмите для выбора"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Поддерживаются JPG, PNG, WebP, GIF (макс. {maxSize / 1024 / 1024}MB)
        </p>
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
      </div>
      {converting && (
        <p className="mt-2 text-sm text-primary">Конвертация в JPEG...</p>
      )}
    </div>
  );
}
