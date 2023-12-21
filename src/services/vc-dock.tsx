import {
  AUTH_VERIFICATION_ID,
  privateIdDomain,
  PROOF_TEMPLATE_ID,
} from "../constant/vc-dock";
import axiosInt from "./orchestration";

const issueCredentials = async (
  userId: string,
  fullInformation: boolean = false
) => {
  try {
    const response = await axiosInt.post(`/v2/users/vc/credentials/${userId}`, {
      fullInformation,
    });
    return response;
  } catch (e) {
    return e;
  }
};

const verifyCredentials = async (userId: string) => {
  try {
    const response = await axiosInt.get(`/v2/users/vc/verify/${userId}`);
    return response;
  } catch (e) {
    return e;
  }
};

const generateDidForUser = async () => {
  try {
    const response = await axiosInt.post("/dids", { type: "key" });
    return response;
  } catch (e) {
    return e;
  }
};

const getCredentialDetails = async (userId: string) => {
  try {
    const response = await axiosInt.get(`/v2/users/vc/credentials/${userId}`);
    return response;
  } catch (e) {
    return e;
  }
};

const viewPDF = async (userId: string) => {
  try {
    const response = await axiosInt.get(`/v2/users/vc/pdf/${userId}`, {
      responseType: "blob",
    });
    return response;
  } catch (e) {
    return e;
  }
};

const deleteCredentials = async (credentialsId: string) => {
  try {
    const response = await axiosInt.delete(
      `/v2/users/vc/credentials/${credentialsId}`
    );
    return response;
  } catch (e) {
    return e;
  }
};

const createProofRequest = async () => {
  try {
    const response = await axiosInt.post(
      `/v2/users/vc/proof-request/${PROOF_TEMPLATE_ID}`,
      {
        domain: privateIdDomain,
      }
    );
    return response;
  } catch (e) {
    return e;
  }
};

const createAuthProofRequest = async () => {
  try {
    const response = await axiosInt.post(
      `/proof-templates/${AUTH_VERIFICATION_ID}/request`,
      {
        domain: privateIdDomain,
      }
    );
    return response;
  } catch (e) {
    return e;
  }
};

const createPresentations = async (payload: any) => {
  try {
    const response = await axiosInt.post("/v2/users/vc/presentations", payload);
    return response;
  } catch (e) {
    return e;
  }
};

const sendPresentationProofRequest = async (
  proofRequestId: string,
  payload: any
) => {
  try {
    const response = await axiosInt.post(
      `/v2/users/vc/proof-requests/${proofRequestId}/send-presentation`,
      payload
    );
    return response;
  } catch (e) {
    return e;
  }
};

const getAuthProofRequest = async (authProofRequestId: string) => {
  try {
    const response = await axiosInt.post(
      `/v2/users/vc/auth-proof-request/${authProofRequestId}`
    );
    return response;
  } catch (e) {
    return e;
  }
};

export {
  issueCredentials,
  verifyCredentials,
  generateDidForUser,
  viewPDF,
  getCredentialDetails,
  createProofRequest,
  createPresentations,
  sendPresentationProofRequest,
  deleteCredentials,
  createAuthProofRequest,
  getAuthProofRequest,
};
