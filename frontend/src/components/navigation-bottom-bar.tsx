"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  CalendarCheck,
  ShoppingCart,
  Sparkles,
  User,
} from "lucide-react";


const NavigationBottomBar = () => {
  const currentRoute = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Home", icon: House },
    { href: "/dashboard/meal-plans", label: "Meal plans", icon: CalendarCheck },
    { href: "/dashboard/chat", label: "AI Assistant", icon: Sparkles },
    { href: "/dashboard/groceries", label: "Groceries", icon: ShoppingCart },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 max-w-lg mx-auto border-t border-x border-t-slate-300 rounded-t-3xl flex items-center bg-white z-50">
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

export default NavigationBottomBar;
