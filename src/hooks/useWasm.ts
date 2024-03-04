import { useState, useEffect, useContext } from "react";
import { getUrlParameter } from "../utils";
import { UserContext } from "context/userContext";
import { loadPrivIdModule as loadOidc } from "@privateid/ping-oidc-web-sdk-alpha";

let isLoading = false;
const useWasm = (
  sessionToken = "",
  apiUrl = "",
  publicKey = "",
  timeout = 0
) => {
  // Initialize the state
  const [ready, setReady] = useState(false);
  const [wasmStatus, setWasmStatus] = useState<any>({ isChecking: true });
  const context = useContext(UserContext);

  const { isWasmLoaded, setIsWasmLoaded } = context;
  const init = async () => {
    console.log("init start");
    const res = await loadOidc({
      sessionToken,
      apiUrl,
      publicKey,
      timeout,
    });
    console.log("OIDC WASM RES:", res);

    if (res.support) {
      setReady(true);
      setWasmStatus({ isChecking: false, ...res });
      setIsWasmLoaded(true);
    } else {
      setReady(false);
      setWasmStatus({ isChecking: false, ...res });
    }
  };

  useEffect(() => {
    if (ready) return;

    if (!isWasmLoaded && !isLoading) {
      init();
      isLoading = true;
    }
    if (isWasmLoaded) {
      console.log("====> WASM LOADED");
      setReady(true);
      setWasmStatus({ isChecking: false, support: true });
    }
  }, [isWasmLoaded]);

  return { ready, wasmStatus };
};

export default useWasm;
