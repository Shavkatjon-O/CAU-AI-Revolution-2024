"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
}

const Page: React.FC = () => {
  const [recommendedMeals, setRecommendedMeals] = useState<Meal[]>([]);

  // Fetch recommended meals from TheMealDB API
  useEffect(() => {
    const fetchRecommendedMeals = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken');
        const data = await response.json();
        setRecommendedMeals(data.meals.slice(0, 3)); // Limit to 3 recipes for display
      } catch (error) {
        console.error('Error fetching recommended meals:', error);
      }
    };

    fetchRecommendedMeals();
  }, []);

  return (
    <div className="bg-gray-100 h-full overflow-y-scroll py-20">
      {/* Today's Progress */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Today`s Progress</h2>
          <button className="text-blue-500 hover:underline">View more</button>
        </div>
        <div className="flex items-center mt-4">
          <div className="flex-1">
            <p className="text-gray-500">Calories</p>
            <h3 className="text-2xl font-semibold">1,284</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 bg-yellow-400 rounded-full">
              <p className="absolute inset-0 flex items-center justify-center text-white font-semibold">29%</p>
            </div>
            <p className="text-gray-500">Fat</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 bg-blue-400 rounded-full">
              <p className="absolute inset-0 flex items-center justify-center text-white font-semibold">65%</p>
            </div>
            <p className="text-gray-500">Protein</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 bg-green-400 rounded-full">
              <p className="absolute inset-0 flex items-center justify-center text-white font-semibold">85%</p>
            </div>
            <p className="text-gray-500">Carbs</p>
          </div>
        </div>
      </div>

      {/* Recommended Recipes Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recommended for You</h2>
          <button className="text-blue-500 hover:underline">View all</button>
        </div>

        {recommendedMeals.length > 0 ? (
          recommendedMeals.map((meal) => (
            <div key={meal.idMeal} className="bg-gray-100 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-2">{meal.strMeal}</h3>
              <Image
                src={meal.strMealThumb}
                alt={meal.strMeal}
                width={384}
                height={192}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Category: {meal.strCategory || 'Chicken'}</p>
                <button className="text-blue-500 hover:underline">View Recipe</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Loading recommended recipes...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
