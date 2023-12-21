import { useState, useEffect } from "react";
import { loadPrivIdModule } from "@privateid/cryptonets-web-sdk";
import { getUrlParameter } from "../utils";

let isLoading = false;
const useWasm = (setContextWasmLoaded= (isLoaded:any)=>{}, setContextWasmStatus= (status:any)=>{}) => {
  // Initialize the state
  const [ready, setReady] = useState(false);
  const [wasmStatus, setWasmStatus] = useState<any>({ isChecking: true });
  const [isWasmLoaded, setIsWasmLoaded] = useState(false);

  const init = async () => {
    const apiKey = getUrlParameter("api_key", null);
    const apiUrl = getUrlParameter("api_url", null);
    console.log("Use Wasm Called!!");
    const isSupported = await loadPrivIdModule(
      apiUrl,
      apiKey,
      null,
      null,
      false
    );
    if (isSupported.support) {
      setContextWasmStatus({ isChecking: false, ...isSupported });
      setReady(true);
      setWasmStatus({ isChecking: false, ...isSupported });
      setIsWasmLoaded(true);
      setContextWasmLoaded(true);
    } else {
      setReady(false);
      setWasmStatus({ isChecking: false, ...isSupported });
    }
  };

  return { ready, wasmStatus, init };
};

export default useWasm;
