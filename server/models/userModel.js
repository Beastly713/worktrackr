const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Removes whitespace
      lowercase: true, // Stores email in lowercase
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// 'User' will be the name of the collection in our database (pluralized to 'users')
module.exports = mongoose.model('User', userSchema);