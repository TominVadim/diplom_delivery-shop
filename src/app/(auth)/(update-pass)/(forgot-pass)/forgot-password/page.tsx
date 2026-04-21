"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/phone-pass-reset");
  }, [router]);
  
  return null;
};

export default ForgotPassword;
