"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from '@/services/auth';
import { z } from "zod";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export function SignInForm() {
  const router = useRouter();

  const [message, setMessage] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    ////////////////// Authentication Logic //////////////////
    try {
      const response = await signIn(data.email, data.password);

      setMessage(response.message);

      if (response.success) {
        console.log("Sign-in successful");

        router.push("/dashboard");
      } else {
        console.log("Sign-in failed");
      }
    } catch (error) {
      console.log("Error during sign-in:", error);

      setMessage("An error occurred during sign-in.");
    }
    //////////////////////////////////////////////////////////
  };

  return (
    <div className="size-full flex justify-center items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md w-full px-6 space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email" {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Password" {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 bg-custom hover:bg-indigo-800 font-semibold"
          >
            Sign In
          </Button>

          <div className="flex justify-center">
            {message && (
              <span className="text-indigo-500">{message}</span>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SignInForm;
