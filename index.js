// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const whatsappClient = require('./service/whatsappClient');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

// 🧠 Wake-up check
app.get('/ping', (req, res) => {
  const now = new Date().toLocaleString();
  console.log(`🔄 Ping received at ${now}`);
  res.status(200).send('JP is awake 🧠');
});

// 📦 Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');

  // 🤖 Start WhatsApp bot only after DB connects
  whatsappClient.initialize();

  // 🚀 Start Express server
  app.listen(3000, () => {
    console.log('🚀 JP Bot is running on http://localhost:3000');
  });

}).catch(err => {
  console.error('❌ Failed to connect to MongoDB:', err.message);
  process.exit(1);
});
