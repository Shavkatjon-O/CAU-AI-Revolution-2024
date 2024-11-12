"use client";

import React from "react";
import NavigationBottomBar from "@/components/navigation-bottom-bar";
import Auth from "@/components/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="size-full">
      {children}
      <NavigationBottomBar />
    </div>
  );
};

export default Auth(Layout);
