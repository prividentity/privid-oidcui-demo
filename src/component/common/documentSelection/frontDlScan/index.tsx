import { Label } from "../../../ui/label";
import Layout from "../../layout";
import lock from "../../../assets/lock.svg";
import CameraComponent from "../../components/camera";
import BackButton from "../../../common/components/backButton";
import { useNavigateWithQueryParams } from "../../../../utils/navigateWithQueryParams";
import useScanFrontDocument from "../../../../hooks/useScanFrontDocumentWithoutPredict";
import { useContext, useState } from "react";
import { UserContext } from "../../../../context/userContext";
import {
  createDocumentUploadIdTypeEnum,
  createDocumentUploadIdWithSession,
  documentImageTypeEnum,
  updateTypeEnum,
  updateUserWithSession,
  uploadDocumentImageWithSession,
} from "@privateid/cryptonets-web-sdk";
import SwitchDeviceSelect from "../../components/switchDeviceSelect";

type Props = {
  heading?: string;
};

function FrontDlScan(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const onFailCallback = () => {};
  const context: any = useContext(UserContext);
  const [completed, setCompleted] = useState(false);
  const onSuccess = async (
    result:
      | {
          croppedDocument: string;
          croppedMugshot: string;
          inputImage: string;
          portraitConfScore: number;
        }
      | any
  ) => {
    const {
      inputImage,
      croppedDocument,
      croppedMugshot,
      portraitConfScore: compareScore,
    } = result;
    console.log({ inputImage, croppedDocument, croppedMugshot, compareScore });
    const documentId = await createDocumentUploadIdWithSession({
      documentType: createDocumentUploadIdTypeEnum.drivers_license,
      sessionToken: context?.tokenParams,
    });

    context.setUser({ ...context.user, documentId: documentId.id });

    const payload = {
      sessionToken: context?.tokenParams,
      portrait_conf_score: compareScore.toFixed(2).toString(),
      updateType: updateTypeEnum.compare,
    };
    async function uploadAllImagesAndUpdateUser() {
      const promises = [
        uploadDocumentImageWithSession({
          sessionToken: context?.tokenParams,
          documentImageType: documentImageTypeEnum.FRONT,
          documentId: documentId.id,
          imageString: inputImage,
        }),
        uploadDocumentImageWithSession({
          sessionToken: context?.tokenParams,
          documentImageType: documentImageTypeEnum.FRONT_CROPPED_DOCUMENT,
          documentId: documentId.id,
          imageString: croppedDocument,
        }),
        uploadDocumentImageWithSession({
          sessionToken: context?.tokenParams,
          documentImageType: documentImageTypeEnum.FRONT_MUGSHOT,
          documentId: documentId.id,
          imageString: croppedMugshot,
        }),
        updateUserWithSession(payload),
      ];

      await Promise.all(promises);
    }

    // Call the function to upload images and update user
    uploadAllImagesAndUpdateUser()
      .then(() => {
        console.log("All uploads and update completed successfully.");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    setCompleted(true);
    setTimeout(() => {
      navigateWithQueryParams("/drivers-licence-back-intro");
    }, 8000);
  };
  const { scanFrontDocument, resultResponse, scanStatus } =
    useScanFrontDocument(
      onSuccess,
      onFailCallback,
      context?.user?.enrollInageData
    ) as any;

  const onCameraReady = () => {
    scanFrontDocument();
  };
  return (
    <>
      <Layout>
        <div className="pt-10 max-md:p-[10px]  max-md:pt-10">
          <div className="flex justify-between relative px-5 max-md:p-0">
            <BackButton />
            <div className="bg-backgroundLightGray py-[5px] px-[15px] text-[12px] rounded-[20px] flex items-center m-auto">
              <img src={lock} alt="lock" className="mr-[5px]" />
              Images never leave this device
            </div>
            <div>{/* {Empty div to adjust space} */}</div>
          </div>
          <div className="mt-[50px] rounded-[20px] flex flex-col items-center justify-center">
            <CameraComponent
              frontDl={true}
              onCameraReady={onCameraReady}
              message={scanStatus || resultResponse?.status_message}
              progress={
                (scanStatus || resultResponse?.status_message) === "Success"
                  ? 100
                  : 0
              }
              scanCompleted={completed}
            />
          </div>
        </div>
      </Layout>
      <SwitchDeviceSelect />
    </>
  );
}

export default FrontDlScan;
