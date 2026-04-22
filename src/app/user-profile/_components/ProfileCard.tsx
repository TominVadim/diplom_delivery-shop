"use client";

import { useState } from "react";
import AlertMessage from "./AlertMessage";

interface ProfileCardProps {
  user: any;
  setUser: (user: any) => void;
}

const ProfileCard = ({ user, setUser }: ProfileCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formatDisplayCard = (card: string | null) => {
    if (!card) return "Не указана";
    const last4 = card.slice(-4);
    return `**** **** **** ${last4}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    setCardNumber(value);
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    if (!cardNumber || cardNumber.length !== 16) {
      setError("Номер карты должен содержать 16 цифр");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/update-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          cardNumber: cardNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сохранения карты");
      }

      // Обновляем данные пользователя в localStorage
      const updatedUser = {
        ...user,
        loyalty_card: cardNumber,
        has_card: true,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event("user-login"));

      setSuccess("Номер карты успешно сохранён");
      setIsEditing(false);
      setCardNumber("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCardNumber("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="border-t pt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#414141]">Карта лояльности</h2>
        {!isEditing && !user?.loyalty_card && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#ff6633] hover:text-[#e55a2b] text-sm font-medium"
          >
            Добавить карту
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4">
          <AlertMessage type="error" message={error} />
        </div>
      )}
      {success && (
        <div className="mb-4">
          <AlertMessage type="success" message={success} />
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="Введите 16 цифр карты"
            maxLength={16}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#70c05b] focus:outline-none"
            disabled={isLoading}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading || cardNumber.length !== 16}
              className="px-6 py-2 bg-[#ff6633] text-white rounded-lg hover:bg-[#e55a2b] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Сохранение..." : "Сохранить"}
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">
            {user?.loyalty_card
              ? formatDisplayCard(user.loyalty_card)
              : "Номер карты не указан"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
