import { useEffect } from "react";
import { AuthFormLayout } from "../_components/AuthFormLayout";

interface SuccessModalProps {
  onClose?: () => void;
}

const SuccessModal = ({ onClose }: SuccessModalProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AuthFormLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-(--color-primary) mb-4">
          Регистрация прошла успешно!
        </h2>
        <p className="text-lg mb-6">
          Сейчас вы будете перенаправлены на главную страницу
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-(--color-primary) h-2.5 rounded-full animate-[progress_3s_linear]"
            style={{ animationFillMode: "forwards" }}
          ></div>
        </div>
      </div>
    </AuthFormLayout>
  );
};

export default SuccessModal;
