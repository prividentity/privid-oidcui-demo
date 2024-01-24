import { useContext, useEffect, useState } from "react";
import Lottie from "lottie-react";
import completedCheck from "Animations/4-Capture-successfully/JSON/confetti.json";
import cameraIcon from "assets/cameraIcon.svg";
import deniedCameraIcon from "assets/deniedCamera.svg";
import { Button } from "components/ui/button";
import { AllowCameraModal } from "../allowCameraModal";
import useWasm from "hooks/useWasm";
import useCamera from "hooks/useCamera";
import {
  CameraConfig,
  ENROLL_CANVAS_RESOLUTION,
  REMOVE_GLASSES,
} from "constant";
import { switchCamera } from "@privateid/ping-oidc-web-sdk-alpha";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";
import { Loader2 } from "lucide-react";
import useCameraPermissions from "hooks/useCameraPermissions";
import FaceAnimation from "common/animateCircle/faceScanAnimation";
import FaceScanProgress from "common/animateCircle/faceScanProgress";
import { isMobile } from "utils";
import DocumentProgressAnimation from "common/animateCircle/documentProgressAnimation";
import DocumentAnimation from "common/animateCircle/documentAnimation";
import { OidcContext } from "context/oidcContext";

type Props = {
  heading?: string;
  faceCamera?: boolean;
  frontDl?: boolean;
  backDl?: boolean;
  passportScan?: boolean;
  faceLoginCamera?: boolean;
  onCameraReady?: () => void;
  progress?: number;
  message?: string | undefined | null;
  onSuccess?: () => void;
  attempt?: number;
  scanCompleted?: boolean;
  onCameraSwitch?: () => void;
};

const rendererSettings = {
  preserveAspectRatio: "xMaxYMin slice",
};

function CameraComponent(props: Props) {
  const {
    faceCamera,
    frontDl,
    backDl,
    passportScan,
    faceLoginCamera,
    onCameraReady,
    progress,
    message,
    onSuccess,
    attempt,
    scanCompleted,
    onCameraSwitch,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [minimizeCamera, setMinimizeCamera] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedLoginScan, setCompletedLoginScan] = useState(false);
  // const [frontDlCompleted, setFrontDlCompleted] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();
  const [isGlasses, setIsGlasses] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false);
  const [documentCompletedScan, setDocumentCompletedScan] = useState(false);
  const enrollOneFaProgress: any = progress || 0;
  const { isCameraGranted, state }: any = useCameraPermissions(() => {});
  // console.log({documentCompletedScan, scanCompleted})
  useEffect(() => {
    if (message === REMOVE_GLASSES && (faceCamera || faceLoginCamera)) {
      setIsGlasses(true);
    }
  }, [message]);
  // Camera and Wasm init
  const onCameraFail = () => {};
  const cameraReady = () => {
    // if (!faceCamera) {
    onCameraReady?.();
    // }
  };
  const documentScan = frontDl || backDl || passportScan;
  const oidcContext = useContext(OidcContext);
  const url = process.env.REACT_APP_API_URL || "";
  const { ready: wasmReady, wasmStatus } = useWasm(
    oidcContext.transactionToken || "adasdasd",
    url,
    "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAkUejlGQtY6fC/B8HY8lI\nCRZys4mQVgI62YI1POIAgcfEYXbrtKGpYJOtYcjgzZJ5Eg7VYKNEsAvfRDYDd+QX\nGqVgYiayIYeqDkgTNPnvrXLQVm/42pSWWYvOaq/DlJmLLpkQKwic45dg58VCP2A/\nzF29fjzfeofn2Im1xjvMs1NhfSd7uJAimEy8hV6MlZh03Z4iZmdl3+f6n8t/KR/Z\nwU6tKw6nbDWEuMyEMsUXkGRWyQvlX2/t5WvCx7xMX2LPlmXGhutYXJlG6rfu4PtN\nKDcGzQFySp1NuU+eV75eGiyfGwg33HRwab/jQr/FrtgphT5Q+sNUKSRZwWXDuGGd\n4wb0E1YwUwdJP0osxJ9v3g62PZD/id/Bec7TqNWhRAWhXux2jexwvwglWh497cJj\nkkLLG5QKJXGUh6S7f46y+TgGoXX0ME8nJM9jCu2OjBXqvVM17SiwU29XoYLrk2G1\nSCqqU6kivOW2cAeIDAYJtlYV5K9kPh4xYoWXKKFcLBcR35I8bdHjeMIHmp4Z+9Zm\nDfhByrDRHxIoz6cKThhX+DqrinKx928tQCaMth1S1uMQp+VDUnA4016yQVtf6XtY\nVfJzU8xt2cQ2nTSTMnwtcAET6GwFQSf17i0L5HiIZXzt685215K8tA6Oe41DsP5E\ngcyHe6R8lM7/HSI+7fn7MrUCAwEAAQ==\n-----END PUBLIC KEY-----"
  );
  const canvasResolution =
    !isMobile && !documentScan ? ENROLL_CANVAS_RESOLUTION : null;
  const { ready, init, device, devices } = useCamera(
    CameraConfig?.elementId,
    documentScan ? "back" : (CameraConfig?.mode as any),
    CameraConfig?.requireHD,
    onCameraFail,
    documentScan,
    canvasResolution
  );
  useEffect(() => {
    if (device) {
      setDeviceId(device);
    }
  }, [device]);
  const handleWasmLoad = () => {
    if (!wasmReady && wasmStatus.isChecking) return;
    if (wasmReady && !wasmStatus.isChecking && wasmStatus.support) {
      if (!ready) {
        init();
      } else if (isCameraGranted && ready) {
        cameraReady();
      }
    }
    if (!wasmReady && !wasmStatus.isChecking && !wasmStatus.support) {
      onCameraFail();
    }
  };
  useEffect(() => {
    handleWasmLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wasmReady, ready, wasmStatus]);

  const onCompleted = () => {
    setCompleted(true);
    onSuccess?.();
  };

  const handleAnimationComplete = (state: string) => {
    if (state === "start") {
      setStartAnimation(true);
    } else if (state === "completed") {
      onCompleted();
    }
  };

  // useEffect(() => {
  //   if ((frontDl && isCameraGranted) || (backDl && isCameraGranted)) {
  //     console.log('scanCompleted, message', scanCompleted, message);
  //     if (message === "Success") {
  //       setFrontDlCompleted(true);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [frontDl, message, backDl, scanCompleted]);

  useEffect(() => {
    if (attempt === 1 && (faceCamera || faceLoginCamera) && isCameraGranted) {
      setMinimizeCamera(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, faceCamera, isCameraGranted]);

  // useEffect(() => {
  //   if (isCameraGranted) {
  //     if (faceCamera) {
  //       onCameraReady?.();
  //     } else if (passportScan) {
  //       onCameraReady?.();
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [backDl, faceCamera, frontDl, isCameraGranted, passportScan]);

  const onSwitchCamera = async (cameraId: any) => {
    setDeviceId(cameraId);
    onCameraSwitch?.();
    await switchCamera(null, cameraId);
  };

  const renderVideo = () => {
    return (
      <div
        className={`bg-[#0b101b] w-full h-full ${
          (faceCamera || faceLoginCamera) && minimizeCamera && "rounded-[160px]"
        }`}
      >
        {!ready && (
          <div className="absolute h-full w-full left-0 top-0 z-50 flex items-center justify-center">
            <Loader2 className="animate-spin h-[55px] w-[55px] text-[#fff]" />
          </div>
        )}
        <video
          id="userVideo"
          muted
          autoPlay
          playsInline
          className={`w-full h-full 
                    ${
                      startAnimation &&
                      (faceCamera || faceLoginCamera) &&
                      "rounded-[160px]"
                    }
                    object-cover ${
                      (faceCamera || faceLoginCamera) && "face-camera"
                    }`}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (!isCameraGranted && state === "prompt") {
      return (
        <>
          <img src={cameraIcon} alt="cameraIcon" />
          <p className="text-[28px] text-white max-w-[350px]">
            Your browser will request access to your camera
          </p>
        </>
      );
    } else if (!isCameraGranted && state === "denied") {
      return (
        <>
          <img src={deniedCameraIcon} alt="cameraIcon" />
          <p className="text-[28px] text-white max-w-[350px]">
            Can not access camera
          </p>
          <p className="text-[16px] text-placeholder max-w-[350px] font-[200]">
            Access to your camera has been denied.
          </p>
          <Button
            className="max-w-[140px] w-full text-white bg-[#5283EC] rounded-[24px] mt-4 hover:opacity-90 hover:bg-[#5283EC]"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Allow camera
          </Button>
        </>
      );
    } else if (isCameraGranted && ["granted", "prompt"]?.includes(state)) {
      return (
        <div className="h-full w-full p-[20px] flex items-center justify-center relative">
          {(faceLoginCamera ? !completedLoginScan : !scanCompleted) &&
            startAnimation && (
              <div className="face-canvas z-50">
                <FaceScanProgress
                  enrollOneFaProgress={enrollOneFaProgress}
                  completedScan={setCompletedLoginScan}
                  faceLoginCamera={faceLoginCamera}
                />
              </div>
            )}
          {documentScan && progress === 100 && !documentCompletedScan && (
            <div className="document-canvas">
              <DocumentProgressAnimation
                progressData={progress}
                setCompleted={(e: any) => setDocumentCompletedScan(e)}
              />
            </div>
          )}
          {faceCamera || faceLoginCamera ? (
            <>
              <FaceAnimation
                isCircle={(faceCamera || faceLoginCamera) && minimizeCamera}
                isScanned={
                  faceLoginCamera
                    ? scanCompleted && completedLoginScan
                    : scanCompleted
                }
                handleAnimationComplete={handleAnimationComplete}
              >
                {renderVideo()}
              </FaceAnimation>
            </>
          ) : (
            <div
              className={`${
                frontDl || backDl ? "max-md:!h-[270px]" : ""
              } w-full h-full`}
            >
              <DocumentAnimation
                isCircle={(faceCamera || faceLoginCamera) && minimizeCamera}
                isScanned={
                  documentScan
                    ? documentCompletedScan && scanCompleted
                    : scanCompleted
                }
                handleAnimationComplete={handleAnimationComplete}
                documentScan={documentScan}
              >
                {renderVideo()}
              </DocumentAnimation>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <>
      {isCameraGranted && ["granted", "prompt"]?.includes(state) && (
        <>
          <h4 className="text-[25px] leading-[24px]  mt-[-40px] mb-[10px] max-md:text-[22px] max-md:mt-[-10px] max-md:mb-[10px]">
            {(frontDl || backDl || faceCamera) && completed
              ? `Complete${faceCamera ? ", your selfie was deleted." : ""}`
              : message
              ? message
              : faceCamera || faceLoginCamera
              ? "Center your head in the frame"
              : frontDl
              ? "Position front of ID in the frame"
              : backDl
              ? "Position back of ID in the frame"
              : ""}
          </h4>
        </>
      )}
      <div className="mx-1 bg-[#0b101b] h-[380px] mt-[0px] rounded-[20px] flex flex-col items-center justify-center w-full max-md:h-[343px]">
        {completed ? (
          <Lottie
            loop={false}
            autoplay={true}
            animationData={completedCheck}
            style={{
              height: isMobile ? 320 : 380,
            }}
            rendererSettings={isMobile ? {} : rendererSettings}
          />
        ) : (
          renderContent()
        )}
      </div>
      {completed ? (
        <div className="mb-[0px] max-md:w-[100%] max-md:mb-[30px] h-[40px]" />
      ) : (
        <div className="mb-[0px] max-md:w-[100%] max-md:mb-[30px] mt-2">
          <Select
            onValueChange={(e: string) => onSwitchCamera(e)}
            value={devices?.find((device) => device?.value === deviceId)?.value}
          >
            <SelectTrigger
              tabIndex={4}
              className="h-[48px] mt-[0px] font-[400] rounded-[8px] border-borderSecondary {
                    ] text-[14px] focus:outline-none  focus:ring-transparent"
            >
              <SelectValue placeholder="Select your camera" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((item: { label: string; value: string }) => {
                return (
                  <SelectItem value={item?.value} key={item?.value}>
                    {item?.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}
      {isCameraGranted && ["granted", "prompt"]?.includes(state) && (
        <div className="p-5 relative w-full">
          {completed ? (
            <p className="text-[14px] font-[400] text-[#000] h-[45px]">
              {/* Your image has been deleted */}
            </p>
          ) : (
            <>
              <h4 className="text-[25px] leading-[24px]">
                {enrollOneFaProgress}%
              </h4>
              <p className="text-[14px] font-[200] text-[#555]">scanned</p>
            </>
          )}
        </div>
      )}
      <AllowCameraModal
        open={isModalOpen}
        toggle={() => setIsModalOpen(!isModalOpen)}
      />
    </>
  );
}

export default CameraComponent;
