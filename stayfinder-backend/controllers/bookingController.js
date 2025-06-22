const Booking = require('../models/Booking');
const Listing = require('../models/Listing');

exports.createBooking = async (req, res) => {
  const start = new Date(req.body.startDate);
  const end = new Date(req.body.endDate);
  const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const listing = await Listing.findById(req.body.listing);
  const totalPrice = nights * listing.pricePerNight;

  const booking = new Booking({
    user: req.user.id,
    listing: req.body.listing,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    totalPrice, // Save it!
  });
  await booking.save();
  res.json(booking);
};