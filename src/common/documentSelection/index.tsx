import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import DriversLicense from "../../assets/driver-licence.svg";
import PassportIcon from "../../assets/passport-icon.svg";
import EditIcon from "../../assets/edit.svg";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import Layout from "../layout";
import BackButton from "../components/backButton";
import { useNavigateWithQueryParams } from "../../utils/navigateWithQueryParams";
import axios from "axios";
import { IPAPI_API } from "constant";
import CloseButton from "common/components/closeButton";
import { ComboboxDemo } from "common/components/countrySelect";

type Props = {
  heading?: string;
};

const options = [
  {
    label: "Driver’s license or National/State ID",
    value: "us-identification",
    img: DriversLicense,
  },
  {
    label: "Passport",
    value: "passport",
    img: PassportIcon,
  },
  {
    label: "Health Insurance Card",
    value: "health-insurance-card",
    img: DriversLicense,
  },
  {
    label: "I’ll fill out personal information myself",
    value: "self",
    img: EditIcon,
  },
];

function DocumentSelection(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [flow, setFlow] = useState<any>("drivers-licence");
  const [country, setCountry] = useState("");
  useEffect(() => {
    getGeoInfo();
  }, []);
  const getGeoInfo = () => {
    axios
      .get(IPAPI_API)
      .then((response) => {
        let data = response.data;
        setCountry(data?.country_name?.toLocaleLowerCase());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Layout>
        <div className="relative flex text-center justify-center">
          <div className="relative w-full">
            <RadioGroup defaultValue="drivers-licence">
              <div className="px-10 py-8 max-md:p-[20px]">
                <div className="flex justify-between relative">
                  <BackButton />
                  <CloseButton />
                </div>
                <div className="mt-2">
                  <Label className="text-[28px] font-[500] text-primaryText max-md:text-[24px]">
                    Verify your identity{" "}
                  </Label>
                </div>
                <div className="text-center overflow-auto h-[490px] mt-2 p-1">
                  <div className="ps-8 pe-8">
                    <Label className="text-[14px] font-[400] text-secondaryText">
                      Please choose the country that issued your ID or Passport{" "}
                    </Label>
                  </div>
                  <div className="mt-5">
                    <ComboboxDemo setCountry={setCountry} country={country} />
                    {options.map((item, index) => (
                      <div
                        onClick={() => setFlow(item.value)}
                        className={`flex justify-between items-center border ${
                          flow === item.value
                            ? "border-primary border-[1.5px]"
                            : "border-borderSecondary"
                        } p-3 rounded-[8px] mt-3 ${
                          flow === item.value ? "bg-primaryLight" : ""
                        }`}
                        key={index}
                      >
                        <div className="flex">
                          <div>
                            <img src={item.img} alt="" className="me-2" />
                          </div>
                          <div>
                            <Label
                              htmlFor={item.value}
                              className="text-[14px] font-[400] text-primaryText"
                            >
                              {item.label}
                            </Label>
                          </div>
                        </div>
                        <RadioGroupItem
                          id={item.value}
                          value={item.value}
                          checked={flow === item.value}
                          // defaultChecked={flow === "drivers-licence"}
                          onClick={() => setFlow(item.value)}
                        ></RadioGroupItem>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="text-left h-[100px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 pb-4 max-md:h-[unset]">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={() => {
                switch (flow) {
                  case "us-identification":
                  case "health-insurance-card":
                    return navigateWithQueryParams("/drivers-licence-intro");
                  case "passport":
                    return navigateWithQueryParams("/passport-scan-intro");
                  case "self":
                    return navigateWithQueryParams("/address");

                  default:
                    break;
                }
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default DocumentSelection;
