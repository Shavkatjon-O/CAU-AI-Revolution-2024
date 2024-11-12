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
import { format } from "date-fns";
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
} from "@/components/ui/form";

type MealPlan = {
  id: string;
  mealName: string;
  dayOfWeek: string;
  mealTime: string;
  ingredients: string[];
  priority: string;
};

const FormSchema = z.object({
  mealTime: z.string().min(1, "Meal time is required."),
  priority: z.string().min(1, "Priority is required."),
});

const Page = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [newMealName, setNewMealName] = useState("");
  const [newMealIngredients, setNewMealIngredients] = useState<{ [key: string]: string }>({});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Load meal plans from cookies on mount
  useEffect(() => {
    const storedMealPlans = Cookies.get("mealPlans");
    if (storedMealPlans) {
      setMealPlans(JSON.parse(storedMealPlans));
    }
  }, []);

  // Save meal plans to cookies when updated
  useEffect(() => {
    Cookies.set("mealPlans", JSON.stringify(mealPlans), { expires: 7 });
  }, [mealPlans]);

  const createMealPlan = (data: z.infer<typeof FormSchema>) => {
    if (!newMealName || !data.mealTime || !data.priority) return;

    const newMeal: MealPlan = {
      id: Date.now().toString(),
      mealName: newMealName,
      dayOfWeek: format(new Date(), "EEEE"), 
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

  return (
    <div className="p-4 overflow-y-scroll mx-auto h-full">
      <h1 className="text-3xl font-semibold text-custom px-6 mb-6">Meal Planner</h1>

      {/* Meal Plan Creation Form */}
      <div className="bg-white p-6 rounded-lg mb-6 shadow-md">
        <Input
          className="mb-4 h-12"
          placeholder="Enter meal name (e.g., Breakfast, Lunch, Dinner)"
          value={newMealName}
          onChange={(e) => setNewMealName(e.target.value)}
        />

        <FormProvider {...form}>
          <div className="mb-6">
            <FormField
              control={form.control}
              name="mealTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Meal Time</FormLabel>
                  <Input
                    {...field}
                    className="h-12"
                    placeholder="Enter meal time (e.g., 8:00 AM)"
                  />
                </FormItem>
              )}
            />
          </div>

          <div className="mb-6">
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
            className="bg-blue-600 hover:bg-blue-700 text-white w-full h-12"
          >
            <PlusCircle className="mr-1" />
            Create Meal Plan
          </Button>
        </FormProvider>
      </div>

      {/* Meal Plans Display */}
      <div className="space-y-6">
        {mealPlans.map((meal) => (
          <Card key={meal.id} className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{meal.mealName} ({meal.dayOfWeek})</h2>
                <p className="text-sm text-gray-600">
                  Time: {meal.mealTime} | Priority: {meal.priority}
                </p>
                <div className="mt-4">
                  <h3 className="text-lg">Ingredients</h3>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {meal.ingredients.length > 0 ? (
                      meal.ingredients.map((ingredient, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-100 p-3 rounded-md shadow-sm text-sm text-gray-700 flex items-center justify-between"
                        >
                          <span>{ingredient}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No ingredients yet</p>
                    )}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => removeMealPlan(meal.id)}
                className="p-2 text-red-500"
                variant="ghost"
              >
                <Trash2 />
              </Button>
            </div>

            {/* Add Ingredient Section */}
            <div className="mt-4">
              <Textarea
                className="mb-4"
                placeholder="Add new ingredient"
                value={newMealIngredients[meal.id] || ""}
                onChange={(e) => handleIngredientChange(meal.id, e.target.value)}
              />
              <Button
                onClick={() => addIngredientToMeal(meal.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full h-12"
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
