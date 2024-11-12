"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
}

const healthyCategories = ['Vegetarian', 'Seafood']; // Healthier meal categories

const Page: React.FC = () => {
  const [mealsByCategory, setMealsByCategory] = useState<Record<string, Meal[]>>({});

  useEffect(() => {
    const fetchHealthyMeals = async () => {
      const newMealsByCategory: Record<string, Meal[]> = {};
      try {
        // Fetch meals for each healthy category
        await Promise.all(
          healthyCategories.map(async (category) => {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();
            newMealsByCategory[category] = data.meals.slice(0, 6); // Limit each category to 6 meals
          })
        );
        setMealsByCategory(newMealsByCategory);
      } catch (error) {
        console.error('Error fetching healthy meals:', error);
      }
    };

    fetchHealthyMeals();
  }, []);

  return (
    <div className="h-full overflow-y-scroll pt-16 pb-20">
      {healthyCategories.map((category) => (
        <div key={category} className="bg-white px-6 pt-6 rounded-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">{category} Dishes</h2>
            <button className="text-blue-500 hover:underline">View all</button>
          </div>

          {mealsByCategory[category] && mealsByCategory[category].length > 0 ? (
            <div className="grid grid-cols-2 gap-4"> {/* Always two columns */}
              {mealsByCategory[category].map((meal) => (
                <div key={meal.idMeal} className="bg-white p-4 rounded-lg shadow-md">
                  <Image
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    width={384}
                    height={192}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold mb-2">{meal.strMeal}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">Category: {meal.strCategory || category}</p>
                    <button className="text-blue-500">View Recipe</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Loading {category} recipes...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Page;
