import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/**
 * Exports an array of objects to an Excel file with auto-sized columns and styled headers.
 * @param {Array} data - The data array to export (JSON objects).
 * @param {string} sheetName - The sheet name in Excel.
 * @param {string} fileName - The file name to save (without extension).
 */
export const exportToExcel = (
  data,
  sheetName = "Sheet1",
  fileName = "export"
) => {
  if (!data || !data.length) {
    console.error("No data to export");
    return;
  }

  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-size columns based on the longest content in each column
  const colWidths = Object.keys(data[0]).map((key) => ({
    wch:
      Math.max(
        key.length,
        ...data.map((row) => (row[key] ? row[key].toString().length : 0))
      ) + 2, // Add padding
  }));
  ws["!cols"] = colWidths;

  // Style header row
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } }, // Blue background
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  }

  // Create workbook & append worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Enable styles (requires XLSX-style or SheetJS Pro for full support)
  // NOTE: If you use community XLSX, styles are limited.

  // Export
  const excelBuffer = XLSX.write(wb, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true, // Helps keep style metadata
  });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}.xlsx`);
};
