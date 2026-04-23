import { isBirthdaySoon } from "@/utils/admin/isBirthdaySoon";
import Image from "next/image";

interface PersonProps {
  name: string;
  birthDate: string | null;
}

const Person = ({ name, birthDate }: PersonProps) => {
  const hasBirthdaySoon = isBirthdaySoon(birthDate);
  
  // Форматируем дату рождения с годом
  const formatBirthdayWithYear = (dateStr: string | null): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  
  const birthdayFormatted = birthDate ? formatBirthdayWithYear(birthDate) : null;
  
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-medium text-[#414141]">{name || "Не указано"}</span>
        {hasBirthdaySoon && (
          <span className="text-sm">🎂</span>
        )}
      </div>
      {birthdayFormatted && (
        <div className="text-xs text-gray-500">{birthdayFormatted}</div>
      )}
    </div>
  );
};

export default Person;
