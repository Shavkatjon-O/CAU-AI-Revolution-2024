"use client";

import React from "react";
import NavigationTopBar from "@/components/navigation-top-bar";
import NavigationBottomBar from "@/components/navigation-bottom-bar";
// import Auth from "@/components/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="size-full py-20 overflow-y-scroll max-w-lg mx-auto bg-slate-50 border-x">
      <NavigationTopBar />
      {children}
      <NavigationBottomBar />
    </div>
  );
};

// export default Auth(Layout);
export default Layout;
