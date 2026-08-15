import React from 'react'
import {
  TopNavBar,
  SideNavBar
} from "../components"
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
