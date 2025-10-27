const Entry = require('../models/entryModel');

/**
 * @desc    Get all entries for the logged-in user
 * @route   GET /api/entries
 * @access  Private
 */
const getEntries = async (req, res) => {
  try {
    // Find all entries that match the logged-in user's ID
    const entries = await Entry.find({ user: req.user.id });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Get a single entry by date for the logged-in user
 * @route   GET /api/entries/by-date/:date
 * @access  Private
 */
const getEntryByDate = async (req, res) => {
  try {
    const entry = await Entry.findOne({
      user: req.user.id,
      date: new Date(req.params.date), // Convert date string from URL
    });

    if (entry) {
      res.json(entry);
    } else {
      // It's not an "error" if an entry doesn't exist, just return null
      res.status(200).json(null); 
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Create or update an entry (upsert)
 * @route   POST /api/entries
 * @access  Private
 */
const setEntry = async (req, res) => {
  try {
    const { date, dsa, cp, dev, college, other } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const entryData = {
      user: req.user.id,
      date: new Date(date),
      dsa,
      cp,
      dev,
      college,
      other,
    };

    // This is the "upsert" magic.
    // It finds a doc matching { user, date }
    // If it finds one, it updates it with entryData.
    // If it doesn't, it creates a new one (due to upsert: true).
    const updatedEntry = await Entry.findOneAndUpdate(
      { user: req.user.id, date: new Date(date) }, // Filter
      entryData, // Data to update/insert
      { new: true, upsert: true, runValidators: true } // Options
    );

    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

/**
 * @desc    Delete an entry by date
 * @route   DELETE /api/entries/by-date/:date
 * @access  Private
 */
const deleteEntry = async (req, res) => {
  try {
    const entry = await Entry.findOneAndDelete({
      user: req.user.id,
      date: new Date(req.params.date),
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ id: entry._id, message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


module.exports = {
  getEntries,
  getEntryByDate,
  setEntry,
  deleteEntry,
};