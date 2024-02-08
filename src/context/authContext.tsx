import React, { createContext, useContext, useState } from "react";

import AuthService from "./authService";

const AuthContext = createContext({
    login: () => {},
    isAuthenticated: false,
    completeLogin: ()=> {},
    tokens: {idToken: "", accessToken: ""},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    tokens: { idToken: "", accessToken: "" },
  });

  const login = (extraParams: any) => AuthService.login(extraParams);

  const completeLogin = async () => {
    try {
      await AuthService.completeLogin();
      const user = await AuthService.getUser();
      if (user) {
        sessionStorage.setItem(
          "tokens",
          JSON.stringify({
            idToken: user.id_token,
            accessToken: user.access_token,
          })
        );
        window.location.href = "/"; // Redirect to home page
      }
    } catch (error) {
      console.error("An error occurred during login completion:", error);
      // Handle error appropriately
    }
  };

  const logout = () => {
    AuthService.logout();
    setAuthState({
      isAuthenticated: false,
      tokens: { idToken: "", accessToken: "" },
    });
  };

  return (
    <AuthContext.Provider
    // @ts-ignore
      value={{ ...authState, login, completeLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
