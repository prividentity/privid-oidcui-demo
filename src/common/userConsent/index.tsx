import { useEffect, useRef, useState } from "react";
import consentLogo from "assets/login/consent-logo.svg";
import { Label } from "components/ui/label";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import Layout from "common/layout";
import BackButton from "common/components/backButton";
import CloseButton from "common/components/closeButton";
import useScrollToBottom from "hooks/useScrollBottom";
import { UrlJSON } from "constant/url";

const UserConsent = () => {
  const [disable, setDisable] = useState<boolean>(false);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);
  const consentContainerRef = useRef<HTMLDivElement>(null);
  const isScrolledToBottom = useScrollToBottom(10, scrollElement);

  useEffect(() => {
    if (!consentContainerRef.current) return;
    setScrollElement(consentContainerRef.current);
  }, [consentContainerRef.current]);

  useEffect(() => {
    if (isScrolledToBottom) {
      setDisable(true);
    }
  }, [isScrolledToBottom]);
  return (
    <Layout>
      <div className="px-10 py-8  max-md:p-[20px]">
        <div className="flex justify-between relative">
          <BackButton />
          <div className="w-full h-[48px]">
            <img src={consentLogo} alt="consentLogo" className="m-auto" />
          </div>
          <CloseButton />
        </div>
        <div className="mt-2">
          <Label className="text-[28px] font-[500]">User consent</Label>
        </div>
        <div
          className="text-left overflow-auto h-[340px] mt-4 max-md:h-[calc(100vh_-_23rem)]"
          ref={consentContainerRef}
        >
          <div className="ps-8 pe-8">
            <ul className="list-disc text-black">
              <li className="ps-2 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  You certify that you reside in one of the following states:
                  Alaska, Arkansas, Colorado, Connecticut, Delaware, Florida,
                  Georgia, Idaho, Indiana, Iowa, Kansas, Kentucky, Louisiana,
                  Maryland, Massachusetts, Michigan, Minnesota, Mississippi,
                  Missouri, Montana, Nevada, New York, North Dakota, Ohio,
                  Oklahoma, Pennsylvania, South Carolina, South Dakota,
                  Tennessee, Texas, Utah, Vermont, Washington, Washington DC,
                  West Virginia, Wisconsin, or Wyoming.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  If you choose to capture your selfie using the Private
                  Identity application, your selfie will be processed by a
                  neural network running in your browser that compares your face
                  to your Photo ID in a few milliseconds. This process is fast
                  and accurate, and does not keep or share your selfie.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  The biometric data is only captured and processed on your
                  device, and is deleted within one second. Private Identity
                  never transmits, receives, stores, manages or discloses your
                  biometric data.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  Only encrypted data is sent to the Private Identity servers.
                  Private Identity then confirms with third-party partners
                  whether or not you have reached the identity assurance
                  threshold required to create an account.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  This app is certified compliant with the IEEE 2410-2021
                  Standard for Biometric Privacy. No biometric template is
                  created, processed, stored, transmitted, or received.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  I acknowledge I am over 21 years of age, all information I
                  provided is accurate, and I am prohibited from allowing any
                  other person to access or use my verified Private Identity
                  account.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  I agree to register for an account using my face images and my
                  US state issued driving license or identity card. Private
                  Identity, and our third-party enrollment and identity proofing
                  service providers IDEMIA and CentralAMS, may share, use and
                  maintain the images and information you provide, and the
                  information on file with other third-party service providers
                  to further verify your identity, to protect against or prevent
                  actual or potential fraud or unauthorized use of the Service,
                  and to establish, maintain and authenticate your verified
                  digital identity, for the duration of our business
                  relationship.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  I agree to receive email and SMS messages for the purpose of
                  registering and maintaining an account.
                </Label>
              </li>
              <li className="ps-2 mt-4 text-primary">
                <Label className="text-[14px] font-[400] leading-0 text-secondaryText">
                  I have read and accepted the Private Identity LLC{" "}
                  <a
                    href="https://github.com/openinfer/PrivateIdentity/wiki/Terms-of-Use"
                    target={"_blank"}
                    className="text-primary underline"
                    rel="noreferrer"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://github.com/openinfer/PrivateIdentity/wiki/Privacy-Policy"
                    target={"_blank"}
                    className="text-primary underline"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                  , CentralAMS{" "}
                  <a
                    href="https://www.centralams.com/terms-of-use/"
                    target={"_blank"}
                    className="text-primary underline"
                    rel="noreferrer"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://www.centralams.com/privacy-policy/"
                    target={"_blank"}
                    className="text-primary underline"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                  , and the IDEMIA{" "}
                  <a
                    href="https://na.idemia.com/terms/"
                    target={"_blank"}
                    className="text-primary underline"
                    rel="noreferrer"
                  >
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://na.idemia.com/privacy/"
                    target={"_blank"}
                    className="text-primary underline"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        style={{ boxShadow: "0px -2px 8px 0px rgba(0, 0, 0, 0.08)" }}
        className="text-left h-[140px] absolute w-full bottom-0 rounded-b-[24px] ps-10 pe-10 pt-4 pb-4 max-md:h-[unset] max-md:rounded-0 max-md:p-[20px]"
      >
        <div className="flex">
          <Checkbox
            id="terms1"
            className="mt-[4px] me-2"
            onClick={() => setDisable(!disable)}
            checked={disable}
          />
          <div>
            <Label className="text-[14px] font-[500] text-[#344054]">
              I acknowledge that I have read, understood and agree to Private
              ID’s Terms and Privacy Policy
            </Label>
          </div>
        </div>
        <div>
          <Button
            className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary"
            disabled={!disable}
            onClick={() => navigateWithQueryParams(UrlJSON.Enroll)}
          >
            Continue
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default UserConsent;
