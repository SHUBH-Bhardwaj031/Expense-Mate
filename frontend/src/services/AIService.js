import { axiosInstance } from "../utils/AxiosHelper.js";

export const getDashboardData = async () => {
  try {
    const response = await axiosInstance.get("/dashboard");
    return response.data;
  } catch (error) {
    console.log("Dashboard API Error:", error);
    throw error;
  }
};