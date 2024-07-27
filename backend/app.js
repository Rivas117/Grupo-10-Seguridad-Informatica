const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const createDefaultUsers = require('./utils/createDefaultUsers');
const path = require('path');
const app = express();

dotenv.config();
connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas
const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/documentos', documentRoutes);
app.use('/api/usuarios', authRoutes);

// Crear usuarios por defecto
createDefaultUsers();

// Escuchar en el puerto especificado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
