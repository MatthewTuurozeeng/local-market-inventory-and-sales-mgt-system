import express, { type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { MAX_UPLOAD_BYTES, cleanupUnusedUploads } from "./utils/uploads.ts";
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
import settingsRoutes from "./routes/settings.ts";
import { listVendorMediaUrls } from "./models/database.ts";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/local-market";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
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
app.use("/api/settings", settingsRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error(err);

  // Handle multer file size limit errors explicitly so the client receives
  // a clear 4xx response instead of a generic 500. Multer emits a
  // MulterError or sets err.code === 'LIMIT_FILE_SIZE'.
  if (err instanceof multer.MulterError || err?.code === "LIMIT_FILE_SIZE") {
    const mb = Math.round((MAX_UPLOAD_BYTES / (1024 * 1024)) * 100) / 100;
    return res.status(413).json({ message: `File too large. Maximum allowed size is ${mb}MB.` });
  }

  res.status(500).json({ message: "Server error" });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("MongoDB connected");
    const runCleanup = async () => {
      const usedUrls = await listVendorMediaUrls();
      await cleanupUnusedUploads(usedUrls);
    };

    runCleanup();
    setInterval(runCleanup, 1000 * 60 * 60 * 6);
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
