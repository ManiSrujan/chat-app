import axios from "axios";
import { ENV_CONFIG_KEY } from "../env-config/constants";
import { getEnvConfig } from "../env-config/envConfig";

const restClient = axios.create();

// Add a request interceptor to include the accessToken in the Authorization header
restClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle token refresh
restClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Refresh token not available");
        }

        const refreshResponse = await axios.post(
          `${getEnvConfig(ENV_CONFIG_KEY.API)}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken } = refreshResponse.data;
        localStorage.setItem("accessToken", accessToken);

        // Update the Authorization header and retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return restClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/"; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default restClient;
