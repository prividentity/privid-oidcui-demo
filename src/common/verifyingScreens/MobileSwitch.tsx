import { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import faceID from "Animations/5-Verify/JSONs/Face_ID.json";
import { Label } from "components/ui/label";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { UserContext } from "context/userContext";
import { issueCredentials } from "services/vc-dock";
import { getFirstRequirement, getUrlParameter } from "utils";
import { ECHO, TELE } from "constant";
import config from "config";
import Layout from "common/layout";
import { ActionFlowEnum, OidcContext } from "context/oidcContext";
import {
  getPublicKey,
  getTokenDetails,
  getTransactionResult,
  verifyUserOidc,
} from "@privateid/ping-oidc-web-sdk-alpha";
import { UrlJSON } from "constant/url";

type Props = {};
let loaded = false;
const MobileSwitchGetStatus = (props: Props) => {
  const context = useContext(UserContext);
  const oidcContext = useContext(OidcContext);
  const [percentage, setPercentage] = useState(0);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
//   const onVerify = async () => {
//     loaded = true;
//     console.log(26, { loaded });
//     // await verifyIdWithSession({
//     //   sessionToken: context?.tokenParams,
//     // });
//     // const verifyTokenRes = await verifySessionTokenV2({
//     //   sessionToken: context?.tokenParams,
//     // });
//     // enum tokenStatus {
//     //   PENDING = "PENDING",
//     //   SUCCESS = "SUCCESS",
//     //   FAILURE = "FAILURE",
//     //   REQUIRES_INPUT = "REQUIRES_INPUT",
//     // }
//     // if (verifyTokenRes.status === tokenStatus.SUCCESS) {
//     //   // Success
//     //   loaded = false;
//     //   navigateWithQueryParams("/generate-passkey");
//     //   await issueVC(verifyTokenRes.user, true);
//     // } else if (verifyTokenRes.status === tokenStatus.FAILURE) {
//     //   loaded = false;
//     //   navigateWithQueryParams("/failed");
//     // } else if (verifyTokenRes.status === tokenStatus.REQUIRES_INPUT) {
//     //   getRequirements(verifyTokenRes?.dueRequirements);
//     // } else if (verifyTokenRes.status === tokenStatus.PENDING) {
//     //   loaded = false;
//     //   navigateWithQueryParams("/failed");
//     // }
//   };

  const getTransactionDetails = async () => {
    const TransactionToken = getUrlParameter("transactionToken", "");
    const publicKey = await getPublicKey({
      baseUrl: process.env.REACT_APP_API_URL || "",
    });
    console.log("Public Key:", publicKey);
    oidcContext.setPublicKey(publicKey.publicKey);
    if (TransactionToken) {
      const tokenDetails = await getTokenDetails({
        baseUrl: process.env.REACT_APP_API_URL || "",
        token: TransactionToken,
      });
      console.log("token details: ", tokenDetails);
      oidcContext.setTransactionToken(TransactionToken);
      oidcContext.setInteractionUid(TransactionToken);
      oidcContext.setActionFlow(tokenDetails.actionFlow);
      oidcContext.setIsSwitched(true);

      if (tokenDetails.actionFlow === ActionFlowEnum.Register) {
        console.log("Navigate here!!!");
        if (tokenDetails.completedRequirements.includes("enroll")) {
          navigateWithQueryParams("/confirm");
        } else {
          navigateWithQueryParams("/register");
        }
      } else if (
        tokenDetails.actionFlow === ActionFlowEnum.Login ||
        tokenDetails.actionFlow === ActionFlowEnum.ForgetMe
      ) {
        navigateWithQueryParams("/login");
      } else {
        navigateWithQueryParams("/");
      }
    } else {
      navigateWithQueryParams("/");
    }
  };

  //   useEffect(() => {
  //     const intervalId = setInterval(() => {
  //       if (percentage <= 99) {
  //         setPercentage((prevPercentage) => prevPercentage + 1);
  //         if (percentage >= 99) {
  //           clearInterval(intervalId);
  //           //goNext();
  //         }
  //       }
  //     }, 50);
  //     // Cleanup the interval on component unmount
  //     return () => clearInterval(intervalId);
  //   }, [percentage]);

  useEffect(() => {
    getTransactionDetails();
  }, []);

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
          {/* <Label className="text-[#558BFF] text-[28px] font-[700] mt-6">
            {percentage}%
          </Label> */}
          <Label className="text-[28px] font-[500] text-primaryText w-[90%] mt-3">
            Please wait a sec . . .
          </Label>
        </div>
      </div>
    </Layout>
  );
};

export default MobileSwitchGetStatus;
