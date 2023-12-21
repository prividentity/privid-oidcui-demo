import { getProjectFromURL } from "../utils";
import React, { createContext, useEffect, useMemo, useState } from "react";


export const WasmContext = createContext({
  isWasmLoaded: false,
  setIsWasmLoaded: (isWasmLoaded: boolean ) => {},
  isSupported: { isChecking: true, support:undefined, message:"" },
  setIsSupported: (isSupported:any) => {},
});

const WasmContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isWasmLoaded, setIsWasmLoaded]  = useState(false);
  const [isSupported, setIsSupported] = useState({ isChecking: true, support:undefined, message:"" })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const values = {
    isWasmLoaded,
    setIsWasmLoaded,
    isSupported,
    setIsSupported,
  };

  const memoValues = useMemo(() => values, [values]);
  return (
    <WasmContext.Provider value={memoValues}>{children}</WasmContext.Provider>
  );
};

export default WasmContextProvider;
