import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import ScanIDFrontAnimation from "../../../Animations/3-Passport/Capture Passport.gif";
import Visible from "../../../assets/ScanID/passportVisibleCorner.svg";
import NotCut from "../../../assets/ScanID/passportNotCut.svg";
import Uncluttered from "../../../assets/ScanID/passportUnClutteredBG.svg";
import Reflective from "../../../assets/ScanID/passportReflective.svg";
import Stepper from "../../faceScanningIntro/Stepper";
import Layout from "../../layout";
import BackButton from "../../../common/components/backButton";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import SwitchDeviceSelect from "common/components/switchDeviceSelect";
import CloseButton from "common/components/closeButton";

type Props = {};

function PassportIntro(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  return (
    <>
      <Layout>
        <div className="relative flex text-center justify-center">
          <div className="relative w-full">
            <div className="px-10 py-8 max-md:p-[20px]">
              <div className="flex justify-between relative">
                <BackButton />
                <div className="flex items-center justify-center w-full">
                  <Stepper step={2} />
                </div>
                <div>{/* {Empty div to adjust space} */}</div>
                <CloseButton />
              </div>
              <div className="mt-2">
                <Label className="text-[28px] font-[500] text-primaryText">
                  Capture passport
                </Label>
              </div>
              <div className="text-center overflow-auto h-[490px] mt-2 p-1 max-md:h-[unset]">
                <div className="ps-8 pe-8">
                  <Label className="text-[14px] font-[400] text-secondaryText">
                    Position your personal details page to fit the frame{" "}
                  </Label>
                </div>
                <div className="mt-5">
                  <img
                    src={ScanIDFrontAnimation}
                    alt="ScanIDAnimation"
                    className="h-[240px] w-full rounded-[12px] max-md:h-[200px]"
                  />
                </div>
                <div className="mt-5 flex justify-between max-md:flex-wrap">
                  <div className="max-w-[85px] max-md:max-w-[50%] max-md:w-[100%] max-md:mb-[20px]">
                    <div className="flex justify-center mb-[5px] block">
                      <img src={Visible} alt="" />
                    </div>
                    <div>
                      <Label className="font-[400] text-[14px] text-primaryText">
                      Visible barcode or MRZ
                      </Label>
                    </div>
                  </div>
                  <div className="max-w-[85px] max-md:max-w-[50%] max-md:w-[100%] max-md:mb-[20px]">
                    {" "}
                    <div className="flex justify-center mb-[5px] block">
                      {" "}
                      <img src={NotCut} alt="" />
                    </div>
                    <div>
                      {" "}
                      <Label className="font-[400] text-[14px] text-primaryText">
                      Not cut
                      </Label>
                    </div>
                  </div>
                  <div className="max-w-[85px] max-md:max-w-[50%] max-md:w-[100%] max-md:mb-[20px]">
                    {" "}
                    <div className="flex justify-center mb-[5px] block mt-[-4px]">
                      {" "}
                      <img src={Uncluttered} alt="" />
                    </div>
                    <div>
                      <Label className="font-[400] text-[14px] text-primaryText">
                      Uncluttered background
                      </Label>
                    </div>
                  </div>
                  <div className="max-w-[85px] max-md:max-w-[50%] max-md:w-[100%] max-md:mb-[20px]">
                    {" "}
                    <div className="flex justify-center mb-[5px] block">
                      {" "}
                      <img src={Reflective} alt="" />
                    </div>
                    <div>
                      <Label className="font-[400] text-[14px] text-primaryText">
                      Not reflective
                      </Label>
                    </div>
                  </div>
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
                navigateWithQueryParams("/passport-scan");
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

export default PassportIntro;
