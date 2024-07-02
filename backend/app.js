const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('./config/passport');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const projectRoutes = require('./routes/projectRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/api/users', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/projects', projectRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
