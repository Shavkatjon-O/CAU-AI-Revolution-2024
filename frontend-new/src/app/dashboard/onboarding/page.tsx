"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import coreApi from "@/lib/coreApi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Step1Schema = z.object({
  age: z
    .string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), { message: "Age must be a valid number" })
    .refine((val) => val > 0, { message: "Age must be a positive number" })
    .refine((val) => val >= 1, { message: "Age must be at least 1" }),

  gender: z.enum(["Male", "Female"]),

  height: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: "Height must be a valid number" })
    .refine((val) => val > 0, { message: "Height must be positive" })
    .refine((val) => val <= 300, { message: "Height seems too large" }),

  weight: z
    .string()
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val), { message: "Weight must be a valid number" })
    .refine((val) => val > 0, { message: "Weight must be positive" })
    .refine((val) => val <= 500, { message: "Weight seems too large" }),
});

const Step2Schema = z.object({
  goal: z.enum(["Weight Loss", "Muscle Gain", "Maintain"]),
  allergies: z.string().optional(),
});

const Step3Schema = z.object({
  activity_level: z.enum(["Sedentary", "Light", "Moderate", "Active", "Very Active"]),
  dietary_preferences: z.string().optional(),
});

type Step1Data = z.infer<typeof Step1Schema>;
type Step2Data = z.infer<typeof Step2Schema>;
type Step3Data = z.infer<typeof Step3Schema>;

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<Step1Data & Step2Data & Step3Data>({
    age: 0,
    gender: "Male",
    height: 0,
    weight: 0,
    goal: "Weight Loss",
    allergies: "",
    activity_level: "Sedentary",
    dietary_preferences: "",
  });
  const [message, setMessage] = useState("");

  const form1 = useForm<Step1Data>({
    resolver: zodResolver(Step1Schema),
    defaultValues: { age: 0, gender: "Male", height: 0, weight: 0 },
  });

  const form2 = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    defaultValues: { goal: "Weight Loss", allergies: "" },
  });

  const form3 = useForm<Step3Data>({
    resolver: zodResolver(Step3Schema),
    defaultValues: { activity_level: "Sedentary", dietary_preferences: "" },
  });

  const onSubmitStep1: SubmitHandler<Step1Data> = (data) => {
    setUserData((prevData) => ({ ...prevData, ...data }));
    setStep(2);
  };

  const onSubmitStep2: SubmitHandler<Step2Data> = (data) => {
    setUserData((prevData) => ({ ...prevData, ...data }));
    setStep(3);
  };

  const onSubmitStep3: SubmitHandler<Step3Data> = async (data) => {
    setIsSubmitting(true);
    setUserData((prevData) => ({ ...prevData, ...data }));

    try {
      const response = await coreApi.put("/users/update/", userData);
      if (response.status === 200) {
        router.push("/dashboard");
      } else {
        setMessage("An error occurred while updating your profile.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage("Error: " + error.message);
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  return (
    <div className="size-full max-w-md mx-auto p-6 flex justify-center items-center">
      <div className="p-6 shadow-sm rounded-md border max-w-sm w-full">

        <h1 className="text-center text-2xl font-bold text-custom">Profile Information</h1>

        {/* Step 1 Form */}
        {step === 1 && (
          <Form {...form1}>
            <form onSubmit={form1.handleSubmit(onSubmitStep1)} className="space-y-4">
              <FormField
                control={form1.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Age" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form1.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Gender Options</SelectLabel>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form1.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Height" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form1.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Weight" {...field} className="h-12" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {message && <p className="text-red-500">{message}</p>}

              <div className="flex justify-between gap-2">
                <Button type="button" onClick={handleSkip} className="w-1/2 h-12" variant="secondary">
                  Skip
                </Button>
                <Button type="submit" className="w-1/2 h-12 bg-custom hover:bg-indigo-800" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 2 Form */}
        {step === 2 && (
          <Form {...form2}>
            <form onSubmit={form2.handleSubmit(onSubmitStep2)} className="space-y-4">
              <FormField
                control={form2.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Goal Options</SelectLabel>
                            <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                            <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                            <SelectItem value="Maintain">Maintain</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form2.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" placeholder="Allergies" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {message && <p className="text-red-500">{message}</p>}

              <div className="flex justify-between gap-2">
                <Button type="button" onClick={handleSkip} className="w-1/2 h-12" variant="secondary">
                  Skip
                </Button>
                <Button type="submit" className="w-1/2 h-12 bg-custom hover:bg-indigo-800" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Next"}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* Step 3 Form */}
        {step === 3 && (
          <Form {...form3}>
            <form onSubmit={form3.handleSubmit(onSubmitStep3)} className="space-y-4">
              <FormField
                control={form3.control}
                name="activity_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Activity Level Options</SelectLabel>
                            <SelectItem value="Sedentary">Sedentary</SelectItem>
                            <SelectItem value="Light">Light</SelectItem>
                            <SelectItem value="Moderate">Moderate</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Very Active">Very Active</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form3.control}
                name="dietary_preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <FormControl>
                      <Input {...field} className="h-12" placeholder="Dietary Preferences" />
                    </FormControl>
                  </FormItem>
                )}
              />

              {message && <p className="text-red-500">{message}</p>}

              <div className="flex justify-between">
                <Button type="submit" className="w-full h-12 bg-custom hover:bg-indigo-800" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Page;
