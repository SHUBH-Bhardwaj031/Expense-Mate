import { Router } from "express";
import {
  createExpense,
  deleteExpense,
  getExpense,
  getExpenses,
  searchByTitle,
  updateExpense,
  getDashboardData,
  getDeletedExpenses,
  restoreExpense,
  permanentDeleteExpense,
} from "../controllers/expense.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const expenseRouter = Router();

// 🔥 ALL ROUTES PROTECTED

expenseRouter.get("/expenses", authMiddleware, getExpenses);

expenseRouter.get("/expenses/search", authMiddleware, searchByTitle);

expenseRouter.get("/expenses/:expenseId", authMiddleware, getExpense);

expenseRouter.post("/expenses", authMiddleware, createExpense);

expenseRouter.delete("/expenses/:expenseId", authMiddleware, deleteExpense);

expenseRouter.put("/expenses/:expId", authMiddleware, updateExpense);

expenseRouter.get("/dashboard", authMiddleware, getDashboardData);

// 🔥 RECYCLE BIN
expenseRouter.get("/expenses/deleted", authMiddleware, getDeletedExpenses);

expenseRouter.put("/expenses/restore/:expenseId", authMiddleware, restoreExpense);

expenseRouter.delete("/expenses/permanent/:expenseId", authMiddleware, permanentDeleteExpense);

export default expenseRouter;