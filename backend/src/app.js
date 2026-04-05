import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


// auth routes
app.use("/api/auth", authRouter);


app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

export default app;
