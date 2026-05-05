import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.js";
import { createUser } from "../controllers/user.controller.js";

const authRouter = Router();

authRouter.post("/auth/login", loginUser);
authRouter.post("/auth/register", createUser);
export default authRouter;
