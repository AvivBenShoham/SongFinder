import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
import MainGrid from "../components/MainGrid";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <MainGrid />,
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
