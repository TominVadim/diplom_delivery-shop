"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "../(auth)/_components/PhoneInput";
import PasswordInput from "../(auth)/_components/PasswordInput";
import { buttonStyles, formStyles } from "../(auth)/styles";
import Link from "next/link";
import { AuthFormLayout } from "../(auth)/_components/AuthFormLayout";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phone, setPhone] = useState("+7 ");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const cleanPhone = phone.replace(/\D/g, '');
  const isPhoneValid = cleanPhone.length === 11;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ошибка авторизации");
      }

      localStorage.setItem("user", JSON.stringify({
        loyalty_card: data.user.loyalty_card,
        has_card: data.user.has_card,
        location: data.user.location,
        id: data.user.id,
        name: data.user.name,
        phone: data.user.phone,
        email: data.user.email,
        gender: data.user.gender,
        phone_verified: data.user.phone_verified,
        email_verified: data.user.email_verified,
      }));
      
      // Диспатчим событие для обновления Profile
      window.dispatchEvent(new Event("user-login"));
      
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка авторизации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout>
      <h1 className="text-2xl font-bold text-[#414141] text-center mb-8">
        Вход
      </h1>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-65 mx-auto max-h-screen flex flex-col justify-center overflow-y-auto gap-y-8"
      >
        <div className="flex flex-col gap-y-4">
          <PhoneInput value={phone} onChangeAction={handlePhoneChange} />
          <PasswordInput
            id="password"
            label="Пароль"
            value={password || ""}
            onChangeAction={handlePasswordChange}
            showPassword={showPassword}
            togglePasswordVisibilityAction={() => setShowPassword(!showPassword)}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!isPhoneValid || !password || isLoading}
          className={`
            ${buttonStyles.base} [&&]:my-0
            ${
              isPhoneValid && password && !isLoading
                ? "bg-[#ff6633] text-white hover:shadow-(--shadow-article)"
                : "cursor-not-allowed bg-[#fcd5ba] text-[#ff6633]"
            }
            active:shadow-(--shadow-button-active)
            duration-300
          `}
        >
          {isLoading ? "Вход..." : "Вход"}
        </button>

        <div className="flex flex-row flex-wrap mx-auto text-xs gap-4 justify-center">
          <Link href="/register" className={`${formStyles.loginLink} w-auto px-2`}>
            Регистрация
          </Link>
          <Link
            href="/forgot-password"
            className="h-8 text-[#414141] hover:text-black w-30 flex items-center justify-center duration-300 cursor-pointer"
          >
            Забыли пароль?
          </Link>
        </div>
      </form>
    </AuthFormLayout>
  );
};

export default LoginPage;
