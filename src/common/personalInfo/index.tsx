import InputMask from "react-input-mask";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import userLogo from "assets/login/user-icon.svg";
import demoFlag from "assets/login/demo-flag.svg";
import emailIcon from "assets/login/email.svg";
import ssnIcon from "assets/ssnIcon.svg";
import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { emailRegex } from "constant";
import { UserContext } from "context/userContext";
import { createUserWithSession } from "@privateid/cryptonets-web-sdk";
import { useToast } from "components/ui/use-toast";
import Layout from "common/layout";
import BackButton from "common/components/backButton";
import { Landmark } from "lucide-react";
import CloseButton from "common/components/closeButton";

type Props = {};

const PersonalInfo = (props: Props) => {
  const { setUser, tokenParams } = useContext(UserContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [ssn, setSsn] = useState<string>("");
  const phoneNumber = phone?.replaceAll("-", "");
  const [errors, setErrors] = useState({
    phoneError: "",
    emailError: "",
  });
  const ssnPattern = "xxx-xx-";
  const disabled = phoneNumber?.length <= 9 || !email;

  const onSubmit = async (e?: any) => {
    e.preventDefault();
    if (phoneNumber?.length < 10) {
      setErrors({ ...errors, phoneError: "Please enter a valid phone number" });
      return;
    }
    if (!emailRegex.test(email)) {
      setErrors({
        ...errors,
        emailError: "Please enter a valid email address",
        phoneError: "",
      });
      return;
    }
    // Set user in context
    setUser({
      email: email,
      phone: phone,
    });
    const payload = {
      sessionToken: tokenParams,
      email: email,
      phone: phoneNumber,
      ssn: ssn || undefined,
    };
    setLoader(true);
    const userResult = await createUserWithSession(payload);
    if (userResult?.error === "Not Acceptable") {
      toast({
        variant: "destructive",
        description: userResult?.message,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
    setLoader(false);
    if (userResult?.success) {
      navigateWithQueryParams("/face-scan-intro");
    }
  };
  const onBlur = (type: string) => {
    switch (type) {
      case "phone":
        setErrors({
          ...errors,
          phoneError: "",
        });
        return;
      case "email":
        setErrors({
          ...errors,
          emailError: "",
        });
        return;
      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numInput = e.target.value.replace(/\D/g, "");
    if (numInput.length <= 4) {
      setSsn(numInput);
    }
  };

  const beforeMaskedStateChange = ({ nextState }: any) => {
    let newState = nextState;
    let value = nextState?.enteredString;
    if (value?.length > 8 && value?.charAt(0) === '0') {
      value = value.slice(1);
      newState = { ...newState, value };
    }

    return newState;
  };

  return (
    <Layout>
      <form onSubmit={onSubmit} autoComplete={"on"} style={{ height: "100%" }}>
        <div className="px-10 py-8 max-md:p-[20px]">
          <div className="flex justify-between relative">
            <BackButton />
            <div className="w-full h-[48px]">
              <img src={userLogo} alt="consentLogo" className="m-auto" />
            </div>
            <CloseButton />
          </div>
          <div className="mt-2">
            <Label className="text-[28px] font-[500] text-primaryText">
              Personal details
            </Label>
          </div>
          <div className="text-center overflow-auto h-[490px] mt-3 p-2">
            <div className="ps-8 pe-8">
              <Label className="text-[14px] font-[400] text-secondaryText">
                Please enter the required information
              </Label>
            </div>
            <div className="">
              <div className="relative">
                <InputMask
                  mask="999-999-9999"
                  name={"phone"}
                  maskPlaceholder={null}
                  alwaysShowMask={true}
                  beforeMaskedStateChange={beforeMaskedStateChange}
                  onChange={(e: any) => {
                    setPhone(e.target.value);
                  }}
                  onFocus={() => {
                    onBlur("phone");
                  }}
                >
                  <Input
                    type="tel"
                    name="phone"
                    autoComplete={"tel"}
                    placeholder="Enter your phone number *"
                    className="mt-5 ps-[3.3rem] h-[56px] rounded-[4px] placeholder:text-placeholder placeholder:font-normal"
                    maxLength={15}
                    error={errors?.phoneError}
                  />
                </InputMask>
                <div className="flex absolute top-4 left-2">
                  <img
                    src={demoFlag}
                    alt="country-icon"
                    className="font-[400] text-primaryText"
                  />
                  <span className="ml-[3px] text-[0.875rem] mt-[1.7px]">
                    +1
                  </span>
                </div>
              </div>
              <div className="relative">
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email *"
                  className="mt-5 ps-9 h-[56px] rounded-[4px] placeholder:text-placeholder placeholder:font-normal"
                  onChange={(e: any) => setEmail(e?.target?.value)}
                  error={errors?.emailError}
                  onFocus={() => {
                    onBlur("email");
                  }}
                />
                <img
                  src={emailIcon}
                  alt="email-icon"
                  className="absolute top-4 left-2 font-[400] text-primaryText"
                />
              </div>
              <div className="relative">
                <Input
                  type="tel"
                  name="ssn4"
                  value={ssn ? ssnPattern + ssn : ssn}
                  // maxLength={4}
                  placeholder="Enter last 4 digits of SSN"
                  className="mt-5 ps-9 h-[56px] rounded-[4px] placeholder:text-placeholder placeholder:font-normal"
                  // onChange={(e: any) => {
                  //   if (e?.target?.value?.length > 4) return;
                  //   setSsn(e?.target?.value);
                  // }}
                  onChange={handleChange}
                />
                {/* <img
                src={ssnIcon}
                alt="ssn-icon"
                className="absolute top-4 left-2 font-[400] text-primaryText"
              /> */}
                <Landmark className="absolute top-4 left-2 font-[400] text-primary " />
              </div>
            </div>
            <div
              className={`text-left h-[100px] absolute w-full left-0 bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4 max-md:h-[unset] max-md:relative`}
            >
              <div>
                <Button
                  className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
                  onClick={(e) => onSubmit(e)}
                  disabled={loader || disabled}
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

export default PersonalInfo;
