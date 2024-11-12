"use client";

import React from 'react';
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { signIn } from '@/services/auth';

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const Page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse({ email, password });

    if (!result.success) {
      const errorMessages = result.error.format();
      setErrors({
        email: errorMessages.email?._errors[0] || "",
        password: errorMessages.password?._errors[0] || "",
      });
      setMessage("");
    } else {
      setErrors({ email: "", password: "" });


      //////////////// Authentication Logic ////////////////////
      try {
        const response = await signIn(email, password);

        setMessage(response.message);

        if (response.success) {
          console.log("Sign-in successful");
        } else {
          console.log("Sign-in failed");
        }
      } catch (error) {
        console.log("Error during sign-in:", error);

        setMessage("An error occurred during sign-in.");
      }
      //////////////////////////////////////////////////////////
    }
  };

  return (
    <div className="size-full flex justify-center items-center">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <div>Sign In</div>

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <span className="text-red-500">{errors.password}</span>}

        <Button type="submit">
          Sign In
        </Button>

        {message && <span className="text-blue-500">{message}</span>}
      </form>
    </div>
  );
};

export default Page;
