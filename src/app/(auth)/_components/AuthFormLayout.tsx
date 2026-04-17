import CloseButton from "./CloseButton";

type AuthFormVariant = "register" | "default";

export const AuthFormLayout = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: AuthFormVariant;
}) => (
  <div className="fixed inset-0 z-100 flex items-center justify-center bg-[#fcd5bacc] text-[#414141] p-4 backdrop-blur-sm overflow-y-auto">
    <div
      className={`${variant === "register" ? "max-w-[687px]" : "max-w-[420px]"} relative bg-white rounded shadow-(--shadow-auth-form) w-full my-8`}
    >
      <CloseButton />
      <div className="pt-16 pb-8 px-6">{children}</div>
    </div>
  </div>
);
