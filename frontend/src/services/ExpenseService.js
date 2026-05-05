import { serverBaseURL } from "../config/config";
import axios from "axios";
import { axiosInstance } from "../utils/AxiosHelper";

// get all expenses + filters
export const getExpenses = async (minPrice = "", maxPrice = "") => {
  const response = await axiosInstance.get(
    `/expenses?minPrice=${minPrice}&maxPrice=${maxPrice}`
  );

  return response.data;
};

//creating expense

export const createExpense = async (expenseData) => {
  const response = await axiosInstance.post(`/expenses`, expenseData);

  return response.data;
};

//delete expense
export const deleteExpense = async (expenseId) => {
  const response = await axiosInstance.delete(`/expenses/${expenseId}`);
  return response.data;
};

// update expense
export const updateExpense = async (expenseId, expenseData) => {
  const response = await axiosInstance.put(`/expenses/${expenseId}`, expenseData);
  return response.data;
};
