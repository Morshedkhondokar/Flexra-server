import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController.js";

const authRouter = Router();


// POST /api/auth/register
authRouter.post("/register", registerUser);

// POST /api/auth/login
authRouter.post("/login", loginUser);

// Get /api/auth/logout
authRouter.get("/logout", logoutUser);

export default authRouter;

