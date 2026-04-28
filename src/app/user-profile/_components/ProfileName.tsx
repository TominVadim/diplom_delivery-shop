"use client";

import { useState } from "react";
import AlertMessage from "./AlertMessage";

interface ProfileNameProps {
  userId: number;
  initialName: string;
  onUpdate: (data: { name: string }) => void;
}

const ProfileName = ({ userId, initialName, onUpdate }: ProfileNameProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Имя не может быть пустым");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/users/update-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          name: name.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка сохранения имени");
      }

      onUpdate({ name: name.trim() });
      setSuccess("Имя успешно обновлено");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(initialName || "");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#414141]">Имя</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#ff6633] hover:text-[#e55a2b] text-sm font-medium"
          >
            Редактировать
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя"
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#70c05b] focus:outline-none"
            disabled={isLoading}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !name.trim()}
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
          <p className="text-gray-700">{initialName || "Не указано"}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileName;
