import axios from "axios";
import { serverBaseURL } from "../config/config";
import { getAccessTokenFromLocalStorage } from "../services/LocalStorageService";
import { toast } from "react-toastify";

export const axiosInstance = axios.create({
  baseURL: serverBaseURL,
});

axiosInstance.interceptors.request.use(
  function (config) {
    // header request ko add karna hai
    // console.log(config);
    // console.log(getLoginData());
    // console.log(getAccessTokenFromLocalStorage());

    const accessToken = getAccessTokenFromLocalStorage();

    if (accessToken) {
      config.headers["Authorization"] = "Bearer " + accessToken;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response Axios Helper: ", response);
    return response;
  },
  (error) => {
    console.log("Error Axios Helper: ", error);
    if (error.code === "ERR_NETWORK") {
      toast.error(
        "Network Error, Your backend is down. Please try again later."
      );
    }

    return Promise.reject(error);
  }
);
