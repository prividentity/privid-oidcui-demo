import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {};

function BackButton(Props: Props) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="flex justify-center items-center cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
      </div>
    </>
  );
}

export default BackButton;
