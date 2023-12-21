import { PASSKEY_BASE_URL } from "../constant";

export const generateRegistrationOptions = async (uuid: string) => {
  try {
    const response = await fetch(
      PASSKEY_BASE_URL + "/generate-registration-options",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ uuid: uuid }),
      }
    );
    const opts = await response.json();
    return opts;
  } catch (error) {
    return error;
  }
};

export const verifyRegistration = async ({ attResp, uuid }: any) => {
  const verificationResp = await fetch(
    PASSKEY_BASE_URL + "/verify-registration",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ data: attResp, uuid: uuid }),
    }
  );

  const verificationJSON = await verificationResp.json();
  return verificationJSON;
};

export const generateAuthenticationOptions = async (uuid: string) => {
  try {
    const response = await fetch(
      PASSKEY_BASE_URL + "/generate-authentication-options",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ uuid: uuid }),
      }
    );
    const opts = await response.json();
    return opts;
  } catch (error) {
    return error;
  }
};

export const verifyAuthentication = async ({ asseResp, uuid }: any) => {
  const verificationResp = await fetch(
    PASSKEY_BASE_URL + "/verify-authentication",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ data: asseResp, uuid: uuid }),
    }
  );

  const verificationJSON = await verificationResp.json();
  return verificationJSON;
};
