import { useNavigate, useSearchParams } from "react-router-dom";
import loginFrame from "assets/login/login-main-frame.svg";
import hhsFrame from "assets/login/hhsBanner.png";
import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import Layout from "common/layout";
import config from "config";
import { useContext, useState } from "react";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { UserContext } from "context/userContext";

type Props = {
  isLogin?: boolean;
};

const Login = (props: Props) => {
  const [searchParams] = useSearchParams();
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [loader, setLoader] = useState(false);
  const onRegister = async () => {
    setLoader(true);
    const payload: any = {
      ...config?.clientConfig,
      productGroupId: config?.clientConfig?.productGroupId,
    };
    setLoader(false);
    // context.setTokenParams(result?.token?.replace("?", ""));
    // if (context?.themeHhs) {
    //   navigate(
    //     `/hhs-consent?token=${result?.token?.replace("?", "")}${
    //       searchParams.get("skipAntispoof") ? "&skipAntispoof=true" : ""
    //     }`
    //   );
    // } else {
    //   navigate(
    //     `/user-consent?token=${result?.token?.replace("?", "")}${
    //       searchParams.get("skipAntispoof") ? "&skipAntispoof=true" : ""
    //     }`
    //   );
    // }
  };
  return (
    <Layout removeBorder={true} removeHeight={true}>
      <div
        className={`flex justify-center mt-8 ${
          context?.themeHhs
            ? "h-[300px] mb-10 max-md:h-[200px] max-md:w-[98%] max-md:m-auto"
            : "h-[361px] max-md:h-[330px]"
        }`}
      >
        <img
          src={context?.themeHhs ? hhsFrame : loginFrame}
          alt=""
          data-src={context?.themeHhs ? hhsFrame : loginFrame}
          className="lazyload"
        />
      </div>
      <div className="flex flex-col">
        <Label className="text-[44px] font-[Google Sans] font-[500] text-primaryText max-md:text-[28px]">
          {props.isLogin ? "Log in with Private ID" : "Sign up with Private ID"}
        </Label>
        <Label className="mt-[15px] text-[16px] font-[Google Sans] font-[100] text-secondaryText max-md:text-[14px] max-md:w-[80%] max-md:m-auto max-md:mt-[7px]">
          A simple, fast and safe way to verify yourself.
        </Label>
      </div>
      <div className="mt-10 flex justify-center max-md:mt-6">
        <Button
          className="w-[65%] bg-primary rounded-[24px] text-[14px] hover:opacity-90 hover:bg-primary text-white max-md:w-[100%] max-md:max-w-[327px]"
          onClick={() => {
            if (props.isLogin) {
              navigateWithQueryParams("/login-options");
            } else {
              onRegister();
            }
          }}
          disabled={loader}
        >
          {props.isLogin ? "Log in" : "Sign up"}
        </Button>
      </div>
      <div className="mt-5 flex justify-center">
        <Label className="mt-[16px] text-[16px] font-[Google Sans] font-[100] text-secondaryText">
          {props.isLogin
            ? "Don’t have an account?"
            : "Already have an account?"}
        </Label>
        <Label
          className="mt-[16px] text-[16px] font-[Google Sans] text-[#5283EC] hover:underline font-[500] ms-2 cursor-pointer"
          onClick={() => {
            if (props.isLogin) {
              navigateWithQueryParams("/");
            } else {
              navigateWithQueryParams("/login");
            }
          }}
        >
          {props.isLogin ? "Register" : "Log in"}
        </Label>
      </div>
      <div className="flex justify-center mt-10">
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

export default Login;
