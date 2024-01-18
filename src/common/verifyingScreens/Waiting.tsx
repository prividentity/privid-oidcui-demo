import { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import {
  verifyIdWithSession,
  verifySessionTokenV2,
} from "@privateid/cryptonets-web-sdk";
import faceID from "Animations/5-Verify/JSONs/Face_ID.json";
import { Label } from "components/ui/label";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { UserContext } from "context/userContext";
import { issueCredentials } from "services/vc-dock";
import { getFirstRequirement } from "utils";
import { ECHO, TELE } from "constant";
import config from "config";
import Layout from "common/layout";

type Props = {};
let loaded = false;
const Waiting = (props: Props) => {
  const context = useContext(UserContext);
  const [percentage, setPercentage] = useState(0);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onVerify = async () => {
    loaded = true;
    console.log(26, { loaded });
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
      loaded = false;
      navigateWithQueryParams("/generate-passkey");
      await issueVC(verifyTokenRes.user, true);
    } else if (verifyTokenRes.status === tokenStatus.FAILURE) {
      loaded = false;
      navigateWithQueryParams("/failed");
    } else if (verifyTokenRes.status === tokenStatus.REQUIRES_INPUT) {
      getRequirements(verifyTokenRes?.dueRequirements);
    } else if (verifyTokenRes.status === tokenStatus.PENDING) {
      loaded = false;
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
    console.log(66, { loaded });
    setTimeout(() => {
      if ([ECHO, TELE]?.includes(config.clientConfig.productGroupId)) {
        navigateWithQueryParams("/address");
      } else if (!loaded) {
        onVerify();
      }
    }, 2000);
  }, []);

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
            Please wait a sec, we’re verifying your identity..
          </Label>
        </div>
      </div>
    </Layout>
  );
};

export default Waiting;