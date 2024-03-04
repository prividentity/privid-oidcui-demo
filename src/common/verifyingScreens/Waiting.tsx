import { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import faceID from "Animations/5-Verify/JSONs/Face_ID.json";
import { Label } from "components/ui/label";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { UserContext } from "context/userContext";
import { issueCredentials } from "services/vc-dock";
import { getFirstRequirement } from "utils";
import { ECHO, TELE } from "constant";
import config from "config";
import Layout from "common/layout";
import { OidcContext } from "context/oidcContext";
import {
  getTokenDetails,
  getTransactionResult,
  verifyUserOidc,
} from "@privateid/ping-oidc-web-sdk-alpha";

type Props = {};
let loaded = false;
const Waiting = (props: Props) => {
  const context = useContext(UserContext);
  const oidcContext = useContext(OidcContext);
  const [percentage, setPercentage] = useState(0);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [displayGoBack, setDisplayGoBack] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onVerify = async () => {
    loaded = true;
    console.log(26, { loaded });
    // await verifyIdWithSession({
    //   sessionToken: context?.tokenParams,
    // });
    // const verifyTokenRes = await verifySessionTokenV2({
    //   sessionToken: context?.tokenParams,
    // });
    // enum tokenStatus {
    //   PENDING = "PENDING",
    //   SUCCESS = "SUCCESS",
    //   FAILURE = "FAILURE",
    //   REQUIRES_INPUT = "REQUIRES_INPUT",
    // }
    // if (verifyTokenRes.status === tokenStatus.SUCCESS) {
    //   // Success
    //   loaded = false;
    //   navigateWithQueryParams("/generate-passkey");
    //   await issueVC(verifyTokenRes.user, true);
    // } else if (verifyTokenRes.status === tokenStatus.FAILURE) {
    //   loaded = false;
    //   navigateWithQueryParams("/failed");
    // } else if (verifyTokenRes.status === tokenStatus.REQUIRES_INPUT) {
    //   getRequirements(verifyTokenRes?.dueRequirements);
    // } else if (verifyTokenRes.status === tokenStatus.PENDING) {
    //   loaded = false;
    //   navigateWithQueryParams("/failed");
    // }
  };

  const goNext = async () => {
    const baseurl =
      process.env.REACT_APP_API_URL ||
      "https://api.orchestration.private.id/oidc";
    console.log("OIDC context", oidcContext);
    console.log("URL", baseurl);

    const verifyResult = await verifyUserOidc({
      token: oidcContext.transactionToken,
      baseUrl: baseurl,
    });

    console.log("verify result", verifyResult);

    const tokenDetailsResult = await getTokenDetails({
      token: oidcContext.transactionToken,
      baseUrl: baseurl,
    });

    console.log("session status after verify", tokenDetailsResult);

    const result = await getTransactionResult({
      token: oidcContext.transactionToken,
      baseUrl: baseurl,
    });
    console.log("Test:", result);
    if (!oidcContext.isSwitched) {
      if (result.url) {
        window.location.href = result.url;
      }
    } else {
      setDisplayGoBack(true);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (percentage <= 99) {
        setPercentage((prevPercentage) => prevPercentage + 1);
        if (percentage >= 99) {
          clearInterval(intervalId);
          goNext();
        }
      }
    }, 50);
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [percentage]);

  // useEffect(() => {
  //   console.log(66, { loaded });
  //   setTimeout(() => {
  //     if ([ECHO, TELE]?.includes(config.clientConfig.productGroupId)) {
  //       navigateWithQueryParams("/address");
  //     } else if (!loaded) {
  //       onVerify();
  //     }
  //   }, 2000);
  // }, []);

  const getRequirements = async (requirement: any) => {
    const requirementStep = await getFirstRequirement(requirement, context);
    loaded = false;
    switch (requirementStep) {
      case "requestSSN9":
        return navigateWithQueryParams("/ssn");
      case "requireResAddress":
        return navigateWithQueryParams("/address");
      case "requestScanID":
        return navigateWithQueryParams("/drivers-licence-intro");
      default:
        break;
    }
  };

  const issueVC = async (userId: string, fullInformation: boolean) => {
    try {
      await issueCredentials(userId, fullInformation);
    } catch (e) {
      console.log({ e }, "error issueVC");
    }
  };

  return (
    <Layout>
      <div className="p-10 max-md:p-[20px]">
        <div
          className="h-[620px] flex justify-center items-center flex-col"
          style={{
            backgroundImage: `url("/verifying-bg.svg")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          <div className="flex justify-center items-center">
            <Lottie
              loop={true}
              autoplay={true}
              animationData={faceID}
              style={{ height: 200, width: 200 }}
            />
          </div>
          <Label className="text-[#558BFF] text-[28px] font-[700] mt-6">
            {percentage}%
          </Label>
          <Label className="text-[28px] font-[500] text-primaryText w-[90%] mt-3">
            {displayGoBack
              ? "Please Go Back To Desktop"
              : "Please wait a sec, we’re verifying your identity.."}
          </Label>
        </div>
      </div>
    </Layout>
  );
};

export default Waiting;
