import { useContext, useState } from "react";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import DriversLicense from "assets/driver-licence.svg";
import PassportIcon from "assets/passport-icon.svg";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { UserContext } from "context/userContext";
import Layout from "common/layout";
import BackButton from "common/components/backButton";
import CloseButton from "common/components/closeButton";

type Props = {
  heading?: string;
};

const options = [
  {
    label: "Login with face scan",
    image: DriversLicense,
    value: "faceLogin",
  },
  {
    label: "Login with passkey",
    image: PassportIcon,
    value: "passkey",
  },
  {
    label: "Login with pin",
    image: PassportIcon,
    value: "loginPin",
  },
  {
    label: "Login with driver's license",
    image: DriversLicense,
    value: "loginDl",
  },
  {
    label: "Login with verifiable credentials",
    image: PassportIcon,
    value: "loginVc",
  },
];

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
              <div className="px-10 py-8 max-md:p-[20px]">
                <div className="flex justify-between relative">
                  <BackButton />
                  <CloseButton />
                </div>
                <div className="mt-2">
                  <Label className="text-[28px] font-[500] text-primaryText max-md:text-[26px]">
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
                    {options?.map((item: any, index: any) => (
                      <div
                        className={`flex justify-between items-center border ${
                          flow === item?.value
                            ? "border-primary border-[1.5px]"
                            : "border-"
                        } p-3 rounded-[8px] mt-3 ${
                          flow === item?.value ? "bg-primaryLight" : ""
                        }`}
                        key={index}
                        onClick={() => setFlow(item?.value)}
                      >
                        <div className="flex">
                          <div>
                            <img src={item?.image} alt="" className="me-2" />
                          </div>
                          <div>
                            <Label className="text-[14px] font-[400] text-primaryText">
                              {item?.label}
                            </Label>
                          </div>
                        </div>
                        <RadioGroupItem
                          value={item?.value}
                          defaultValue={item?.value}
                          onClick={() => setFlow(item?.value)}
                          checked={flow === item?.value}
                        ></RadioGroupItem>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="text-left absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pb-4 max-md:pb-7">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={onContinue}
            >
              Continue
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default LoginOptions;
