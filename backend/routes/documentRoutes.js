const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');
const Document = require('../models/documentModel');
const documentoController = require('../controllers/documentoController');

// Configurar motor de almacenamiento
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Inicializar carga
const upload = multer({
  storage: storage
}).single('documentFile');

// Ruta para subir un documento
router.post('/upload', ensureAuthenticated, (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(500).send('Error al subir el archivo.');
    } else {
      const nuevoDocumento = new Document({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        file: req.file.path
      });
      nuevoDocumento.save()
        .then(() => res.redirect('/documentos'))
        .catch(err => res.status(500).send('Error al guardar el documento.'));
    }
  });
});

// Ruta para obtener todos los documentos
router.get('/', ensureAuthenticated, documentoController.getDocuments);

// Ruta para obtener un documento por ID
router.get('/:id', ensureAuthenticated, (req, res) => {
  Document.findById(req.params.id)
    .then(document => res.json(document))
    .catch(err => res.status(500).send('Error al obtener el documento.'));
});

// Ruta para actualizar un documento
router.put('/:id', ensureAuthenticated, documentoController.updateDocument);

// Ruta para eliminar un documento
router.delete('/:id', ensureAuthenticated, documentoController.deleteDocument);

// Ruta para descargar un documento como imagen
router.get('/:id/download-image', ensureAuthenticated, documentoController.downloadAsImage);

// Ruta para descargar un documento como PDF
router.get('/:id/download-pdf', ensureAuthenticated, documentoController.downloadAsPDF);

// Ruta para descargar un documento como DOC
router.get('/:id/download-doc', ensureAuthenticated, documentoController.downloadAsDoc);

module.exports = router;
