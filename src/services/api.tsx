import identityAPI from "./orchestration";
import cryptonetsAPI from "./index";

export const updateDocumentUploadIdWithSession = async ({
  sessionToken,
  documentId,
  content,
}: {
  sessionToken: string;
  documentId: string;
  content: any;
}) => {
  try {
    const result = await identityAPI.put(
      `/v2/verification-session/${sessionToken}/document/${documentId}`,
      { content }
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const verifyTokenApi = async (id: any) => {
  try {
    const result = await identityAPI.get(`/v2/verification-session/${id}`);
    return result;
  } catch (err) {
    return err;
  }
};

export const getUserPortrait = async (token: any) => {
  try {
    const type = "portrait";

    const result = await identityAPI.get(
      `/v2/verification-session/${token}/img/${type}`
    );
    return result;
  } catch (err) {
    return err;
  }
};

export const getUser = async (payload: any) => {
  try {
    const result = await identityAPI.post(`/v2/users/get`, payload);
    return result;
  } catch (err) {
    return err;
  }
};

export const sendMessage = async (payload: any) => {
  try {
    const result = await cryptonetsAPI.post(`/user/communicate`, payload);
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
