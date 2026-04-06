import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import routes
import authRouter from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import aiRouter from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());


// auth routes
app.use("/api/auth", authRouter);

// product routes
app.use("/api/products", productRouter);

// ai routes
app.use("/api/ai", aiRouter);


app.get("/", (req, res) => {
  res.send("Server is working 🚀");
});

export default app;
