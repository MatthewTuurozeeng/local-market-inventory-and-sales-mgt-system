import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.ts";
import vendorRoutes from "./routes/vendors.ts";
import productRoutes from "./routes/products.ts";
import salesRoutes from "./routes/sales.ts";
import summaryRoutes from "./routes/summary.ts";
import reportRoutes from "./routes/reports.ts";
import publicRoutes from "./routes/public.ts";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/local-market";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "Vendor API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/public", publicRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Vendor API listening on ${PORT}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("MongoDB connection failed", error);
    process.exit(1);
  });
