"use client";

import { useState, useEffect } from "react";
import { cities } from "../../../data/cities";

interface LocationSectionProps {
  userId?: number;
  initialLocation?: string;
  onUpdate: (data: { location: string }) => void;
}

const LocationSection = ({
  userId,
  initialLocation = "",
  onUpdate,
}: LocationSectionProps) => {
  const [location, setLocation] = useState(initialLocation);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
    setError("");
  };

  const handleCancel = () => {
    setLocation(initialLocation);
    setIsEditing(false);
    setError("");
  };

  const handleSave = async () => {
    if (!userId) {
      setError("Пользователь не найден");
      return;
    }

    if (!location) {
      setError("Выберите город");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/auth/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, location }),
      });

      if (!response.ok) {
        throw new Error("Ошибка сохранения");
      }

      onUpdate({ location });
      setIsEditing(false);
    } catch (err) {
      setError("Не удалось сохранить изменения");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#414141]">Город</h2>
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
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {isEditing ? (
        <select
          value={location}
          onChange={handleCityChange}
          className="w-full p-3 border border-[#e5e5e5] rounded bg-white"
        >
          {cities.map((city) => (
            <option key={city.value} value={city.label}>
              {city.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700">{initialLocation || "Не указан"}</p>
        </div>
      )}

      {isEditing && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 bg-[#f3f2f1] text-[#606060] py-2 rounded hover:shadow-md active:shadow-inner disabled:opacity-50 cursor-pointer"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !location}
            className="flex-1 bg-[#ff6633] text-white py-2 rounded hover:bg-[#e55a2b] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationSection;
