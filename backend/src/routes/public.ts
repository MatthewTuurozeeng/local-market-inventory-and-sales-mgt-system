import express, { type Request, type Response } from "express";
import { getPublicStats } from "../services/publicStatsService.ts";

const router = express.Router();

router.get("/stats", async (_req: Request, res: Response) => {
  const stats = await getPublicStats();
  return res.json(stats);
});

export default router;
