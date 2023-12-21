import QRCode from "react-qr-code";
import InputMask from "react-input-mask";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ComputerIcon from "assets/comp.svg";
import demoFlag from "assets/login/demo-flag.svg";
import check from "assets/check.svg";
import emailIcon from "assets/login/email.svg";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import { getUser, sendMessage, verifyTokenApi } from "../../../services/api";
import { useInterval } from "../../../utils/useInterval";
import clipIcon from "assets/clipIcon.svg";
import Layout from "../layout";
import BackButton from "../components/backButton";
type Props = {
  resendCode?: boolean;
  limitFailed?: boolean;
  sent?: boolean;
};

function SwitchDevice(props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lodaing, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<null | number>(10000);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [smsLimit, setSmsLimit] = useState(0);
  const [searchParams] = useSearchParams();
  const tokenParams: any = searchParams.get("token");

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      if (smsLimit !== 4) {
        setIsResendDisabled(false);
      }
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);
  const sendPhone = async () => {
    const payload: any = {
      type: "phone",
      phone: `+1${phone}`,
      subject: "Continue your verification",
      message: `to continue your verification process, Please delete this message if you did not request this verification.`,
      endpoint: window.location.origin.slice(1),
    };
    setLoading(true);
    if (smsLimit === 0) {
      setTimer(30);
    } else if (smsLimit === 1) {
      setTimer(60);
    } else if (smsLimit === 2) {
      setTimer(90);
    }
    setIsResendDisabled(true);
    setSmsLimit(smsLimit + 1);
    await sendMessage(payload);
    setLoading(false);
  };
  const sendEmail = async () => {
    const payload = {
      type: "email",
      email,
      subject: "Continue your verification",
      message: `to continue your verification process, Please delete this message if you did not request this verification.`,
      endpoint: window.location.origin.slice(1),
    };
    setLoading(true);
    await sendMessage(payload);
    setLoading(false);
    setEmail("");
  };

  useInterval(() => {
    verifyTokenApi(tokenParams).then(async (res: any) => {
      // navigateWithQueryParams('/redirected-mobile')
      if (["SUCCESS", "FAILURE"].includes(res.status)) {
        setRefreshInterval(null);
        if (res.status === "SUCCESS") {
          const payload = {
            id: res.user,
          };
          const data: any = await getUser(payload);
          localStorage.setItem("uuid", JSON.stringify(data.user.uuid || {}));
          successSessionRedirect(tokenParams, false, false);
          // setStep(STEPS.PASSKEY);
        } else {
          failureSessionRedirect(tokenParams, false);
          // setStep(STEPS.FAILURE);
        }
      }
    });
  }, refreshInterval);

  const failureSessionRedirect = (
    session: { failureUrl: string | URL },
    redirectUrl = false
  ) => {
    if (redirectUrl && session.failureUrl) {
      setTimeout(() => {
        window.location.replace(session.failureUrl);
      }, 2000);
    } else {
      return navigateWithQueryParams("/failed");
    }
  };

  const successSessionRedirect = (
    session: { successUrl: string | URL },
    redirectUrl = false,
    passKey = true
  ) => {
    if (passKey) {
      return navigateWithQueryParams("/generate-passkey");
    } else if (redirectUrl && session.successUrl) {
      setTimeout(() => {
        window.location.replace(session.successUrl);
      }, 2000);
    } else {
      return navigateWithQueryParams("/success");
    }
  };
  const from = searchParams.get("from");
  const urlForRedirect =
    window.location.origin + from + "?token=" + tokenParams;
  return (
    <>
      <Layout>
        <div className="px-10 py-5 h-full max-md:p-[20px]">
          <div className="flex justify-between">
            <BackButton />
            <div className="w-full">
              <img src={ComputerIcon} alt="ComputerIcon" className="m-auto" />
            </div>
            <div>{/* {Empty div to adjust space} */}</div>
          </div>
          <div className="mt-2">
            <Label className="text-[28px] font-[500] text-primaryText">
              To continue, use your smartphone
            </Label>
          </div>
          <div className="text-center overflow-auto h-[480px] mt-3 p-2 max-md:h-[unset]">
            <div className="ps-5 pe-5">
              <Label className="text-[14px] font-[400] text-secondaryText">
                To avoid problems with the quality of your verification, please
                continue on mobile and do not close this tab until verification
                is done.
              </Label>
            </div>
            <Tabs defaultValue="qr-code" className="w-full">
              <TabsList
                style={{ background: "none" }}
                className="grid w-full grid-cols-4"
              >
                <TabsTrigger value="qr-code" className="">
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="link" className="">
                  Link
                </TabsTrigger>
                <TabsTrigger value="sms" className="">
                  SMS
                </TabsTrigger>
                <TabsTrigger value="email" className="">
                  Email
                </TabsTrigger>
              </TabsList>
              <TabsContent value="qr-code" className="mt-5">
                <Card className="border-none bg-[#f8f8f8] rounded-[24px] p-6 max-md:p-[10px]">
                  <CardHeader className="p-2">
                    <CardTitle>Scan QR code</CardTitle>
                    <CardDescription>
                      <div className="mt-2 w-[80%] m-auto max-md:w-[100%]">
                        Please scan the QR Code below with your mobile phone
                        device to continue your verification.
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-center items-center">
                      <div className="bg-[#fff] shadow-2xl p-4 rounded-[20px]">
                        <QRCode size={150} value={urlForRedirect} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="link" className="mt-6">
                <Card className="border-none bg-[#f8f8f8] rounded-[24px] p-6 max-md:p-[10px]">
                  <CardHeader className="p-2 max-md:p-[10px]">
                    <CardTitle>Copy link</CardTitle>
                    <CardDescription>
                      <div className="mt-2">
                        Open this link to complete this verification on a
                        different device.
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 ps-8 pe-8 max-md:p-[10px]">
                    <div className="flex justify-center h-[200px]">
                      <div className="relative w-full mt-6">
                        <img
                          src={clipIcon}
                          alt="clipIcon"
                          className="absolute top-3.5 left-2"
                        />
                        <Input
                          placeholder=""
                          className="ps-[2rem] h-[50px] rounded-[8px] pe-[140px]"
                          value={urlForRedirect}
                        />
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(urlForRedirect);
                          }}
                          className="absolute right-3 top-[6px] h-[38px] rounded-[24px] w-[113px] bg-primary hover:bg-primary text-white max-md:w-[90px]"
                        >
                          Copy link
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="sms" className="mt-6">
                <Card className="border-none bg-[#f8f8f8] rounded-[24px] p-6 max-md:p-[10px]">
                  <CardHeader className="p-2">
                    <CardTitle>Receive a link via text message.</CardTitle>
                    <CardDescription>
                      <div className="mt-2">
                        Enter your mobile number and we will send you a link to
                        complete this verification on a different device.
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 ps-8 pe-8 pb-0 max-md:p-[10px]">
                    <div
                      className={`flex justify-center ${
                        props?.resendCode ? "h-[145px]" : "h-[160px]"
                      } `}
                    >
                      <div className="relative w-full mt-0">
                        <InputMask
                          mask="999-999-9999"
                          maskChar={null}
                          alwaysShowMask={true}
                          onChange={(e: any) => {
                            setPhone(e.target.value);
                          }}
                          value={phone}
                        >
                          {
                            // @ts-ignore
                            () => {
                              return (
                                <Input
                                  type="tel"
                                  placeholder="000-000-0000 *"
                                  className="mt-5 ps-[3.3rem] h-[56px] rounded-[4px] placeholder:text-placeholder placeholder:font-normal"
                                  maxLength={12}
                                />
                              );
                            }
                          }
                        </InputMask>
                        <div className="flex absolute top-9 left-2">
                          <img
                            src={demoFlag}
                            alt=""
                            className="font-[400] text-primaryText"
                          />
                          <span className="ml-[3px] text-[0.875rem] mt-[1.7px]">
                            +1
                          </span>
                        </div>
                      </div>
                    </div>
                    {isResendDisabled && smsLimit !== 4 ? (
                      <div className="!mt-[-45px] pb-5">
                        <Label className="text-secondaryText text-[14px]">
                          Resend Code in{" "}
                          <span className="text-primary">{timer}s</span>
                        </Label>
                      </div>
                    ) : (
                      ""
                    )}
                    {smsLimit === 4 ? (
                      <div className="!mt-[-55px] pb-[6px] w-[70%] text-center m-auto">
                        <Label className="text-[#FB6E4F] text-[14px] font-[400]">
                          Usage limit exceeded. Please try other methods to
                          switch to mobile device.{" "}
                        </Label>
                      </div>
                    ) : (
                      ""
                    )}
                    <div>
                      <Button
                        className={`w-full ${
                          isResendDisabled ? "text-[#9ba3b2]" : "text-white"
                        } bg-primary rounded-[24px] mt-0 hover:opacity-90 hover:bg-primary`}
                        disabled={!phone || lodaing || isResendDisabled}
                        onClick={sendPhone}
                      >
                        {isResendDisabled ? (
                          <img src={check} className="mr-[3px]" alt="" />
                        ) : (
                          ""
                        )}
                        {isResendDisabled ? "Sent" : "Send Link"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="email" className="mt-6">
                <Card className="border-none bg-[#f8f8f8] rounded-[24px] p-6 max-md:p-[10px]">
                  <CardHeader className="p-2">
                    <CardTitle>Receive a link via email</CardTitle>
                    <CardDescription>
                      <div className="mt-2">
                        Enter your email and we will send you a link to complete
                        this verification on a different device.
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 ps-8 pe-8 pb-0 max-md:p-[10px]">
                    <div className="h-[120px]">
                      <div className="flex justify-center relative w-full mt-6 mb-3">
                        <Input
                          placeholder="Enter your email *"
                          className="mt-0 ps-9 h-[56px] rounded-[4px] placeholder:text-placeholder placeholder:font-normal"
                          onChange={(e: any) => setEmail(e?.target?.value)}
                          value={email}
                          type="email"
                        />
                        <img
                          src={emailIcon}
                          alt=""
                          className="absolute top-4 left-2 font-[400] text-primaryText"
                        />
                      </div>
                      <Label className="text-[14px] font-[400] text-secondaryText">
                        If you do not see the email, then please check your spam
                        folder.
                      </Label>
                    </div>
                    <div>
                      <Button
                        className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
                        disabled={!email || lodaing}
                        onClick={sendEmail}
                      >
                        Send Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Layout>
      <Label
        className="hover:underline text-primary text-[14px] cursor-pointer mt-[0px] block text-center mb-5"
        onClick={() => navigateWithQueryParams("/redirected-mobile")}
      >
        Continue on desktop
      </Label>
    </>
  );
}

export default SwitchDevice;
