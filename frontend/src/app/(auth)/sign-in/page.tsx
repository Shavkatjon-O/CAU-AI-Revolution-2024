"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link"; 

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/token/`, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        Cookies.set("accessToken", response.data.access);
        Cookies.set("refreshToken", response.data.refresh);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Sign-in failed. Please check your credentials.");
      console.log(err);
    }
  };

  return (
    <div className="px-4">
      <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-3xl shadow-2xl border">
        <div className="flex items-center justify-center pb-6 font-semibold text-custom">
          <span className="text-3xl">SafeBite</span>
        </div>

        <Image
          src="/img/sign-up-image.svg"
          alt="Image"
          width={256}
          height={256}
          className="mx-auto w-full mb-6 shadow-md rounded-3xl"
        />

        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="pl-10 h-12 focus:border-custom"
          />
          <Mail size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        <div className="relative mt-4">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="pl-10 h-12 focus:border-custom"
          />
          <Lock size={20} className="text-custom absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="flex justify-center mt-4">
          <Button
            onClick={handleSignIn}
            className="w-full h-12 bg-custom hover:bg-indigo-800 font-semibold"
          >
            Sign In
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm">
            Do not have an account yet?{" "}
            <Link href="/sign-up" className="text-custom font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
