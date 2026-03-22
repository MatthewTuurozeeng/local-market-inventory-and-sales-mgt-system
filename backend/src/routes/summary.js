import express from "express";
import { authenticate } from "../auth.js";
import { getSalesSummary } from "../db/database.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const summary = await getSalesSummary(req.user.id);
  return res.json({ summary });
});

export default router;
