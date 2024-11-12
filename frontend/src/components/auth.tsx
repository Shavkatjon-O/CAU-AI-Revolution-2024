"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import axios from "axios"
import {
  Loader2,
} from "lucide-react"

const Auth = (WrappedComponent: React.ComponentType) => {
  const AuthComponent = (props: any) => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoaded, setisLoaded] = useState<boolean>(false)
  
    useEffect(() => {
      const checkAuth = async () => {
        try {
          const refreshToken = Cookies.get("refreshToken");
          if (!refreshToken) {
            router.push('/sign-in');
          }
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/token/verify/`, {
            token: refreshToken,
          })
          if (response.status === 200) {
            setIsAuthenticated(true)
          } else {
            router.push('/sign-in');
          }
        } catch (error) {
          console.log(error)
          router.push('/sign-in');
        } finally {
          setisLoaded(true)
        }
      }
      checkAuth();
    }, [router]);
  
    if (isLoaded) {
      if (isAuthenticated) {
        return <WrappedComponent {...props} />
      } else {
        return null;
      }
    } else {
      return (
        <div className="h-screen flex justify-center items-center">
          <Loader2 className="animate-spin text-custom" />
        </div>
      );
    }
  }
  return AuthComponent;
}

export default Auth;