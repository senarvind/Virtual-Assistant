import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.router.js";
import geminiResponse from "./gemini.js";

dotenv.config();

const app = express();

// ✅ CORS setup for React frontend
app.use(cors({
  origin: "https://virtualassistant-hay9.onrender.com",
  credentials: true
}));

// ✅ Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Get port from .env or default to 5000
const port = process.env.PORT || 5000;

// ✅ Connect DB first, then start server
connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server started on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });
