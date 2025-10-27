const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // This is a special type for IDs
      required: true,
      ref: 'User', // This tells Mongoose the ID references the 'User' model
    },
    date: {
      type: Date,
      required: true,
    },
    // --- MVP Categories ---
    dsa: {
      problems: { type: [String], default: [] },
      notes: { type: String, default: '' },
    },
    cp: {
      contests: { type: [String], default: [] },
      notes: { type: String, default: '' },
    },
    dev: {
      projects: { type: [String], default: [] },
      notes: { type: String, default: '' },
    },
    college: {
      topics: { type: [String], default: [] },
      notes: { type: String, default: '' },
    },
    other: {
      notes: { type: String, default: '' },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// --- IMPORTANT: Create a Composite Unique Index ---
// This line ensures that a single user can only have ONE entry per date.
// It prevents duplicate entries for the same day from the same user.
entrySchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Entry', entrySchema);