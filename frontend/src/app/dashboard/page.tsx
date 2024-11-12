
import React from 'react';
import Image from 'next/image';

const Page = () => {
  return (
    <div className="bg-gray-100 h-full overflow-y-scroll">
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
            <div className="relative w-24 h-24">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 rounded-full w-20 h-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold">29%</div>
              </div>
            </div>
            <p className="text-gray-500">Fat</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-400 rounded-full w-20 h-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold">65%</div>
              </div>
            </div>
            <p className="text-gray-500">Pro</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-400 rounded-full w-20 h-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-semibold">85%</div>
              </div>
            </div>
            <p className="text-gray-500">Carb</p>
          </div>
        </div>
        <div className="flex items-center mt-4">
          {/* <img src="/user-avatar.png" alt="User Avatar" className="w-12 h-12 rounded-full mr-4" /> */}
          <Image src="/user-avatar.png" alt="User Avatar" width={48} height={48} className="w-12 h-12 rounded-full mr-4" />
          <p className="text-gray-600">Keep the pace! You`re doing great.</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center">
          <input type="text" className="flex-1 border border-gray-300 p-2 rounded-l-lg" placeholder="Search" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recommended for You</h2>
          <button className="text-blue-500 hover:underline">View all</button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Maximize muscles growth</h3>
            <button className="text-red-500 hover:underline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-1.375-.58-2.575-1.5-3.5m0 0l-3.375 3.375c1.14 1.02 1.76 2.4 1.76 3.85 0 1.45-.62 2.83-1.76 3.85l3.375 3.375c1.375-1.375 1.5-2.575 1.5-3.5 0-1.375-.58-2.575-1.5-3.5z" />
              </svg>
            </button>
          </div>
          {/* <img src="/stir-fry.jpg" alt="Lean Beef Stir-Fry" className="w-full h-48 object-cover rounded-lg mb-4" />
           */}

           <Image src="/stir-fry.jpg" alt="Lean Beef Stir-Fry" width={384} height={192} className="w-full h-48 object-cover rounded-lg mb-4" />
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5-4.5l-2.25 2.25-4.5 4.5M12 6V4m0 4h.01M6.75 19.5A2.25 2.25 0 119 17.25H5.25a2.25 2.25 0 011.5-4.125z" />
              </svg>
              <p className="text-gray-600 ml-2">25 min</p>
            </div>
            <div className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5-4.5l-2.25 2.25-4.5 4.5M12 6V4m0 4h.01M6.75 19.5A2.25 2.25 0 119 17.25H5.25a2.25 2.25 0 011.5-4.125z" />
              </svg>
              <p className="text-gray-600 ml-2">245 kcal</p>
            </div>
            <div className="flex items-center">
              <p className="text-gray-600">30 g P</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
