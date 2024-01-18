import { useState } from "react";
// import { faceLogin } from "@privateid/cryptonets-web-sdk";
import { faceLogin } from "@privateid/ping-oidc-web-sdk-alpha";
import { useSearchParams } from "react-router-dom";

let showError = false;
const useFaceLoginWithLivenessCheck = (
  setCompleted: (isComplete: boolean) =>void,
  onSetStatus?: (e: number) => void,
  retryTimes = 3,
  isInitialPredict = true
) => {
  const [searchParams] = useSearchParams();
  const [faceLoginWithLivenessMessage, setPredictMessage] = useState("");
  const [faceLoginInputImageData, setFaceLoginInputImageData] =
    useState<any>(null);
  const [faceLoginData, setPredictData] = useState<any>(null);
  const [faceLoginResponseStatus, setFaceLoginResponseStatus] = useState<number>();
  let tries = 0;
  const faceLoginWithLiveness = async (skipAntispoof = false) => {
    // @ts-ignore
    const inputImage = await faceLogin(callback, {
      input_image_format: "rgba",
      skip_antispoof: true
        // searchParams.get("skipAntispoof") === "true" || skipAntispoof,
    });
    setFaceLoginInputImageData(inputImage);
  };

  const callback = async (result: any) => {
    console.log("Predict Callback Result:", result)
    if (result.status !== "WASM_RESPONSE") {
      faceLoginWithLiveness();
      return;
    }

    handleWasmResponse(result.returnValue);
  };

  const handleWasmResponse = (returnValue: any) => {
    if(returnValue?.status !== -100) {
      setFaceLoginResponseStatus(returnValue?.status);
    }
    if (returnValue?.error) {
      setPredictMessage(
        "Please position your face in the center of the circle"
      );
      return;
    }
    if (returnValue.status === 0) {
      handleValidImage(returnValue);
    } else {
      handleInvalidImage(returnValue);
    }
  };

  const handleValidImage = (returnValue: any) => {
    setPredictMessage("Valid Image");
    setPredictData({
      ...returnValue,
      retryComplete: !isInitialPredict && tries === retryTimes,
    });
    setCompleted(true);
  };

  const handleInvalidImage = (returnValue: any) => {
    // const { message = "" } = returnValue || {};
    // if (!showError) {
    //   showError = true;
    //   setPredictMessage(message);
    //   setTimeout(() => {
    //     showError = false;
    //   }, 2000);
    // }

    if (tries !== retryTimes) {
      if (isInitialPredict) {
        tries += 1;
      }
      faceLoginWithLiveness();
    } else {
      setCompleted(true);
      setPredictData({
        ...returnValue,
        retryComplete: !isInitialPredict && tries === retryTimes,
      });
      tries = 0;
    }
  };
  const resetFaceLogin = (callFunc = true) => {
    setPredictData(undefined);
    setFaceLoginInputImageData(null);
    setPredictMessage("");
    if (callFunc) {
      faceLoginWithLiveness();
    }
  };

  return {
    faceLoginWithLiveness,
    faceLoginWithLivenessMessage,
    faceLoginInputImageData,
    faceLoginData,
    resetFaceLogin,
    faceLoginResponseStatus,
  };
};

export default useFaceLoginWithLivenessCheck;
