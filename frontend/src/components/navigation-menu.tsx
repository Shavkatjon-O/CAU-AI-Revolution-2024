"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  CalendarCheck,
  ShoppingCart,
  MessageSquareText,
  User,
} from "lucide-react";

const NavigationMenu = () => {
  const currentRoute = usePathname();

  const menuItems = [
    { href: "/", label: "Home", icon: House },
    { href: "/meal-plans", label: "Meal plans", icon: CalendarCheck },
    { href: "/chat", label: "Chat", icon: MessageSquareText },
    { href: "/groceries", label: "Groceries", icon: ShoppingCart },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 h-20 border-t border-t-gray-300 rounded-t-3xl flex items-center bg-white shadow-xl">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentRoute === item.href;

        return (
          <Link key={item.href} href={item.href} className="w-1/5 h-full flex justify-center items-center">
            <div className="flex flex-col items-center space-y-1">
              <Icon className={isActive ? "text-custom" : "text-gray-600"} />
              <span className={`text-xs font-medium ${isActive ? "text-custom" : "text-gray-600"}`}>
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default NavigationMenu;
