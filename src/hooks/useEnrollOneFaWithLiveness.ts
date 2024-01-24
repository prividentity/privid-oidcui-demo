// @ts-nocheck
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { convertCroppedImage, enroll1FA } from "@privateid/ping-oidc-web-sdk-alpha";
import {
  getStatusMessage,
  MessageType,
} from "@privateid/ping-oidc-web-sdk-alpha";
import Rerun from "../utils/reRuncheck";
import { useSearchParams } from "react-router-dom";

let skipAntispoofProcess = false;
const useEnrollOneFaWithLiveness = (onSuccess) => {
  const [searchParams] = useSearchParams();
  const [enrollStatus, setEnrollStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [enrollPortrait, setEnrollPortrait] = useState<ImageData>();
  const [enrollData, setEnrollData] = useState<
    { puid: string; guid: string } | undefined
  >();

  const enrollUserOneFa = async (token = "", skipAntispoof = false) => {
    RerunAction.doInterval();
    skipAntispoofProcess = skipAntispoof;
    if (token) {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 20;
      });
    } else {
      setProgress(0);
    }
    // eslint-disable-next-line no-unused-vars
    try {
      const bestImage = await enroll1FA(callback, {
        input_image_format: "rgba",
        mf_token: token,
        skip_antispoof: false,
        // true || searchParams.get("skipAntispoof") === "true" || skipAntispoof,
      });
      if (bestImage) {
        console.log(bestImage);
        const image =  new ImageData(bestImage.imageData, bestImage.width, bestImage.height);
        const convertImageToBase64 = async (
          imageData: any,
          width: any,
          height: any,
        ) => {
          try {
            if (imageData.length === width * height * 4) {
              const imageBase64 = await convertCroppedImage(imageData, width, height);
             return imageBase64;
            }
          } catch (e) {
            console.log(e);
          }
        };
        const getB64 = await convertImageToBase64(image.data, image.width, image.height);
        console.log("Enroll Image:", getB64);
        setEnrollPortrait(
          image
        );
      }
    } catch (e) {}
  };
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const RerunAction = new Rerun(() => {
    enrollUserOneFa("", skipAntispoofProcess);
  });

  const handleFailureCase = (result, reScanIfFail) => {
    if (result.returnValue.status === -1) {
      const regex = /offline/gi;
      if (regex.test(result.returnValue.message)) {
        setEnrollStatus("Low Bandwidth / No Internet Detected");
      } else {
        setEnrollStatus("Please try again");
      }
      setProgress(0);
      RerunAction.clearCheck();
      setTimeout(() => {
        enrollUserOneFa("", skipAntispoofProcess);
      }, 3000);
    } else if (result.returnValue.validation_status.length > 0) {
      if (result.returnValue.validation_status[0].anti_spoof_performed) {
        if (
          (result.returnValue.validation_status[0].anti_spoof_status === 4 &&
            result.returnValue.validation_status[0].status === 22) ||
          result.returnValue.validation_status[0].status === 23
        ) {
          setEnrollStatus(
            getStatusMessage(result.returnValue.validation_status[0].status)
          );
        } else if (
          (result.returnValue.validation_status[0].anti_spoof_performed &&
            result.returnValue.validation_status[0].anti_spoof_status === 0 &&
            result.returnValue.validation_status[0].status === 10) ||
          result.returnValue.validation_status[0].status === 11
        ) {
          setEnrollStatus(
            getStatusMessage(result.returnValue.validation_status[0].status)
          );
        } else {
          setEnrollStatus(
            getStatusMessage(
              result.returnValue.validation_status[0].anti_spoof_status,
              MessageType.antispoofStatus
            )
          );
        }
      } else {
        setEnrollStatus(
          getStatusMessage(result.returnValue.validation_status[0].status)
        );
      }
      const enrollToken =
        result.returnValue.validation_status[0].status === 0
          ? result.returnValue.validation_status[0].enroll_token
          : "";
      enrollUserOneFa(enrollToken, skipAntispoofProcess);
      // }
    } else {
      setEnrollStatus(null);
      if (reScanIfFail) {
        enrollUserOneFa("", skipAntispoofProcess);
      }
    }
  };

  


  const callback = async (result) => {
    console.log("Enroll callback result:", result);
    RerunAction.RerunAction = false;
    if (result.returnValue?.success) {
      RerunAction.clearCheck();
      if (progress <= 100) {
        setProgress((p) => p + 20);
      }
      setEnrollStatus("Enroll Success");
      // setTimeout(() => {
      onSuccess(result.returnValue);
      setEnrollData(result.returnValue);
      onSuccess(true);
      // }, 3000);
    } else if (result.returnValue.status === 0) {
      handleFailureCase(result, false);
    } else {
      handleFailureCase(result, true);
    }
  };

  return {
    enrollStatus,
    enrollUserOneFa,
    progress,
    enrollPortrait,
    enrollData,
  };
};

export default useEnrollOneFaWithLiveness;
