import { Router } from "express";
import {
  listUser,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const userRouter = Router();

//list user
userRouter.get("/users", listUser);
userRouter.get("/users/:userId", getUser);
userRouter.post("/users", createUser);
userRouter.put("/users/:userId", updateUser);
userRouter.delete("/users/:userId", deleteUser);
export default userRouter;
