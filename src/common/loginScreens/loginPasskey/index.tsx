import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import PasskeyBg from "assets/passkey-bg.svg";
import PasskeyErrorIcon from "assets/passkey-error.png";
import Layout from "../../layout";
import BackButton from "../../components/backButton";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthentication,
  verifyRegistration,
} from "services/passkey";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context/userContext";
import { useToast } from "components/ui/use-toast";
import CloseButton from "common/components/closeButton";

type Props = {};

function LoginPasskey(Props: Props) {
  const context = useContext(UserContext);
  const { toast } = useToast();
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [supportsPasskey, setSupportsPasskey] = useState(false);
  useEffect(() => {
    const checkWebAuthnSupport = async () => {
      try {
        if ("PublicKeyCredential" in window) {
          const supportsPasskey =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setSupportsPasskey(supportsPasskey);
          await onGeneratePasskey();
        } else {
          // WebAuthn is not supported
          setSupportsPasskey(false);
        }
      } catch (error) {
        console.error("Error checking WebAuthn support:", error);
        setSupportsPasskey(false);
      }
    };

    checkWebAuthnSupport();
  }, []);
  const onGeneratePasskey = async () => {
    // if (!supportsPasskey) {
    //   context.setSuccessMessage("Success! Your account is created");
    //   navigateWithQueryParams("/success");
    //   return;
    // }
    try {
      const uuid = JSON.parse(localStorage.getItem("uuid") ?? "{}");
      const response = await generateAuthenticationOptions(uuid);
      if (response?.challenge) {
        let asseResp;
        try {
          asseResp = await startAuthentication(response);
        } catch (error) {
          console.log({ error });
        }
        console.log({ asseResp });
        const verificationJSON = await verifyAuthentication({ asseResp, uuid });
        if (verificationJSON?.verified) {
          context?.setSuccessMessage("Authentication successful!");
          navigateWithQueryParams("/success");
        } else {
          toast({
            variant: "destructive",
            description: "There was some issue authenticating with passkey.",
          });
          navigateWithQueryParams("/");
        }
      } else {
        toast({
          variant: "destructive",
          description: "Passkey not found.",
        });
        navigateWithQueryParams("/");
      }
    } catch (e) {
      toast({
        variant: "destructive",
        description: "There was some issue authenticating with passkey.",
      });
      navigateWithQueryParams("/");
    }
  };
  return (
    <>
      <Layout>
        <div className="relative flex text-center justify-center">
          <div className="relative w-full">
            <div className="px-10 py-8 max-md:p-[20px]">
              <div className="flex justify-between relative">
                <BackButton />
                <CloseButton />
              </div>
              <div className="mt-[-10px]">
                <Label className="text-[28px] font-[500] text-primaryText">
                  Login with passkey{" "}
                </Label>
              </div>
              {!supportsPasskey ? (
                <div className="mt-2">
                  <img
                    src={PasskeyErrorIcon}
                    alt="PasskeyErrorIcon"
                    className="w-[100px] m-auto block mt-[7rem]"
                  />
                  <p className="text-[20px] font-[400] mt-[30px]">
                    Your browser is not currently supported. Please use a{" "}
                    <a
                      href="https://passkeys.dev/device-support/#matrix"
                      className="color-[#] text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      recommended browser
                    </a>{" "}
                    or learn more{" "}
                    <a
                      href="https://passkeys.dev/device-support/"
                      className="color-[#] text-primary"
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      here
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <div className="text-center overflow-auto h-[550px] mt-2 p-1 max-md:h-[unset]">
                  <div className="ps-8 pe-8">
                    <Label className="text-[14px] font-[400] text-secondaryText">
                      Speed up your sign in next time by creating a passkey on
                      this device.{" "}
                    </Label>
                  </div>
                  <div className="mt-2">
                    <img
                      src={PasskeyBg}
                      alt="PasskeyBg"
                      className="h-[240px] w-full rounded-[12px]"
                    />
                    {/*<p className="text-[15px] font-[400] m-auto mt-[10px] text-secondaryText">*/}
                    {/*  With passkeys, you don't need to remember complex*/}
                    {/*  passwords.*/}
                    {/*</p>*/}

                    {/*<ul className="passkeyList w-[82%] m-auto overflow-auto h-[220px]">*/}
                    {/*  <li className="text-[14px] font-[400] m-auto mt-[10px] w-[100%] text-left">*/}
                    {/*    What are passkeys?*/}
                    {/*  </li>*/}
                    {/*  <p className="text-[13px] font-[400] m-auto mt-[5px] w-[100%] text-secondaryText text-left">*/}
                    {/*    Passkeys are encrypted digital keys you create using*/}
                    {/*    your fingerprint, face, or screen lock.*/}
                    {/*  </p>*/}
                    {/*  <li className="text-[14px] font-[400] m-auto mt-[10px] w-[100%] text-left mt-[20px]">*/}
                    {/*    Where are passkeys saved?*/}
                    {/*  </li>*/}
                    {/*  <p className="text-[13px] font-[400] m-auto mt-[5px] w-[100%] text-secondaryText text-left">*/}
                    {/*    Passkeys are saved to your password manager, so you can*/}
                    {/*    sign in on other devices.*/}
                    {/*  </p>*/}
                    {/*</ul>*/}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-left h-[80px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt- pb-4">
          <div>
              {/*<Button*/}
              {/*  className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"*/}
              {/*  onClick={onGeneratePasskey}*/}
              {/*>*/}
              {/*  {supportsPasskey ? "Authenticate passkey" : "Continue"}*/}
              {/*</Button>*/}
          </div>
        </div>
      </Layout>
    </>
  );
}

export default LoginPasskey;
