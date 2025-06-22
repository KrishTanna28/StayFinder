const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const {
  getAllListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} = require('../controllers/listingController');

router.get('/', getAllListings);
router.get('/:id', getListingById);
router.post('/', auth, upload.single('image'), createListing);
router.put('/:id', auth, upload.single('image'), updateListing);
router.delete('/:id', auth, deleteListing);

module.exports = router;
