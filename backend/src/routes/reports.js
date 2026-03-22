import express from "express";
import { body, validationResult } from "express-validator";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { authenticate } from "../auth.js";
import { getVendorById, listSalesByDateRange } from "../db/database.js";

const router = express.Router();

router.post(
  "/sales",
  authenticate,
  [
    body("startDate").optional().isISO8601(),
    body("endDate").optional().isISO8601(),
    body("format").isIn(["pdf", "xlsx"]),
    body("fields").isArray({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vendor = await getVendorById(req.user.id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const startDate = req.body.startDate
      ? new Date(req.body.startDate).toISOString()
      : null;
    const endDate = req.body.endDate
      ? new Date(`${req.body.endDate}T23:59:59.999Z`).toISOString()
      : null;
    const fields = req.body.fields;
    const sales = await listSalesByDateRange(req.user.id, startDate, endDate);

    const heading = `${vendor.businessName} • ${vendor.firstName} ${vendor.lastName}`;
    const totals = sales.reduce(
      (acc, sale) => ({
        revenue: acc.revenue + Number(sale.total),
        units: acc.units + Number(sale.quantity),
        count: acc.count + 1,
      }),
      { revenue: 0, units: 0, count: 0 }
    );

    if (req.body.format === "pdf") {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const filename = `sales-report-${Date.now()}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);

      doc.pipe(res);

      const pageWidth = doc.page.width;
      const leftMargin = doc.page.margins.left;
      const rightMargin = doc.page.margins.right;
      const contentWidth = pageWidth - leftMargin - rightMargin;

      doc.save();
      doc.rotate(-30, { origin: [pageWidth / 2, doc.page.height / 2] });
      doc.fontSize(46).fillColor("#f0f0f0").text(heading, 0, 220, {
        align: "center",
        width: pageWidth,
      });
      doc.restore();
      doc.fillColor("black");

      doc.font("Helvetica-Bold").fontSize(20).text("Sales Report", {
        align: "left",
      });
      doc.moveDown(0.2);
      doc.font("Helvetica").fontSize(11).fillColor("#6b6b6b").text(heading);
      doc.fillColor("black");
      doc.moveDown(0.4);
      doc.fontSize(10).text(`Period: ${startDate || "Any"} → ${endDate || "Any"}`);
      doc.moveDown(0.8);

      const summaryTop = doc.y;
      doc.roundedRect(leftMargin, summaryTop, contentWidth, 70, 8).stroke("#d7d7d7");
      doc.font("Helvetica-Bold").fontSize(12).text("Summary", leftMargin + 12, summaryTop + 10);
      doc.font("Helvetica").fontSize(11);
      doc.text(`Total sales: ${totals.count}`, leftMargin + 12, summaryTop + 32);
      doc.text(`Units sold: ${totals.units}`, leftMargin + 200, summaryTop + 32);
      doc.text(`Total revenue: ${totals.revenue}`, leftMargin + 350, summaryTop + 32);
      doc.moveDown(3.5);

      const tableHeaders = fields.map((field) => field.toUpperCase());
      const tableTop = doc.y + 10;
      const columnWidths = tableHeaders.map((header) =>
        header === "PRODUCT" ? 140 : header === "CATEGORY" ? 110 : 90
      );

      doc.font("Helvetica-Bold").fontSize(10);
      let xPosition = leftMargin;
      tableHeaders.forEach((header, index) => {
        doc.text(header, xPosition, tableTop, {
          width: columnWidths[index],
          align: "left",
        });
        xPosition += columnWidths[index];
      });

      doc.moveTo(leftMargin, tableTop + 16)
        .lineTo(leftMargin + contentWidth, tableTop + 16)
        .strokeColor("#d0d0d0")
        .stroke();

      doc.font("Helvetica").fontSize(9).fillColor("#333");
      let rowY = tableTop + 24;
      sales.forEach((sale) => {
        if (rowY > doc.page.height - doc.page.margins.bottom - 40) {
          doc.addPage();
          rowY = doc.page.margins.top;
        }

        const rowValues = fields.map((field) => {
          switch (field) {
            case "product":
              return sale.productName;
            case "category":
              return sale.productCategory;
            case "quantity":
              return String(sale.quantity);
            case "unitPrice":
              return String(sale.unitPrice);
            case "total":
              return String(sale.total);
            case "soldAt":
              return new Date(sale.soldAt).toLocaleDateString();
            default:
              return "";
          }
        });

        let rowX = leftMargin;
        rowValues.forEach((value, index) => {
          doc.text(value, rowX, rowY, {
            width: columnWidths[index],
            align: "left",
          });
          rowX += columnWidths[index];
        });
        rowY += 18;
      });

      doc.addPage();
      doc.font("Helvetica-Bold").fontSize(18).text("Sales Performance", {
        align: "left",
      });
      doc.moveDown(0.5);
      doc.font("Helvetica").fontSize(11).text(heading);
      doc.moveDown();

      const chartTop = doc.y + 10;
      const chartHeight = 180;
      const chartWidth = 360;
      const barGap = 12;
      const chartMax = Math.max(1, ...sales.map((sale) => Number(sale.total)));
      const topSales = sales.slice(0, 5);

      doc.fontSize(10).text("Top sales totals", leftMargin, chartTop - 18);
      topSales.forEach((sale, index) => {
        const barWidth = ((Number(sale.total) / chartMax) * chartWidth) || 0;
        const barY = chartTop + index * (barGap + 18);
        doc.fillColor("#734A3B").rect(leftMargin, barY, barWidth, 14).fill();
        doc.fillColor("#333").text(
          `${sale.productName} (${sale.total})`,
          leftMargin + chartWidth + 10,
          barY - 2
        );
      });

      doc.end();
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Sales Report");

  const lastColumn = String.fromCharCode(64 + Math.max(fields.length, 5));
  sheet.mergeCells(`A1:${lastColumn}1`);
    sheet.getCell("A1").value = "Sales Report";
    sheet.getCell("A1").font = { size: 16, bold: true };
    sheet.getCell("A2").value = heading;
    sheet.getCell("A3").value = `Period: ${startDate || "Any"} → ${endDate || "Any"}`;

    const columns = fields.map((field) => ({
      header: field.toUpperCase(),
      key: field,
      width: 18,
    }));
    sheet.columns = columns;

    sales.forEach((sale) => {
      sheet.addRow({
        product: sale.productName,
        category: sale.productCategory,
        quantity: sale.quantity,
        unitPrice: sale.unitPrice,
        total: sale.total,
        soldAt: new Date(sale.soldAt).toLocaleString(),
      });
    });

    const summarySheet = workbook.addWorksheet("Summary");
    summarySheet.getCell("A1").value = "Sales Report Summary";
    summarySheet.getCell("A1").font = { size: 16, bold: true };
    summarySheet.getCell("A2").value = heading;
    summarySheet.getCell("A3").value = `Period: ${startDate || "Any"} → ${endDate || "Any"}`;
    summarySheet.addRow([]);
    summarySheet.addRow(["Total sales", totals.count]);
    summarySheet.addRow(["Units sold", totals.units]);
    summarySheet.addRow(["Total revenue", totals.revenue]);

    const filename = `sales-report-${Date.now()}.xlsx`;
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    await workbook.xlsx.write(res);
    res.end();
  }
);

export default router;
