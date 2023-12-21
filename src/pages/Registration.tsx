import React, { useState } from "react";

const Registration = () => {
  enum RegistrationStep {
    None = "NONE",
    Consent = "CONSENT",
    PreEnroll = "PRE_ENROLL",
    Enroll = "ENROLL",
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
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(
    RegistrationStep.None
  );

  switch (currentStep) {
    case RegistrationStep.Consent:
      return <>Consent</>;
    case RegistrationStep.PreEnroll:
      return <>Pre Enroll</>;
    case RegistrationStep.Enroll:
      return <>Enroll</>;
    case RegistrationStep.DocumentTypeSelection:
      return <>Document Type Selection</>;
    case RegistrationStep.PreFrontDlScan:
      return <>Pre-Front Document Scan</>;
    case RegistrationStep.FrontDlScan:
      return <>Front DL Scan</>;
    case RegistrationStep.PreBacktDlScan:
      return <>Pre-Back DL Scan</>;
    case RegistrationStep.BackDlScan:
      return <>Back DL Scan</>;
    case RegistrationStep.PrePassportScan:
      return <>Pre-Passport Scan</>;
    case RegistrationStep.PassportScan:
      return <>Passport Scan</>;
    case RegistrationStep.Passkey:
      return <>Passkey</>;
    case RegistrationStep.Success:
      return <>Success</>;
    case RegistrationStep.Failure:
      return <>Failure</>;
    case RegistrationStep.None:
      return <>None</>;

    default:
      return <></>;
  }
};

export default Registration;
