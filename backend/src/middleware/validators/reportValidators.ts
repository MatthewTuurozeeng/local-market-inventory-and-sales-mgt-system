import { body } from "express-validator";

const salesReportValidators = [
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("format").isIn(["pdf", "xlsx"]),
  body("fields").isArray({ min: 1 }),
];

export { salesReportValidators };
