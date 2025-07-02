const express = require('express');
const router = express.Router();
const Note = require('../model/Note');
const Expense = require('../model/Expense');

router.get('/notes', async (req, res) => {
  const notes = await Note.find().sort({ createdAt: -1 });
  res.json(notes);
});

router.get('/expenses', async (req, res) => {
  const expenses = await Expense.find().sort({ createdAt: -1 });
  res.json(expenses);
});

module.exports = router;
