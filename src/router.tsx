import { createBrowserRouter } from "react-router-dom";

import Login from "common/authentication/login";
import FaceScan from "common/faceScan";
import PersonalInfo from "common/personalInfo";
import UserConsent from "common/userConsent";
import RedirectedMobile from "common/redirectScreens/RedirectedMobile";
import SwitchDevice from "common/redirectScreens/SwitchDevice";
import DocumentSelection from "common/documentSelection";
import DriversLicense from "common/documentSelection/driversLicenceIntro";
import VCProof from "common/vCProof";
import FaceScanningIntro from "common/faceScanningIntro";
import DriversLicenseIntro from "common/documentSelection/driversLicenceIntro";
import FrontDlScan from "common/documentSelection/frontDlScan";
import BackDlScan from "common/documentSelection/backDlScan";
import Success from "common/verifyingScreens/Success";
import CreatePasskey from "common/createPasskey";
import SSN from "common/additionalScreens/SSN";
import PassportIntro from "common/documentSelection/passportIntro";
import PassportScan from "common/documentSelection/passportScan";
import Waiting from "common/verifyingScreens/Waiting";
import FailureScreen from "common/verifyingScreens/failureScreens";
import NotApproved from "common/verifyingScreens/failureScreens/NotApproved";
import Address from "common/additionalScreens/address";
import FaceLogin from "common/loginScreens/faceLogin";
import LoginOptions from "common/loginScreens/loginOptions";
import LoginDl from "common/loginScreens/loginDl";
import LoginVC from "common/loginScreens/loginVc";
import LoginPasskey from "common/loginScreens/loginPasskey";
import IdentityConsent from "common/identityConsent";
import HhsConsent from "common/hhsConsent";
import VerifyPin from "common/verifyPin";
import Homepage from "pages/Homepage";
import ConfirmUser from "common/loginScreens/confirmUser";
import { AuthProvider, TAuthConfig } from "react-oauth2-code-pkce";
import LoginCallback from "pages/Callback";
import MobileSwitchGetStatus from "common/verifyingScreens/MobileSwitch";

let authConfigRegister: TAuthConfig = {
  clientId: process.env.REACT_APP_CLIENT_ID || "",
  authorizationEndpoint: process.env.REACT_APP_OIDC_AUTH_URL || "",
  tokenEndpoint: process.env.REACT_APP_OIDC_TOKEN_URL || "",
  redirectUri: "https://oidc-ui.devel.privateid.com/callback",
  scope: "openid privateid",
  storageKeyPrefix: "action",
  extraAuthParameters: {
    code_challenge_method: "S256",
    productGroupId: process.env.REACT_APP_PRODUCT_GROUP_ID || "",
    actionFlow: "register",
    prompt: "login",
  },
};

let authConfigLogin: TAuthConfig = {
  clientId: process.env.REACT_APP_CLIENT_ID || "",
  authorizationEndpoint: process.env.REACT_APP_OIDC_AUTH_URL || "",
  tokenEndpoint: process.env.REACT_APP_OIDC_TOKEN_URL || "",
  redirectUri: "https://oidc-ui.devel.privateid.com/callback",
  scope: "openid privateid",
  storageKeyPrefix: "action",
  extraAuthParameters: {
    code_challenge_method: "S256",
    productGroupId: process.env.REACT_APP_PRODUCT_GROUP_ID || "",
    actionFlow: "login",
    prompt: "login",
  },
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login isLogin={true} />,
  },
  {
    path: "/",
    // element: <BackDlScan />
    element: (
      // <AuthProvider authConfig={authConfigRegister}>
      <Homepage />
      // </AuthProvider>
    ),
    // element: <FaceScan />
  },
  // LOGIN SCREEN
  {
    path: "/face-login",
    element: <FaceLogin />,
  },
  {
    path: "/login-options",
    element: <LoginOptions />,
  },
  {
    path: "/login-dl",
    element: <LoginDl />,
  },
  {
    path: "/login-vc",
    element: <LoginVC />,
  },
  {
    path: "/login-passkey",
    element: <LoginPasskey />,
  },
  // LOGIN SCREEN END
  {
    path: "/user-consent",
    element: <UserConsent />,
  },
  {
    path: "/user-info",
    element: <PersonalInfo />,
  },
  {
    path: "/switch-device",
    element: <SwitchDevice />,
  },
  {
    path: "/redirected-mobile",
    element: <RedirectedMobile />,
  },
  {
    path: "/face-scan-intro",
    element: <FaceScanningIntro />,
  },
  {
    path: "/face-scan",
    element: <FaceScan />,
  },
  {
    path: "/confirm-user",
    element: <ConfirmUser />,
  },
  {
    path: "/doc-selection",
    element: <DocumentSelection />,
  },
  {
    path: "/drivers-licence-intro",
    element: <DriversLicenseIntro />,
  },
  {
    path: "/front-dl-scan",
    element: <FrontDlScan />,
  },
  {
    path: "/drivers-licence-back-intro",
    element: <DriversLicense documentSide="back" />,
  },
  {
    path: "/back-dl-scan",
    element: <BackDlScan />,
  },
  {
    path: "/passport-scan-intro",
    element: <PassportIntro />,
  },
  {
    path: "/passport-scan",
    element: <PassportScan />,
  },
  {
    path: "/generate-passkey",
    element: <CreatePasskey />,
  },
  {
    path: "/vc-proof",
    element: <VCProof />,
  },
  {
    path: "/address",
    element: <Address />,
  },
  {
    path: "/ssn",
    element: <SSN />,
  },
  {
    path: "/waiting",
    element: <Waiting />,
  },
  {
    path: "/identity-consent",
    element: <IdentityConsent />,
  },
  {
    path: "/verify-pin",
    element: <VerifyPin />,
  },
  {
    path: "/hhs-consent",
    element: <HhsConsent />,
  },
  {
    path: "/success",
    element: <Success heading={"Authentication successful!"} />,
  },
  {
    path: "/failed",
    element: (
      <NotApproved heading={"Authentication failed!"} showFooter={false} />
    ),
  },
  {
    path: "/failure",
    element: <FailureScreen buttonLabel="Rescan" heading="passport" />,
  },

  // OIDC Callback
  {
    path:"/callback",
    element: <LoginCallback />
  },
  {
    path:"/mobile-switch",
    element: <MobileSwitchGetStatus />
  }
]);
