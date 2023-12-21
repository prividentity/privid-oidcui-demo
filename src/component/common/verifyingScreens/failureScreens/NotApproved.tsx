import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import NotApprovedImage from "../../../assets/not-approved.svg";
import Layout from "../../../common/layout";

type Props = {
  heading?: string;
  showFooter?: boolean;
};

const NotApproved = (Props: Props) => {
  return (
    <Layout>
      <div className="h-full p-10 flex justify-between items-center flex-col max-md:p-[20px]">
        <div className="h-full flex justify-center items-center flex-col">
          <div className="flex justify-center items-center mt-[-50px]">
            <img src={NotApprovedImage} alt="" />
          </div>
          <Label className="text-[28px] font-[500] text-primaryText w-[100%] mt-10">
            {Props.heading || "Your account is not approved."}
          </Label>
        </div>
        <div className="mt-[3rem] w-full">
          <Button
            className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary hover:text-white"
            onClick={() => (window.location.href = "/")}
          >
            Return to homepage
          </Button>
          <Button className="w-full text-primary bg-white rounded-[24px] mt-4 hover:opacity-90 hover:bg-white hover:text-primary">
            Provide feedback
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotApproved;
