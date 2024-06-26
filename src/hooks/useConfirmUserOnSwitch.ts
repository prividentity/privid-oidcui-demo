import { useEffect, useState } from "react";
// import { faceLogin } from "@privateid/cryptonets-web-sdk";
import { confirmUser, convertCroppedImage } from "@privateid/ping-oidc-web-sdk-alpha";
import { useSearchParams } from "react-router-dom";

let showError = false;
const useConfirmUserOnSwitch = (
  setCompleted: (isComplete: any) =>void,
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
    const inputImage = await confirmUser(callback, {
      input_image_format: "rgba",
      skip_antispoof: true
        // searchParams.get("skipAntispoof") === "true" || skipAntispoof,
    });
    setFaceLoginInputImageData(inputImage);
  };



  const callback = async (result: any) => {
    console.log("Confirm User Callback Result:", result)
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

    if (returnValue.validation_status === 0) {
      console.log("Return");
      handleValidImage(returnValue);
    } else {
      handleInvalidImage(returnValue);
    }
  };

  const handleValidImage = (returnValue: any) => {
    console.log("Set Completed");
    setPredictMessage("Valid Image");
    setPredictData({
      ...returnValue,
      retryComplete: !isInitialPredict && tries === retryTimes,
    });
   // setCompleted(faceLoginInputImageData);
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
     // setCompleted(faceLoginInputImageData);
      setPredictData({
        ...returnValue,
        retryComplete: !isInitialPredict && tries === retryTimes,
      });
      tries = 0;
    }
  };

  const convertImageToBase64 = async (
    imageData: any,
    width: any,
    height: any,
  ) => {
    try {
      console.log("test?", imageData);
      if (imageData.length === width * height * 4) {
        const imageBase64 = await convertCroppedImage(imageData, width, height);
        console.log("Confirm User Image:", imageBase64);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(()=>{
    if(faceLoginInputImageData){
      console.log("function pass:", faceLoginInputImageData)
      convertImageToBase64(faceLoginInputImageData?.imageData, faceLoginInputImageData?.width, faceLoginInputImageData?.height);
      try{
        const image =  new ImageData(faceLoginInputImageData.imageData, faceLoginInputImageData.width, faceLoginInputImageData.height);
        setCompleted(image);
      }
      catch(e){
        console.log(e);
      }
    }
  },[faceLoginInputImageData])


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

export default useConfirmUserOnSwitch;
