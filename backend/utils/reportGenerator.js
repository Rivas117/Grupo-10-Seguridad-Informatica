const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const archiver = require('archiver');
const Document = require('../models/documentModel');

// Función para generar un PDF a partir de un documento
const generatePDF = (document) => {
  const doc = new jsPDF();
  doc.text(`ID: ${document._id}`, 10, 10);
  doc.text(`Título: ${document.title}`, 10, 20);
  doc.text(`Descripción: ${document.description}`, 10, 30);
  doc.text(`Categoría: ${document.category}`, 10, 40);
  doc.text(`Fecha de Creación: ${new Date(document.createdAt).toLocaleDateString()}`, 10, 50);
  
  const pdfPath = path.join(__dirname, `../reports/document_${document._id}.pdf`);
  doc.save(pdfPath);
  return pdfPath;
};

// Función para generar un archivo ZIP de todos los PDFs generados
const generateZIP = async (documents) => {
  const zipPath = path.join(__dirname, '../reports/documents_report.zip');
  const output = fs.createWriteStream(zipPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`ZIP generado: ${archive.pointer()} bytes`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);

  for (let document of documents) {
    const pdfPath = generatePDF(document);
    archive.file(pdfPath, { name: path.basename(pdfPath) });
  }

  await archive.finalize();
  return zipPath;
};

// Función para generar el reporte
const generateReport = async () => {
  const documents = await Document.find();
  const zipPath = await generateZIP(documents);
  return zipPath;
};

module.exports = {
  generateReport,
};
