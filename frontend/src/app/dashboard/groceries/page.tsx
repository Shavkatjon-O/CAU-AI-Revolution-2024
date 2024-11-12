"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
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

type ShoppingList = {
  id: string;
  name: string;
  ingredients: string[];
  dueDate: string;
  priority: string;
};

const FormSchema = z.object({
  dob: z.date({
    required_error: "A due date is required.",
  }),
  priority: z.string().min(1, "Priority is required."),
});

const Page = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [newIngredientForList, setNewIngredientForList] = useState<{ [key: string]: string }>({});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  // Load shopping lists from cookies when the component mounts
  useEffect(() => {
    const storedShoppingLists = Cookies.get("shoppingLists");
    if (storedShoppingLists) {
      setShoppingLists(JSON.parse(storedShoppingLists));
    }
  }, []);

  // Save shopping lists to cookies whenever they change
  useEffect(() => {
    if (shoppingLists.length > 0) {
      Cookies.set("shoppingLists", JSON.stringify(shoppingLists), { expires: 7 });
    }
  }, [shoppingLists]);

  const createShoppingList = (data: z.infer<typeof FormSchema>) => {
    if (!newListName || !data.dob || !data.priority) return;

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: newListName,
      ingredients: [],
      dueDate: format(data.dob, "yyyy-MM-dd"), // Format the date to YYYY-MM-DD
      priority: data.priority,
    };

    const updatedShoppingLists = [...shoppingLists, newList];
    setShoppingLists(updatedShoppingLists);
    setNewListName("");
    setNewIngredientForList({});
  };

  const addIngredientToList = (listId: string) => {
    const ingredient = newIngredientForList[listId];
    if (!ingredient) return;

    const updatedShoppingLists = shoppingLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          ingredients: [...list.ingredients, ingredient],
        };
      }
      return list;
    });

    setShoppingLists(updatedShoppingLists);
    setNewIngredientForList((prev) => ({ ...prev, [listId]: "" }));
  };

  const removeShoppingList = (id: string) => {
    const updatedShoppingLists = shoppingLists.filter((list) => list.id !== id);
    setShoppingLists(updatedShoppingLists);
  };

  const handleIngredientChange = (listId: string, value: string) => {
    setNewIngredientForList((prev) => ({
      ...prev,
      [listId]: value,
    }));
  };

  return (
    <div className="p-6 h-full overflow-y-scroll">
      <h1 className="text-custom text-3xl font-semibold px-6 mb-6">Shopping Lists</h1>

      <div className="mb-6 bg-white p-6 rounded-lg">
        <span className="mb-1">Title</span>
        <Input
          className="mb-4 mt-1 h-12"
          placeholder="Enter shopping list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />

        {/* FormProvider wraps the entire form */}
        <FormProvider {...form}>
          {/* Date Picker */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="pl-3 text-left font-normal w-full h-12"
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          {/* Priority Selector - ShadCN Select */}
          <div className="mb-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Priority</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
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
                  {/* Handling errors correctly */}
                  {form.formState.errors.priority && (
                    <p className="text-red-500 text-sm">{form.formState.errors.priority?.message}</p>
                  )}
                </FormItem>
              )}
            />
          </div>

          <Button
            onClick={() => createShoppingList(form.getValues())}
            className="bg-custom hover:bg-indigo-700 text-white w-full h-12"
          >
            <PlusCircle className="mr-1" />
            Create Shopping List
          </Button>
        </FormProvider>
      </div>

      <div className="space-y-4">
        {shoppingLists.map((list) => (
          <Card key={list.id} className="p-4 shadow-none border-none">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">{list.name}</h2>
                <p className="text-sm text-custom mt-4">
                  Due: {list.dueDate} | Priority: {list.priority}
                </p>
                <div className="mt-4">
                  <div className="w-max bg-indigo-500 rounded-lg mb-4">
                    <h3 className="text-md p-2 text-white">Ingredients</h3>
                  </div>
                  <ul className="list-disc pl-6">
                    {list.ingredients.length > 0 ? (
                      list.ingredients.map((ingredient, idx) => (
                        <li key={idx} className="text-sm">{ingredient}</li>
                      ))
                    ) : (
                      <li className="text-sm text-gray-500">No ingredients yet</li>
                    )}
                  </ul>
                </div>
              </div>
              <Button onClick={() => removeShoppingList(list.id)} className="p-2" variant="secondary">
                <Trash2 />
              </Button>
            </div>

            <div className="mt-4">
              <Textarea
                className="mb-4"
                placeholder="Add new ingredient"
                value={newIngredientForList[list.id] || ""}
                onChange={(e) => handleIngredientChange(list.id, e.target.value)}
              />
              <Button
                onClick={() => addIngredientToList(list.id)}
                className="bg-custom hover:bg-indigo-700 text-white w-full h-12"
              >
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
