import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import ScanIDFrontAnimation from "../../../Animations/2-ID Card/GIFs/Scan ID-Front.gif";
import ScanIDBackAnimation from "../../../Animations/2-ID Card/GIFs/Scan ID-Back.gif";
import Visible from "../../../assets/ScanID/visibleCorner.svg";
import NotCut from "../../../assets/ScanID/NotCut.svg";
import Uncluttered from "../../../assets/ScanID/unClutteredBG.svg";
import Reflective from "../../../assets/ScanID/reflective.svg";
import Stepper from "../../faceScanningIntro/Stepper";
import Layout from "../../layout";
import BackButton from "../../components/backButton";
import { useNavigateWithQueryParams } from "../../../../utils/navigateWithQueryParams";
import SwitchDeviceSelect from "../../components/switchDeviceSelect";

type Props = {
  documentSide?: string;
};

const instructions = [
  {
    text: "Visible 4 corners",
    img: Visible,
  },
  {
    text: "Not cut",
    img: NotCut,
  },
  {
    text: "Uncluttered background",
    img: Uncluttered,
  },
  {
    text: "Not reflective",
    img: Reflective,
  },
];

function DriversLicenseIntro(Props: Props) {
  const { documentSide } = Props;
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  return (
    <>
      <Layout>
        <div className="relative flex text-center justify-center">
          <div className="relative w-full">
            <div className="p-10 max-md:p-[20px]">
              <div className="flex justify-between">
                <BackButton />
                <div className="flex items-center justify-center w-full">
                  <Stepper step={2} />
                </div>
                <div>{/* {Empty div to adjust space} */}</div>
              </div>
              <div className="mt-2">
                <Label className="text-[28px] font-[500] text-primaryText">
                  Scan {Props.documentSide || "front"} of ID card{" "}
                </Label>
              </div>
              <div className="text-center overflow-auto h-[490px] mt-2 p-1 max-md:h-[unset]">
                <div className="ps-8 pe-8">
                  <Label className="text-[14px] font-[400] text-secondaryText">
                    Scan the {Props.documentSide || "front"} of your ID card in
                    a well-lit area{" "}
                  </Label>
                </div>
                <div className="mt-5">
                  <img
                    src={
                      Props.documentSide === "back"
                        ? ScanIDBackAnimation
                        : ScanIDFrontAnimation
                    }
                    alt="ScanIDAnimation"
                    className="h-[250px] w-full rounded-[12px] max-md:h-[200px]"
                  />
                </div>
                <div className="mt-5 flex justify-between max-md:flex-wrap">
                  {instructions.map((item, index) => (
                    <div
                      className="max-w-[85px] max-md:max-w-[50%] max-md:w-[100%] max-md:mb-[20px]"
                      key={index}
                    >
                      <div className="flex justify-center mb-[5px] block">
                        <img src={item.img} alt="" />
                      </div>
                      <div>
                        <Label className="font-[400] text-[14px] text-primaryText leading-3">
                          {item.text}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-left h-[100px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10  pt-6 pb-4">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={() => {
                if (documentSide === "back") {
                  navigateWithQueryParams("/back-dl-scan");
                } else {
                  navigateWithQueryParams("/front-dl-scan");
                }
              }}
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

export default DriversLicenseIntro;
