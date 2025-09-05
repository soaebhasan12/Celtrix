import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);

// Safe MongoDB connection for scaffold
if (!mongoURI || mongoURI === "your_mongodb_uri_here") {
  console.warn("⚠️  No Mongo URI provided. Skipping DB connection. You can set it in .env later.");
  app.listen(port, () => console.log(`Server running without DB on port ${port}`));
} else {
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log("MongoDB connected");
      app.listen(port, () => console.log(`Server running on port ${port}`));
    })
    .catch((err) => {
      console.error("MongoDB connection failed:", err.message);
      app.listen(port, () => console.log(`Server running without DB on port ${port}`));
    });
}
