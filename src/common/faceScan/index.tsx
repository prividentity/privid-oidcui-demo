import { useContext, useState } from "react";
import lock from "assets/lock.svg";
import useCameraPermissions from "hooks/useCameraPermissions";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";
import useEnrollOneFaWithLiveness from "hooks/useEnrollOneFaWithLiveness";
import { UserContext } from "context/userContext";
import {
  closeCamera,
  convertCroppedImage,
  updateTypeEnum,
  updateUserWithSession,
  uploadEnrollImageWithSession,
} from "@privateid/cryptonets-web-sdk";
import Layout from "common/layout";
import BackButton from "common/components/backButton";
import CameraComponent from "common/components/camera";
import { ELEMENT_ID } from "constant";
import SwitchDeviceSelect from "common/components/switchDeviceSelect";

import { OidcContext } from "context/oidcContext";
import { getTransactionResult } from "@privateid/ping-oidc-web-sdk-alpha";

type Props = {
  heading?: string;
};

function FaceScan(Props: Props) {
  const context = useContext(UserContext);
  const oidcContext = useContext(OidcContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const { isCameraGranted } = useCameraPermissions(() => {});
  const [scanCompleted, setScanCompleted] = useState(false);
  const onSuccess = () => {
    setTimeout(async () => {
      await closeCamera(ELEMENT_ID);
      // navigateWithQueryParams("/doc-selection");
      const baseurl = process.env.REACT_APP_API_URL || "https://api.orchestration.private.id/oidc";
      console.log("OIDC context", oidcContext);
      console.log("URL", baseurl);
      const result = await getTransactionResult({token:oidcContext.transactionToken, baseUrl:  baseurl});
      console.log("Test:", result);

      if(result.url){
        window.location.href = result.url;
      }
      
    }, 2000);
  };
  const {
    enrollUserOneFa,
    progress,
    enrollStatus,
    enrollPortrait,
    enrollData,
  } = useEnrollOneFaWithLiveness(setScanCompleted);
  // console.log({ progress, enrollStatus, enrollPortrait, enrollData });
  // useEffect(() => {
  //   if (enrollPortrait && enrollData) {
  //     onFaceSuccess();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [enrollPortrait, enrollData]);
  // something
  const onFaceSuccess = async () => {
    console.log("onFaceSuccess");
    setScanCompleted(true);
    context.setUser({
      ...context.user,
      uuid: enrollData?.puid,
      guid: enrollData?.guid,
      enrollImageData: enrollPortrait,
    });
    await updateUserWithSession({
      sessionToken: context?.tokenParams,
      updateType: updateTypeEnum.enroll,
      uuid: enrollData?.puid,
      guid: enrollData?.guid,
    });

    if (enrollPortrait) {
      const enrollPortraitBase64 = await convertCroppedImage(
        enrollPortrait.data,
        enrollPortrait.width,
        enrollPortrait.height
      );
      await uploadEnrollImageWithSession({
        sessionToken: context?.tokenParams,
        imageString: enrollPortraitBase64,
      });
      localStorage.setItem("uuid", JSON.stringify(enrollData?.puid || {}));
    }
  };

  const onCameraReady = () => {
    enrollUserOneFa();
  };

  return (
    <>
      <Layout removeHeight={!isCameraGranted}>
        <div className="px-10 py-8 max-md:p-[20px] max-md:pt-[20px]">
          <div className="flex justify-between relative">
            <BackButton isCamera />
            <div className="bg-backgroundLightGray py-[5px] px-[15px] text-[12px] rounded-[20px] flex items-center m-auto">
              <img src={lock} alt="lock" className="mr-[5px]" />
              Images never leave this device
            </div>
          </div>
          <div className="mt-[50px] rounded-[20px] flex flex-col items-center justify-center">
            <CameraComponent
              faceCamera={true}
              onCameraReady={onCameraReady}
              progress={progress}
              message={enrollStatus}
              onSuccess={onSuccess}
              attempt={enrollStatus ? 1 : 0}
              scanCompleted={scanCompleted}
            />
          </div>
        </div>
      </Layout>
      <SwitchDeviceSelect />
    </>
  );
}

export default FaceScan;
