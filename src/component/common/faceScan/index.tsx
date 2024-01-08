import { useContext, useEffect } from "react";
import lock from "../../../assets/lock.svg";
import useCameraPermissions from "../../../hooks/useCameraPermissions";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import useEnrollOneFaWithLiveness from "../../../hooks/useEnrollOneFaWithLiveness";
import { UserContext } from "../../../context/userContext";
import {
  closeCamera,
  convertCroppedImage,
  updateTypeEnum,
  updateUserWithSession,
  uploadEnrollImageWithSession,
} from "@privateid/cryptonets-web-sdk";
import Layout from "../layout";
import BackButton from "../components/backButton";
import CameraComponent from "../components/camera";
import { ELEMENT_ID } from "../../../constant";
import SwitchDeviceSelect from "../components/switchDeviceSelect";

type Props = {
  heading?: string;
  nextStep: ()=>void;
};

function FaceScan({heading, nextStep}: Props) {
  const context = useContext(UserContext);
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const { isCameraGranted } = useCameraPermissions(() => {});
  const onSuccess = () => {};
  const {
    enrollUserOneFa,
    progress,
    enrollStatus,
    enrollPortrait,
    enrollData,
  } = useEnrollOneFaWithLiveness(() => {});
  console.log({ progress, enrollStatus, enrollPortrait, enrollData });
  useEffect(() => {
    if (enrollPortrait && enrollData) {
      onFaceSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollPortrait, enrollData]);

  const onFaceSuccess = async () => {
    context.setUser({
      ...context.user,
      uuid: enrollData?.puid,
      guid: enrollData?.guid,
      enrollInageData: enrollPortrait,
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
      const updateV2Params = {
        sessionToken: context?.tokenParams,
        guid: enrollData?.guid,
        uuid: enrollData?.puid,
        updateType: updateTypeEnum.enroll,
      };
      await updateUserWithSession(updateV2Params);
      localStorage.setItem("uuid", JSON.stringify(enrollData?.puid || {}));
      setTimeout(async () => {
        await closeCamera(ELEMENT_ID);
        nextStep();
        // navigateWithQueryParams("/doc-selection");
      }, 2000);
    }
  };

  const onCameraReady = () => {
    enrollUserOneFa();
  };

  return (
    <>
      <Layout removeHeight={!isCameraGranted}>
        <div className="pt-10 max-md:p-[10px] max-md:pt-[20px]">
          <div className="flex justify-between relative px-5">
            <BackButton />
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
            />
          </div>
        </div>
      </Layout>
      <SwitchDeviceSelect />
    </>
  );
}

export default FaceScan;
