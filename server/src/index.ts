import express from "express";
import cors from "cors";
import { config } from "dotenv";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/orders";
import userRoutes from "./routes/users";
import { errorHandler } from "./middleware/error-handler";
import prisma from "./config/database";

// Load environment variables
config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(errorHandler as express.ErrorRequestHandler);

// Health check route
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok" });
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Handle graceful shutdown
// process.on("SIGTERM", async () => {
//   console.log("SIGTERM received, shutting down gracefully");
//   server.close(async () => {
//     await prisma.$disconnect();
//     console.log("Server closed");
//     process.exit(0);
//   });
// });

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Connected to database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();

// export { app, prisma };
