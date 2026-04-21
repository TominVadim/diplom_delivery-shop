"use client";

import { AuthFormLayout } from "../../_components/AuthFormLayout";

const SuccessUpdatePass = () => {
  return (
    <AuthFormLayout>
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-[#70c05b]">
          Пароль успешно изменен!
        </h1>
        <p className="text-gray-600">
          Вы будете перенаправлены на страницу входа...
        </p>
      </div>
    </AuthFormLayout>
  );
};

export default SuccessUpdatePass;
