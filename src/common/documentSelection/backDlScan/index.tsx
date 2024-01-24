import { Label } from "../../../components/ui/label";
import Layout from "../../layout";
import lock from "../../../assets/lock.svg";
import CameraComponent from "../../components/camera";
import BackButton from "../../../common/components/backButton";
import { useNavigateWithQueryParams } from "../../../utils/navigateWithQueryParams";
import useScanBackDocument from "../../../hooks/useScanBackDocument";
import { useContext, useState } from "react";
import { UserContext } from "../../../context/userContext";

import {
  documentImageTypeEnum,
  uploadDocumentImage,
  updateDocumentDetails,
  pkiEncryptData,
} from "@privateid/ping-oidc-web-sdk-alpha";
import { getBackDocumentStatusMessage } from "@privateid/ping-oidc-web-sdk-alpha/dist/utils";
import SwitchDeviceSelect from "common/components/switchDeviceSelect";
import { OidcContext } from "context/oidcContext";

type Props = {
  heading?: string;
};

function BackDlScan(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const context: any = useContext(UserContext);
  const [completed, setCompleted] = useState(false);
  const oidcContext = useContext(OidcContext);
  const userContext = useContext(UserContext);
  const onSuccess = async (result: any) => {
    const { barcodeData, croppedDocument, croppedBarcode } = result;
    setCompleted(true);
    context.setUser({ ...context.user, barcodeData });
    async function uploadDocumentAndUpdateImages() {
      const documentDetailsParam = await pkiEncryptData(barcodeData);
      const promises = [];
      promises.push(
        updateDocumentDetails({
          baseUrl: process.env.REACT_APP_API_URL || "",
          token: oidcContext.transactionToken,
          documentId: context?.user?.documentId,
          params: documentDetailsParam,
        })
      );

      if (croppedDocument) {
        promises.push(
          uploadDocumentImage({
            baseUrl: process.env.REACT_APP_API_URL || "",
            token: oidcContext.transactionToken,
            documentId: context?.user?.documentId,
            params: {
              type: documentImageTypeEnum.BACKDLORIGINAL,
              data: croppedDocument,
            },
          })
        );
      }

      promises.push(
        uploadDocumentImage({
          baseUrl: process.env.REACT_APP_API_URL || "",
          token: oidcContext.transactionToken,
          documentId: context?.user?.documentId,
          params: {
            type: documentImageTypeEnum.BACKDLBARCODE,
            data: croppedBarcode,
          },
        })
      );

      await Promise.all(promises);
    }

    await uploadDocumentAndUpdateImages()
      .then(() => {
        console.log("All uploads and updates completed successfully.");
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
    const backDocumentData = {
      firstName: barcodeData.firstName,
      lastName: barcodeData.lastName,
      dob: barcodeData.dateOfBirth,
      address: {
        addressLine1: barcodeData.streetAddress1,
        addressLine2: barcodeData.streetAddress2,
        city: barcodeData.city,
        state: barcodeData.state,
        zipCode: barcodeData.postCode,
        country: barcodeData.issuingCountry,
        idDocumentNumber: barcodeData.customerId,
      },
    };

    context.setUser({ ...context.user, backDocumentData });
  };
  const onDocumentSuccess = () => {
    setTimeout(() => {
      navigateWithQueryParams("/waiting");
    }, 2000);
  };

  const { scanBackDocument, barcodeStatusCode, scannedCodeData } =
    useScanBackDocument(onSuccess) as any;
  const onCameraReady = () => {
    scanBackDocument();
  };
  console.log({ barcodeStatusCode });

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
              backDl={true}
              onCameraReady={onCameraReady}
              message={
                scannedCodeData?.status_message === "Success"
                  ? "Success"
                  : getBackDocumentStatusMessage(barcodeStatusCode)
              }
              progress={scannedCodeData?.status_message === "Success" ? 100 : 0}
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

export default BackDlScan;
