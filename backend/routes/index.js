const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureAdminAuthenticated } = require('../config/auth');
const Document = require('../models/documentModel');

// Render Admin Panel
router.get('/admin', ensureAdminAuthenticated, async (req, res) => {
  try {
    const documents = await Document.find();
    res.render('admin', { documents });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
