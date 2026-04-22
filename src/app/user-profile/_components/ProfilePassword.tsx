"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "./AlertMessage";

interface ProfilePasswordProps {
  user: {
    id: number;
    phone?: string;
    email?: string;
  };
}

const ProfilePassword = ({ user }: ProfilePasswordProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handlePasswordChange = () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Выходим из аккаунта
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("storage"));

      // Перенаправляем на страницу сброса пароля
      router.push("/phone-pass-reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при смене пароля");
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setError(null);
  };

  return (
    <>
      <div className="border-t pt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#414141]">Пароль</h2>
          <button
            onClick={handlePasswordChange}
            className="text-[#ff6633] hover:text-[#e55a2b] text-sm font-medium"
          >
            Сменить пароль
          </button>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">••••••••</p>
        </div>
      </div>

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-[#414141] mb-4">
              Смена пароля
            </h3>
            <p className="text-gray-600 mb-6">
              Для смены пароля будет отправлен SMS-код на ваш номер телефона. Вы будете выведены из аккаунта.
            </p>
            {error && (
              <div className="mb-4">
                <AlertMessage type="error" message={error} />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#ff6633] text-white rounded-lg hover:bg-[#e55a2b] disabled:opacity-50"
              >
                {isLoading ? "Загрузка..." : "Продолжить"}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfilePassword;
