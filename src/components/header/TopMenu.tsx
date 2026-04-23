"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import iconHeart from "/public/icons-header/icon-heart.svg";
import iconCart from "/public/icons-header/icon-cart.svg";
import IconMenuMob from "../svg/IconMenuMob";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconBox from "../svg/IconBox";

const TopMenu = () => {
  const pathname = usePathname();
  const isCatalogPage = pathname === "/catalog";
  const [userRole, setUserRole] = useState<string>("user");

  useEffect(() => {
    const loadUserRole = () => {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setUserRole(user.role || "user");
        } catch {
          setUserRole("user");
        }
      } else {
        setUserRole("user");
      }
    };

    loadUserRole();

    const handleStorageChange = () => {
      loadUserRole();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("user-login", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-login", handleStorageChange);
    };
  }, []);

  const isManagerOrAdmin = userRole === "admin" || userRole === "manager";

  return (
    <ul className="flex flex-row gap-x-6 items-end">
      <Link href="/catalog">
        <li className="flex flex-col items-center gap-2.5 md:hidden w-11 cursor-pointer">
          <IconMenuMob isCatalogPage={isCatalogPage} />
          <span className={isCatalogPage ? "text-[#ff6633]" : "text-[#414141]"}>
            Каталог
          </span>
        </li>
      </Link>
      
      {!isManagerOrAdmin && (
        <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
          <Image
            src={iconHeart}
            alt="Избранное"
            width={24}
            height={24}
            className="object-contain w-6 h-6"
          />
          <span>Избранное</span>
        </li>
      )}

      <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
        <IconBox />
        <span className={isManagerOrAdmin ? "text-[#ff6633]" : ""}>Заказы</span>
      </li>
      
      {!isManagerOrAdmin && (
        <li className="flex flex-col items-center gap-2.5 w-11 cursor-pointer">
          <Image
            src={iconCart}
            alt="Корзина"
            width={24}
            height={24}
            className="object-contain w-6 h-6"
          />
          <span>Корзина</span>
        </li>
      )}
    </ul>
  );
};

export default TopMenu;
