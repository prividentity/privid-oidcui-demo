import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {};

function CloseButton(Props: Props) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex justify-center items-center cursor-pointer "
        onClick={() => navigate(-1)}
      >
        <X />
      </div>
    </>
  );
}

export default CloseButton;
