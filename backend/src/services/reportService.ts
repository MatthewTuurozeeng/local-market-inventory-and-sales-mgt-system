import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import type { Response } from "express";
import type { SalesReportRow, VendorRecord } from "../models/database.ts";

interface ReportSummary {
  revenue: number;
  units: number;
  count: number;
}

interface ReportPayload {
  vendor: VendorRecord;
  sales: SalesReportRow[];
  fields: string[];
  startDate: string | null;
  endDate: string | null;
}

type ArcCapableDocument = InstanceType<typeof PDFDocument> & {
  arc: (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => InstanceType<typeof PDFDocument>;
};

const getHeading = (vendor: VendorRecord): string =>
  `${vendor.businessName} • ${vendor.firstName} ${vendor.lastName}`;

const getTotals = (sales: SalesReportRow[]): ReportSummary =>
  sales.reduce(
    (acc, sale) => ({
      revenue: acc.revenue + Number(sale.total),
      units: acc.units + Number(sale.quantity),
      count: acc.count + 1,
    }),
    { revenue: 0, units: 0, count: 0 }
  );

const renderPdfReport = (
  res: Response,
  { vendor, sales, fields, startDate, endDate }: ReportPayload
) => {
  const heading = getHeading(vendor);
  const totals = getTotals(sales);

  const doc = new PDFDocument({ margin: 50, size: "A4" }) as ArcCapableDocument;
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
    align: "center",
  });
  doc.moveDown(0.1);
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#6b6b6b")
    .text(heading, { align: "center" });
  doc.fillColor("black");
  doc.moveDown(0.2);
  doc
    .fontSize(10)
    .text(`Period: ${startDate || "Any"} → ${endDate || "Any"}`, {
      align: "center",
    });
  doc.moveDown(0.4);

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
  const columnWidths = tableHeaders.map((header) => {
    switch (header) {
      case "Product":
        return 160;
      case "Category":
        return 110;
      case "SoldAt":
        return 110;
      default:
        return 70;
    }
  });
  const totalWidth = columnWidths.reduce((sum, value) => sum + value, 0);
  const scale = totalWidth > contentWidth ? contentWidth / totalWidth : 1;
  const scaledWidths = columnWidths.map((value) => value * scale);

  doc.rect(leftMargin, tableTop - 4, contentWidth, 22).fill("#f4f2ef");
  doc.fillColor("#333").font("Helvetica-Bold").fontSize(10);
  let xPosition = leftMargin;
  tableHeaders.forEach((header, index) => {
    doc.text(header, xPosition + 4, tableTop, {
      width: scaledWidths[index] - 8,
      align: "left",
    });
    xPosition += scaledWidths[index];
  });
  doc.fillColor("#333");

  doc.moveTo(leftMargin, tableTop + 18)
    .lineTo(leftMargin + contentWidth, tableTop + 18)
    .strokeColor("#d0d0d0")
    .stroke();

  doc.font("Helvetica").fontSize(9).fillColor("#333");
  let rowY = tableTop + 24;
  sales.forEach((sale, rowIndex) => {
    if (rowY > doc.page.height - doc.page.margins.bottom - 40) {
      doc.addPage();
      rowY = doc.page.margins.top;
    }

    if (rowIndex % 2 === 0) {
      doc.rect(leftMargin, rowY - 4, contentWidth, 20).fill("#faf9f7");
      doc.fillColor("#333");
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
      const header = tableHeaders[index];
      const align = ["Quantity", "Unit Price", "Total"].includes(header)
        ? "right"
        : "left";
      doc.text(value, rowX + 4, rowY, {
        width: scaledWidths[index] - 8,
        align,
      });
      rowX += scaledWidths[index];
    });
    rowY += 18;
  });

  let gridX = leftMargin;
  scaledWidths.forEach((width) => {
    gridX += width;
    doc.moveTo(gridX, tableTop - 4)
      .lineTo(gridX, rowY - 2)
      .strokeColor("#e0e0e0")
      .stroke();
  });

  doc.addPage();
  doc.font("Helvetica-Bold").fontSize(18).text("Summary", {
    align: "left",
  });
  doc.moveDown(0.4);
  doc.font("Helvetica").fontSize(11).text(heading);
  doc.moveDown(0.6);
  doc.fontSize(11).text(`Total sales: ${totals.count}`);
  doc.text(`Units sold: ${totals.units}`);
  doc.text(`Total revenue: ${totals.revenue}`);

  doc.moveDown(1.2);
  doc.font("Helvetica-Bold").fontSize(14).text("Sales Visuals", {
    align: "left",
  });
  doc.moveDown(0.6);

  const topSales = sales.slice(0, 5);
  const chartMax = Math.max(1, ...topSales.map((sale) => Number(sale.total)));
  const barWidth = 260;
  const barHeight = 14;
  const barGap = 12;
  const barStartX = leftMargin;
  let barStartY = doc.y + 10;

  doc.font("Helvetica").fontSize(10).text("Top 5 Sales Totals", barStartX, barStartY - 18);
  topSales.forEach((sale) => {
    const width = (Number(sale.total) / chartMax) * barWidth;
    doc.fillColor("#734A3B").rect(barStartX, barStartY, width, barHeight).fill();
    doc.fillColor("#333").text(
      `${sale.productName} (${sale.total})`,
      barStartX + barWidth + 12,
      barStartY - 2
    );
    barStartY += barHeight + barGap;
  });

  const pieCenterX = leftMargin + barWidth + 140;
  const pieCenterY = doc.y + 40;
  const pieRadius = 55;
  const pieColors = ["#734A3B", "#593F24", "#D6A77A", "#88A289", "#B9C6B1"];
  const totalRevenue = topSales.reduce(
    (acc, sale) => acc + Number(sale.total),
    0
  );
  const legendStartX = pieCenterX - 60;
  let legendStartY = pieCenterY + pieRadius + 18;

  if (totalRevenue > 0) {
    let startAngle = -Math.PI / 2;
    topSales.forEach((sale, index) => {
      const sliceAngle = (Number(sale.total) / totalRevenue) * Math.PI * 2;
      doc.save();
      doc
        .moveTo(pieCenterX, pieCenterY)
        .fillColor(pieColors[index % pieColors.length])
        .arc(pieCenterX, pieCenterY, pieRadius, startAngle, startAngle + sliceAngle)
        .lineTo(pieCenterX, pieCenterY)
        .fill();
      doc.restore();
      startAngle += sliceAngle;

      doc.fillColor(pieColors[index % pieColors.length])
        .rect(legendStartX, legendStartY, 10, 10)
        .fill();
      doc.fillColor("#333").fontSize(9).text(
        `${sale.productName} (${sale.total})`,
        legendStartX + 14,
        legendStartY - 2,
        { width: 140 }
      );
      legendStartY += 14;
    });

    doc.fillColor("#333").fontSize(9).text(
      "Revenue Share",
      pieCenterX - 50,
      pieCenterY + pieRadius + 6,
      {
        width: 120,
        align: "center",
      }
    );
  }

  doc.end();
};

const renderExcelReport = (
  res: Response,
  { vendor, sales, fields, startDate, endDate }: ReportPayload
) => {
  const heading = getHeading(vendor);
  const totals = getTotals(sales);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Sales Report");

  const lastColumn = String.fromCharCode(64 + Math.max(fields.length, 5));
  sheet.mergeCells(`A1:${lastColumn}1`);
  sheet.getCell("A1").value = "Sales Report";
  sheet.getCell("A1").font = { size: 16, bold: true };
  sheet.getCell("A2").value = heading;
  sheet.getCell("A3").value = `Period: ${startDate || "Any"} → ${endDate || "Any"}`;

  const columns: Partial<ExcelJS.Column>[] = fields.map((field) => ({
    header: field.toUpperCase(),
    key: field,
    width: 18,
  }));
  sheet.columns = columns as ExcelJS.Column[];

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
  workbook.xlsx.write(res).then(() => res.end());
};

export { renderExcelReport, renderPdfReport };
