import React, { useEffect } from "react";
import UserContextProvider from "./context/userContext";
import WasmContextProvider from "./context/WasmContext";
import OidcContextProvider from "./context/oidcContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { getUrlParameter } from "utils";
import { AuthProvider } from "context/authContext";

function App() {
  return (
    <>
      <AuthProvider>
        <OidcContextProvider>
          <UserContextProvider>
            <WasmContextProvider>
              <RouterProvider router={router} />
            </WasmContextProvider>
          </UserContextProvider>
        </OidcContextProvider>
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;
