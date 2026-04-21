import Link from "next/link";

export default function GoodbyePage() {
  return (
    <div className="min-h-screen bg-[#fbf8ec] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#414141] mb-4">
          Ваш аккаунт был удален
        </h1>
        <p className="text-[#414141] mb-6">
          Спасибо, что были с нами. Все ваши данные были успешно удалены.
        </p>
        <Link
          href="/"
          className="inline-block w-full bg-[#ff6633] hover:shadow-md active:shadow-inner text-white text-center text-lg px-3 py-2 cursor-pointer rounded duration-300"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
