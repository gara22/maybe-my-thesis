import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import { Bookings } from "./features/bookings/Bookings";
import { Classrooms } from "./features/classrooms/ClassroomList";
import { Home } from "./features/home/Home";
import { QueryClient, QueryClientProvider } from "react-query";
import ClassroomShow from "./features/classrooms/ClassroomShow";
import { ClerkProvider } from "@clerk/clerk-react";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/" errorElement={<ErrorPage />}>
      <Route element={<Home />} path="/" />
      <Route element={<Classrooms />} path="/classrooms" />
      <Route element={<ClassroomShow />} path="/classrooms/:id" />
      <Route element={<Bookings />} path="/bookings" />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </ClerkProvider>,
);
