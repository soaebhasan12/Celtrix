const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

const mongoUri: string | undefined = process.env.MONGO_URI;
const port: number = Number(process.env.PORT) || 5000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Connect to MongoDB and start server
if (!mongoUri || mongoUri === "your_mongodb_uri_here") {
  console.warn("⚠️  No Mongo URI provided. Skipping DB connection. You can set it in .env later.");
  app.listen(port, () => console.log(`Server running without DB on port ${port}`));
} else {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("✅ MongoDB connected");
      app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
    })
    .catch((err: Error) => {
      console.error("❌ MongoDB connection failed:", err.message);
      app.listen(port, () => console.log(`Server running without DB on port ${port}`));
    });
}
