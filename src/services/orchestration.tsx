import axios from "axios";

const axiosInt = axios.create({
  baseURL: process.env.REACT_APP_API_ORCHESTRATION,
  headers: {
    x_api_key: process.env.REACT_APP_API_KEY ?? "0000000000000000test",
  },
});

// Initialize the dynamic baseURL
export async function initializeBaseURL(dynamicBaseURL?: string) {
  axiosInt.defaults.baseURL =
    dynamicBaseURL ||
    process.env.REACT_APP_API_ORCHESTRATION ||
    "https://api-orchestration.cams.devel.private.id/";
}

axiosInt.interceptors.request.use(
  async (config) => {
    config.headers.authorization = "";
    return Promise.resolve(config);
  },
  (error) => Promise.reject(error)
);

axiosInt.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error.response);
  }
);

export default axiosInt;
