"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Ingredient {
  id: number;
  name: string;
}

interface ShoppingList {
  id: number;
  name: string;
  items: Ingredient[];
}

const Page: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [listName, setListName] = useState('');

  useEffect(() => {
    const savedLists = Cookies.get('shoppingLists');
    if (savedLists) {
      const lists: ShoppingList[] = JSON.parse(savedLists);
      const list = lists.find((list) => list.id === parseInt(id));
      if (list) {
        setIngredients(list.items);
        setListName(list.name);
      }
    }
  }, [id]);

  const updateCookies = (newIngredients: Ingredient[]) => {
    const savedLists = Cookies.get('shoppingLists');
    if (savedLists) {
      const lists: ShoppingList[] = JSON.parse(savedLists).map((list: ShoppingList) =>
        list.id === parseInt(id) ? { ...list, items: newIngredients } : list
      );
      Cookies.set('shoppingLists', JSON.stringify(lists), { expires: 7 });
    }
  };

  const handleAddIngredient = (event: FormEvent) => {
    event.preventDefault();
    if (newIngredientName.trim() === '') return;

    const newIngredient: Ingredient = {
      id: Date.now(),
      name: newIngredientName
    };
    const updatedIngredients = [...ingredients, newIngredient];
    setIngredients(updatedIngredients);
    updateCookies(updatedIngredients);
    setNewIngredientName('');
  };

  const handleRemoveIngredient = (ingredientId: number) => {
    const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== ingredientId);
    setIngredients(updatedIngredients);
    updateCookies(updatedIngredients);
  };

  return (
    <div className="pt-16 pb-20 px-6 text-center">
      <h2 className="text-2xl text-custom font-bold my-6">{listName}</h2>
      <form onSubmit={handleAddIngredient} className="mb-6">
        <div className="flex">
          <Input
            type="text"
            value={newIngredientName}
            onChange={(e) => setNewIngredientName(e.target.value)}
            placeholder="Enter ingredient name"
            className="mr-2 w-full h-12"
          />
          <Button type="submit" className="h-12 bg-custom hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Add Ingredient
          </Button>
        </div>
      </form>
      <ul className="space-y-4">
        {ingredients.map(ingredient => (
          <li key={ingredient.id} className="bg-indigo-50 p-4 rounded-md flex justify-between items-center">
            <span className="font-semibold text-blue-600">{ingredient.name}</span>
            <Button
              onClick={() => handleRemoveIngredient(ingredient.id)}
              className="text-white bg-indigo-500 hover:bg-indigo-700"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => router.back()}
        className="mt-6 h-12 bg-custom hover:bg-indigo-800"
      >
        Back to Lists
      </Button>
    </div>
  );
};

export default Page;
