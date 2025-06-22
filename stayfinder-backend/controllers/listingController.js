const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Listing = require('../models/Listing');

exports.getAllListings = async (req, res) => {
  const { search } = req.query;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const listings = await Listing.find(query).populate('host', 'name email');
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name email');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const createListing = async (req, res) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);
  try {
    const { title, description, pricePerNight, location, latitude, longitude } = req.body;
    if (!title || !description || !pricePerNight || !location || !latitude || !longitude) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized: No user info' });
    }
    const imagePath = req.file ? req.file.path : null;
    const listing = new Listing({
      title,
      description,
      pricePerNight: Number(pricePerNight),
      location,
      coordinates: { lat: Number(latitude), lng: Number(longitude) },
      images: imagePath ? [imagePath] : [],
      host: req.user.id,
      latitude: req.body.latitude,
      longitude: req.body.longitude
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create listing', details: err.message });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const { title, description, pricePerNight, location, latitude, longitude } = req.body;
    const updateData = {
      title,
      description,
      pricePerNight: Number(pricePerNight),
      location,
      latitude: Number(latitude),
      longitude: Number(longitude),
    };

    // If a new image is uploaded, update the images array
    if (req.file) {
      updateData.images = [req.file.path];
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Listing not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Listing not found' });
    res.json({ msg: 'Listing removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createListing = createListing; // Export the function for use in the router

// Remove router and related code from controller file.
// Only export controller functions from this file.