import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ErrorPage from "./error-page";
import App from "./App";
import SupabaseCredential from "./popup/SupabaseCredentials";
import ImageUpload from "./popup/ImageUpload";
import { ChakraProvider } from '@chakra-ui/react'
import ImageList from "./popup/ImageList";

const router = createBrowserRouter([
  {
    path: "/index.html",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "credential",
        element: <SupabaseCredential />,
        errorElement: <ErrorPage />,
      },
      {
        path: "uploadImage",
        element: <ImageUpload />,
        errorElement: <ErrorPage />,
      },
      {
        path: "imageList",
        element: <ImageList />,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
