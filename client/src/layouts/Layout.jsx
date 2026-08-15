import React from 'react'
import TopNavBar from '../components/TopNavBar'
import SideNavBar from '../components/SideNavBar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <>
      <TopNavBar />
      <SideNavBar />
      <Outlet />
    </>
  )
}

export default Layout
