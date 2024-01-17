// import React, { useState } from "react";
// import FaceLogin from "../common/loginScreens/faceLogin";
// import Success from "../common/verifyingScreens/Success";
// import IdentityConsent from "../common/identityConsent";
// import UserConsent from "../common/userConsent";
// import Waiting from "../common/verifyingScreens/Waiting";

// const Authentication = () => {
//   enum AuthenticationSteps {
//     None = "NONE",
//     Consent = "CONSENT",
//     DocumentTypeSelection = "DOCUMENT_TYPE_SELECTION",
//     PreFrontDlScan = "PRE_FRONT_DL_SCAN",
//     FrontDlScan = "FRONT_DL_SCAN",
//     PreBacktDlScan = "PRE_BACK_DL_SCAN",
//     BackDlScan = "BACK_DL_SCAN",
//     PrePassportScan = "PRE_PASSPORT_SCAN",
//     PassportScan = "PASSPORT SCAN",
//     Passkey = "PASSKEY",
//     Success = "SUCCESS",
//     Failure = "FAILURE",
//     FaceLogin = "FaceLogin",
//   }


//   const [steps, setSteps] = useState([
//     AuthenticationSteps.Consent,
//     AuthenticationSteps.FaceLogin,
//     AuthenticationSteps.Success
//   ]);

//   const [stepIndex, setStepIndex] = useState(0);

//   const [currentStep, setCurrentStep] = useState<AuthenticationSteps>(
//     steps[stepIndex]
//   );

//   const handleNextStep = () => {
//     setCurrentStep(steps[stepIndex+1])
//     setStepIndex(stepIndex+1);
//   }
//   switch (currentStep) {
//     case AuthenticationSteps.Consent:
//       return <UserConsent nextStep={handleNextStep} />;
//     case AuthenticationSteps.FaceLogin:
//       return <FaceLogin  nextStep={handleNextStep} />;
//     // case AuthenticationSteps.DocumentTypeSelection:
//     //   return <>Document Type Selection</>;
//     // case AuthenticationSteps.PreFrontDlScan:
//     //   return <>Pre-Front Document Scan</>;
//     // case AuthenticationSteps.FrontDlScan:
//     //   return <>Front DL Scan</>;
//     // case AuthenticationSteps.PreBacktDlScan:
//     //   return <>Pre-Back DL Scan</>;
//     // case AuthenticationSteps.BackDlScan:
//     //   return <>Back DL Scan</>;
//     // case AuthenticationSteps.PrePassportScan:
//     //   return <>Pre-Passport Scan</>;
//     // case AuthenticationSteps.PassportScan:
//     //   return <>Passport Scan</>;
//     // case AuthenticationSteps.Passkey:
//     //   return <>Passkey</>;
//     case AuthenticationSteps.Success:
//       return <Waiting />;
//     case AuthenticationSteps.Failure:
//       return <>Failure</>;
//     case AuthenticationSteps.None:
//       return <>None</>;

//     default:
//       return <></>;
//   }
//   return <></>;
// };

// export default Authentication;

const wew =() => {
  return <></>
}
export default wew;