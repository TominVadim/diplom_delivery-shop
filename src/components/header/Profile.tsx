"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import iconArrow from "/public/icons-header/icon-arrow.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Функция для получения данных из localStorage
  const loadUserData = () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name);
      } catch {
        setUserName(null);
      }
    } else {
      setUserName(null);
    }
  };

  // Загрузка при монтировании
  useEffect(() => {
    loadUserData();
  }, []);

  // Слушаем событие storage (для обновления при логине в другой вкладке)
  // и кастомное событие для обновления в той же вкладке
  useEffect(() => {
    const handleStorageChange = () => {
      loadUserData();
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-login", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-login", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("user");
      setUserName(null);
      // Диспатчим событие для обновления других компонентов
      window.dispatchEvent(new Event("storage"));
      router.replace("/");
    } catch (error) {
      console.error("Не удалось выйти:", error);
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  if (!userName) {
    return (
      <Link
        href="/login"
        className="ml-6 w-10 xl:w-[157px] flex justify-between items-center gap-x-2 p-2 rounded text-white text-base bg-[#ff6633] hover:shadow-(--shadow-article) active:shadow-(--shadow-button-active) duration-300 cursor-pointer"
      >
        <div className="w-[109px] justify-center hidden xl:flex">
          <p>Войти</p>
        </div>
        <Image
          src="/icons-header/icon-entry.svg"
          alt="Войти"
          width={24}
          height={24}
        />
      </Link>
    );
  }

  return (
    <div className="relative ml-6" ref={menuRef}>
      <div
        className="flex items-center gap-2.5 cursor-pointer"
        onClick={toggleMenu}
      >
        <div className="min-w-10 min-h-10 w-10 h-10 rounded-full bg-[#ff6633] flex items-center justify-center text-white font-bold">
          {userName.charAt(0).toUpperCase()}
        </div>
        <p className="hidden xl:block cursor-pointer p-2.5">{userName}</p>
        <div className="hidden xl:block">
          <Image
            src={iconArrow}
            alt="Меню профиля"
            width={24}
            height={24}
            sizes="24px"
            className={`transform transition-transform duration-300 ${
              isMenuOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      <div
        className={`absolute right-0 bg-white rounded shadow-button-secondary overflow-hidden z-50 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } transition-all duration-300 min-w-[200px] ${
          isMobile ? "bottom-full top-auto mb-6" : "top-full mt-6"
        }`}
      >
        <Link
          href="/user-profile"
          className="block px-4 py-3 text-[#414141] hover:text-[#ff6633] duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Профиль
        </Link>
        <Link
          href="/"
          className="block px-4 py-3 text-[#414141] hover:text-[#ff6633] duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Главная
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full text-left px-4 py-3 text-[#414141] hover:text-[#ff6633] duration-300 border-t border-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? "Выход..." : "Выйти"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
