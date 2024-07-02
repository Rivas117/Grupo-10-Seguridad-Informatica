const Document = require('../models/documentModel');
const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');
const docx = require('docx');
const { Document: DocxDocument, Packer, Paragraph, TextRun } = docx;

// Crear documento
exports.createDocument = async (req, res) => {
  const { title, description, category } = req.body;
  const file = req.file.path;

  try {
    const document = await Document.create({ title, description, category, file });
    res.status(201).json({ success: true, data: document });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Obtener todos los documentos
exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find();
    res.status(200).json({ success: true, data: documents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Actualizar documento
exports.updateDocument = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  try {
    const document = await Document.findByIdAndUpdate(id, { title, description, category }, { new: true });
    res.status(200).json({ success: true, data: document });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Eliminar documento
exports.deleteDocument = async (req, res) => {
  const { id } = req.params;

  try {
    await Document.findByIdAndDelete(id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Descargar como imagen
exports.downloadAsImage = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Documento no encontrado' });
    }

    // Aquí agregarías el código para generar y enviar la imagen

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Descargar como PDF
exports.downloadAsPdf = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Documento no encontrado' });
    }

    const doc = new jsPDF();
    doc.text(`ID: ${document._id}`, 10, 10);
    doc.text(`Título: ${document.title}`, 10, 20);
    doc.text(`Descripción: ${document.description}`, 10, 30);
    doc.text(`Categoría: ${document.category}`, 10, 40);
    doc.text(`Fecha de Creación: ${new Date(document.createdAt).toLocaleDateString()}`, 10, 50);
    
    const pdfPath = path.join(__dirname, `../downloads/document_${document._id}.pdf`);
    doc.save(pdfPath);
    res.download(pdfPath, `document_${document._id}.pdf`, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).json({ success: false, error: 'Error al descargar el archivo' });
      } else {
        fs.unlinkSync(pdfPath); // Eliminar el archivo después de la descarga
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Descargar como DOC
exports.downloadAsDoc = async (req, res) => {
  const { id } = req.params;

  try {
    const document = await Document.findById(id);
    if (!document) {
      return res.status(404).json({ success: false, error: 'Documento no encontrado' });
    }

    const doc = new DocxDocument();
    doc.addSection({
      children: [
        new Paragraph({ text: `ID: ${document._id}`, style: 'Heading1' }),
        new Paragraph({ text: `Título: ${document.title}`, style: 'Heading2' }),
        new Paragraph(document.description),
        new Paragraph(`Categoría: ${document.category}`),
        new Paragraph(`Fecha de Creación: ${new Date(document.createdAt).toLocaleDateString()}`)
      ]
    });

    const buffer = await Packer.toBuffer(doc);
    const filePath = path.join(__dirname, `../downloads/document_${document._id}.docx`);
    fs.writeFileSync(filePath, buffer);

    res.download(filePath, `document_${document._id}.docx`, (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).json({ success: false, error: 'Error al descargar el archivo' });
      } else {
        fs.unlinkSync(filePath); // Eliminar el archivo después de la descarga
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
