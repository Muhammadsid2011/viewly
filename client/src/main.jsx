import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from './layouts/Layout.jsx'
import {
  HomeFeed,
  Signup,
  Login
} from "./pages"
import AuthProvider from './provider/AuthProvider.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomeFeed />
      }
    ]
  },
  {
    path: "/auth/signup",
    element: <Signup />
  },
  {
    path: "/auth/login",
    element: <Login />
  }
]);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />,
  </AuthProvider>
)
