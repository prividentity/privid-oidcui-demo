import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import ScanFaceAnimation from "../../../Animations/1-Selfie/Scan face.gif";
import NoHat from "../../../assets/no-hat.svg";
import Sun from "../../../assets/sun.svg";
import ClutteredBg from "../../../assets/cluttered-bg.svg";
import BackButton from "../components/backButton";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import Stepper from "./Stepper";
import Layout from "../layout";
import SwitchDeviceSelect from "../components/switchDeviceSelect";

type Props = {
  heading?: string;
  nextStep: ()=>void
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

function FaceScanningIntro({heading, nextStep}: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  return (
    <>
      <Layout>
        <div className="px-10 py-5 max-md:p-[20px]">
          <div className="flex justify-between">
            <BackButton />
            <div className="flex items-center justify-center w-full">
              <Stepper step={1} />
            </div>
            <div>{/* {Empty div to adjust space} */}</div>
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
            <div className="mt-5">
              <img
                src={ScanFaceAnimation}
                alt="ScanFaceAnimation"
                className="h-[250px] w-full rounded-[10px] max-md:h-[200px]"
              />
            </div>

            <div className="mt-5 max-md:mt-10 overflow-auto max-md:h-[unset]">
              <div className="flex max-md:flex-col ">
                {instructions.map((instruction) => (
                  <div className="flex flex-col pb-4 justify-start items-center">
                    <img src={instruction.image} alt="" className="inline" />
                    <div className="flex flex-col text-center">
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
        <div className="text-left h-[100px] absolute w-full bottom-0 max-md:bottom-5 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4 max-md:h-[unset]">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={() => nextStep()}
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
