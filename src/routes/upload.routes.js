const router = require('express').Router();
const { upload } = require('../config/cloudinary');

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No se envió ningún archivo' });
  res.json({ url: req.file.path });
});

module.exports = router;
