"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface ShoppingList {
  id: number;
  name: string;
  items: string[];
}

const ShoppingListsPage: React.FC = () => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [newListTitle, setNewListTitle] = useState('');

  useEffect(() => {
    const savedLists = Cookies.get('shoppingLists');
    if (savedLists) {
      setShoppingLists(JSON.parse(savedLists));
    }
  }, []);

  const updateCookies = (lists: ShoppingList[]) => {
    Cookies.set('shoppingLists', JSON.stringify(lists), { expires: 7 });
  };

  const handleAddList = (event: FormEvent) => {
    event.preventDefault();
    if (newListTitle.trim() === '') return;

    const newList: ShoppingList = {
      id: Date.now(),
      name: newListTitle,
      items: []
    };
    const updatedLists = [...shoppingLists, newList];
    setShoppingLists(updatedLists);
    updateCookies(updatedLists);
    setNewListTitle('');
  };

  const handleRemoveList = (id: number) => {
    const updatedLists = shoppingLists.filter(list => list.id !== id);
    setShoppingLists(updatedLists);
    updateCookies(updatedLists);
  };

  return (
    <div className="container mx-auto py-20 text-center">
      <h1 className="text-3xl font-bold mb-8">Shopping Lists</h1>
      <form onSubmit={handleAddList} className="mb-6">
        <input
          type="text"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
          placeholder="Enter list title"
          className="px-4 py-2 border rounded mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create New List
        </button>
      </form>
      <ul className="space-y-4">
        {shoppingLists.map(list => (
          <li key={list.id} className="bg-gray-100 p-4 rounded shadow-md flex justify-between items-center">
            <Link href={`/dashboard/shopping-lists/${list.id}`} className="text-lg font-semibold text-blue-600 hover:underline">
              {list.name}
            </Link>
            <button
              onClick={() => handleRemoveList(list.id)}
              className="text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShoppingListsPage;
