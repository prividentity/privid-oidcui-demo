import React, { useEffect, useState } from "react";
import Signup from "../component/common/authentication/signup";
import { getUrlParameter } from "../utils";

const Homepage = () => {
  const [displayHomepage, setDisplayHomepage] = useState(false);

  useEffect(() => {
    const TransactionToken = getUrlParameter("transactionToken", "");
    const InteractionUID = getUrlParameter("interactionUID", "");

    if (TransactionToken && InteractionUID) {
        // GET TransactionToken details from Orchestration
        
    } else {
      setDisplayHomepage(true);
    }
  }, []);

  return <>{displayHomepage ? <Signup /> : <></>}</>;
};

export default Homepage;