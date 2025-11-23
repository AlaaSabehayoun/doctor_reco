const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialties: [String],
  hospital: String,
  address: String,
  city: String,
  latitude: Number,
  longitude: Number,
  fee_usd: Number,
  rating: Number,
  reviews_count: Number,
  phone: String,
  email: String,
  updated_at: { type: Date, default: Date.now }
});

ContactSchema.index({ latitude: 1, longitude: 1 });
ContactSchema.index({ specialties: 1 });
ContactSchema.index({ city: 1 });

module.exports = mongoose.model('Contact', ContactSchema);
