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

// Step 1 Schema with manual transformations
const Step1Schema = z.object({
  age: z
    .string() // Treat input as string initially
    .transform((val) => parseInt(val)) // Convert to integer
    .refine((val) => !isNaN(val), { message: "Age must be a valid number" })
    .refine((val) => val > 0, { message: "Age must be a positive number" })
    .refine((val) => val >= 1, { message: "Age must be at least 1" }),

  gender: z.enum(["Male", "Female"]),

  height: z
    .string() // Treat input as string initially
    .transform((val) => parseFloat(val)) // Convert to float for height
    .refine((val) => !isNaN(val), { message: "Height must be a valid number" })
    .refine((val) => val > 0, { message: "Height must be positive" })
    .refine((val) => val <= 300, { message: "Height seems too large" }),

  weight: z
    .string() // Treat input as string initially
    .transform((val) => parseFloat(val)) // Convert to float for weight
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

const UpdateProfilePage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<Step1Data & Step2Data & Step3Data>({
    age: 1, // Ensure age is a valid value (1 or greater)
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
    defaultValues: { age: 1, gender: "Male", height: 0, weight: 0 },
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
    <div className="w-full max-w-md mx-auto px-4 py-6">
      <h1 className="text-center text-2xl font-bold">Update Your Profile</h1>

      {/* Step 1 Form */}
      {step === 1 && (
        <form onSubmit={form1.handleSubmit(onSubmitStep1)} className="space-y-4">
          <div>
            <label>Age</label>
            <Input type="number" {...form1.register("age")} />
            {form1.formState.errors.age && (
              <p className="text-red-500">{form1.formState.errors.age.message}</p>
            )}
          </div>
          <div>
            <label>Gender</label>
            <select {...form1.register("gender")}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label>Height (cm)</label>
            <Input type="number" {...form1.register("height")} />
            {form1.formState.errors.height && (
              <p className="text-red-500">{form1.formState.errors.height.message}</p>
            )}
          </div>
          <div>
            <label>Weight (kg)</label>
            <Input type="number" {...form1.register("weight")} />
            {form1.formState.errors.weight && (
              <p className="text-red-500">{form1.formState.errors.weight.message}</p>
            )}
          </div>

          {message && <p className="text-red-500">{message}</p>}

          <div className="flex justify-between">
            <Button type="button" onClick={handleSkip} className="w-1/2">
              Skip
            </Button>
            <Button type="submit" className="w-1/2" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Next"}
            </Button>
          </div>
        </form>
      )}

      {/* Step 2 Form */}
      {step === 2 && (
        <form onSubmit={form2.handleSubmit(onSubmitStep2)} className="space-y-4">
          <div>
            <label>Goal</label>
            <select {...form2.register("goal")}>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Maintain">Maintain</option>
            </select>
          </div>
          <div>
            <label>Allergies</label>
            <Input {...form2.register("allergies")} />
          </div>

          {message && <p className="text-red-500">{message}</p>}

          <div className="flex justify-between">
            <Button type="button" onClick={handleSkip} className="w-1/2">
              Skip
            </Button>
            <Button type="submit" className="w-1/2" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Next"}
            </Button>
          </div>
        </form>
      )}

      {/* Step 3 Form */}
      {step === 3 && (
        <form onSubmit={form3.handleSubmit(onSubmitStep3)} className="space-y-4">
          <div>
            <label>Activity Level</label>
            <select {...form3.register("activity_level")}>
              <option value="Sedentary">Sedentary</option>
              <option value="Light">Light</option>
              <option value="Moderate">Moderate</option>
              <option value="Active">Active</option>
              <option value="Very Active">Very Active</option>
            </select>
          </div>
          <div>
            <label>Dietary Preferences</label>
            <Input {...form3.register("dietary_preferences")} />
          </div>

          {message && <p className="text-red-500">{message}</p>}

          <div className="flex justify-between">
            <Button type="button" onClick={handleSkip} className="w-1/2">
              Skip
            </Button>
            <Button type="submit" className="w-1/2" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Submit"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateProfilePage;
