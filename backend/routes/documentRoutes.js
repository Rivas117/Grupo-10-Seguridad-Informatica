const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');
const Document = require('../models/Document');

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
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        rutaArchivo: req.file.path
      });
      nuevoDocumento.save()
        .then(() => res.redirect('/documentos'))
        .catch(err => res.status(500).send('Error al guardar el documento.'));
    }
  });
});

// Ruta para obtener todos los documentos
router.get('/', ensureAuthenticated, (req, res) => {
  Document.find()
    .then(documents => res.json(documents))
    .catch(err => res.status(500).send('Error al obtener los documentos.'));
});

// Ruta para obtener un documento por ID
router.get('/:id', ensureAuthenticated, (req, res) => {
  Document.findById(req.params.id)
    .then(document => res.json(document))
    .catch(err => res.status(500).send('Error al obtener el documento.'));
});

// Ruta para actualizar un documento
router.put('/:id', ensureAuthenticated, (req, res) => {
  Document.findByIdAndUpdate(req.params.id, {
    titulo: req.body.titulo,
    descripcion: req.body.descripcion
  }, { new: true })
    .then(document => res.json(document))
    .catch(err => res.status(500).send('Error al actualizar el documento.'));
});

// Ruta para eliminar un documento
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Document.findByIdAndDelete(req.params.id)
    .then(() => res.json({ message: 'Documento eliminado correctamente.' }))
    .catch(err => res.status(500).send('Error al eliminar el documento.'));
});

module.exports = router;
