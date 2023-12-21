import { useContext, useState } from "react";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import DriversLicense from "assets/driver-licence.svg";
import PassportIcon from "assets/passport-icon.svg";
import { RadioGroup, RadioGroupItem } from "../../../ui/radio-group";
import { useNavigateWithQueryParams } from "../../../../utils/navigateWithQueryParams";
import { UserContext } from "../../../../context/userContext";
import Layout from "../../layout";
import BackButton from "../../components/backButton";

type Props = {
  heading?: string;
};

function LoginOptions(Props: Props) {
  const context = useContext(UserContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [flow, setFlow] = useState<any>("faceLogin");
  const onContinue = () => {
    context.setLoginOption(flow);
    navigateWithQueryParams("/face-login");
  };
  return (
    <>
      <Layout>
        <div className="relative flex text-center justify-center">
          <div className="relative w-full">
            <RadioGroup defaultValue="faceLogin">
              <div className="p-10  max-md:p-[20px]">
                <div className="flex justify-between">
                  <BackButton />
                </div>
                <div className="mt-2">
                  <Label className="text-[28px] font-[500] text-primaryText">
                    Choose your login option{" "}
                  </Label>
                </div>
                <div className="text-center overflow-auto h-[490px] mt-2 p-1">
                  <div className="ps-8 pe-8">
                    <Label className="text-[14px] font-[400] text-secondaryText">
                      Select one option to continue in the next step{" "}
                    </Label>
                  </div>
                  <div className="mt-5">
                    <div
                      className={`flex justify-between items-center border ${
                        flow === "faceLogin"
                          ? "border-primary border-[1.5px]"
                          : "border-"
                      } p-3 rounded-[8px] mt-3 ${
                        flow === "faceLogin" ? "bg-primaryLight" : ""
                      }`}
                    >
                      <div className="flex">
                        <div>
                          <img src={DriversLicense} alt="" className="me-2" />
                        </div>
                        <div>
                          <Label className="text-[14px] font-[400] text-primaryText">
                            Login with face scan
                          </Label>
                        </div>
                      </div>
                      <RadioGroupItem
                        value={"faceLogin"}
                        defaultChecked={flow === "faceLogin"}
                        onClick={() => setFlow("faceLogin")}
                      ></RadioGroupItem>
                    </div>
                    <div
                      className={`flex justify-between items-center border ${
                        flow === "passkey"
                          ? "border-primary border-[1.5px]"
                          : "border-borderSecondary"
                      } p-3 rounded-[8px] mt-3 ${
                        flow === "passkey" ? "bg-primaryLight" : ""
                      }`}
                    >
                      <div className="flex">
                        <div>
                          <img src={PassportIcon} alt="" className="me-2" />
                        </div>
                        <div>
                          <Label className="text-[14px] font-[400] text-primaryText">
                            Login with passkey
                          </Label>
                        </div>
                      </div>{" "}
                      <RadioGroupItem
                        value={"passkey"}
                        defaultChecked={flow === "passkey"}
                        onClick={() => setFlow("passkey")}
                      ></RadioGroupItem>
                    </div>
                    <div
                      className={`flex justify-between items-center border ${
                        flow === "loginDl"
                          ? "border-primary border-[1.5px]"
                          : "border-borderSecondary"
                      } p-3 rounded-[8px] mt-3 ${
                        flow === "loginDl" ? "bg-primaryLight" : ""
                      }`}
                    >
                      <div className="flex">
                        <div>
                          <img src={DriversLicense} alt="" className="me-2" />
                        </div>
                        <div>
                          <Label className="text-[14px] font-[400] text-primaryText">
                            Login with driver's license
                          </Label>
                        </div>
                      </div>{" "}
                      <RadioGroupItem
                        value={"loginDl"}
                        defaultChecked={flow === "loginDl"}
                        onClick={() => setFlow("loginDl")}
                      ></RadioGroupItem>
                    </div>
                    <div
                      className={`flex justify-between items-center border ${
                        flow === "loginVc"
                          ? "border-primary border-[1.5px]"
                          : "border-borderSecondary"
                      } p-3 rounded-[8px] mt-3 ${
                        flow === "loginVc" ? "bg-primaryLight" : ""
                      }`}
                    >
                      <div className="flex">
                        <div>
                          <img src={PassportIcon} alt="" className="me-2" />
                        </div>
                        <div>
                          <Label className="text-[14px] font-[400] text-primaryText">
                            Login with verified credentials
                          </Label>
                        </div>
                      </div>{" "}
                      <RadioGroupItem
                        value={"loginVc"}
                        defaultChecked={flow === "loginVc"}
                        onClick={() => setFlow("loginVc")}
                      ></RadioGroupItem>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>
            <div className="text-left h-[100px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt- pb-4">
              <div>
                <Button
                  className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
                  onClick={() => onContinue()}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default LoginOptions;
