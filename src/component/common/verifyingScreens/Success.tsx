import success from "../../../Animations/5-Verify/GIFs/Success.gif";
import { Label } from "../../ui/label";
import { Button } from "../../ui/button";
import Layout from "../layout";

type Props = {
  heading?: string;
};

function Success(Props: Props) {
  return (
    <Layout>
      <div className="h-full p-10 flex justify-between items-center flex-col max-md:p-[20px]">
        <div className="h-full flex justify-center items-center flex-col">
          <div className="flex justify-center items-center ">
            <img
              src={success}
              alt=""
              className="w-[500px] h-[300px] object-cover"
            />
          </div>
          <Label className="text-[28px] font-[500] text-primaryText w-[90%] mt-[-50px]">
            {Props.heading || "Success! Your account is created"}
          </Label>
        </div>
        <div className="mt-[3rem] w-full">
          <Button
            className="w-full text-white bg-primary rounded-[24px] mt-4 hover:opacity-90 hover:bg-primary hover:text-white"
            onClick={() => (window.location.href = "/")}
          >
            Continue
          </Button>
          <Button className="w-full text-primary bg-white rounded-[24px] mt-4 hover:opacity-90 hover:bg-white hover:text-primary">
            Provide feedback
          </Button>
        </div>
      </div>
    </Layout>
  );
}

export default Success;
