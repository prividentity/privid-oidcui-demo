import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {};

function CloseButton(Props: Props) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex justify-center items-center cursor-pointer top-0 right-0 absolute"
        onClick={() => navigate('/')}
      >
        <X />
      </div>
    </>
  );
}

export default CloseButton;
