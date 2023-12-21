import { useEffect, useState } from "react";
import { detect } from "detect-browser";

const browser = detect();

const useCameraPermissions = (callback?: (arg0: boolean) => any) => {
  const [isCameraGranted, setIsCameraGranted] = useState(false);
  const [state, setState] = useState<string>();
  const checkCameraPermissions = async () => {
    try {
      const result = await navigator.permissions.query({
        name: "camera",
      } as any);
      // console.log(result, "result");
      setState(result?.state);
      if (result.state === "granted") {
        setIsCameraGranted(true);
      } else {
        await getUserMedia(setIsCameraGranted, callback);
      }
      // Don't do anything if the permission was denied.
    } catch (e) {
      await getUserMedia(setIsCameraGranted, callback);
    }
  };
  useEffect(() => {
    if (browser?.name === "firefox") {
      getUserMedia(setIsCameraGranted, callback);
    } else {
      checkCameraPermissions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { isCameraGranted, state };
};

const getUserMedia = (
  setIsCameraGranted: (arg0: boolean) => void,
  callback?: (arg0: boolean) => any
) =>
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      setIsCameraGranted(true);
    })
    .catch(function (err) {
      setIsCameraGranted(false);
      callback?.(false);
    });

export default useCameraPermissions;
