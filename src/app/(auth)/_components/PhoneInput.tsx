"use client";

import { ChangeEvent } from "react";
import { formStyles } from "../styles";

interface PhoneInputProps {
  value: string;
  onChangeAction: (e: ChangeEvent<HTMLInputElement>) => void;
}

const PhoneInput = ({ value, onChangeAction }: PhoneInputProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Очищаем от всех нецифровых символов, оставляем только цифры
    const raw = e.target.value.replace(/\D/g, '');

    // Форматируем как +7 (XXX) XXX-XX-XX
    let formatted = '+7 ';
    if (raw.length > 1) {
      const digits = raw.slice(1);
      if (digits.length >= 1) formatted += '(' + digits.slice(0, 3);
      if (digits.length >= 4) formatted += ') ' + digits.slice(3, 6);
      if (digits.length >= 7) formatted += '-' + digits.slice(6, 8);
      if (digits.length >= 9) formatted += '-' + digits.slice(8, 10);
    }

    // Создаём синтетическое событие с новым значением
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        id: 'phone',
        value: formatted,
      },
    } as ChangeEvent<HTMLInputElement>;

    onChangeAction(syntheticEvent);
  };

  return (
    <div>
      <label htmlFor="phone" className={formStyles.label}>
        Телефон
      </label>
      <input
        id="phone"
        type="tel"
        value={value || "+7 "}
        onChange={handleChange}
        placeholder="+7 (___) ___-__-__"
        className={formStyles.input}
      />
    </div>
  );
};

export default PhoneInput;
