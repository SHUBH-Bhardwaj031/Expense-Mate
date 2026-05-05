import Expense from "../models/expense.js";
import mongoose from "mongoose";

export const getExpenseData = async (userId) => {
  console.log("Getting data");

  const userObjectId = new mongoose.Types.ObjectId(userId);

  // 🔥 FIXED DATE RANGE (LAST 7 DAYS CORRECT)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  // =========================
  // TOTAL (CURRENT WEEK)
  // =========================
  const total = await Expense.aggregate([
    {
      $match: {
        userId: userObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$rs" },
      },
    },
  ]);

  // =========================
  // PREVIOUS WEEK
  // =========================
  const prevEnd = new Date(startDate);
  prevEnd.setDate(prevEnd.getDate() - 1);

  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - 6);

  const totalP = await Expense.aggregate([
    {
      $match: {
        userId: userObjectId,
        createdAt: { $gte: prevStart, $lte: prevEnd },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$rs" },
      },
    },
  ]);

  // =========================
  // PAYMENT METHOD
  // =========================
  const topPaymentMethodUsed = await Expense.aggregate([
    {
      $match: {
        userId: userObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        amount: { $sum: "$rs" },
      },
    },
    { $sort: { amount: -1 } },
  ]);

  // =========================
  // DAILY BREAKDOWN
  // =========================
  const breakdown = await Expense.aggregate([
    {
      $match: {
        userId: userObjectId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        amount: { $sum: "$rs" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // =========================
  // RECENT
  // =========================
  const recent = await Expense.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title description rs createdAt paymentMethod");

  return {
    // 🔥 IMPORTANT FIX
    totalForTheWeek: total[0]?.total || 0,
    totalPreviousWeek: totalP[0]?.total || 0,

    paymentMethodBreakdown: topPaymentMethodUsed.map((item) => ({
      name: item._id,
      amount: item.amount,
    })),

    dailyBreakdown: breakdown.map((item) => ({
      date: item._id,
      amount: item.amount,
    })),

    recentTransactions: recent,
  };
};