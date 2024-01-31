import React, { useEffect } from "react";
import UserContextProvider from "./context/userContext";
import WasmContextProvider from "./context/WasmContext";
import OidcContextProvider from "./context/oidcContext";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import {
  AuthProvider,
  TAuthConfig,
  TRefreshTokenExpiredEvent,
} from "react-oauth2-code-pkce";
import { getUrlParameter } from "utils";

function App() {
  return (
    <>
      <OidcContextProvider>
        <UserContextProvider>
          <WasmContextProvider>
            <RouterProvider router={router} />
          </WasmContextProvider>
        </UserContextProvider>
      </OidcContextProvider>
      <Toaster />
    </>
  );
}

export default App;
