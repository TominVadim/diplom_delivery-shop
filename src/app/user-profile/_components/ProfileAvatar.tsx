"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import IconAvatarChange from "../../../components/svg/IconAvatarChange";
import ConfirmAvatarModal from "./ConfirmAvatarModal";
import useAvatar from "../../../hooks/useAvatar";

interface ProfileAvatarProps {
  userId?: string | number;
  gender?: string;
}

const ProfileAvatar = ({ userId, gender = "male" }: ProfileAvatarProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    displayAvatar,
    isLoading: isUploading,
    uploadAvatar,
  } = useAvatar({ userId, gender });

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = "/images/graphics/defaultAvatars/male.png";
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
        setPendingFile(file);
        setShowConfirmModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarConfirm = async () => {
    if (pendingFile) {
      setShowConfirmModal(false);
      try {
        await uploadAvatar(pendingFile);
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl("");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Ошибка загрузки");
        setPreviewUrl("");
      } finally {
        setPendingFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleAvatarCancel = () => {
    setShowConfirmModal(false);
    setPendingFile(null);
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <div className="relative">
        <Image
          src={displayAvatar}
          width={128}
          height={128}
          alt="Аватар профиля"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          onError={handleImageError}
          priority
        />
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        <label className="absolute bottom-0 right-0 bg-[#ff6633] text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-[#e55a2b] duration-300">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileInputChange}
          />
          <IconAvatarChange />
        </label>
      </div>
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-600 mb-1">
          Нажмите на иконку для смены аватара
        </p>
        <p className="text-xs text-gray-500">
          {isUploading ? "Загрузка..." : "Загрузить файл"}
        </p>
      </div>
      <ConfirmAvatarModal
        isOpen={showConfirmModal}
        previewUrl={previewUrl}
        isUploading={isUploading}
        onConfirm={handleAvatarConfirm}
        onCancel={handleAvatarCancel}
      />
    </div>
  );
};

export default ProfileAvatar;
