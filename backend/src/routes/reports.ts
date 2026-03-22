import express, { type Request, type Response } from "express";
import { validationResult } from "express-validator";
import { authenticate } from "../middleware/auth/index.ts";
import { salesReportValidators } from "../middleware/validators/reportValidators.ts";
import { getVendorById, listSalesByDateRange } from "../models/database.ts";
import { renderExcelReport, renderPdfReport } from "../services/reportService.ts";

const router = express.Router();

router.post(
  "/sales",
  authenticate,
  salesReportValidators,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendorId = req.user?.id;
    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const vendor = await getVendorById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const startDate = req.body.startDate
      ? new Date(req.body.startDate as string).toISOString()
      : null;
    const endDate = req.body.endDate
      ? new Date(`${req.body.endDate}`).toISOString()
      : null;
    const fields = req.body.fields as string[];
    const sales = await listSalesByDateRange(vendorId, startDate, endDate);

    if (req.body.format === "pdf") {
      renderPdfReport(res, { vendor, sales, fields, startDate, endDate });
      return;
    }

    renderExcelReport(res, { vendor, sales, fields, startDate, endDate });
  }
);

export default router;
