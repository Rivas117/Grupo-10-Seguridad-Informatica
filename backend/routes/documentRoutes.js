const express = require('express');
const multer = require('multer');
const { createDocument, getDocuments, updateDocument, deleteDocument, searchDocuments, generateReport, downloadAsImage, downloadAsPdf, downloadAsDoc } = require('../controllers/documentController');
const { protect, admin, analyst } = require('../middleware/authMiddleware');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', protect, admin, upload.single('file'), createDocument);
router.get('/', getDocuments);
router.put('/:id', protect, admin, updateDocument);
router.delete('/:id', protect, admin, deleteDocument);
router.get('/search/:query', searchDocuments);
router.get('/report', protect, admin, generateReport);
router.get('/:id/download/image', downloadAsImage);
router.get('/:id/download/pdf', downloadAsPdf);
router.get('/:id/download/doc', downloadAsDoc);

module.exports = router;
