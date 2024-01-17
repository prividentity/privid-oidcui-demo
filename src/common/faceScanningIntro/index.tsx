import Lottie, { LottieRefCurrentProps } from "lottie-react";
import faceScan from "Animations/1-Selfie/JSON/Scan-face.json";
import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import NoHat from "assets/no-hat.svg";
import Sun from "assets/sun.svg";
import ClutteredBg from "assets/cluttered-bg.svg";
import BackButton from "../components/backButton";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import Stepper from "./Stepper";
import Layout from "common/layout";
import SwitchDeviceSelect from "common/components/switchDeviceSelect";
import { useRef } from "react";
import CloseButton from "common/components/closeButton";

type Props = {
  heading?: string;
};

const instructions = [
  {
    image: NoHat,
    heading: "Take off glasses",
    text: "Ensure nothing covers your face",
  },
  {
    image: ClutteredBg,
    heading: "Uncluttered backgrounds",
    text: "Ensure just your face is in the frame",
  },
  {
    image: Sun,
    heading: "Ensure good lighting",
    text: "Your face isn’t backlit by a light source",
  },
];

const style = { height: window.innerWidth <= 767 ? 200 : 250 };
const rendererSettings = {
  preserveAspectRatio: "xMaxYMin slice",
};

function FaceScanningIntro(Props: Props) {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  return (
    <>
      <Layout>
        <div className="px-10 py-8 max-md:p-[20px]">
          <div className="flex justify-between relative">
            <BackButton />
            <div className="flex items-center justify-center w-full">
              <Stepper step={1} />
            </div>
            <div>{/* {Empty div to adjust space} */}</div>
            <CloseButton />
          </div>
          <div className="mt-2">
            <Label className="text-[28px] font-[500] mt-[20px] text-primaryText block max-md:text-[24px]">
              Take a selfie to verify identity{" "}
            </Label>
          </div>
          <div className="text-center overflow-auto mt-1 p-1">
            <div className="ps-8 pe-8 max-md:p-[10px] max-md:pt-[0px]">
              <Label className="text-[14px] font-[400] text-secondaryText">
                On the next screen, hold your phone at eye level
              </Label>
            </div>
            <div className="mt-5 rounded-[10px] overflow-hidden">
              <Lottie
                animationData={faceScan}
                autoplay={true}
                loop={2}
                style={style}
                rendererSettings={rendererSettings}
                lottieRef={lottieRef}
                onDOMLoaded={() => lottieRef.current?.setSpeed(2)}
                onComplete={() => navigateWithQueryParams("/face-scan")}
              />
            </div>
            <div className="mt-5 max-md:mt-10 overflow-auto max-md:h-[200px]">
              <div className="flex max-md:flex-col ">
                {instructions.map((instruction, idx) => (
                  <div
                    className="flex flex-col pb-4 justify-start items-center max-md:flex-row"
                    key={idx}
                  >
                    <img src={instruction.image} alt="" className="inline" />
                    <div className="flex flex-col text-center max-md:text-left max-md:ml-[20px]">
                      <Label className="text-primaryText font-[500] text-[14px]">
                        {instruction.heading}
                      </Label>
                      <Label className="text-secondaryText font-[400] text-[12px]">
                        {instruction.text}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="text-left h-[100px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4 max-md:h-[unset]">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={() => navigateWithQueryParams("/face-scan")}
            >
              Start
            </Button>
          </div>
        </div>
      </Layout>
      <SwitchDeviceSelect />
    </>
  );
}

export default FaceScanningIntro;
