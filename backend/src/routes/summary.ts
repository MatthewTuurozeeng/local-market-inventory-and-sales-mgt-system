import express, { type Request, type Response } from "express";
import { authenticate } from "../middleware/auth/index.ts";
import { getSalesSummary } from "../models/database.ts";

const router = express.Router();

router.get("/", authenticate, async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const summary = await getSalesSummary(vendorId);
  return res.json({ summary });
});

export default router;
