import { closeCamera } from "@privateid/cryptonets-web-sdk";
import { ELEMENT_ID } from "constant";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  isCamera?: boolean;
};

function BackButton(Props: Props) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex justify-center items-center cursor-pointer absolute top-0 left-0"
        onClick={async () => {
          if (Props?.isCamera) {
            await closeCamera(ELEMENT_ID);
            navigate(-1);
          } else {
            navigate(-1);
          }
        }}
      >
        <ArrowLeft />
      </div>
    </>
  );
}

export default BackButton;
