import { useState } from "react";
// import { openCamera } from "@privateid/cryptonets-web-sdk";
import { openCamera } from "@privateid/ping-oidc-web-sdk-alpha";
import { isIphoneCC, isMobile, mapDevices } from "../utils";
import { CameraFaceMode } from "@privateid/ping-oidc-web-sdk-alpha/dist/types";


const useCamera = (
  element = "userVideo",
  requestFaceMode: CameraFaceMode = CameraFaceMode.front,
  requireHD = false,
  onCameraFail = () => {},
  isDocumentScan = false,
  canvasResolution: { width: number; height: number } | null = null
): {
  init: () => Promise<void>;
  devices: Array<{ label: string; value: string }>;
  ready: boolean;
  faceMode: any;
  device: string;
  setDevice: (value: ((prevState: string) => string) | string) => void;
  settings?: any;
  capabilities?: any;
} => {
  // Initialize the state
  const [ready, setReady] = useState(false);
  const [devices, setDevices] = useState<
    Array<{ label: string; value: string }>
  >([]);
  const [device, setDevice] = useState("");
  const [faceMode, setFaceMode] = useState<any>(null);
  const [cameraFeatures, setCameraFeatures] = useState({});
  const enableHDMode = requireHD;
  const init = async () => {
    if (ready) return;
    try {
      const {
        devices = [],
        faceMode,
        settings,
        capabilities,
      } = await openCamera(
        element,
        enableHDMode,
        null,
        requestFaceMode,
        canvasResolution,
        isDocumentScan && isMobile
      );
      console.log({ settings, capabilities });
      if (isIphoneCC(capabilities)) {
        await setResolutionForIphoneCC();
      }

      setCameraFeatures({ settings, capabilities });
      setFaceMode(faceMode);
      if (Array.isArray(devices) && devices?.length > 0) {
        const selectedDevice = devices.find(
          (device) =>
            device.deviceId === settings?.deviceId ||
            device.groupId === settings?.groupId
        );
        const options = devices?.map(mapDevices);
        setDevices(options);
        setDevice(selectedDevice?.deviceId as string);
      }

      if (devices?.length === 0) {
        onCameraFail();
      } else {
        setReady(true);
      }
    } catch (e) {
      onCameraFail();
      console.log("Error Message", e);
    }
  };

  return {
    ready,
    init,
    devices,
    device,
    setDevice,
    faceMode,
    ...cameraFeatures,
  };
};

export const setResolutionForIphoneCC = async () => {
  const video = document.getElementById("userVideo") as any;
  const mediaStream = video.srcObject;
  const track = await mediaStream.getTracks()[0];
  const capabilities = track.getCapabilities() ? track.getCapabilities() : null;
  if (
    capabilities &&
    capabilities?.height?.max === 1440 &&
    capabilities?.width?.max === 1920
  ) {
    await track.applyConstraints({
      advanced: [
        {
          width: 1920,
          height: 1440,
        },
      ],
    });
  }
};

export default useCamera;
