import React, { useContext, useEffect, useState } from "react";
import Signup from "../component/common/authentication/signup";
import { getUrlParameter } from "../utils";
import { OidcContext } from "../context/oidcContext";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [displayHomepage, setDisplayHomepage] = useState(false);

  const navigate = useNavigate();
  const oidcContext = useContext(OidcContext);

  useEffect(() => {
    const TransactionToken = getUrlParameter("transactionToken", "");
    const InteractionUID = getUrlParameter("interactionUID", "");
    const actionType = getUrlParameter("actionType","");
    if (TransactionToken && InteractionUID) {
        // GET TransactionToken details from Orchestration
        oidcContext.setTransactionToken(TransactionToken);
        oidcContext.setInteractionUid(InteractionUID);
        oidcContext.setAalLevel(1);
        oidcContext.setFalLevel(2);
        oidcContext.setIalLevel(2);
        if(actionType === "register"){
          navigate("/register")
        }
    } else {
      setDisplayHomepage(true);
    }
  }, []);

  return <>{displayHomepage ? <Signup /> : <></>}</>;
};

export default Homepage;