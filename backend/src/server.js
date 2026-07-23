import dotenv from "dotenv";
dotenv.config();


console.log("API KEY:", process.env.GEMINI_API_KEY);

import express from "express";
import expenseRouter from "./routes/expense.route.js";
import userRouter from "./routes/user.route.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { notFount, errorHandler } from "./errors/error.js";
import connectDb from "./config/db.js";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import aiRouter from "./routes/ai.route.js";

const app = express();

// DB connect
connectDb();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://expense-mate-sage.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// JSON parser
app.use(express.json());

// Routes
app.use("/api", authRouter);

// Auth middleware
app.use(authMiddleware);

app.use("/api", expenseRouter);
app.use("/api", userRouter);
app.use("/api", aiRouter);

// Error handlers
app.use(notFount);
app.use(errorHandler);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to expense backend.",
  });
});

// Server start
app.listen(8081, () => {
  console.log("Server started on port 8081");
});