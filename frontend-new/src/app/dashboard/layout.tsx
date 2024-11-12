"use client";

import React from "react";
import Auth from "@/components/auth";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="">
      {children}
    </div>
  );
};

export default Auth(Layout);
