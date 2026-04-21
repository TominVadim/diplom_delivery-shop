"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { buttonStyles } from "../../styles";
import PasswordInput from "../../_components/PasswordInput";
import { isPasswordValid } from "@/utils/validation/passwordValid";
import SuccessUpdatePass from "./SuccessUpdatePass";

interface PhonePasswordResetVerifyProps {
  phone: string;
  loading: boolean;
  setLoadingAction: (loading: boolean) => void;
  error: string | null;
  setErrorAction: (error: string | null) => void;
  onBackAction: () => void;
}

export const PhonePasswordResetVerify = ({
  phone,
  loading,
  setLoadingAction,
  error,
  setErrorAction,
  onBackAction,
}: PhonePasswordResetVerifyProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [closeForm, setCloseForm] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setErrorAction(null);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setErrorAction(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid(newPassword)) {
      setErrorAction("Пароль должен содержать минимум 6 символов, включая заглавные и строчные буквы и цифры");
      return;
    }
    
    if (otp.length !== 4) {
      setErrorAction("Введите 4-значный код");
      return;
    }
    
    setLoadingAction(true);
    setErrorAction(null);

    try {
      // 1. Проверяем OTP код
      const verifyResponse = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: phone.replace(/\D/g, ""),
          code: otp,
          type: "reset"
        }),
      });

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        if (verifyData.error?.includes("Invalid") || verifyData.error?.includes("неверный")) {
          setOtp("");
          throw new Error("Неверный код подтверждения");
        }
        throw new Error(verifyData.error || "Неверный код подтверждения");
      }

      // 2. Если OTP верный, обновляем пароль
      const resetResponse = await fetch("/api/auth/reset-phone-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: phone.replace(/\D/g, ""),
          newPassword,
        }),
      });

      const resetData = await resetResponse.json();

      if (!resetResponse.ok) {
        throw new Error(resetData.error || "Не удалось обновить пароль");
      }

      setSuccess(true);

      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Произошла ошибка";
      setErrorAction(errorMessage);
      
      if (errorMessage.includes("попыток") || errorMessage.includes("просрочен")) {
        setCloseForm(true);
      }
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToLogin = () => {
    router.push("/login");
  };

  if (success) {
    return <SuccessUpdatePass />;
  }

  return (
    <AuthFormLayout>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 mb-4 flex items-center justify-center">
            <span className="text-3xl">📱</span>
          </div>
          <h1 className="text-2xl font-bold text-center">Введите код из SMS</h1>
        </div>

        <p className="text-center">
          Мы отправили 4-значный код на номер: <br />
          <span className="text-[#ff6633] font-medium">{phone}</span>
        </p>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}
        
        {error && (error.includes("Превышено") || error.includes("просрочен")) && (
          <button
            onClick={handleToLogin}
            className="text-[#ff6633] hover:underline text-sm mx-auto cursor-pointer"
          >
            Перейти на страницу входа
          </button>
        )}
        
        <button
          type="button"
          onClick={onBackAction}
          className="text-[#ff6633] hover:underline text-sm mx-auto cursor-pointer"
        >
          Изменить номер телефона
        </button>
        
        {!closeForm && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-y-4 justify-center">
            <div>
              <p className="text-center text-[#8f8f8f] mb-2">Код из SMS</p>
              <input
                type="text"
                id="otp"
                pattern="[0-9]{4}"
                maxLength={4}
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={handleOtpChange}
                className="flex justify-center w-28 h-15 mx-auto text-center px-4 py-3 border border-[#bfbfbf] rounded focus:border-[#70c05b] focus:shadow-[0_0_0_3px_rgba(112,192,91,0.2)] focus:bg-white focus:outline-none text-2xl"
                required
              />
            </div>

            <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-4 relative">
              <div className="flex flex-col items-start relative">
                <PasswordInput
                  id="new-password"
                  label="Новый пароль"
                  value={newPassword || ""}
                  onChangeAction={handlePasswordChange}
                  showPassword={showNewPassword}
                  togglePasswordVisibilityAction={() => setShowNewPassword(!showNewPassword)}
                  showRequirements={true}
                  inputClass={`h-15 ${
                    newPassword.length > 0 && !isPasswordValid(newPassword)
                      ? "border-red-500"
                      : ""
                  }`}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={loading}
                className={`${buttonStyles.active} rounded w-full max-w-65 px-4 [&&]:h-10 cursor-pointer flex items-center justify-center gap-2 mx-auto`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Сохранение...
                  </>
                ) : (
                  "Установить новый пароль"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthFormLayout>
  );
};
