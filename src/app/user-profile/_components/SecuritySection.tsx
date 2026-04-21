"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DeleteAccountModal from "./DeleteAccountModal";
import Loader from "../../../components/Loader";

interface UserData {
  name: string;
  phone?: string;
  email?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
}

interface SecuritySectionProps {
  user: UserData;
  setUser: (user: null) => void;
}

const SecuritySection: React.FC<SecuritySectionProps> = ({ user, setUser }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const logoutFromProfile = () => {
    router.push("/");
  };

  const handleAppLogout = async () => {
    try {
      localStorage.removeItem("user");
      setUser(null);
      window.dispatchEvent(new Event("storage"));
      router.replace("/");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      setError("Не удалось выйти из приложения");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: user.phone || user.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось удалить аккаунт");
      }

      localStorage.removeItem("user");
      setUser(null);
      window.dispatchEvent(new Event("storage"));
      router.replace("/goodbye");
    } catch (error) {
      console.error("Ошибка при удалении аккаунта:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Не удалось удалить аккаунт. Попробуйте позже."
      );
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setError(null);
    setShowDeleteConfirm(true);
  };

  const handleCloseDeleteModal = () => {
    setError(null);
    setShowDeleteConfirm(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold text-[#414141] mb-6">Безопасность</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-[#d80000] rounded">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={logoutFromProfile}
            className="flex flex-1 items-center justify-center h-12 bg-[#f3f2f1] text-[#606060] px-4 py-2 rounded font-medium hover:shadow-md active:shadow-inner duration-300 cursor-pointer"
          >
            Выйти из личного кабинета
          </button>
          <button
            onClick={handleAppLogout}
            className="flex-1 bg-[#f3f2f1] border-none rounded flex hover:shadow-md px-4 py-2 justify-center items-center active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed h-12 text-[#606060] font-medium duration-300 cursor-pointer"
          >
            Выйти из приложения
          </button>
          <button
            onClick={handleOpenDeleteModal}
            className="bg-[#ffc7c7] hover:bg-[#d80000] text-[#d80000] hover:text-[#f2f2f2] px-4 py-2 h-12 rounded font-medium duration-300 text-center cursor-pointer"
          >
            Удалить аккаунт
          </button>
        </div>
      </div>
      <DeleteAccountModal
        isOpen={showDeleteConfirm}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteAccount}
        error={error}
      />
    </>
  );
};

export default SecuritySection;
