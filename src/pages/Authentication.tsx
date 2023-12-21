import React, { useState } from "react";

const Authentication = () => {
  enum AuthenticationSteps {
    None = "NONE",
    Consent = "CONSENT",
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
    FaceLogin = "FaceLogin",
  }

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState<AuthenticationSteps>(
    AuthenticationSteps.None
  );

  switch (currentStep) {
    case AuthenticationSteps.Consent:
      return <>Consent</>;
    case AuthenticationSteps.FaceLogin:
      return <>Face Login</>;
    case AuthenticationSteps.DocumentTypeSelection:
      return <>Document Type Selection</>;
    case AuthenticationSteps.PreFrontDlScan:
      return <>Pre-Front Document Scan</>;
    case AuthenticationSteps.FrontDlScan:
      return <>Front DL Scan</>;
    case AuthenticationSteps.PreBacktDlScan:
      return <>Pre-Back DL Scan</>;
    case AuthenticationSteps.BackDlScan:
      return <>Back DL Scan</>;
    case AuthenticationSteps.PrePassportScan:
      return <>Pre-Passport Scan</>;
    case AuthenticationSteps.PassportScan:
      return <>Passport Scan</>;
    case AuthenticationSteps.Passkey:
      return <>Passkey</>;
    case AuthenticationSteps.Success:
      return <>Success</>;
    case AuthenticationSteps.Failure:
      return <>Failure</>;
    case AuthenticationSteps.None:
      return <>None</>;

    default:
      return <></>;
  }
  return <></>;
};

export default Authentication;
