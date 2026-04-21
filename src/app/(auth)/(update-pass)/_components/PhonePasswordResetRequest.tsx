"use client";

import { useState } from "react";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { buttonStyles, formStyles } from "../../styles";
import PhoneInput from "../../_components/PhoneInput";

interface PhonePasswordResetRequestProps {
  onSuccessAction: (phone: string) => void;
  loading: boolean;
  setLoadingAction: (loading: boolean) => void;
  error: string | null;
  setErrorAction: (error: string | null) => void;
}

export const PhonePasswordResetRequest = ({
  onSuccessAction,
  loading,
  setLoadingAction,
  error,
  setErrorAction,
}: PhonePasswordResetRequestProps) => {
  const [phone, setPhone] = useState("+7 ");

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAction(true);
    setErrorAction(null);

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 11) {
      setErrorAction("Введите корректный номер телефона");
      setLoadingAction(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, type: "reset" }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes("не зарегистрирован")) {
          throw new Error("Номер телефона не зарегистрирован в системе");
        }
        throw new Error(data.error || "Не удалось отправить код");
      }

      onSuccessAction(phone);
    } catch (err) {
      setErrorAction(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoadingAction(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setErrorAction(null);
  };

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col items-center">
          <span className="text-5xl mb-4">🔑</span>
          <h1 className="text-2xl font-bold text-center">
            Сброс пароля для телефона
          </h1>
        </div>

        <p className="text-center">
          Введите номер телефона, на который придет код для сброса пароля
        </p>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleRequestReset}
          className="flex flex-col gap-y-4 mx-auto w-full max-w-[320px]"
        >
          <PhoneInput
            id="phone"
            value={phone}
            onChangeAction={handlePhoneChange}
          />

          <button
            type="submit"
            disabled={loading}
            className={`${buttonStyles.active} rounded [&&]:w-full [&&]:h-10 cursor-pointer flex items-center justify-center gap-2`}
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Отправка...
              </>
            ) : (
              <>
                <span>📱</span>
                Отправить код
              </>
            )}
          </button>
        </form>
      </div>
    </AuthFormLayout>
  );
};
