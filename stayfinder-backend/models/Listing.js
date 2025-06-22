const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  location: String,
  pricePerNight: Number,
  description: String,
  images: [String],
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model('Listing', listingSchema);