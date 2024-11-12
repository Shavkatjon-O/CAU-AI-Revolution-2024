"use client"

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Loader2 } from "lucide-react";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    router.push("/sign-in");
  }, [router]);

  return (
    <div className="size-full flex justify-center items-center">
      <Loader2 className="animate-spin text-custom" />
    </div>
  );
}

export default Page;
