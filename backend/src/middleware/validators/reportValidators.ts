import { body } from "express-validator";

// the salesReportValidators array defines a set of validation rules for the sales report generation endpoint.
// it checks that the optional startDate and endDate fields, if provided, are valid ISO 8601 date strings. 
// it also validates that the required format field is either "pdf" or "xlsx", and that the fields field is a non-empty array.
const salesReportValidators = [
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  body("format").isIn(["pdf", "xlsx"]),
  body("fields").isArray({ min: 1 }),
];

export { salesReportValidators };
