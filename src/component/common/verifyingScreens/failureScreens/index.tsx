import { useContext } from "react";
import FailIdCard from "../../../../Animations/5-Verify/GIFs/Fail-ID Card.gif";
import FailPassport from "../../../../Animations/5-Verify/GIFs/Fail-Passport.gif";
import FailSelfie from "../../../../Animations/5-Verify/GIFs/Fail-Selfie.gif";
import NotApprovedImage from "../../../../assets/not-approved.svg";
import { Label } from "../../../ui/label";
import { Button } from "../../../ui/button";
import Layout from "../../../common/layout";
import { UserContext } from "../../../../context/userContext";
import { ACCOUNT_NOT_APPROVED, AUTHENTICATION_FAILED } from "../../../../constant";

type Props = {
  heading?: string;
  buttonLabel?: string;
};

function FailureScreen(Props: Props) {
  const context = useContext(UserContext);
  const getMiddleImage = (type: string) => {
    switch (type) {
      case "idCard":
        return FailIdCard;
      case "passport":
        return FailPassport;
      case "selfie":
        return FailSelfie;
      case AUTHENTICATION_FAILED:
        return NotApprovedImage;
      case ACCOUNT_NOT_APPROVED:
        return NotApprovedImage;
      default:
        return FailIdCard;
    }
  };
  return (
    <>
      <Layout>
        <div className="p-10 h-full flex justify-between flex-col max-md:p-[20px]">
          <div className="h-full flex justify-center items-center flex-col">
            <div className="flex justify-center items-center mt-[-50px]">
              <img
                src={getMiddleImage(context?.failedMessage || "idCard")}
                alt=""
                className="h-[103px] w-[157px]"
              />
            </div>
            <Label className="text-[28px] font-[500] text-primaryText w-[95%] mt-10">
              {context?.failedMessage ||
                `Oops! Your ${Props.heading} is not valid, please rescan it.`}
            </Label>
          </div>
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary hover:text-white"
              onClick={() => (window.location.href = "/")}
            >
              {Props.buttonLabel}
            </Button>
          </div>
        </div>
      </Layout>
      {/* <div className="mt-0 text-primary text-[14px] cursor-pointer block text-center mb-5">
        <Label className="font-[400] text-secondaryText text-[16px]">
          Have problems?
        </Label>
        <Label className="font-[700] text-primary ml-[6px] cursor-pointer text-[16px] hover:underline">
          Switch to mobile
        </Label>
      </div> */}
    </>
  );
}

export default FailureScreen;
