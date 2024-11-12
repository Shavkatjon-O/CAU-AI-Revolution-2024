"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/token/`, {
        email,
        password,
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
    <div>
      <label htmlFor="email">Email:</label>
      <Input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <label htmlFor="password">Password:</label>
      <Input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <Button onClick={handleSignUp}>Sign In</Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Page;
