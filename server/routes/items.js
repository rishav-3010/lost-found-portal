const express = require('express');
const router = express.Router();
const multer = require('multer');
const Item = require('../models/Item');
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

// Multer storage (memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔥 ADD THIS GET route to fetch items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 }); // latest first
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/items
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'lost-found-items' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const newItem = new Item({
      title: req.body.title,
      description: req.body.description,
      imageUrl: result.secure_url,
      type: req.body.type,
      location: req.body.location,
      contactEmail: req.body.contactEmail,
      contactPhone: req.body.contactPhone,
      hostelAddress: req.body.hostelAddress,
    });

    await newItem.save();
    res.status(201).json({ message: 'Item submitted successfully', item: newItem });

  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

module.exports = router;
