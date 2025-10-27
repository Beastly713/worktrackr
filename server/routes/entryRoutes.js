const express = require('express');
const router = express.Router();
const {
  getEntries,
  getEntryByDate,
  setEntry,
  deleteEntry,
} = require('../controllers/entryController');

// Import our protection middleware
const { protect } = require('../middleware/authMiddleware');

// Apply the 'protect' middleware to all routes in this file
// Any request to /api/entries/* will now require a valid token.
router.use(protect);

// Route definitions
router.route('/').get(getEntries).post(setEntry);

router.route('/by-date/:date')
  .get(getEntryByDate)
  .delete(deleteEntry);

module.exports = router;