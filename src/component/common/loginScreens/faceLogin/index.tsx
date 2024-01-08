import lock from "../../../../assets/lock.svg";
import useCameraPermissions from "../../../../hooks/useCameraPermissions";
import { useNavigateWithQueryParams } from "../../../../utils/navigateWithQueryParams";
import { useContext } from "react";
import { UserContext } from "../../../../context/userContext";
import useFaceLoginWithLivenessCheck from "../../../../hooks/useFaceLoginWithLiveness";
import { getUser } from "../../../../services/api";
import {
  ACCOUNT_NOT_APPROVED,
  AUTHENTICATION_FAILED,
  ERROR,
  SUCCESS,
} from "../../../../constant";
import { getStatusFromUser } from "../../../../utils";
import Layout from "../../layout";
import BackButton from "../../components/backButton";
import CameraComponent from "../../components/camera";

type Props = {
  heading?: string;
  nextStep: ()=>void;
};

function FaceLogin({nextStep}: Props) {
  const context = useContext(UserContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const { isCameraGranted } = useCameraPermissions(() => {});
  const onStatus = (e: number) => {};
  const { faceLoginWithLiveness, faceLoginWithLivenessMessage, faceLoginData } =
    useFaceLoginWithLivenessCheck(() => {}, onStatus, 50, true);
  console.log({
    faceLoginWithLivenessMessage,
    faceLoginData,
  });

  const onSuccess = () => {
    context.setUser({
      ...context.user,
      uuid: faceLoginData?.puid,
      guid: faceLoginData?.guid,
    });
   // handelLoginResponse(faceLoginData);
   nextStep();
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
        nextStep();
        // navigateWithQueryParams("/failed");
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
          switch (context.loginOption) {
            case "passkey":
              return navigateWithQueryParams("/login-passkey");
            case "loginDl":
              return navigateWithQueryParams("/login-dl");
            case "loginVc":
              return navigateWithQueryParams("/login-vc");
            default:
              localStorage.setItem("user", JSON.stringify(user || {}));
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

  const onCameraReady = () => {
    faceLoginWithLiveness();
  };

  return (
    <>
      <Layout removeHeight={!isCameraGranted}>
        <div className="pt-10 max-md:p-[10px] max-md:pt-10">
          <div className="flex justify-between relative px-5 max-md:p-0">
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
              progress={
                faceLoginWithLivenessMessage === "Valid Image" ? 100 : 0
              }
              message={faceLoginWithLivenessMessage}
              onSuccess={onSuccess}
              attempt={faceLoginWithLivenessMessage ? 1 : 0}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default FaceLogin;
