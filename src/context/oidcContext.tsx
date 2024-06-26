import React, { createContext, useMemo, useState } from "react";

export enum ActionFlowEnum {
  Login = "login",
  Register = "register",
  Age = "age",
  ForgetMe = "forget_me",
}

export const OidcContext = createContext({
  interactionUid: "",
  setInteractionUid: (interactionId: string) => {},
  transactionToken: "",
  setTransactionToken: (transactionToken: string) => {},
  aalLevel: 0,
  setAalLevel: (aalLevel: number) => {},
  falLevel: 0,
  setFalLevel: (falLevel: number) => {},
  ialLevel: 0,
  setIalLevel: (ialLevel: number) => {},
  productGroupId: "",
  setProductGroupId: (productGroupId: string) => {},
  actionFlow: "",
  setActionFlow: (actionFlow: string) => {},
  organizationId: "",
  setOrganizationId: (organizationId: string) => {},
  publicKey: "",
  setPublicKey: (publicKey: string) => {},
  isSwitched: false,
  setIsSwitched: (isSwitched: boolean) => {},
  clientId: "",
  setClientId: (clientId: string) => {},
  cibaAuthReqId: "",
  setCibaAuthReqId: (cibaAuthReqId: string) => {},
  cibaIdToken: "", 
  setCibaIdToken: (cibaIdToken: string) => {},
  cibaAccessToken: "",
  setCibaAccessToken: (cibaAccessToken: string) => {},
});

const OidcContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [interactionUid, setInteractionUid] = useState("");
  const [transactionToken, setTransactionToken] = useState("");
  const [aalLevel, setAalLevel] = useState(0);
  const [falLevel, setFalLevel] = useState(0);
  const [ialLevel, setIalLevel] = useState(0);

  const [productGroupId, setProductGroupId] = useState("");
  const [actionFlow, setActionFlow] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [publicKey, setPublicKey] = useState("");

  const [clientId, setClientId] = useState("");
  const [cibaAuthReqId, setCibaAuthReqId] = useState("");

  const [cibaIdToken, setCibaIdToken] = useState("");
  const [cibaAccessToken, setCibaAccessToken] = useState("");

  const [isSwitched, setIsSwitched] = useState(false);

  const values = {
    interactionUid,
    setInteractionUid,
    productGroupId,
    setProductGroupId,
    transactionToken,
    setTransactionToken,
    aalLevel,
    setAalLevel,
    falLevel,
    setFalLevel,
    ialLevel,
    setIalLevel,
    actionFlow,
    setActionFlow,
    organizationId,
    setOrganizationId,
    publicKey,
    setPublicKey,
    isSwitched,
    setIsSwitched,
    clientId,
    setClientId,
    cibaAuthReqId,
    setCibaAuthReqId,
    cibaIdToken, 
    setCibaIdToken,
    cibaAccessToken, 
    setCibaAccessToken
  };

  const memoValues = useMemo(() => values, [values]);
  return (
    <OidcContext.Provider value={memoValues}>{children}</OidcContext.Provider>
  );
};

export default OidcContextProvider;
