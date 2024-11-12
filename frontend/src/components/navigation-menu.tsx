
import Link from "next/link"

import {
  House,
  CalendarCheck,
  ShoppingCart,
  MessageSquareText,
  User,
} from 'lucide-react';

const NavigationMenu = () => {
  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 h-16 border-t border-t-gray-300 rounded-t-3xl flex items-center bg-white shadow-xl">
      <Link href="/" className="w-1/5 h-full flex justify-center items-center">
        <div className="flex flex-col items-center space-y-1">
          <House />
          <span className="text-xs text-gray-700 font-medium">Home</span>
        </div>
      </Link>
      <Link href="/" className="w-1/5 h-full flex justify-center items-center">
        <div className="flex flex-col items-center space-y-1">
          <CalendarCheck />
          <span className="text-xs text-gray-700 font-medium">Meal plans</span>
        </div>
      </Link>
      <Link href="/" className="w-1/5 h-full flex justify-center items-center">
        <div className="flex flex-col items-center space-y-1">
          <MessageSquareText />
          <span className="text-xs text-gray-700 font-medium">Chat</span>
        </div>
      </Link>
      <Link href="/" className="w-1/5 h-full flex justify-center items-center">
        <div className="flex flex-col items-center space-y-1">
          <ShoppingCart />
          <span className="text-xs text-gray-700 font-medium">Shopping lists</span>
        </div>
      </Link>
      <Link href="/" className="w-1/5 h-full flex justify-center items-center">
        <div className="flex flex-col items-center space-y-1">
          <User />
          <span className="text-xs text-gray-700 font-medium">Profile</span>
        </div>
      </Link>
    </div>
  )
}

export default NavigationMenu