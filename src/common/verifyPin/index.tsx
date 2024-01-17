import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import Layout from "common/layout";
import BackButton from "common/components/backButton";
import CloseButton from "common/components/closeButton";
import PinInput from "react-pin-input";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { useContext, useState } from "react";
import { isMobile } from "utils";
import { PIN } from "constant";
import { UserContext } from "context/userContext";

type Props = {};

const VerifyPin = (props: Props) => {
  const context = useContext(UserContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [pin, setPin] = useState("");
  const [wrongPin, setWrongPin] = useState(false);
  const handlePinOnComplete = (value: string) => {
    // console.log("onComplete:", `${value}`);
    if (value !== PIN) {
      setWrongPin(true);
      return
    }
    setPin(value);
  };
  return (
    <Layout>
      <form autoComplete={"on"} style={{ height: "100%" }}>
        <div className="px-10 py-8 max-md:p-[20px]">
          <div className="flex justify-between relative">
            <BackButton />
            <CloseButton />
          </div>
          <div className="mt-2">
            <Label className="text-[28px] font-[500] text-primaryText">
              Enter your Card PIN
            </Label>
          </div>
          <div className="text-center overflow-auto h-[490px] mt-3 p-2">
            <div className="ps-8 pe-8">
              <Label className="text-[14px] font-[400] text-secondaryText">
                Enter your PIN to{" "}
                {context?.loginOption === "loginPin" ? "login" : "Register"}
              </Label>
            </div>
            <div className="">
              <div className="relative">
                <PinInput
                  length={4}
                  initialValue=""
                  secret
                  secretDelay={200}
                  type="numeric"
                  inputMode="number"
                  style={{ padding: "10px" }}
                  inputStyle={{
                    borderColor: "gray",
                    width: isMobile ? "50px" : "70px",
                    height: isMobile ? "50px" : "70px",
                    fontSize: isMobile ? "20px" : "24px",
                    marginLeft: 10,
                    transition: "all .2s",
                  }}
                  inputFocusStyle={{
                    borderColor: "blue",
                    transform: "scale(1.1)",
                  }}
                  onChange={(e) => {
                    setWrongPin(false);
                  }}
                  onComplete={(value) => {
                    handlePinOnComplete(value);
                  }}
                  autoSelect={true}
                  regexCriteria={/^[0-9]*$/}
                />
              </div>
              {wrongPin && (
                <div className="ps-8 pe-8">
                  <Label className="text-[14px] font-[400] text-[red]">
                    Whoops, wrong PIN. Please try again.
                  </Label>
                </div>
              )}
            </div>
            <div
              className={`text-left h-[100px] absolute w-full left-0 bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4 max-md:h-[unset] max-md:relative`}
            >
              <div>
                <Button
                  className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
                  disabled={!pin}
                  onClick={() => navigateWithQueryParams("/success")}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default VerifyPin;
