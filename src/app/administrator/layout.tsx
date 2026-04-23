"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.replace("/");
        return;
      }

      try {
        const user = JSON.parse(userStr);
        const role = user.role || "user";
        
        if (role === "admin" || role === "manager") {
          setHasAccess(true);
        } else {
          router.replace("/");
        }
      } catch {
        router.replace("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (isLoading) {
    return <Loader />;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
}
