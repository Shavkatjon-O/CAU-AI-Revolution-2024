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
import { signIn, signUp } from '@/services/auth';
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const FormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Page = () => {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    ////////////////// Sign Up Logic //////////////////
    try {
      const response = await signUp(data.email, data.password);

      setMessage(response.message);

      if (response.success) {
        const signInResponse = await signIn(data.email, data.password);

        if (signInResponse.success) {
          console.log("Sign-up and sign-in successful");
          router.push("/dashboard/onboarding");
        } else {
          console.log("Sign-in failed after sign-up");
        }
      } else {
        console.log("Sign-up failed");
      }
    } catch (error) {
      console.log("Error during sign-up:", error);
      setMessage("An error occurred during sign-up.");
    } finally {
      setIsSubmitting(false);
    }
    /////////////////////////////////////////////////////
  };

  return (
    <div className="size-full flex justify-center items-center px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="py-6 max-w-sm w-full px-6 space-y-3 shadow-sm rounded-md border">
          <h1 className="text-custom text-2xl font-bold text-center">SafeBite</h1>

          <div>
            <Image
              src="/images/auth-image.svg"
              alt="Auth Image"
              width={300}
              height={300}
              className="w-full"
            />
          </div>

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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm Password" {...field}
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {message && (
            <div className="flex justify-center w-full bg-slate-100 py-2 rounded-md">
              <span className="text-indigo-500">{message}</span>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 bg-custom hover:bg-indigo-800 font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin text-white" />
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="w-full flex justify-center">
            <span className="text-slate-500">Already have account?</span>
            <Link href="/sign-in" className="text-custom ml-1">Sign In</Link>
          </div>

        </form>
      </Form>
    </div>
  );
}

export default Page;
