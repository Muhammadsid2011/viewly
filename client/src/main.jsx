import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import Layout from './layouts/Layout.jsx'
import {
  HomeFeed,
  Signup,
  Login,
  WatchVideo,
  Channel,
  Dashboard,
  Upload,
  Search,
  LikedVideos,
  History,
  NotFound,
} from "./pages"
import AuthProvider from './provider/AuthProvider.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomeFeed /> },
      { path: "search", element: <Search /> },
      { path: "watch/:videoId", element: <ProtectedRoute><WatchVideo /></ProtectedRoute> },
      { path: "channel/:username", element: <ProtectedRoute><Channel /></ProtectedRoute> },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "upload", element: <ProtectedRoute><Upload /></ProtectedRoute> },
      { path: "liked", element: <ProtectedRoute><LikedVideos /></ProtectedRoute> },
      { path: "history", element: <ProtectedRoute><History /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
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
    <RouterProvider router={router} />
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          background: "#2a2a2a",
          color: "#e5e2e1",
          border: "1px solid #353534",
        },
      }}
    />
  </AuthProvider>
)
