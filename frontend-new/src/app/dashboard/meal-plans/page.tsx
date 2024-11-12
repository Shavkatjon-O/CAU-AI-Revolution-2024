"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue
} from "@/components/ui/select";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl
} from "@/components/ui/form";

type MealPlan = {
  id: string;
  mealName: string;
  mealTime: string;
  ingredients: string[];
  priority: string;
};

const FormSchema = z.object({
  mealTime: z.string().min(1, "Meal time is required."), // Time as string
  priority: z.string().min(1, "Priority is required."),
});

const priorityColors = {
  High: "bg-red-500 text-white",
  Medium: "bg-yellow-500 text-white",
  Low: "bg-green-500 text-white",
};

const Page = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [newMealName, setNewMealName] = useState("");
  const [newMealIngredients, setNewMealIngredients] = useState<{ [key: string]: string }>({});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    const storedMealPlans = Cookies.get("mealPlans");
    if (storedMealPlans) {
      setMealPlans(JSON.parse(storedMealPlans));
    }
  }, []);

  useEffect(() => {
    Cookies.set("mealPlans", JSON.stringify(mealPlans), { expires: 7 });
  }, [mealPlans]);

  const createMealPlan = (data: z.infer<typeof FormSchema>) => {
    if (!newMealName || !data.mealTime || !data.priority) return;

    const newMeal: MealPlan = {
      id: Date.now().toString(),
      mealName: newMealName,
      mealTime: data.mealTime,
      ingredients: [],
      priority: data.priority,
    };

    setMealPlans([...mealPlans, newMeal]);
    setNewMealName("");
    setNewMealIngredients({});
  };

  const addIngredientToMeal = (mealId: string) => {
    const ingredient = newMealIngredients[mealId];
    if (!ingredient) return;

    const updatedMealPlans = mealPlans.map((meal) => {
      if (meal.id === mealId) {
        return {
          ...meal,
          ingredients: [...meal.ingredients, ingredient],
        };
      }
      return meal;
    });

    setMealPlans(updatedMealPlans);
    setNewMealIngredients((prev) => ({ ...prev, [mealId]: "" }));
  };

  const removeMealPlan = (id: string) => {
    setMealPlans(mealPlans.filter((meal) => meal.id !== id));
  };

  const handleIngredientChange = (mealId: string, value: string) => {
    setNewMealIngredients((prev) => ({ ...prev, [mealId]: value }));
  };

  // Format meal time as "HH:MM"
  const formatMealTime = (mealTime: string) => {
    const [hour, minute] = mealTime.split(":");
    return `${hour}:${minute}`;
  };

  return (
    <div className="pt-16 pb-20 max-w-4xl mx-auto h-full overflow-y-scroll">
      <h1 className="text-3xl font-semibold text-custom px-6 pt-6 text-center">Meal Planner</h1>

      <div className="p-6 rounded-lg mb-6">
        <span className="mb-1">Title</span>
        <Input
          className="mb-4 mt-1 h-12"
          placeholder="Enter meal name (e.g., Breakfast, Lunch, Dinner)"
          value={newMealName}
          onChange={(e) => setNewMealName(e.target.value)}
        />

        <FormProvider {...form}>
          <div className="mb-4 flex items-center">
            <FormField
              control={form.control}
              name="mealTime"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Meal Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      {/* Hour Selector */}
                      <Select value={field.value?.split(":")[0] || ""} onValueChange={(value) => field.onChange(`${value}:${field.value?.split(":")[1] || "00"}`)}>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Hour" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="00">00</SelectItem>
                            <SelectItem value="01">01</SelectItem>
                            <SelectItem value="02">02</SelectItem>
                            <SelectItem value="03">03</SelectItem>
                            <SelectItem value="04">04</SelectItem>
                            <SelectItem value="05">05</SelectItem>
                            <SelectItem value="06">06</SelectItem>
                            <SelectItem value="07">07</SelectItem>
                            <SelectItem value="08">08</SelectItem>
                            <SelectItem value="09">09</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="11">11</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {/* Colon Separator */}
                      <span className="text-xl">:</span>
                      {/* Minute Selector */}
                      <Select value={field.value?.split(":")[1] || "00"} onValueChange={(value) => field.onChange(`${field.value?.split(":")[0] || "00"}:${value}`)}>
                        <SelectTrigger className="h-12 w-full">
                          <SelectValue placeholder="Min" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="00">00</SelectItem>
                            <SelectItem value="15">15</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="45">45</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Priority Selector */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Priority</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Priority Levels</SelectLabel>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.priority && (
                    <p className="text-red-500 text-sm">{form.formState.errors.priority?.message}</p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <Button
            onClick={() => createMealPlan(form.getValues())}
            className="bg-custom hover:bg-indigo-700 text-white w-full h-12"
          >
            <PlusCircle className="mr-1" />
            Create Meal Plan
          </Button>
        </FormProvider>
      </div>

      {/* Meal Plans Display */}
      <div className="space-y-6 border-t">
        {mealPlans.map((meal) => (
          <Card key={meal.id} className="p-6 bg-white rounded-lg border-none shadow-none">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl">{meal.mealName}</h2>
                <p className="text-sm text-custom mt-4">
                  Time: {formatMealTime(meal.mealTime)} |
                  <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${priorityColors[meal.priority as keyof typeof priorityColors]}`}>
                    {meal.priority}
                  </span>
                </p>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {meal.ingredients.length > 0 ? (
                      meal.ingredients.map((ingredient, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-3 py-1 text-sm font-semibold text-white bg-blue-500 rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500">No ingredients yet</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => removeMealPlan(meal.id)}
                size="icon"
                variant="secondary"
              >
                <Trash2 />
              </Button>
            </div>

            <div className="mt-4">
              <Textarea
                className="mb-4"
                placeholder="Add new ingredient"
                value={newMealIngredients[meal.id] || ""}
                onChange={(e) => handleIngredientChange(meal.id, e.target.value)}
              />
              <Button
                onClick={() => addIngredientToMeal(meal.id)}
                className="bg-custom hover:bg-indigo-700 text-white w-full h-12"
              >
                <CheckCircle className="mr-1" />
                Add Ingredient
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Page;
