import waitingIcon from "../../../Animations/5-Verify/GIFs/Face ID.gif";
import { useContext, useEffect, useState } from "react";
import { Label } from "../../ui/label";
import Layout from "../layout";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import {
  verifyIdWithSession,
  verifySessionTokenV2,
} from "@privateid/cryptonets-web-sdk";
import { UserContext } from "../../../context/userContext";
import { issueCredentials } from "../../../services/vc-dock";
import { getFirstRequirement } from "../../../utils";
import config from "../../../config";
import { ECHO, TELE } from "../../../constant";

type Props = {};
let loaded = false;
const Waiting = (props: Props) => {
  const context = useContext(UserContext);
  const [percentage, setPercentage] = useState(0);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onVerify = async () => {
    loaded = true;
    await verifyIdWithSession({
      sessionToken: context?.tokenParams,
    });
    const verifyTokenRes = await verifySessionTokenV2({
      sessionToken: context?.tokenParams,
    });
    enum tokenStatus {
      PENDING = "PENDING",
      SUCCESS = "SUCCESS",
      FAILURE = "FAILURE",
      REQUIRES_INPUT = "REQUIRES_INPUT",
    }
    if (verifyTokenRes.status === tokenStatus.SUCCESS) {
      // Success
      navigateWithQueryParams("/generate-passkey");
      await issueVC(verifyTokenRes.user, true);
    } else if (verifyTokenRes.status === tokenStatus.FAILURE) {
      navigateWithQueryParams("/failed");
    } else if (verifyTokenRes.status === tokenStatus.REQUIRES_INPUT) {
      getRequirements(verifyTokenRes?.dueRequirements);
    } else if (verifyTokenRes.status === tokenStatus.PENDING) {
      navigateWithQueryParams("/failed");
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (percentage <= 99) {
        setPercentage((prevPercentage) => prevPercentage + 1);
        if (percentage >= 99) {
          clearInterval(intervalId);
        }
      }
    }, 50);
    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [percentage]);

  useEffect(() => {
    if ([ECHO, TELE]?.includes(config.clientConfig.productGroupId)) {
      navigateWithQueryParams("/address");
    } else if (!loaded) {
      onVerify();
    }
  }, [onVerify, navigateWithQueryParams]);

  const getRequirements = async (requirement: any) => {
    const requirementStep = await getFirstRequirement(requirement, context);
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
            <img src={waitingIcon} alt="" className="w-[123px]" />
          </div>
          <Label className="text-[#558BFF] text-[28px] font-[700] mt-6">
            {percentage}%
          </Label>
          <Label className="text-[28px] font-[500] text-primaryText w-[90%] mt-3">
            Please wait a sec, we’re verifying your identity..
          </Label>
        </div>
      </div>
    </Layout>
  );
};

export default Waiting;
