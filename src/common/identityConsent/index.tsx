import loginFrame from "../../assets/login/login-main-frame.svg";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Layout } from "../index";
import { useNavigate } from "react-router-dom";

type Props = {
  isLogin?: boolean;
};

const IdentityConsent = (props: Props) => {
  const navigate = useNavigate();
  const onRegister = async () => {};
  return (
    <Layout removeBorder={true} removeHeight={true}>
      <Label className="text-[20px] font-[Google Sans] font-[500] text-primaryText">
        Take a selfie to verify your age
      </Label>
      <div className="flex justify-center mt-0">
        <img src={loginFrame} alt="" width={400} />
      </div>
      <div className="flex flex-col w-[80%] m-auto max-md:w-[100%] max-md:p-[20px]">
        <Label className="mt-[15px] text-[15px] font-[Google Sans] font-[100] text-secondaryText">
          By clicking the 'Agree and continue' button below, you acknowledge
          that you are over eighteen (18) years of age, have read the Private
          Identity{" "}
          <span
            onClick={() => {
              navigate("/privacy-policy");
            }}
            className="text-[#5283EC] underline cursor-pointer"
          >
            Privacy Policy
          </span>{" "}
          and{" "}
          <span
            onClick={() => {
              navigate("/user-consent");
            }}
            className="text-[#5283EC] underline cursor-pointer"
          >
            Terms of Use
          </span>{" "}
          , and understand how your personal data will be processed in
          connection with your use of the Age Estimation Service
        </Label>
        <Label className="mt-[15px] text-[15px] font-[Google Sans] font-[100] text-secondaryText">
          <span
            onClick={() => {
              navigate("/user-consent");
            }}
            className="text-[#5283EC] underline cursor-pointer"
          >
            Learn
          </span>{" "}
          how age estimation works. No images leave your device.
        </Label>
      </div>
      <div className="mt-10 flex justify-center max-md:mt-16">
        <Button
          className="w-[65%] bg-primary rounded-[24px] text-[14px] hover:opacity-90 hover:bg-primary text-white"
          onClick={() => onRegister()}
        >
          Agree and continue
        </Button>
      </div>
      <div className="mt-4 flex justify-center max-md:mt-2">
        <Button className="w-[65%] bg-primary rounded-[24px] text-[14px] hover:opacity-90 hover:bg-primary text-white">
          Back to options
        </Button>
      </div>
      <div className="flex justify-center mt-[3rem]">
        <ul className="flex justify-between w-[50%] max-md:w-[80%]">
          <li className="text-secondaryText text-[14px] cursor-pointer">
            Learn More
          </li>
          <li className="text-secondaryText text-[14px] cursor-pointer">
            Privacy
          </li>
          <li className="text-secondaryText text-[14px] cursor-pointer">
            Terms
          </li>
          <li className="text-secondaryText text-[14px] cursor-pointer">
            Feedback
          </li>
        </ul>
      </div>
    </Layout>
  );
};

export default IdentityConsent;
