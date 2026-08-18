import React, { useState } from 'react'
import {
  TopNavBar,
  SideNavBar
} from "../components"
import { Outlet } from 'react-router-dom'

function Layout() {
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  return (
    <>
      <TopNavBar onMenuClick={() => setIsSideNavOpen(prev => !prev)} isOpen={isSideNavOpen} />
      <div className="flex">
        <SideNavBar isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
        <Outlet />
      </div>
    </>
  )
}

export default Layout
