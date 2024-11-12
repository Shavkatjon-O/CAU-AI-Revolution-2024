"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShoppingList {
  id: number;
  name: string;
  items: string[];
}

const Page: React.FC = () => {
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
    <div className="pt-16 pb-20 px-6 text-center">
      <h1 className="text-2xl text-custom font-bold my-6">Shopping Lists</h1>
      <form onSubmit={handleAddList} className="mb-6">
        <div className='flex'>
          <Input
            type="text"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            placeholder="Enter list title"
            className="mr-2 w-full h-12"
          />
          <Button type="submit" className="h-12 bg-custom hover:bg-indigo-700 text-white px-4 py-2 rounded">
            Create
          </Button>
        </div>
      </form>
      <ul className="space-y-4">
        {shoppingLists.map(list => (
          <li key={list.id} className="bg-indigo-50 p-4 rounded-md flex justify-between items-center">
            <Link href={`/dashboard/shopping-lists/${list.id}`} className="font-semibold text-blue-600 hover:underline">
              {list.name}
            </Link>
            <Button
              onClick={() => handleRemoveList(list.id)}
              className="text-white bg-indigo-500 hover:bg-indigo-700"
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
