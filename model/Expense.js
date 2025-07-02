// models/Expense.js
const mongoose = require('mongoose');
module.exports = mongoose.model('Expense', new mongoose.Schema({
  amount: Number,
  category: String,
  createdAt: { type: Date, default: Date.now }
}));