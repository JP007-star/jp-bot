// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const whatsappClient = require('./service/whatsappClient');
const apiRoutes = require('./routes/apiRoutes.js');

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);







mongoose.connect(process.env.MONGO_URI);

whatsappClient.initialize();

app.listen(3000, () => console.log('🚀 JP Bot is running on http://localhost:3000'));