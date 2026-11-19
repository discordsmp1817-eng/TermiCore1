import { jsPDF } from 'jspdf';
import { ProductCategory, ProductSku } from '../data/termicoreData';
import {
  buildModelSpecificationSections,
  getModelDrawingDimensions,
} from './modelSpecifications';
import {
  buildModelCadSvgMarkup,
  buildModelCircuitSvgMarkup,
} from './modelGraphics';

function loadImageToDataUrl(
  url: string,
  mimeType: 'image/jpeg' | 'image/png' = 'image/jpeg',
  targetWidth = 800,
  targetHeight = 600
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        const scale = Math.min(
          targetWidth / (img.naturalWidth || targetWidth),
          targetHeight / (img.naturalHeight || targetHeight)
        );
        const drawW = (img.naturalWidth || targetWidth) * scale;
        const drawH = (img.naturalHeight || targetHeight) * scale;
        const offsetX = (targetWidth - drawW) / 2;
        const offsetY = (targetHeight - drawH) / 2;
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        resolve(canvas.toDataURL(mimeType, 0.92));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

function svgMarkupToPngDataUrl(
  svgMarkup: string,
  width = 1120,
  height = 720
): Promise<string | null> {
  const dataUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
  return loadImageToDataUrl(dataUri, 'image/png', width, height);
}

export async function downloadModelPdfDatasheet(
  sku: ProductSku,
  category: ProductCategory,
  resolvedProductImageUrl: string
): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const dims = getModelDrawingDimensions(sku, category);
  const sections = buildModelSpecificationSections(sku, category);
  const cadSvg = buildModelCadSvgMarkup(sku, category);
  const circuitSvg = buildModelCircuitSvgMarkup(sku, category);

  const [photoDataUrl, cadDataUrl, circuitDataUrl] = await Promise.all([
    loadImageToDataUrl(resolvedProductImageUrl, 'image/jpeg', 800, 600),
    svgMarkupToPngDataUrl(cadSvg, 1120, 720),
    svgMarkupToPngDataUrl(circuitSvg, 1120, 720),
  ]);

  const drawPageHeader = () => {
    doc.setFillColor(16, 29, 43); // #101D2B
    doc.rect(0, 0, pageWidth, 18, 'F');
    doc.setFillColor(15, 118, 110); // #0F766E
    doc.rect(0, 18, pageWidth, 1.5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TermiCore', margin, 11.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(203, 213, 225);
    doc.text('TECHNICAL DATASHEET', margin + 26, 11.5);

    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(sku.model, pageWidth - margin, 11.5, { align: 'right' });
  };

  drawPageHeader();
  let y = 27;

  // Title & Summary Block
  doc.setTextColor(15, 118, 110);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text(`${category.seriesCode}  ·  ${category.title}  ·  ${sku.connectionType}`, margin, y);
  y += 6;

  doc.setTextColor(16, 29, 43);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(sku.name, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 6.5 + 1;

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const subtitle = `Model ${sku.model} engineered for ${sku.wireRangeIec} conductors, rated ${sku.currentRating} / ${sku.voltageRating}, ${sku.mounting} interface.`;
  const subtitleLines = doc.splitTextToSize(subtitle, contentWidth);
  doc.text(subtitleLines, margin, y);
  y += subtitleLines.length * 4.5 + 4;

  // 3 Visual Boxes: Product Photo + CAD Drawing + Circuit Diagram
  const gap = 4;
  const boxWidth = (contentWidth - gap * 2) / 3;
  const boxHeight = 44;

  const panels: { label: string; dataUrl: string | null; format: 'JPEG' | 'PNG' }[] = [
    { label: 'Product View', dataUrl: photoDataUrl, format: 'JPEG' },
    { label: 'CAD Dimensional Drawing', dataUrl: cadDataUrl, format: 'PNG' },
    { label: 'Circuit Schematic', dataUrl: circuitDataUrl, format: 'PNG' },
  ];

  panels.forEach((panel, idx) => {
    const x = margin + idx * (boxWidth + gap);
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, boxWidth, boxHeight + 7, 1.5, 1.5, 'FD');

    if (panel.dataUrl) {
      doc.addImage(panel.dataUrl, panel.format, x + 1.5, y + 1.5, boxWidth - 3, boxHeight - 2);
    }

    doc.setFillColor(248, 250, 252);
    doc.rect(x + 0.3, y + boxHeight, boxWidth - 0.6, 6.7, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(panel.label, x + boxWidth / 2, y + boxHeight + 4.5, { align: 'center' });
  });

  y += boxHeight + 12;

  // Quick Key Metrics Strip
  doc.setFillColor(245, 247, 249);
  doc.setDrawColor(220, 226, 232);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

  const kpis = [
    { label: 'Wire Size (IEC)', value: sku.wireRangeIec },
    { label: 'Rated Current', value: sku.currentRating },
    { label: 'Rated Voltage', value: sku.voltageRating },
    { label: 'Width / Pitch', value: dims.pitchLabel },
  ];

  const colW = contentWidth / 4;
  kpis.forEach((kpi, idx) => {
    const kx = margin + idx * colW + 3;
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.text(kpi.label, kx, y + 5);

    doc.setTextColor(16, 29, 43);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(kpi.value, kx, y + 10.5);
  });

  y += 20;

  // Render All Specification Tables
  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 16) {
      doc.addPage();
      drawPageHeader();
      y = 26;
    }
  };

  for (const section of sections) {
    ensureSpace(18);
    doc.setTextColor(16, 29, 43);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.text(section.title, margin, y);
    doc.setDrawColor(15, 118, 110);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 2, margin + contentWidth, y + 2);
    y += 4;

    section.rows.forEach((row, rowIdx) => {
      const valLines = doc.splitTextToSize(row.value, contentWidth * 0.48 - 4);
      const labelLines = doc.splitTextToSize(row.label, contentWidth * 0.52 - 4);
      const rowHeight = Math.max(labelLines.length, valLines.length) * 4.2 + 3.2;

      ensureSpace(rowHeight + 2);

      if (rowIdx % 2 === 0) {
        doc.setFillColor(255, 255, 255);
      } else {
        doc.setFillColor(248, 250, 252);
      }
      doc.setDrawColor(220, 226, 232);
      doc.setLineWidth(0.2);
      doc.rect(margin, y, contentWidth, rowHeight, 'FD');
      doc.line(margin + contentWidth * 0.52, y, margin + contentWidth * 0.52, y + rowHeight);

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.3);
      doc.text(labelLines, margin + 2.5, y + 4.4);

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.3);
      doc.text(valLines, margin + contentWidth * 0.52 + 3, y + 4.4);

      y += rowHeight;
    });

    y += 7;
  }

  // Page Footers
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p += 1) {
    doc.setPage(p);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(
      `TermiCore Industrial Wiring Systems · ${sku.model} Engineering Datasheet · sales@termicore.com`,
      margin,
      pageHeight - 7
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 7, {
      align: 'right',
    });
  }

  const safeFile = `TermiCore-${sku.model.replace(/[^a-zA-Z0-9._-]+/g, '-')}-Datasheet.pdf`;
  doc.save(safeFile);
}
