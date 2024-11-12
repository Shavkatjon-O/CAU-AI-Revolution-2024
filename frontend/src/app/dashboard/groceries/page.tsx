"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Cookies from "js-cookie";

type ShoppingList = {
  id: string;
  name: string;
  ingredients: string[];
  dueDate: string;
  priority: string;
};

const Page = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [newIngredientForList, setNewIngredientForList] = useState<{ [key: string]: string }>({});

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

  const createShoppingList = () => {
    if (!newListName) return;

    const newList: ShoppingList = {
      id: Date.now().toString(),
      name: newListName,
      ingredients: [],
      dueDate,
      priority,
    };
    const updatedShoppingLists = [...shoppingLists, newList];
    setShoppingLists(updatedShoppingLists);
    setNewListName("");
    setDueDate("");
    setPriority("");
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
    <div className="bg-white p-6 h-full overflow-y-scroll">
      <h1 className="text-custom text-3xl font-semibold mb-6">Shopping Lists</h1>

      <div className="mb-6">
        <Input
          className="mb-4 h-12"
          placeholder="Enter shopping list name"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <Input
          className="mb-4 h-12"
          placeholder="Due date (e.g., 2024-12-01)"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Input
          className="mb-4 h-12"
          placeholder="Priority (e.g., High, Medium, Low)"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />
        <Button onClick={createShoppingList} className="bg-custom hover:bg-indigo-700 text-white w-full h-12">
          <PlusCircle className="mr-1"  />
          Create Shopping List
        </Button>
      </div>

      <div className="space-y-4">
        {shoppingLists.map((list) => (
          <Card key={list.id} className="p-4 shadow-lg">
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold">{list.name}</h2>
                <p className="text-sm text-gray-600">
                  Due: {list.dueDate} | Priority: {list.priority}
                </p>
                <div className="mt-2">
                  <h3 className="text-lg">Ingredients</h3>
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
              <Button
                onClick={() => removeShoppingList(list.id)}
                className="p-2"
                variant="secondary"
              >
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
