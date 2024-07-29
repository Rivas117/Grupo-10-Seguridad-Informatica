const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/analytics', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir esquema y modelo de Documento
const documentSchema = new mongoose.Schema({
  title: String,
  description: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now }
});
const Document = mongoose.model('Document', documentSchema);

// Endpoint para subir documentos
app.post('/documents/upload', upload.single('file'), async (req, res) => {
  const { title, description } = req.body;
  const filePath = req.file.path;

  const newDocument = new Document({
    title,
    description,
    filePath
  });

  await newDocument.save();

  res.json(newDocument);
});

// Endpoint para obtener todos los documentos
app.get('/documents', async (req, res) => {
  const documents = await Document.find();
  res.json(documents);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
