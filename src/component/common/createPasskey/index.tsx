import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import PasskeyBg from "../../../assets/passkey-bg.svg";
import Stepper from "../faceScanningIntro/Stepper";
import Layout from "../layout";
import BackButton from "../components/backButton";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import { startRegistration } from "@simplewebauthn/browser";
import {
  generateRegistrationOptions,
  verifyRegistration,
} from "../../../services/passkey";
import SwitchDeviceSelect from "../components/switchDeviceSelect";

type Props = {};

function CreatePasskey(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const onGeneratePasskey = async () => {
    const uuid = JSON.parse(localStorage.getItem("uuid") ?? "{}");
    const response = await generateRegistrationOptions(uuid);
    let attResp;
    try {
      const opts = response;
      attResp = await startRegistration(opts);
    } catch (error: any) {
      navigateWithQueryParams("/success");
      return;
    }
    const verificationJSON = await verifyRegistration({ attResp, uuid });
    if (verificationJSON?.verified) {
      navigateWithQueryParams("/success");
    }
  };
  return (
    <>
      <Layout>
        <div className="relative flex text-center justify-center">
          <div className="relative w-full">
            <div className="p-10 max-md:p-[20px]">
              <div className="flex justify-between">
                <BackButton />
                <div className="flex items-center justify-center w-full">
                  <Stepper step={3} />
                </div>
                <div>{/* {Empty div to adjust space} */}</div>
              </div>
              <div className="mt-2">
                <Label className="text-[28px] font-[500] text-primaryText">
                  Create your passkey{" "}
                </Label>
              </div>
              <div className="text-center overflow-auto h-[490px] mt-2 p-1 max-md:h-[unset]">
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
                  <p className="text-[15px] font-[400] m-auto mt-[10px] text-secondaryText">
                    With passkeys, you don't need to remember complex passwords.
                  </p>

                  <ul className="passkeyList w-[82%] m-auto overflow-auto h-[140px] max-md:h-[unset]">
                    <li className="text-[14px] font-[400] m-auto mt-[10px] w-[100%] text-left">
                      What are passkeys?
                    </li>
                    <p className="text-[13px] font-[400] m-auto mt-[5px] w-[100%] text-secondaryText text-left">
                      Passkeys are encrypted digital keys you create using your
                      fingerprint, face, or screen lock.
                    </p>
                    <li className="text-[14px] font-[400] m-auto mt-[10px] w-[100%] text-left mt-[20px]">
                      Where are passkeys saved?
                    </li>
                    <p className="text-[13px] font-[400] m-auto mt-[5px] w-[100%] text-secondaryText text-left">
                      Passkeys are saved to your password manager, so you can
                      sign in on other devices.
                    </p>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-left h-[100px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={() => onGeneratePasskey()}
            >
              Create a passkey
            </Button>
          </div>
        </div>
      </Layout>
      <SwitchDeviceSelect />
    </>
  );
}

export default CreatePasskey;
