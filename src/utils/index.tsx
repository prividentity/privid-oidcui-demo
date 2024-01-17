import { FAILURE, REQUIRES_INPUT, SUCCESS } from "../constant";
import Platform from "platform";
import { getUserPortrait } from "../services/api";

export const isIOS = Platform?.os?.family === "iOS";
export const API_KEY = "0000000000000000test";
export const osVersion = Number(Platform?.os?.version);
export const isAndroid = Platform?.os?.family === "Android";
export const isMobile = isIOS || isAndroid;
export function getUrlParameter(sParam: string, defaultValue: null | string) {
  const sPageURL = window.location.search.substring(1);
  const sURLVariables = sPageURL.split("&");
  let sParameterName;
  let i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split("=");

    if (sParameterName[0] === sParam) {
      return typeof sParameterName[1] === undefined
        ? defaultValue
        : decodeURIComponent(sParameterName[1]);
    }
  }
  return defaultValue;
}

export const isIphoneCC = (capabilities: MediaTrackCapabilities | null) =>
  capabilities &&
  capabilities?.height?.max === 1440 &&
  capabilities?.width?.max === 1920;

export const mapDevices = (devices: { label: string; deviceId: string }) => ({
  label: devices.label,
  value: devices.deviceId,
});

export const isBackCamera = (
  availableDevices: Array<{ value: string; label: string }>,
  currentDevice: string
) => {
  const mediaDevice = availableDevices.find(
    (device) => device.value === currentDevice
  );
  return mediaDevice?.label?.toLowerCase().includes("back");
};

export const stopCamera = (): void => {
  const videoEl: any = document.getElementById("userVideo");
  // now get the steam
  const stream = videoEl?.srcObject;
  // now get all tracks
  const tracks = stream?.getTracks();
  // now close each track by having forEach loop
  tracks?.forEach((track: MediaStreamTrack) => {
    // stopping every track
    track.stop();
  });
  // assign null to srcObject of video
  if (videoEl) {
    videoEl.srcObject = null;
  }
};

export const getScanFrontColor = (status: number) => {
  switch (status) {
    case 10:
    case 0:
      return "rgb(21, 182, 124)";
    case 12:
      return "";
    case -1:
      return "#000";
    case 18:
      return "#000";
    case 3:
      return "rgb(21, 182, 124)";
    // case 4:
    //   return "MOVE JUST A LITTLE CLOSER";
    case 7:
    case 9:
      return "rgba(246,62,62,.4392156862745098)";
    case -2:
      return "rgba(246,62,62,.4392156862745098)";
    case 5:
    case 6:
    case 8:
      return "#000";
    default:
      return "#000";
  }
};

const WEB_CANVAS_SIZE = {
  "10K": { width: 10240, height: 4320 },
  "8K": { width: 7680, height: 4320 },
  "5K": { width: 5120, height: 2880 },
  "4K": { width: 4096, height: 2160 },
  "2K": { width: 2560, height: 1440 },
  FHD: { width: 1920, height: 1080 },
  iPhoneCC: { width: 1920, height: 1440 },
  UXGA: { width: 1600, height: 1200 },
  SXGA: { width: 1280, height: 1024 },
  SXGA2: { width: 1280, height: 960 },
};

const MOBILE_CANVAS_SIZE = {
  "2K": { width: 2560, height: 1440 },
  FHD: { width: 1920, height: 1080 },
  UXGA: { width: 1600, height: 1200 },
  SXGA: { width: 1280, height: 1024 },
  SXGA2: { width: 1280, height: 960 },
};

export const CANVAS_SIZE: any = isMobile ? MOBILE_CANVAS_SIZE : WEB_CANVAS_SIZE;

export const convertLinkToImageData = (link: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const newImg = new Image();
    newImg.crossOrigin = "anonymous";
    newImg.src = link;

    newImg.onload = () => {
      const imgSize = {
        w: newImg.width,
        h: newImg.height,
      };
      const canvas = document.createElement("canvas");
      canvas.setAttribute("height", `${imgSize.h}`);
      canvas.setAttribute("width", `${imgSize.w}`);
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject("Could not get 2D context");
        return;
      }

      ctx.drawImage(newImg, 0, 0);
      const enrollImage = ctx.getImageData(0, 0, imgSize.w, imgSize.h);
      resolve(enrollImage);
    };

    newImg.onerror = () => {
      reject("Error loading image");
    };
  });
};

export function getStatusFromUser(user: any) {
  const { userApproved, requestScanID, requestResAddress, requestSSN9 } =
    user || {};
  if (userApproved === true) {
    return SUCCESS;
  } else if (requestResAddress || requestSSN9 || requestScanID) {
    return REQUIRES_INPUT;
  }
  return FAILURE;
}

export enum AdditionalRequirementsEnum {
  requestSSN9 = "requestSSN9",
  requestResAddress = "requireResAddress",
  requestScanID = "requestScanID",
}

export enum additionalRequirementsEnum {
  REQUEST_SSN9 = "requestSSN9",
  REQUEST_SSN4 = "requestSSN4",
  REQUEST_RES_ADDRESS = "requestResAddress",
  REQUEST_SCAN_ID = "requestScanID",
}

export const getFirstRequirement = async (
  additionalRequirements: any,
  context: any
) => {
  if (
    additionalRequirements.includes(additionalRequirementsEnum.REQUEST_SSN9)
  ) {
    return AdditionalRequirementsEnum.requestSSN9;
  }
  if (
    additionalRequirements.includes(
      additionalRequirementsEnum.REQUEST_RES_ADDRESS
    )
  ) {
    return AdditionalRequirementsEnum.requestResAddress;
  }
  if (
    additionalRequirements.includes(additionalRequirementsEnum.REQUEST_SCAN_ID)
  ) {
    const userPortrait: any = await getUserPortrait(context?.tokenParams);
    const enrollImageData = await convertLinkToImageData(
      userPortrait.imagedata
    );
    context.setUser({ ...context.user, enrollImageData });
    return AdditionalRequirementsEnum.requestScanID;
  }
  return null;
};

export const getProjectFromURL = (): any => {
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);
  var themeValue = urlParams.get("theme");
  return themeValue;
};

export const formateDate = (dateString: string) => {
  if (!dateString) return '-'
  const dateObject = new Date(dateString);

  // Extracting components of the date
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Months are zero-based, so we add 1
  const day = dateObject.getDate();
  return day + '/' + month + '/' + year
};
