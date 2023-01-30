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
import { Classrooms } from './features/classrooms/Classrooms'
import { Start } from './features/start/Start'
import { getFullBookings } from './features/bookings/utils'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Start />,
      },
      {
        path: "/classrooms",
        element: <Classrooms />,
      },
      {
        path: "/bookings",
        element: <Bookings />,
        loader: getFullBookings,
        shouldRevalidate: () => {
          return false
        }

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
    <RouterProvider router={router} />
  </ChakraProvider>
)
