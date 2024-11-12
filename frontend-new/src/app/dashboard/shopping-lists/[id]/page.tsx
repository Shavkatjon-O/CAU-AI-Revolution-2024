"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'next/navigation';

interface Ingredient {
  id: number;
  name: string;
}

interface ShoppingList {
  id: number;
  name: string;
  items: Ingredient[];
}

const ShoppingList: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredientName, setNewIngredientName] = useState('');

  useEffect(() => {
    const savedLists = Cookies.get('shoppingLists');
    if (savedLists) {
      const lists: ShoppingList[] = JSON.parse(savedLists);
      const list = lists.find((list) => list.id === parseInt(id));
      if (list) {
        setIngredients(list.items);
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
    <div className="container mx-auto py-20 text-center">
      <h2 className="text-3xl font-bold mb-8">Shopping List {id}</h2>
      <form onSubmit={handleAddIngredient} className="mb-6">
        <input
          type="text"
          value={newIngredientName}
          onChange={(e) => setNewIngredientName(e.target.value)}
          placeholder="Enter ingredient name"
          className="px-4 py-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Ingredient
        </button>
      </form>
      <ul className="space-y-4">
        {ingredients.map(ingredient => (
          <li key={ingredient.id} className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center">
            <span>{ingredient.name}</span>
            <button
              onClick={() => handleRemoveIngredient(ingredient.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={() => router.back()}
        className="mt-6 text-blue-500 hover:underline"
      >
        Back to Lists
      </button>
    </div>
  );
};

export default ShoppingList;
