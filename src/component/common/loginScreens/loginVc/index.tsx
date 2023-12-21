import { useContext, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigateWithQueryParams } from "../../../../utils/navigateWithQueryParams";
import { UserContext } from "../../../../context/userContext";
import { createProofRequest, getAuthProofRequest } from "../../../../services/vc-dock";
import { UNABLE_TO_VERIFY } from "../../../../constant";
import Layout from "../../layout";
import BackButton from "../../components/backButton";

type Props = {
  heading?: string;
};
let intervalId: any;
let counter = 0;
let authProofRequestRes: any;
function LoginVC(Props: Props) {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const context: any = useContext(UserContext);
  const [qrLink, setQrLink] = useState("");

  const handleAuthProofRequest = async () => {
    if (!qrLink) {
      authProofRequestRes = await createProofRequest();
      setQrLink(authProofRequestRes?.qr || "");
    }
    intervalId = setInterval(async () => {
      const res: any = await getAuthProofRequest(authProofRequestRes?.id);

      if (res?.verified) {
        clearInterval(intervalId);
        navigateWithQueryParams("/success");
      }
      if (counter >= 36) {
        context.setFailedMessage(UNABLE_TO_VERIFY);
        clearInterval(intervalId);
        navigateWithQueryParams("/failure");
      }
      counter++;
    }, 5000);
  };
  useEffect(() => {
    handleAuthProofRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Layout>
      <div className="pt-10 max-md:p-[10px] max-md:pt-10">
          <div className="flex justify-between relative px-5 max-md:p-0">
            <BackButton />
            <p className="text-[20px] text-center w-full mt-[-4px]  max-md:w-[80%]  max-md:m-auto">
              Scan QR code on device to Verify Credentials
            </p>
          </div>
          {qrLink && (
            <div className="bg-[#fff] shadow-2xl p-4 rounded-[20px] w-[300px] m-auto flex items-center justify-center mt-20">
              <QRCode width={200} height={200} value={qrLink} />
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export default LoginVC;
