import React, { useState } from "react";
import IdentityConsent from "../component/common/identityConsent";
import FaceScan from "../component/common/faceScan";

const EstimateAge = () => {
  enum EstimateAgeStep {
    None = "NONE",
    Consent = "CONSENT",
    PreEnroll = "PRE_ENROLL",
    Enroll = "ENROLL",
    AgeScan = "AGE_SCAN",
    DocumentTypeSelection = "DOCUMENT_TYPE_SELECTION",
    PreFrontDlScan = "PRE_FRONT_DL_SCAN",
    FrontDlScan = "FRONT_DL_SCAN",
    PreBacktDlScan = "PRE_BACK_DL_SCAN",
    BackDlScan = "BACK_DL_SCAN",
    PrePassportScan = "PRE_PASSPORT_SCAN",
    PassportScan = "PASSPORT SCAN",
    Passkey = "PASSKEY",
    Success = "SUCCESS",
    Failure = "FAILURE",
  }

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState<EstimateAgeStep>(
    EstimateAgeStep.None
  );

  switch (currentStep) {
    case EstimateAgeStep.Consent:
      return <IdentityConsent />;
    case EstimateAgeStep.PreEnroll:
      return <>Pre Enroll</>;
    // case EstimateAgeStep.Enroll:
    //   return <FaceScan />;
    case EstimateAgeStep.DocumentTypeSelection:
      return <>Document Type Selection</>;
    case EstimateAgeStep.PreFrontDlScan:
      return <>Pre-Front Document Scan</>;
    case EstimateAgeStep.FrontDlScan:
      return <>Front DL Scan</>;
    case EstimateAgeStep.PreBacktDlScan:
      return <>Pre-Back DL Scan</>;
    case EstimateAgeStep.BackDlScan:
      return <>Back DL Scan</>;
    case EstimateAgeStep.PrePassportScan:
      return <>Pre-Passport Scan</>;
    case EstimateAgeStep.PassportScan:
      return <>Passport Scan</>;
    case EstimateAgeStep.Passkey:
      return <>Passkey</>;
    case EstimateAgeStep.Success:
      return <>Success</>;
    case EstimateAgeStep.Failure:
      return <>Failure</>;
    case EstimateAgeStep.None:
      return <>None</>;

    default:
      return <></>;
  }
};

export default EstimateAge;
