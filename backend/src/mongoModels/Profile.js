const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: Number, required: true }, // referencia al id SQL
  bio: String,
  preferences: Object
});

module.exports = mongoose.model('Profile', ProfileSchema);