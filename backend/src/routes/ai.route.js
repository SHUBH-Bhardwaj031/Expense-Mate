import { Router } from "express";
import {chatWithAi, getSuggestions} from "../controllers/ai.controller.js";

const aiRouter = Router();

aiRouter.post("/ai/suggestions", getSuggestions);
aiRouter.get("/ai/chat",chatWithAi)
export default aiRouter;
