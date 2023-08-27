import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ChakraProvider } from '@chakra-ui/react'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from './components/ErrorPage/ErrorPage'
import { Admin } from './features/admin/Admin'
import { Bookings } from './features/bookings/Bookings'
import { Classrooms } from './features/classrooms/ClassroomList'
import { Home } from './features/home/Home'
import Topbar from './components/Topbar/Topbar'
import { QueryClient, QueryClientProvider } from 'react-query'
import ClassroomShow from './features/classrooms/ClassroomShow'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/classrooms",
        element: <Classrooms />,
      },
      {
        path: "/classrooms/:id",
        element: <ClassroomShow />,
      },
      {
        path: "/bookings",
        element: <Bookings />,
        // loader: getFullBookings,
        // shouldRevalidate: () => {
        //   return false
        // }

      },
      {
        path: "/admin",
        element: <Admin />,
        // loader: () => getFullBookings()
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ChakraProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ChakraProvider>
)
