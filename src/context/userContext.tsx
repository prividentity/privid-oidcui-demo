import { getProjectFromURL } from "../utils";
import React, { createContext, useEffect, useMemo, useState } from "react";

export const UserContext = createContext({
  user: {},
  setUser: (userData: any) => {},
  tokenParams: "",
  setTokenParams: (token: any) => {},
  failedMessage: "",
  setFailedMessage: (message: any) => {},
  loginOption: "",
  setLoginOption: (message: any) => {},
  themeHhs: false,
  setThemeHhs: (hhs: any) => {},
  successMessage: "",
  setSuccessMessage: (message: any) => {},
  isWasmLoaded: false,
  setIsWasmLoaded: (isWasmLoaded: boolean) => {},
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState({});
  const [tokenParams, setTokenParams] = useState("");
  const [failedMessage, setFailedMessage] = useState("");
  const [loginOption, setLoginOption] = useState("");
  const [themeHhs, setThemeHhs] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const values = {
    user,
    setUser,
    tokenParams,
    setTokenParams,
    failedMessage,
    setFailedMessage,
    loginOption,
    setLoginOption,
    themeHhs,
    setThemeHhs,
    successMessage, 
    setSuccessMessage,
    isWasmLoaded,
    setIsWasmLoaded,
  };
  useEffect(() => {
    const projectName = getProjectFromURL();
    if (projectName === "hhs") {
      setThemeHhs(true);
    }
  }, []);
  const memoValues = useMemo(() => values, [values]);
  return (
    <UserContext.Provider value={memoValues}>{children}</UserContext.Provider>
  );
};

export default UserContextProvider;
