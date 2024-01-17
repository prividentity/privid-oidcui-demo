import { useContext } from "react";
import Lottie from "lottie-react";
import NotApprovedImage from "assets/not-approved.svg";
import failIdCard from "Animations/5-Verify/JSONs/Fail-ID-Card.json";
import failPassport from "Animations/5-Verify/JSONs/Fail-Passport.json";
import failSelfie from "Animations/5-Verify/JSONs/Fail-selfie.json";
import { ACCOUNT_NOT_APPROVED, AUTHENTICATION_FAILED } from "constant";
import { UserContext } from "context/userContext";
import Layout from "common/layout";
import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  heading?: string;
  buttonLabel?: string;
};

function FailureScreen(Props: Props) {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  const defaultOptions = {};
  const getMiddleImage = (type: string) => {
    switch (type) {
      case "idCard":
        return (
          <Lottie
            loop={false}
            animationData={failIdCard}
            autoplay={true}
            style={{ height: 200, width: 200 }}
          />
        );
      case "passport":
        return (
          <Lottie
            loop={false}
            autoplay={true}
            animationData={failPassport}
            style={{ height: 200, width: 200 }}
          />
        );
      case "selfie":
        return (
          <Lottie
            animationData={failSelfie}
            loop={false}
            autoplay={true}
            style={{ height: 200, width: 200 }}
          />
        );
      case AUTHENTICATION_FAILED:
        return (
          <img src={NotApprovedImage} alt="" className="h-[103px] w-[157px]" />
        );
      case ACCOUNT_NOT_APPROVED:
        return (
          <img src={NotApprovedImage} alt="" className="h-[103px] w-[157px]" />
        );
      default:
        return (
          <Lottie
            loop={false}
            animationData={failIdCard}
            autoplay={true}
            style={{ height: 200, width: 200 }}
          />
        );
    }
  };
  return (
    <>
      <Layout>
        <div className="p-10 h-full flex justify-between flex-col max-md:p-[20px]">
          <div className="h-full flex justify-center items-center flex-col">
            <div className="flex justify-center items-center mt-[-50px]">
              {getMiddleImage(context?.failedMessage || AUTHENTICATION_FAILED)}
            </div>
            <Label className="text-[28px] font-[500] text-primaryText w-[95%] mt-10">
              {context?.failedMessage === "passport"
                ? `Oops! Your ${Props.heading} is not valid, please rescan it.`
                : context?.failedMessage || ACCOUNT_NOT_APPROVED}
            </Label>
          </div>
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary hover:text-white"
              onClick={() => navigate(-1)}
            >
              {Props.buttonLabel}
            </Button>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary hover:text-white"
              onClick={() => navigate("/")}
            >
              Return to homepage
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default FailureScreen;
