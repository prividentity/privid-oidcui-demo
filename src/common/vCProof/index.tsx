import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

import Stepper from "../faceScanningIntro/Stepper";
import Layout from "../layout";
import { Checkbox } from "../../components/ui/checkbox";
import BackButton from "../components/backButton";
import { useNavigateWithQueryParams } from "../../utils/navigateWithQueryParams";
import {
  getCredentialDetails,
  issueCredentials,
  verifyCredentials,
} from "services/vc-dock";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context/userContext";
import { useToast } from "components/ui/use-toast";
import { formateDate } from "utils";
import { Loader2 } from "lucide-react";
import CloseButton from "common/components/closeButton";

type Props = {};

function VCProof(Props: Props) {
  const context = useContext(UserContext);
  const user: any = context?.user;
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [credentials, setCredentials] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();
  const viewCredentials = async () => {
    try {
      setCredentials({});
      setLoader(true);
      const credentialDetails: any = await getCredentialDetails(user._id);
      if (credentialDetails?.id) {
        setCredentials(credentialDetails);
      }
      setLoader(false);
      return;
    } catch (e) {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (user) {
      viewCredentials();
    }
  }, [user]);
  const onSubmitPresentation = async () => {
    try {
      setLoading(true);
      const response: any = await verifyCredentials(user._id);
      if (response.verified) {
        toast({
          variant: "success",
          description: "VC verified successfully.",
        });
        localStorage.setItem("credential", JSON.stringify(credentials));
        navigateWithQueryParams("/");
      } else {
        toast({
          variant: "destructive",
          description: "There was some problem verifying VC. Please try again.",
        });
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      toast({
        variant: "destructive",
        description: "There was some problem verifying VC. Please try again.",
      });
    }
  };

  const NoVcFound = () => {
    const generateCredentials = async () => {
      try {
        const credentials: any = await issueCredentials(user?._id, false);
        setCredentials(credentials);
        const vcData = { did: credentials.did, credentialsId: credentials.id };
        localStorage.setItem("user", JSON.stringify({ ...user, ...vcData }));
      } catch (error) {
        toast({
          variant: "destructive",
          description: "There was some problem verifying VC. Please try again.",
        });
      }
    };
    return (
      <div
        className={"w-full h-full flex items-center justify-center flex-col"}
      >
        <h3 className={""}>No Verifiable Credential available.</h3>
        <Button
          className="w-[200px] text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
          onClick={() => {
            generateCredentials();
          }}
        >
          Generate Now
        </Button>
      </div>
    );
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
                  <Stepper step={5} />
                </div>
                <div>{/* {Empty div to adjust space} */}</div>
                <CloseButton />
              </div>
              <div className="mt-2">
                <Label className="text-[28px] font-[500] text-primaryText">
                  Verifiable Credentials{" "}
                </Label>
              </div>
              <div className="text-center overflow-auto h-[490px] mt-2 p-1">
                <div className="ps-8 pe-8">
                  <Label className="text-[14px] font-[400] text-secondaryText">
                    Please select the personal details you want to share.
                  </Label>
                </div>
                <div className="relative mt-5 bg-[#EBF3FE] h-[370px] rounded-[16px] text-left p-5">
                  {loader ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="animate-spin h-[55px] w-[55px] text-[#5182ec]" />
                    </div>
                  ) : !credentials?.id ? (
                    <NoVcFound />
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                          LAST NAME
                        </Label>
                        <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                          {credentials?.credential?.credentialSubject?.lastname}
                        </Label>
                      </div>
                      <div className="flex flex-col mt-[16px]">
                        <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                          FIRST NAME
                        </Label>{" "}
                        <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                          {
                            credentials?.credential?.credentialSubject
                              ?.firstname
                          }
                        </Label>
                      </div>
                      <div className="flex flex-col mt-[16px]">
                        <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                          JOB TITLE
                        </Label>
                        <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                          {credentials?.credential?.name}
                        </Label>
                      </div>
                      <div className="flex flex-col mt-[16px]">
                        <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                          Address
                        </Label>
                        <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                          {credentials?.credential?.credentialSubject?.address1}
                        </Label>
                      </div>
                      <div className="flex flex-col mt-[16px]">
                        <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                          START DATE
                        </Label>
                        <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                          {formateDate(credentials?.credential?.issuanceDate)}
                        </Label>
                      </div>
                      <div className="flex flex-col mt-[16px]">
                        <Label className="text-secondaryText font-[400] text-[14px] tracking-[0.5px]">
                          TERMINATION DATE{" "}
                        </Label>
                        <Label className="text-primaryText font-[700] text-[14px] tracking-[0.5px]">
                          {formateDate(credentials?.credential?.expiryDate)}
                        </Label>
                      </div>
                    </>
                  )}
                </div>
                {credentials?.id && (
                  <div
                    onClick={() => setChecked(!checked)}
                    className="flex mt-[10px] relative z-[99999] cursor-pointer"
                  >
                    <Checkbox
                      className="bg-[#EBF3FE] mt-[2px] mr-[5px]"
                      onClick={() => setChecked(!checked)}
                      checked={checked}
                    />
                    <p className="text-[14px] text-left">
                      I agree to the Private ID verifiable credentials terms and
                      conditions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-left h-[120px] absolute max-md:relative w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-6 max-md:pt-0 pb-4">
          <div>
            <Button
              className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
              onClick={onSubmitPresentation}
              disabled={!checked || loading}
            >
              Share personal details
            </Button>
            <Label
              className="hover:underline text-primary text-[14px] cursor-pointer mt-[0px] block text-center mb-0 mt-[10px]"
              onClick={() => {
                toast({
                  variant: "destructive",
                  description: "Permission Denied",
                });
                navigateWithQueryParams("/");
              }}
            >
              I do not agree
            </Label>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default VCProof;
