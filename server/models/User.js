const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;