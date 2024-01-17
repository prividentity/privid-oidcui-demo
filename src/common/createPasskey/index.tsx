import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import PasskeyBg from "../../assets/passkey-bg.svg";
import PasskeyErrorIcon from "../../assets/passkey-error.png";
import Stepper from "../faceScanningIntro/Stepper";
import Layout from "../layout";
import BackButton from "../components/backButton";
import { useNavigateWithQueryParams } from "../../utils/navigateWithQueryParams";
import { startRegistration } from "@simplewebauthn/browser";
import {
  generateRegistrationOptions,
  verifyRegistration,
} from "../../services/passkey";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context/userContext";
import CloseButton from "common/components/closeButton";

type Props = {};

function CreatePasskey(Props: Props) {
  const context = useContext(UserContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [supportsPasskey, setSupportsPasskey] = useState(false);
  useEffect(() => {
    const checkWebAuthnSupport = async () => {
      try {
        if ("PublicKeyCredential" in window) {
          const supportsPasskey =
            await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setSupportsPasskey(supportsPasskey);
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
    if (!supportsPasskey) {
      context.setSuccessMessage("Success! Your account is created");
      navigateWithQueryParams("/success");
      return;
    }
    const uuid = JSON.parse(localStorage.getItem("uuid") ?? "{}");
    let response;
    try {
      response = await generateRegistrationOptions(uuid);
    } catch (error: any) {
      context.setSuccessMessage("Success! Your account is created");
      navigateWithQueryParams("/success");
      return;
    }
    let attResp;
    try {
      const opts = response;
      attResp = await startRegistration(opts);
    } catch (error: any) {
      context.setSuccessMessage("Success! Your account is created");
      navigateWithQueryParams("/success");
      return;
    }
    const verificationJSON = await verifyRegistration({ attResp, uuid });
    if (verificationJSON?.verified) {
      context.setSuccessMessage("Success! Your account is created");
      navigateWithQueryParams("/success");
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
                <div className="flex items-center justify-center w-full">
                  <Stepper step={3} />
                </div>
                <div>{/* {Empty div to adjust space} */}</div>
                <CloseButton />
              </div>
              {supportsPasskey ? (
                <>
                  <div className="mt-2">
                    <Label className="text-[28px] font-[500] text-primaryText">
                      Create your Passkey{" "}
                    </Label>
                  </div>
                  <div className="text-center overflow-auto h-[470px] mt-2 p-1 max-md:h-[unset]">
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
                      {/*<p className="text-[15px] font-[400 w-[93%] m-auto text-left mt-[10px] text-secondaryText max-md:w-[90%] max-md:text-left">*/}
                      {/*  With passkeys, you don't need to remember complex*/}
                      {/*  passwords.*/}
                      {/*</p>*/}

                      {/*<ul className="passkeyList w-[93%] m-auto overflow-auto h-[120px] max-md:h-[calc(20vh_-_2rem)] max-md:w-[90%]">*/}
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
                      {/*    Passkeys are saved to your password manager, so you*/}
                      {/*    can sign in on other devices.*/}
                      {/*  </p>*/}
                      {/*</ul>*/}
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-2">
                  <Label className="text-[28px] font-[500] text-primaryText">
                    Create your Passkey{" "}
                  </Label>
                  <img
                    src={PasskeyErrorIcon}
                    alt="PasskeyErrorIcon"
                    className="w-[100px] m-auto block mt-[40px]"
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
              )}
            </div>
          </div>
        </div>
        <div className="text-left h-[120px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={() => onGeneratePasskey()}
            >
              {supportsPasskey ? "Create a passkey" : "Continue"}
            </Button>
            <Label
              className="hover:underline text-primary text-[14px] cursor-pointer mt-[0px] block text-center mb-0 mt-[10px]"
              onClick={() => navigateWithQueryParams("/verify-pin")}
            >
              No thanks, I am on a shared device.
            </Label>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default CreatePasskey;
