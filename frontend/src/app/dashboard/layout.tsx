import React from 'react'

import NavigationTopBar from "@/components/navigation-bottom-bar";
import NavigationBottomBar from "@/components/navigation-top-bar";

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="size-full py-20 overflow-y-scroll">
      <NavigationTopBar />
      {children}
      <NavigationBottomBar />
    </div>
  )
}

export default Layout;