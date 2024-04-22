import { useNavigate, useSearchParams } from "react-router-dom";
import loginFrame from "assets/login/login-main-frame.svg";
import hhsFrame from "assets/login/hhsBanner.png";
import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import Layout from "common/layout";
import config from "config";
import { useContext, useEffect, useState } from "react";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { UserContext } from "context/userContext";
import { AuthContext } from "react-oauth2-code-pkce";
import { useAuth } from "context/authContext";
import { createCibaSession } from "@privateid/ping-oidc-web-sdk-alpha";
import { OidcContext } from "context/oidcContext";

type Props = {
  isLogin?: boolean;
};

const Login = (props: Props) => {
  const pkcContext = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [loader, setLoader] = useState(false);
  const oidcContext = useContext(OidcContext);

  const { login } = useAuth();
  const [decodedIdToken, setDecodedIdToken] = useState(null);
  const [uuid, setUuid] = useState(null);

  const getRandomToken = () => {
    function randomString(length:number, chars:string) {
      var result = "";
      for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    }
    var rString = randomString(
      32,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    );
    return rString;
  };

  const handleLogin = async() => {
    // const extraParams = {
    //   productGroupId: process.env.REACT_APP_AUTH_PRODUCT_GROUP_ID || "",
    //   actionFlow: "login",
    //   prompt: "login",
    //   redirectUrl: process.env.REACT_APP_REDIRECT_URL || "",
    // };
    // //@ts-ignore
    // login(extraParams);

    const result = await createCibaSession({
      baseUrl: process.env.REACT_APP_API_URL || "", //"https://api.orchestration.devel.privateid.com/oidc",
      productGroupId: process.env.REACT_APP_AUTH_PRODUCT_GROUP_ID || "", //"test102",
      clientId: process.env.REACT_APP_CLIENT_ID || "", // "0nCeaqMLNuIhZ2nFV029i", //"CtzBXSfip7saYUGB28gps",
      actionFlow: "login",
      interactionUid: getRandomToken(),
    });

    console.log("login result", result);
    console.log("length:", result.url.length);
    console.log("index:", result.url.indexOf("="))
    const token = result.url.slice(result.url.indexOf("=")+1);
    oidcContext.setTransactionToken(token);
    oidcContext.setActionFlow("login");
    oidcContext.setProductGroupId(process.env.REACT_APP_AUTH_PRODUCT_GROUP_ID || "") ; //"test102");
    oidcContext.setClientId(process.env.REACT_APP_CLIENT_ID || ""); //"CtzBXSfip7saYUGB28gps");
    navigate(`/face-login`);   
  };


  const handleRegister = async() => {
    // const extraParams = {
    //   productGroupId: process.env.REACT_APP_PRODUCT_GROUP_ID || "",
    //   actionFlow: "register",
    //   prompt: "login",
    //   redirectUrl: process.env.REACT_APP_REDIRECT_URL || "",
    // };
    //@ts-ignore
    // login(extraParams);
    
    const result = await createCibaSession({
      baseUrl: process.env.REACT_APP_API_URL || "", //"https://api.orchestration.devel.privateid.com/oidc",
      productGroupId: process.env.REACT_APP_PRODUCT_GROUP_ID || "" , //"test101",
      clientId: process.env.REACT_APP_CLIENT_ID || "", // "0nCeaqMLNuIhZ2nFV029i", //"CtzBXSfip7saYUGB28gps",
      actionFlow: "register",
      interactionUid: getRandomToken(),
    });

    console.log("login result", result);
    console.log("length:", result.url.length);
    console.log("index:", result.url.indexOf("="))
    const token = result.url.slice(result.url.indexOf("=")+1);
    oidcContext.setTransactionToken(token);
    oidcContext.setActionFlow("register");
    oidcContext.setProductGroupId(process.env.REACT_APP_PRODUCT_GROUP_ID || "");
    oidcContext.setClientId(process.env.REACT_APP_CLIENT_ID || "", );// "0nCeaqMLNuIhZ2nFV029i"); //"CtzBXSfip7saYUGB28gps");
    navigate(`/user-consent`);    
  };

  const handleForgetMe = () => {
    const extraParams = {
      productGroupId: process.env.REACT_APP_AUTH_PRODUCT_GROUP_ID || "",
      actionFlow: "forget_me",
      prompt: "login",
      redirectUrl: process.env.REACT_APP_REDICRECT_URL || "",
    };
    //@ts-ignore
    login(extraParams);
  };

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
              // navigateWithQueryParams("/login-options");
              //  pkcContext.login();
              handleLogin();
            } else {
              // onRegister();
              // pkcContext.login();
              handleRegister();
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

        {/* {props.isLogin ? ( */}
        <Label
          className="mt-[16px] text-[16px] font-[Google Sans] text-[#5283EC] hover:underline font-[500] ms-2 cursor-pointer"
          onClick={() => {
            if (props.isLogin) {
              navigateWithQueryParams("/");
            } else {
              navigateWithQueryParams("/login", { action: "login" });

              // window.location.href = "/login?action=login" ;
            }
          }}
        >
          {props.isLogin ? "Register" : "Log in"}
        </Label>
        {/* // ) : (
        //   <a href="/login?action=login">
        //     <Label className="mt-[16px] text-[16px] font-[Google Sans] text-[#5283EC] hover:underline font-[500] ms-2 cursor-pointer">
        //       Log in
        //     </Label>
        //   </a>
        // )} */}
      </div>

      <div className="mt-5 flex justify-center">
        <Label
          className="mt-[16px] text-[16px] font-[Google Sans] text-[#5283EC] hover:underline font-[500] ms-2 cursor-pointer"
          onClick={() => {
            handleForgetMe();
          }}
        >
          Forget Me
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
