import { useContext } from "react";
import Lottie from "lottie-react";
import { UserContext } from "context/userContext";
import successJson from "Animations/5-Verify/JSONs/Success.json";
import Layout from "common/layout";
import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import { useNavigate } from "react-router-dom";
import { isMobile } from "utils";
import { OidcContext } from "context/oidcContext";
import useWasm from "hooks/useWasm";

type Props = {
  heading?: string;
};

function Success(Props: Props) {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const oidcContext = useContext(OidcContext);

  const {setReady} = useWasm();
  return (
    <Layout>
      <div className="h-full p-10 flex justify-between items-center flex-col max-md:p-[20px]">
        <div className="h-full flex justify-center items-center flex-col">
          <div className="flex justify-center items-center ">
            <Lottie
              loop={false}
              autoplay={true}
              animationData={successJson}
              style={{
                height: isMobile ? 350 : 400,
                width: isMobile ? 380 : 400,
              }}
            />
          </div>
          <Label className="text-[28px] font-[500] text-primaryText w-[90%] mt-[-4rem] max-md:mt-[-4rem]">
            {context?.successMessage ||
              Props.heading ||
              "Success! Your account is created"}
          </Label>
          <div>
            <Label className="text-[14px] font-[500] text-primaryText w-[90%] mt-[-4rem] max-md:mt-[-4rem]">
              {`ID Token: ${oidcContext.cibaIdToken.slice(
                oidcContext.cibaIdToken.length - 20
              )}`}
            </Label>
          </div>
          <div>
            <Label className="text-[14px] font-[500] text-primaryText w-[90%] mt-[-4rem] max-md:mt-[-4rem]">
              {`Access Token: ${oidcContext.cibaAccessToken}`}
            </Label>
          </div>
        </div>
        <div className="mt-[3rem] w-full">
          <Button
            className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary hover:text-white"
            onClick={() => {
              // context.setIsWasmLoaded(false);
              // setReady(false);
              navigate("/");
              navigate(0);
            }}
          >
            Return to homepage
          </Button>
          <Button className="w-full text-primary bg-white rounded-[24px] mt-4 hover:opacity-90 hover:bg-white hover:text-primary">
            Provide feedback
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default Success;
