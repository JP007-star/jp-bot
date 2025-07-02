const mongoose = require('mongoose');
module.exports = mongoose.model('Note', new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
}));