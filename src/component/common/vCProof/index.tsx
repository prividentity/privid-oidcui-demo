import { Button } from "../../ui/button";
import { Label } from "../../ui/label";

import Stepper from "../faceScanningIntro/Stepper";
import Layout from "../layout";
import { Checkbox } from "../../ui/checkbox";
import BackButton from "../components/backButton";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import SwitchDeviceSelect from "../components/switchDeviceSelect";

type Props = {};

function VCProof(Props: Props) {
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
                  <Stepper step={4} />
                </div>
                <div>{/* {Empty div to adjust space} */}</div>
              </div>
              <div className="mt-2">
                <Label className="text-[28px] font-[500] text-primaryText">
                  Verified Credentials{" "}
                </Label>
              </div>
              <div className="text-center overflow-auto h-[490px] mt-2 p-1">
                <div className="ps-8 pe-8">
                  <Label className="text-[14px] font-[400] text-secondaryText">
                    Please select the personal details you want to share.
                  </Label>
                </div>
                <div className="relative mt-5 bg-[#EBF3FE] h-[312px] rounded-[16px] text-left p-5">
                  <div className="flex flex-col">
                    <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                      LAST NAME
                    </Label>
                    <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                      Roth
                    </Label>
                  </div>
                  <div className="flex flex-col mt-[16px]">
                    <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                      FIRST NAME
                    </Label>{" "}
                    <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                      William
                    </Label>
                  </div>
                  <div className="flex flex-col mt-[16px]">
                    <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                      JOB TITLE
                    </Label>
                    <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                      PIUser template
                    </Label>
                  </div>
                  <div className="flex flex-col mt-[16px]">
                    <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                      START DATE
                    </Label>
                    <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                      25/09/2023
                    </Label>
                  </div>
                  <div className="flex flex-col mt-[16px]">
                    <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                      TERMINATION DATE{" "}
                    </Label>
                    <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                      -
                    </Label>
                  </div>
                  <div className="absolute bottom-6 right-5">
                    <Checkbox className="bg-[white]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-left h-[100px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={() => {
                navigateWithQueryParams("/ssn");
              }}
            >
              Share personal details
            </Button>
          </div>
        </div>
      </Layout>
      <SwitchDeviceSelect />
    </>
  );
}

export default VCProof;
