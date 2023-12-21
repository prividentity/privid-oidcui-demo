import faceID from "../../assets/face-id.svg";
import key from "../../assets/key.svg";
import user from "../../assets/user.svg";
import stepperTick from "../../assets/stepper-tick.svg";

function Stepper({ step }: any) {
  return (
    <div className="flex w-[150px] justify-between items-center max-md:mb-[15px]">
      <div
        className={`${
          step > 1
            ? "bg-primaryLight"
            : `${step === 2 || step === 1 ? "bg-primary" : "bg-white"}`
        } flex justify-center items-center w-[28px] h-[28px] border border-border rounded-full`}
      >
        <img
          src={step >= 2 ? stepperTick : faceID}
          alt=""
          className="w-[14px]"
        />
      </div>
      <div
        className={`w-[25px] h-[1.5px] ${
          step > 1 ? "bg-primary" : "bg-border"
        } `}
      ></div>
      <div
        className={`${
          step > 2
            ? "bg-primaryLight "
            : `${step === 2 ? "bg-primary" : "bg-white"}`
        } flex justify-center items-center w-[28px] h-[28px] border border-border rounded-full`}
      >
        <img
          src={step >= 3 ? stepperTick : user}
          alt=""
          className="w-[14px] text-white"
          style={{ filter: step >= 2 && step < 3 ? "brightness(1.5)" : "" }}
        />
      </div>
      <div
        className={`w-[25px] h-[1.5px] ${
          step > 2 ? "bg-primary" : "bg-border"
        } `}
      ></div>{" "}
      <div
        className={`${
          step > 3
            ? "bg-primaryLight "
            : `${step === 3 ? "bg-primary" : "bg-white"}`
        } flex justify-center items-center w-[28px] h-[28px] border border-border rounded-full`}
      >
        <img
          src={step >= 4 ? stepperTick : key}
          alt=""
          className="w-[14px]"
          style={{ filter: step >= 3 && step < 4 ? "brightness(1.5)" : "" }}
        />
      </div>
    </div>
  );
}

export default Stepper;
