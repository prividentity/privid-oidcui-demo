import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import HomeIcon from "../../../assets/home-icon.svg";
import Layout from "../../layout";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { States } from "../../../constant";
import BackButton from "../../../common/components/backButton";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import {
  updateUserDetails,
  pkiEncryptData,
} from "@privateid/ping-oidc-web-sdk-alpha";
import { issueCredentials } from "../../../services/vc-dock";
import { getFirstRequirement } from "../../../utils";
import CloseButton from "common/components/closeButton";
import { OidcContext } from "context/oidcContext";

type Props = {};

function Address(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const context: any = useContext(UserContext);
  const oidcContext = useContext(OidcContext);
  const [addressData, setAddressData] = useState<any>({});
  const [state, setState] = useState<any>();
  useEffect(() => {
    if (context?.user?.backDocumentData?.address) {
      const credentials = context?.user?.backDocumentData?.address;
      const credentialsAddress: any = {
        addressLine1: credentials?.addressLine1,
        addressLine2: "",
        zipCode: credentials?.zipCode,
        city: credentials?.city,
        state: credentials?.state,
      };
      setAddressData(credentialsAddress);
      setState(credentials?.state);
    }
  }, [context?.user?.backDocumentData?.address]);
  const disabled =
    !addressData?.addressLine1 ||
    !addressData?.city ||
    !addressData?.zipCode ||
    !state;
  const onChange = (e: { target: { name: string; value: string } }) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setAddressData({
      ...addressData,
      [name]: value,
    });
  };

  const onSubmit = async (e?: any) => {
    e.preventDefault();

    const encryptedAddressPayload = await pkiEncryptData({
      manual: {
        address: {
          addressLine1: addressData?.addressLine1,
          addressLine2: addressData?.addressLine2,
          city: addressData?.city,
          state,
          zipCode: addressData?.zipCode,
          country: "USA",
        },
      },
    });
    const addressResult = await updateUserDetails({
        baseUrl: process.env.REACT_APP_API_URL || "",
        token: oidcContext.transactionToken,
        params: encryptedAddressPayload
  });
    if (addressResult?.success) {
      // await verifyIdWithSession({
      //   sessionToken: context?.tokenParams,
      // });
      // const verifyTokenRes = await verifySessionTokenV2({
      //   sessionToken: context?.tokenParams,
      // });
      // enum tokenStatus {
      //   PENDING = "PENDING",
      //   SUCCESS = "SUCCESS",
      //   FAILURE = "FAILURE",
      //   REQUIRES_INPUT = "REQUIRES_INPUT",
      // }
      // if (verifyTokenRes.status === tokenStatus.SUCCESS) {
      //   context.setSuccessMessage("Success! Your account is created");
      //   navigateWithQueryParams("/success");
      //   await issueVC(verifyTokenRes.user, true);
      // } else if (verifyTokenRes.status === tokenStatus.PENDING) {
      //   navigateWithQueryParams("/failed");
      // } else if (verifyTokenRes.status === tokenStatus.FAILURE) {
      //   navigateWithQueryParams("/failed");
      // } else if (verifyTokenRes.status === tokenStatus.REQUIRES_INPUT) {
      //   getRequirements(verifyTokenRes?.dueRequirements);
      // }
    }
  };

  const getRequirements = async (requirement: any) => {
    const requirementStep = await getFirstRequirement(requirement, context);
    switch (requirementStep) {
      case "requestSSN9":
        return navigateWithQueryParams("/ssn");
      case "requireResAddress":
        return navigateWithQueryParams("/address");
      case "requestScanID":
        return navigateWithQueryParams("/drivers-licence-intro");
      default:
        break;
    }
  };
  const issueVC = async (userId: string, fullInformation: boolean) => {
    try {
      await issueCredentials(userId, fullInformation);
    } catch (e) {
      console.log({ e }, "error issueVC");
    }
  };
  return (
    <>
      <Layout>
        <form onSubmit={onSubmit} style={{ height: "100%" }}>
          <div className="relative flex text-center justify-center h-full">
            <div className="relative w-full">
              <div className="px-10 py-8 max-md:p-[20px]">
                <div className="flex justify-between relative">
                  <BackButton />
                  <div className="w-full">
                    <img
                      src={HomeIcon}
                      alt=""
                      className="w-[42px] h-[42px] m-auto"
                    />
                  </div>
                  <div>{/* {Empty div to adjust space} */}</div>
                  <CloseButton />
                </div>
                <div className="mt-2">
                  <Label className="text-[28px] font-[500] text-primaryText">
                    Address{" "}
                  </Label>
                </div>
                <div className="text-center overflow-auto h-[380px] mt-2 p-1 max-md:h-[unset]">
                  <Input
                    tabIndex={1}
                    placeholder="Home address (Street address 1) *"
                    className="h-[48px] mt-[12px] font-[400] rounded-[8px] border-borderSecondary placeholder:text-placeholder placeholder:font-normal text-[14px]"
                    name="addressLine1"
                    onChange={onChange}
                    value={addressData?.addressLine1}
                  />
                  <Input
                    tabIndex={2}
                    placeholder="Home address (Street address 2)"
                    className="h-[48px] mt-[12px] font-[400] rounded-[8px] border-borderSecondary placeholder:text-placeholder placeholder:font-normal text-[14px]"
                    name="addressLine2"
                    onChange={onChange}
                    value={addressData?.addressLine2}
                  />
                  <Input
                    tabIndex={3}
                    placeholder="Your city *"
                    className="h-[48px] mt-[12px] font-[400] rounded-[8px] border-borderSecondary placeholder:text-placeholder placeholder:font-normal text-[14px]"
                    name="city"
                    onChange={onChange}
                    value={addressData?.city}
                  />
                  <Select
                    onValueChange={(e: string) => setState(e)}
                    value={state}
                  >
                    <SelectTrigger
                      tabIndex={4}
                      className="h-[48px] mt-[12px] font-[400] rounded-[8px] border-borderSecondary {
                    ] text-[16px] focus:outline-none  focus:ring-transparent"
                      style={{ color: state ? "#020817" : "#9ba3b1" }}
                    >
                      <SelectValue placeholder="State or province" />
                    </SelectTrigger>
                    <SelectContent>
                      {States.map(
                        (item: { label: string; abbreviation: string }) => {
                          return (
                            <SelectItem
                              value={item?.abbreviation}
                              key={item?.abbreviation}
                            >
                              {item?.label}
                            </SelectItem>
                          );
                        }
                      )}
                    </SelectContent>
                  </Select>
                  <Input
                    tabIndex={5}
                    placeholder="ZIP code *"
                    className="h-[48px] mt-[12px] font-[400] rounded-[8px] border-borderSecondary text-[14px]"
                    name="zipCode"
                    onChange={onChange}
                    value={addressData?.zipCode}
                  />
                </div>
              </div>
              <div className="text-left h-[100px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-8 pb-0 max-md:relative max-md:pt-0">
                <div>
                  <Button
                    className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
                    onClick={(e) => onSubmit(e)}
                    disabled={disabled}
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Layout>
    </>
  );
}

export default Address;
