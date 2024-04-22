import lock from "assets/lock.svg";
import useCameraPermissions from "hooks/useCameraPermissions";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "context/userContext";
import useFaceLoginWithLivenessCheck from "hooks/useFaceLoginWithLiveness";
import { getUser } from "services/api";
import {
  ACCOUNT_NOT_APPROVED,
  AUTHENTICATION_FAILED,
  ERROR,
  SUCCESS,
} from "constant";
import { getStatusFromUser } from "utils";
import Layout from "common/layout";
import BackButton from "common/components/backButton";
import CameraComponent from "common/components/camera";
import {
  completeCibaAuth,
  createCibaAuthRequest,
  getCibaTokenDetails,
  getSessionDetails,
  getTransactionResult,
  verifyUserOidc,
} from "@privateid/ping-oidc-web-sdk-alpha";
import { OidcContext } from "context/oidcContext";

type Props = {
  heading?: string;
};

function FaceLogin(Props: Props) {
  const context = useContext(UserContext);
  const oidcContext = useContext(OidcContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const { isCameraGranted } = useCameraPermissions(() => {});
  const [completed, setCompleted] = useState(false);
  const onStatus = (e: number) => {};
  const {
    faceLoginWithLiveness,
    faceLoginWithLivenessMessage,
    faceLoginData,
    faceLoginResponseStatus,
  } = useFaceLoginWithLivenessCheck(setCompleted, onStatus, 50, false);

  const onSuccess = async () => {
    // context.setUser({
    //   ...context.user,
    //   uuid: faceLoginData?.puid,
    //   guid: faceLoginData?.guid,
    // });

    // const baseurl = process.env.REACT_APP_API_URL || "https://api.orchestration.private.id/oidc";
    //   console.log("OIDC context", oidcContext);
    //   console.log("URL", baseurl);
    //   const result = await getTransactionResult({token:oidcContext.transactionToken, baseUrl:  baseurl});
    //   console.log("Test:", result);

    //   if(result.url){
    //     window.location.href = result.url;
    //   }

    const enrollTokenDetails = await getSessionDetails({
      baseUrl: process.env.REACT_APP_API_URL || "",
      token: oidcContext.transactionToken,
    });

    console.log("after enroll", enrollTokenDetails);

    const createCibaAuth = await createCibaAuthRequest({
      oidcUrl: process.env.REACT_APP_OIDC_URL || "", //"https://oidc.devel.privateid.com",
      login_hint: enrollTokenDetails.userPuid,
      client_id: oidcContext.clientId,
      actionFlow: "login",
    });

    console.log("cibaAuth", createCibaAuth);
    // const verifyResult = await verifyUserOidc({
    //   token: oidcContext.transactionToken,
    //   baseUrl: process.env.REACT_APP_API_URL || "",
    // });

    // console.log("verify result", verifyResult);

    const completeAuth = await completeCibaAuth({
      oidcUrl: process.env.REACT_APP_OIDC_URL || "", //"https://oidc.devel.privateid.com",
      auth_req_id: createCibaAuth.auth_req_id,
      orchestration_session_token: oidcContext.transactionToken,
    });

    console.log("complete auth:", completeAuth);

    if (completeAuth.status === "success") {
      const lastAuth = await getCibaTokenDetails({
        oidcUrl:process.env.REACT_APP_OIDC_URL || "",// "https://oidc.devel.privateid.com",
        auth_req_id: createCibaAuth.auth_req_id,
        client_id: oidcContext.clientId,
      });

      console.log("ciba token detail: ", lastAuth);

      oidcContext.setCibaIdToken(lastAuth.id_token);
      oidcContext.setCibaAccessToken(lastAuth.access_token);
      navigateWithQueryParams("/success");
    } else {
      navigateWithQueryParams("/failure");
    }

    // handelLoginResponse(faceLoginData);
  };

  const handelLoginResponse = async (result: any) => {
    if (result?.status === 0) {
      localStorage.setItem("uuid", JSON.stringify(result?.puid || {}));
      const payload = {
        guid: result?.guid,
        uuid: result?.puid,
        checkVC: false,
      };
      const data: any = await getUser(payload);
      if (data?.data?.level === ERROR || data?.data?.statusCode === 404) {
        context.setFailedMessage(AUTHENTICATION_FAILED);
        navigateWithQueryParams("/failed");
        context.setUser({
          ...context.user,
          data,
        });
        localStorage.setItem("user", JSON.stringify(data.user || {}));
        return;
      }
      const user =
        data?.user || JSON.parse(localStorage.getItem("user") ?? "{}");
      if (user._id) {
        const userStatus = getStatusFromUser(data.status);
        if (userStatus === SUCCESS) {
          context.setUser({
            ...context.user,
            ...user,
          });
          switch (context.loginOption) {
            case "passkey":
              return navigateWithQueryParams("/login-passkey");
            case "loginDl":
              return navigateWithQueryParams("/login-dl");
            case "loginVc":
              return navigateWithQueryParams("/vc-proof");
            case "loginPin":
              // context?.setSuccessMessage("Authentication successful!");
              navigateWithQueryParams("/verify-pin");
              break;
            default:
              localStorage.setItem("user", JSON.stringify(user || {}));
              // context?.setSuccessMessage("Authentication successful!");
              navigateWithQueryParams("/success");
              break;
          }
        } else {
          context.setFailedMessage(ACCOUNT_NOT_APPROVED);
          navigateWithQueryParams("/failure");
        }
      }
    } else {
      context.setFailedMessage(AUTHENTICATION_FAILED);
      navigateWithQueryParams("/failed");
    }
  };

  useEffect(() => {
    if (faceLoginResponseStatus === 0) {
      setCompleted(true);
    }
  }, [faceLoginWithLivenessMessage]);

  const onCameraReady = () => {
    faceLoginWithLiveness();
  };

  return (
    <>
      <Layout removeHeight={!isCameraGranted}>
        <div className="px-10 py-8 max-md:p-[20px] max-md:pt-[20px]">
          <div className="flex justify-between relative max-md:p-0">
            <BackButton />
            <div className="bg-backgroundLightGray py-[5px] px-[15px] text-[12px] rounded-[20px] flex items-center m-auto">
              <img src={lock} alt="lock" className="mr-[5px]" />
              Images never leave this device
            </div>
          </div>
          <div className="mt-[50px] rounded-[20px] flex flex-col items-center justify-center">
            <CameraComponent
              faceLoginCamera={true}
              onCameraReady={onCameraReady}
              progress={faceLoginResponseStatus === 0 ? 100 : 0}
              message={faceLoginWithLivenessMessage}
              onSuccess={onSuccess}
              attempt={typeof faceLoginResponseStatus === "number" ? 1 : 0}
              scanCompleted={completed}
              onCameraSwitch={() => faceLoginWithLiveness()}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default FaceLogin;
