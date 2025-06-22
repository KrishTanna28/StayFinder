const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createBooking } = require('../controllers/bookingController');
const Booking = require('../models/Booking');

router.post('/', auth, createBooking);

// Add this route:
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('listing');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
