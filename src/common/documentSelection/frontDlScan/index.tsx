import { Label } from "../../../components/ui/label";
import Layout from "../../layout";
import lock from "../../../assets/lock.svg";
import CameraComponent from "../../components/camera";
import BackButton from "../../../common/components/backButton";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import useScanFrontDocument from "../../../hooks/useScanFrontDocument";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";

import {
  uploadDocumentImage,
  createDocumentDL,
  documentImageTypeEnum,
  pkiEncryptData,
  updateUserDetails,
} from "@privateid/ping-oidc-web-sdk-alpha";

import SwitchDeviceSelect from "common/components/switchDeviceSelect";
import { OidcContext } from "context/oidcContext";

type Props = {
  heading?: string;
};

function FrontDlScan(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const onFailCallback = () => {};
  const context: any = useContext(UserContext);
  const oidcContext = useContext(OidcContext);
  const [completed, setCompleted] = useState(false);
  const onDocumentSuccess = () => {
    setTimeout(() => {
      navigateWithQueryParams("/drivers-licence-back-intro");
    }, 2000);
  };
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
    setCompleted(true);
    const {
      inputImage,
      croppedDocument,
      croppedMugshot,
      portraitConfScore: compareScore,
    } = result;
    console.log({ inputImage, croppedDocument, croppedMugshot, compareScore });
    const documentId = await createDocumentDL({
      baseUrl: process.env.REACT_APP_API_URL || "",
      token: oidcContext.transactionToken,
    });

    context.setUser({ ...context.user, documentId: documentId.id });

    const confScoreUpdatePayload = await pkiEncryptData({portrait_conf_score: compareScore.toFixed(2).toString()});
    console.log("payload?", confScoreUpdatePayload);

    async function uploadAllImagesAndUpdateUser() {
      const promises = [
        uploadDocumentImage({
          baseUrl: process.env.REACT_APP_API_URL || "",
          token: oidcContext.transactionToken,
          documentId: documentId.id,
          params:{
            type: documentImageTypeEnum.FRONTDLORIGINAL,
            data: inputImage,
          },
        }),
        uploadDocumentImage({
          baseUrl: process.env.REACT_APP_API_URL || "",
          token: oidcContext.transactionToken,
          documentId: documentId.id,
          params:{
            type: documentImageTypeEnum.FRONTDLCROPPED,
            data: croppedDocument,
          },
        }),
        uploadDocumentImage({
          baseUrl: process.env.REACT_APP_API_URL || "",
          token: oidcContext.transactionToken,
          documentId: documentId.id,
          params:{
            type: documentImageTypeEnum.FRONTDLHEADSHOT,
            data: croppedMugshot,
          },
        }),
        updateUserDetails({
          baseUrl: process.env.REACT_APP_API_URL || "",
          token: oidcContext.transactionToken,
          params: confScoreUpdatePayload
        })
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
  };
  const { scanFrontDocument, resultResponse, scanStatus } =
    useScanFrontDocument(
      onSuccess,
      onFailCallback,
      context?.user?.enrollImageData
    ) as any;

  const onCameraReady = () => {
    scanFrontDocument();
  };
  return (
    <>
      <Layout>
        <div className="px-10 py-8 max-md:p-[20px] max-md:pt-[20px]">
          <div className="flex justify-between relative max-md:p-0">
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
              onSuccess={onDocumentSuccess}
            />
          </div>
        </div>
      </Layout>
      <SwitchDeviceSelect />
    </>
  );
}

export default FrontDlScan;
