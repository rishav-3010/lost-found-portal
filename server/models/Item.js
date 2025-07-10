const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  hostelAddress: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' }
});

module.exports = mongoose.model('Item', itemSchema);
