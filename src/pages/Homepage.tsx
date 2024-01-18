import React, { useContext, useEffect, useState } from "react";
import Signup from "common/authentication/signup";
import { getUrlParameter } from "../utils";
import { ActionFlowEnum, OidcContext } from "../context/oidcContext";
import { useNavigate } from "react-router-dom";
import {
  getPublicKey,
  getTokenDetails,
} from "@privateid/ping-oidc-web-sdk-alpha";

const Homepage = () => {
  const [displayHomepage, setDisplayHomepage] = useState(false);

  const navigate = useNavigate();
  const oidcContext = useContext(OidcContext);

  const getTransactionDetails = async () => {
    const TransactionToken = getUrlParameter("transactionToken", "");
    const publicKey = await getPublicKey({
      baseUrl: process.env.REACT_APP_API_URL || "",
    });
    console.log("Public Key:", publicKey);
    oidcContext.setPublicKey(publicKey);
    if (TransactionToken) {
      const tokenDetails = await getTokenDetails({
        baseUrl: process.env.REACT_APP_API_URL || "",
        token: TransactionToken,
      });
      console.log("token details: ", tokenDetails);

      oidcContext.setTransactionToken(TransactionToken);
      oidcContext.setInteractionUid(tokenDetails.interactionUid);
      oidcContext.setOrganizationId(tokenDetails.organization);
      oidcContext.setProductGroupId(tokenDetails.productGroupId);
      oidcContext.setActionFlow(tokenDetails.actionFlow);

      if (tokenDetails.actionFlow === ActionFlowEnum.Register) {
        navigate("/user-consent");
      } else if (tokenDetails.actionFlow === ActionFlowEnum.Login) {
        navigate("/face-login");
      } else {
        setDisplayHomepage(true);
      }
    } else {
      setDisplayHomepage(true);
    }
  };

  useEffect(() => {
    getTransactionDetails();
  }, []);

  return <>{displayHomepage ? <Signup /> : <></>}</>;
};

export default Homepage;
