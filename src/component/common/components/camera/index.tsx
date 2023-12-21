import { useEffect, useRef, useState } from "react";
import useCameraPermissions from "../../../../hooks/useCameraPermissions";
import cameraIcon from "../../../assets/cameraIcon.svg";
import deniedCameraIcon from "../../../assets/deniedCamera.svg";
import { Button } from "../../../ui/button";
import completedCheck from "../../../assets/completedCheck.gif";
import infoIcon from "../../../assets/infoIcon.svg";
import { AllowCameraModal } from "../allowCameraModal";
import useWasm from "../../../../hooks/useWasm";
import useCamera from "../../../../hooks/useCamera";
import { CameraConfig } from "../../../../constant";
import { switchCamera } from "@privateid/cryptonets-web-sdk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";

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
  } = props;
  const canvasRef = useRef<null | HTMLCanvasElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [minimizeCamera, setMinimizeCamera] = useState(false);
  const [blur, setBlur] = useState(false);
  const [smallCircle, setSmallCircle] = useState(false);
  const [drawAnimationStart, setDrawAnimationStart] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [frontDlCompleted, setFrontDlCompleted] = useState(false);
  const [finishSlider, setFinishSlider] = useState(false);
  const [deviceId, setDeviceId] = useState<string>();
  const enrollOneFaProgress: any = progress || 0;
  const { isCameraGranted, state }: any = useCameraPermissions(() => {});

  useEffect(() => {
    setTimeout(() => {
      setFinishSlider(true);
    }, 2000);
  }, []);
  // Camera and Wasm init
  const onCameraFail = () => {};
  const cameraReady = () => {
    if (!faceCamera) {
      onCameraReady?.();
    }
  };
  const documentScan = frontDl || backDl || passportScan;
  const { ready: wasmReady, wasmStatus, init: wasmInit } = useWasm();
  const { ready, init, device, devices } = useCamera(
    CameraConfig?.elementId,
    CameraConfig?.mode as any,
    CameraConfig?.requireHD,
    onCameraFail,
    documentScan
  );
  useEffect(() => {
    if (device) {
      setDeviceId(device);
    }
  }, [device]);
  const handleWasmLoad = () => {
    if (!wasmReady && wasmStatus.isChecking) return;
    if (
      wasmReady &&
      !wasmStatus.isChecking &&
      wasmStatus.support &&
      finishSlider
    ) {
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
  }, [wasmReady, ready, wasmStatus, finishSlider]);
  // Camera and Wasm init end

  const onFaceCall = () => {
    setMinimizeCamera(true);
    setTimeout(() => {
      requestAnimationFrame(draw);
      setDrawAnimationStart(true);
    }, 2000);
  };

  const onFaceScan = () => {
    if (drawAnimationStart) {
      requestAnimationFrame(drawColor);
    }
    if (enrollOneFaProgress === 100 && message === "Enroll Success") {
      setBlur(true);
      setTimeout(() => {
        setSmallCircle(true);
        setTimeout(() => {
          setCompleted(true);
          onSuccess?.();
        }, 3000);
      }, 2000);
    }
  };

  const onFrontDlScan = () => {
    if (message === "Success" && scanCompleted) {
      setFrontDlCompleted(true);
      setTimeout(() => {
        setSmallCircle(true);
        setTimeout(() => {
          setCompleted(true);
          setTimeout(() => {
            onSuccess?.();
          }, 2000);
        }, 3000);
      }, 2000);
    }
  };

  const onBackDlScan = () => {
    if (message === "Success" && scanCompleted) {
      setTimeout(() => {
        setFrontDlCompleted(true);
        setTimeout(() => {
          setSmallCircle(true);
          setTimeout(() => {
            setCompleted(true);
          }, 2000);
        }, 2000);
      }, 2000);
    }
  };

  const onfaceLoginSuccess = () => {
    if (message === "Valid Image") {
      setFrontDlCompleted(true);
      setTimeout(() => {
        setSmallCircle(true);
        setBlur(true);
        setTimeout(() => {
          setCompleted(true);
          setTimeout(() => {
            onSuccess?.();
          }, 2000);
        }, 3000);
      }, 2000);
    }
  };

  useEffect(() => {
    if (faceCamera && isCameraGranted) {
      onFaceScan();
    } else if (faceLoginCamera && isCameraGranted) {
      onfaceLoginSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollOneFaProgress, message, faceLoginCamera, drawAnimationStart]);

  useEffect(() => {
    if (frontDl && isCameraGranted && scanCompleted) {
      onFrontDlScan();
    } else if (backDl && isCameraGranted && scanCompleted) {
      onBackDlScan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frontDl, message, backDl, scanCompleted]);

  const onFrontDlCall = () => {
    wasmInit();
  };

  const onBackDlCall = () => {
    wasmInit();
  };

  useEffect(() => {
    if (attempt === 1 && faceCamera && isCameraGranted) {
      onFaceCall();
    } else if (attempt === 1 && faceLoginCamera && isCameraGranted) {
      setMinimizeCamera(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, faceCamera, isCameraGranted]);
  useEffect(() => {
    if (isCameraGranted) {
      if (faceCamera) {
        onCameraReady?.();
      } else if (frontDl) {
        onFrontDlCall();
      } else if (backDl) {
        onBackDlCall();
      } else if (passportScan) {
        wasmInit();
        onCameraReady?.();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backDl, faceCamera, frontDl, isCameraGranted, passportScan]);

  // Example: Draw a dotted border with specified parameters
  function draw() {
    const canvas: any = canvasRef.current;
    if (canvas) {
      let ctx = canvas.getContext("2d");
      var centerX = canvas.width / 2 - 3;
      var centerY = canvas.height / 2 + 3;
      var radius = Math.min(canvas.width, canvas.height) / 2 - 3;
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = "#FFFFFF"; // or "white"
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX + 1, centerY - 1, radius, 0, 5 * Math.PI);
      ctx.stroke();
    }
  }

  const drawColor = () => {
    const canvas: any = canvasRef.current;

    if (canvas) {
      const ctx: any = canvas.getContext("2d");
      const centerX = canvas.width / 2 - 3;
      const centerY = canvas.height / 2 + 3;
      const radius = Math.min(canvas.width, canvas.height) / 2 - 3;
      const startAngle = -0.5 * Math.PI; // Start from the top
      if (enrollOneFaProgress === 0) {
        // Clear the canvas when enrollOneFaProgress is 0
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw();
        return;
      }
      const endAngle = startAngle + (enrollOneFaProgress / 100) * 2 * Math.PI;
      // Draw the filled portion with green color
      ctx.setLineDash([]); // Reset the line dash for a solid line
      ctx.strokeStyle = "#16b364"; // Green color
      ctx.lineWidth = 4; // Adjust the line width as needed
      ctx.beginPath();
      ctx.arc(centerX + 1, centerY - 1, radius, startAngle, endAngle);
      ctx.stroke();
    }
  };
  const onSwitchCamera = async (deviceID: any) => {
    setDeviceId(deviceID);
    await switchCamera(null, deviceID);
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
          {!smallCircle && minimizeCamera && (
            <canvas
              id="dottedBorderCanvas"
              ref={canvasRef}
              className="face-canvas !max-md:h-[343px]"
              width="310"
              height="310"
            />
          )}

          <div
            className={`bg-white w-full h-full face-camera-wrap overflow-hidden p-[3px] rounded-[5px] ${
              (frontDl || backDl) && smallCircle
                ? "small-circle-document"
                : smallCircle
                ? "small-circle"
                : minimizeCamera && "minimize-camera dotted-border"
            } ${blur && "blur-camera"} ${frontDlCompleted && "relative"}`}
          >
            {frontDlCompleted && <div className="greenOverlay" />}
            <video
              id="userVideo"
              muted
              autoPlay
              playsInline
              className={`w-full h-full object-cover ${
                (faceCamera || faceLoginCamera) && "face-camera"
              }`}
            />
          </div>
        </div>
      );
    }
  };
  return (
    <>
      {isCameraGranted && ["granted", "prompt"]?.includes(state) && (
        <>
          <h4 className="text-[25px] leading-[24px]  mt-[-30px] mb-[10px] max-md:text-[22px]">
            {(frontDl || backDl) && completed
              ? "Great! Capture successfully"
              : message
              ? message
              : faceCamera
              ? "Center your head in the frame"
              : frontDl
              ? "Position front of ID in the frame"
              : backDl
              ? "Position back of ID in frame"
              : ""}
          </h4>
        </>
      )}
      <div className="px-2 max-md:px-0 w-full">
        <div className="bg-[#0b101b] h-[380px] mt-[0px] rounded-[20px] flex flex-col items-center justify-center w-full max-md:h-[343px]">
          {completed ? (
            <img
              src={completedCheck}
              alt="completedCheck"
              className="w-full h-full object-contain"
            />
          ) : (
            renderContent()
          )}
        </div>
      </div>
      <div className="w-full flex justify-center mt-2 mr-4">
        <div>
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
      </div>

      {isCameraGranted && ["granted", "prompt"]?.includes(state) && (
        <div className="p-7 relative w-full max-md:absolute bottom-0 right-0">
          {completed ? (
            <p className="text-[14px] font-[400] text-[#000] h-[45px]">
              Your image has been deleted
            </p>
          ) : (
            <>
              <h4 className="text-[25px] leading-[24px]">
                {enrollOneFaProgress}%
              </h4>
              <p className="text-[14px] font-[200] text-[#555]">scanned</p>
            </>
          )}
          {/* <img
            src={infoIcon}
            alt="infoIcon"
            className="absolute right-[15px] bottom-[20px] cursor-pointer"
          /> */}
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
