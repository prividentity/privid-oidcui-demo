import RedirectIcon from "assets/redirect-mob.svg";
import { Label } from "components/ui/label";
import BackButton from "../components/backButton";
import Layout from "common/layout";
import { useNavigate } from "react-router-dom";
import CloseButton from "common/components/closeButton";

type Props = {};
const RedirectedMobile = (props: Props) => {
  const navigate = useNavigate();
  return (
    <>
      <Layout>
        <div className="px-10 py-8 max-md:p-[20px]">
          <div className="flex justify-between relative">
            <BackButton />
            <div>{/* {Empty div to adjust space} */}</div>
            <div>{/* {Empty div to adjust space} */}</div>
            <CloseButton />
          </div>
          <div className="h-[450px] flex justify-center items-center flex-col">
            <div className="flex justify-center items-center">
              <img src={RedirectIcon} alt="" />
            </div>
            <Label className="text-[32px] font-[500] text-primaryText">
              Redirected to mobile
            </Label>
            <div>
              <Label className="text-[14px] text-secondaryText font-[500]">
                Continue on mobile{" "}
                <span className="text-[#FB6E4F] font-[700]">
                  but do not close this tab
                </span>{" "}
                until verification is done.
              </Label>
            </div>
          </div>
        </div>
      </Layout>
      <Label
        className="mt-0 hover:underline text-primary text-[14px] cursor-pointer block text-center mb-5"
        onClick={() => navigate(-1)}
      >
        Continue on desktop
      </Label>
    </>
  );
};

export default RedirectedMobile;
