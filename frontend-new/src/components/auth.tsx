"use client";

import { useRouter } from "next/navigation";
import React, { ComponentType, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";

const Auth = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          const refreshToken = Cookies.get("refreshToken");
          if (!refreshToken) {
            router.push("/sign-in");
            return;
          }
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/token/verify/`,
            { token: refreshToken }
          );
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            router.push("/sign-in");
          }
        } catch (error) {
          console.log("Authentication error:", error);
          router.push("/sign-in");
        } finally {
          setIsLoaded(true);
        }
      };

      checkAuth();
    }, [router]);

    if (isLoaded) {
      return isAuthenticated ? <WrappedComponent {...props} /> : null;
    }

    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="animate-spin text-custom" />
      </div>
    );
  };

  return AuthComponent;
};

export default Auth;
