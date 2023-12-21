import { useContext, useState } from "react";
import lock from "assets/lock.svg";
import { useNavigateWithQueryParams } from "../../../../utils/navigateWithQueryParams";
import useScanBackDocument from "../../../../hooks/useScanBackDocument";
import { UserContext } from "../../../../context/userContext";
import Layout from "../../layout";
import BackButton from "../../components/backButton";
import CameraComponent from "../../components/camera";

type Props = {
  heading?: string;
};

function LoginDl(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const context: any = useContext(UserContext);
  const [completed, setCompleted] = useState(false);
  const onSuccess = async (result: any) => {
    const { barcodeData } = result;
    context.setUser({ ...context.user, barcodeData });
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
    setCompleted(true);
    setTimeout(() => {
      navigateWithQueryParams("/success");
    }, 7000);
  };

  const { scanBackDocument, scannedCodeData } = useScanBackDocument(
    onSuccess
  ) as any;
  const onCameraReady = () => {
    scanBackDocument();
  };
  return (
    <>
      <Layout>
        <div className="pt-10 max-md:p-[10px] max-md:pt-10">
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
              backDl={true}
              onCameraReady={onCameraReady}
              message={scannedCodeData?.status_message}
              progress={scannedCodeData?.status_message === "Success" ? 100 : 0}
              scanCompleted={completed}
            />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default LoginDl;
