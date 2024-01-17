export const States = [
  { label: "Alabama", abbreviation: "AL" },
  { label: "Alaska", abbreviation: "AK" },
  { label: "Arizona", abbreviation: "AZ" },
  { label: "Arkansas", abbreviation: "AR" },
  { label: "California", abbreviation: "CA" },
  { label: "Colorado", abbreviation: "CO" },
  { label: "Connecticut", abbreviation: "CT" },
  { label: "Delaware", abbreviation: "DE" },
  { label: "Florida", abbreviation: "FL" },
  { label: "Georgia", abbreviation: "GA" },
  { label: "Hawaii", abbreviation: "HI" },
  { label: "Idaho", abbreviation: "ID" },
  { label: "Illinois", abbreviation: "IL" },
  { label: "Indiana", abbreviation: "IN" },
  { label: "Iowa", abbreviation: "IA" },
  { label: "Kansas", abbreviation: "KS" },
  { label: "Kentucky", abbreviation: "KY" },
  { label: "Louisiana", abbreviation: "LA" },
  { label: "Maine", abbreviation: "ME" },
  { label: "Maryland", abbreviation: "MD" },
  { label: "Massachusetts", abbreviation: "MA" },
  { label: "Michigan", abbreviation: "MI" },
  { label: "Minnesota", abbreviation: "MN" },
  { label: "Mississippi", abbreviation: "MS" },
  { label: "Missouri", abbreviation: "MO" },
  { label: "Montana", abbreviation: "MT" },
  { label: "Nebraska", abbreviation: "NE" },
  { label: "Nevada", abbreviation: "NV" },
  { label: "New Hampshire", abbreviation: "NH" },
  { label: "New Jersey", abbreviation: "NJ" },
  { label: "New Mexico", abbreviation: "NM" },
  { label: "New York", abbreviation: "NY" },
  { label: "North Carolina", abbreviation: "NC" },
  { label: "North Dakota", abbreviation: "ND" },
  { label: "Ohio", abbreviation: "OH" },
  { label: "Oklahoma", abbreviation: "OK" },
  { label: "Oregon", abbreviation: "OR" },
  { label: "Pennsylvania", abbreviation: "PA" },
  { label: "Rhode Island", abbreviation: "RI" },
  { label: "South Carolina", abbreviation: "SC" },
  { label: "South Dakota", abbreviation: "SD" },
  { label: "Tennessee", abbreviation: "TN" },
  { label: "Texas", abbreviation: "TX" },
  { label: "Utah", abbreviation: "UT" },
  { label: "Vermont", abbreviation: "VT" },
  { label: "Virginia", abbreviation: "VA" },
  { label: "Washington", abbreviation: "WA" },
  { label: "West Virginia", abbreviation: "WV" },
  { label: "Wisconsin", abbreviation: "WI" },
  { label: "Wyoming", abbreviation: "WY" },
];

export const CameraConfig = {
  elementId: "userVideo",
  mode: "front",
  requireHD: false,
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ELEMENT_ID = "userVideo";
export const FLOW = {
  CREATE_USER: 1,
  UPLOAD_SELFIE: 2,
  UPLOAD_DOC_FRONT: 3,
  UPLOAD_DOC_BACK: 4,
};

export const SUCCESS = "SUCCESS";
export const FAILURE = "FAILURE";
export const REQUIRES_INPUT = "REQUIRES_INPUT";
export const REMOVE_GLASSES = "Remove glasses";
export const ERROR = "error";
export const PASSKEY_BASE_URL = "https://simplewebauthn.privateid.com";
export const ECHO = "echo";
export const TELE = "tele";
export const AUTHENTICATION_FAILED = "Authentication failed!";
export const ACCOUNT_CREATION_FAILED = "Account Creation Failed";
export const ACCOUNT_NOT_APPROVED = "Your account is not approved.";
export const UNABLE_TO_VERIFY = "Unable to Verify Credentials.";

export const ENROLL_CANVAS_RESOLUTION = {width: 1920, height: 1080};
export const IPAPI_API  = 'https://ipapi.co/json/'
export const PIN = "9999";