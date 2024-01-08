import React, { useState } from "react";
import FaceScan from "../component/common/faceScan";
import DocumentSelection from "../component/common/documentSelection";
import FaceScanningIntro from "../component/common/faceScanningIntro";
import DriversLicenseIntro, { documentSideEnum } from "../component/common/documentSelection/driversLicenceIntro";
import FrontDlScan from "../component/common/documentSelection/frontDlScan";
import BackDlScan from "../component/common/documentSelection/backDlScan";
import CreatePasskey from "../component/common/createPasskey";
import Success from "../component/common/verifyingScreens/Success";
import FailureScreen from "../component/common/verifyingScreens/failureScreens";
import UserConsent from "../component/common/userConsent";

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

  const [steps, setSteps] = useState([
    RegistrationStep.Consent,
    RegistrationStep.PreEnroll,
    RegistrationStep.Enroll,
    RegistrationStep.PreFrontDlScan,
    RegistrationStep.FrontDlScan,
    RegistrationStep.PreBacktDlScan,
    RegistrationStep.BackDlScan,
    RegistrationStep.Success
  ]);

  const [stepIndex, setStepIndex] = useState(0);

  const [currentStep, setCurrentStep] = useState<RegistrationStep>(
    steps[stepIndex]
  );

  const handleNextStep = () => {
    setCurrentStep(steps[stepIndex+1])
    setStepIndex(stepIndex+1);
  }

  switch (currentStep) {
    case RegistrationStep.Consent:
      return <UserConsent nextStep={handleNextStep} />;
    case RegistrationStep.PreEnroll:
      return <FaceScanningIntro nextStep={handleNextStep} />;
    case RegistrationStep.Enroll:
      return <FaceScan nextStep={handleNextStep}/>;
    case RegistrationStep.DocumentTypeSelection:
      return <DocumentSelection nextStep={handleNextStep}/>;
    case RegistrationStep.PreFrontDlScan:
      return <DriversLicenseIntro documentSide={documentSideEnum.FRONT} nextStep={handleNextStep}/>;
    case RegistrationStep.FrontDlScan:
      return <FrontDlScan nextStep={handleNextStep} />;
    case RegistrationStep.PreBacktDlScan:
      return <DriversLicenseIntro documentSide={documentSideEnum.FRONT} nextStep={handleNextStep}/>;
    case RegistrationStep.BackDlScan:
      return <BackDlScan nextStep={handleNextStep}/>;
    // case RegistrationStep.PrePassportScan:
    //   return <>Pre-Passport Scan</>;
    // case RegistrationStep.PassportScan:
    //   return <>Passport Scan</>;
    case RegistrationStep.Passkey:
      return <CreatePasskey />;
    case RegistrationStep.Success:
      return <Success />;
    case RegistrationStep.Failure:
      return <FailureScreen />;
    case RegistrationStep.None:
      return <></>;

    default:
      return <></>;
  }
};

export default Registration;
