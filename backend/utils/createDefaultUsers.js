const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

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
  } finally {
    mongoose.connection.close();
  }
};

createDefaultUsers();
