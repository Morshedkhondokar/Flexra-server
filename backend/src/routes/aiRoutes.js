import express from "express";
import { handleChat } from "../controllers/aiController.js";

const aiRouter = express.Router();

// POST endpoint for the AI Chatbot
aiRouter.post("/chat", handleChat);

export default aiRouter;
