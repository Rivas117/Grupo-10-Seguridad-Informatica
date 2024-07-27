const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/userModel');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

// Función para crear usuarios por defecto
const createDefaultUsers = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      const defaultUsers = [
        { name: 'Admin User', email: 'admin@example.com', password: 'adminpassword', role: 'admin' },
        { name: 'Analyst User', email: 'analyst@example.com', password: 'analystpassword', role: 'analyst' }
      ];

      for (const userData of defaultUsers) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = new User({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        });

        await newUser.save();
        console.log(`User ${userData.email} created`);
      }
    } else {
      console.log('Default users already exist');
    }
  } catch (err) {
    console.error(err);
  }
};

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    createDefaultUsers(); // Crear usuarios por defecto
  })
  .catch(err => console.log(err));

// Passport config
require('./config/passport')(passport);

// Routes
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Contraseña incorrecta' });
    }

    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token: 'Bearer ' + token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
});

app.post('/api/users/recover', async (req, res) => {
  const { email } = req.body;
  // Implementa la lógica de recuperación de contraseña
  res.json({ success: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
