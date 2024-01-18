/* eslint-disable @typescript-eslint/no-use-before-define */
import { SetStateAction, useEffect, useState } from "react";
import {
  convertCroppedImage,
  // documentMugshotFaceCompare,
  isValidPhotoID,
} from "@privateid/ping-oidc-web-sdk-alpha";
import { CANVAS_SIZE } from "../utils";
import { documentImageTypeUpload } from "@privateid/ping-oidc-web-sdk-alpha";
import Rerun from "../utils/reRuncheck";
import { useToast } from "components/ui/use-toast";
import { useNavigateWithQueryParams } from "utils/navigateWithQueryParams";

const useScanFrontDocument = (
  onSuccess: ({
    croppedDocument,
    inputImage,
    croppedMugshot,
    portraitConfScore,
  }: {
    croppedDocument: string | null;
    inputImage: string | null;
    croppedMugshot: string | null;
    portraitConfScore: number;
  }) => void,
  onFailCallback: ({
    status,
    message,
  }: {
    status: string;
    message: string;
  }) => void,
  enrollImageData: ImageData
) => {
  const { navigateWithQueryParams } = useNavigateWithQueryParams();
  const { toast } = useToast();
  const [isFound, setIsFound] = useState(false);
  const [resultStatus, setResultStatus] = useState(null);
  const [scanStatus, setScanStatus] = useState("");
  // raw byte
  const [inputImageData, setInputImageData] = useState<any>(null);
  const [croppedDocumentRaw, setCroppedDocumentRaw] = useState(null);
  const [croppedMugshotRaw, setCroppedMugshotRaw] = useState(null);

  // base64 image
  const [inputImageBase64, setInputImageBase64] = useState(null);
  const [croppedDocumentBase64, setCroppedDocumentBase64] = useState(null);
  const [croppedMugshotBase64, setCroppedMugshotBase64] = useState(null);

  // confidence value
  const [resultResponse, setResultResponse] = useState(null);
  const [returnValue, setResultValue] = useState<any>({});

  const documentCallback = (result: any) => {
    console.log("front scan callback: ", result);
    RerunAction.RerunAction = false;

    setResultResponse(result.returnValue);
    if (
      result.returnValue.op_status === 0 ||
      result.returnValue.op_status === 10
    ) {
      RerunAction.clearCheck();
      const { predict_status } = result.returnValue;
      if (
        result.returnValue.cropped_face_width &&
        result.returnValue.cropped_face_height
      ) {
        setIsFound(true);
        setResultStatus(predict_status);
        setResultValue(result.returnValue);
        setScanStatus("");
      } else {
        setInputImageData(null);
        setCroppedDocumentRaw(null);
        setCroppedMugshotRaw(null);
        scanFrontDocument();
        setScanStatus("");
      }
    } else {
      setInputImageData(null);
      setCroppedDocumentRaw(null);
      setCroppedMugshotRaw(null);
      onFailCallback({
        status: result.returnValue.op_status.toString(),
        message: result.returnValue.op_message,
      });
      scanFrontDocument();
    }
  };

  const convertImageToBase64 = async (
    imageData: any,
    width: any,
    height: any,
    setState: SetStateAction<any>
  ) => {
    try {
      if (imageData.length === width * height * 4) {
        const imageBase64 = await convertCroppedImage(imageData, width, height);
        setState(imageBase64);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Converting imageInput
  useEffect(() => {
    if (inputImageData && isFound && returnValue?.image_width) {
      convertImageToBase64(
        inputImageData,
        returnValue?.image_width,
        returnValue?.image_height,
        setInputImageBase64
      );
    }
  }, [inputImageData, isFound, returnValue?.image_width]);

  // Converting croppedDocument
  useEffect(() => {
    if (isFound && croppedDocumentRaw && returnValue?.cropped_doc_width) {
      convertImageToBase64(
        croppedDocumentRaw,
        returnValue?.cropped_doc_width,
        returnValue?.cropped_doc_height,
        setCroppedDocumentBase64
      );
    }
  }, [croppedDocumentRaw, returnValue?.cropped_doc_width, isFound]);

  // Converting croppedMugshot
  useEffect(() => {
    if (croppedMugshotRaw && returnValue?.cropped_face_width && isFound) {
      convertImageToBase64(
        croppedMugshotRaw,
        returnValue?.cropped_face_width,
        returnValue?.cropped_face_height,
        setCroppedMugshotBase64
      );
    }
  }, [croppedMugshotRaw, returnValue?.cropped_face_width, isFound]);

  const faceCompareCallback = async (result: any) => {
    const { conf_score } = result.returnValue;
    console.log("COMPARE RESULT", conf_score);
    if (conf_score < 30) {
      setScanStatus("Please rescan driver’s license");
      setTimeout(() => {
        reScanFrontDocument();
      }, 3000);
    } else {
      onSuccess({
        inputImage: inputImageBase64,
        croppedDocument: croppedDocumentBase64,
        croppedMugshot: croppedMugshotBase64,
        portraitConfScore: conf_score,
      });
    }
  };

  // if all images are available and Document UUID available call onSuccess Callback
  useEffect(() => {
    if (
      isFound &&
      inputImageBase64 &&
      croppedDocumentBase64 &&
      croppedMugshotBase64 &&
      croppedDocumentRaw
    ) {
      const croppedDocument = new ImageData(
        // @ts-ignore
        croppedDocumentRaw,
        returnValue?.cropped_doc_width,
        returnValue?.cropped_doc_height
      );
      console.log(
        "croppedDocument data?",
        { croppedDocumentBase64 },
        enrollImageData
      );
      // const doCompare = async () => {
      //   await documentMugshotFaceCompare(
      //     faceCompareCallback,
      //     croppedDocument,
      //     enrollImageData,
      //     {
      //       input_image_format: "rgba",
      //       // @ts-ignore
      //       auto_zoom_disabled: false,
      //     }
      //   );
      // };
      if (enrollImageData) {
       // doCompare();
      } else {
        toast({
          variant: "destructive",
          description: "Image data not found. Please scan your face again.",
        });
        navigateWithQueryParams("/face-scan-intro");
      }
    }
  }, [
    isFound,
    inputImageBase64,
    croppedDocumentBase64,
    croppedMugshotBase64,
    croppedDocumentRaw,
    returnValue?.cropped_doc_width,
    enrollImageData,
  ]);

  const scanFrontDocument = async (
    canvasSize?: any,
    initializeCanvas?: any
  ) => {
    RerunAction.doInterval();
    const canvasObj = canvasSize ? CANVAS_SIZE?.[canvasSize] : {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result: any = await isValidPhotoID(
      // @ts-ignore
      "front",
      initializeCanvas || documentCallback,
      undefined,
      {
        input_image_format: "rgba",
      },
      canvasObj
    );
    try {
      const { imageData, croppedDocument, croppedMugshot } = result;
      if (imageData && croppedDocument && croppedMugshot) {
        setInputImageData(imageData);
        setCroppedDocumentRaw(croppedDocument);
        setCroppedMugshotRaw(croppedMugshot);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const RerunAction = new Rerun(scanFrontDocument);

  const reScanFrontDocument = () => {
    setInputImageData(null);
    setCroppedDocumentRaw(null);
    setCroppedMugshotRaw(null);
    setInputImageBase64(null);
    setCroppedDocumentBase64(null);
    setCroppedMugshotBase64(null);
    setResultValue({});
    scanFrontDocument();
  };

  return {
    scanFrontDocument,
    isFound,
    setIsFound,
    resultStatus,
    resultResponse,
    reScanFrontDocument,
    scanStatus,
  };
};

export default useScanFrontDocument;
