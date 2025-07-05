const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');
const jpBrain = require('./jpBrain');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// ✅ MongoStore for remote session
const store = new MongoStore({ mongoose: mongoose });

const client = new Client({
  authStrategy: new RemoteAuth({
    store,
    backupSyncIntervalMs: 300000,
    clientId: 'jp'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

// 🔁 QR Code Setup
client.on('qr', async (qr) => {
  qrcodeTerminal.generate(qr, { small: true });

  const qrPath = path.join(__dirname, '../qr.png');

  try {
    // ✅ Save QR code as image
    await QRCode.toFile(qrPath, qr);
    console.log('🖼️ QR Code saved locally');
  } catch (err) {
    console.error('❌ Failed to save QR image:', err.message);
    return;
  }

  // ✅ Setup Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"JP Bot" <${process.env.EMAIL_USER}>`,
    to: 'jayaprasad.jp.m@gmail.com',
    subject: '📲 JP Bot WhatsApp QR Code',
    html: `<p>Hey Jaya, scan this QR to activate your JP Bot 🤖</p><img src="cid:jpqr"/>`,
    attachments: [
      {
        filename: 'qr.png',
        path: qrPath,
        cid: 'jpqr'
      }
    ]
  };

  // ✅ Send Email
  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 QR Code emailed to jayaprasad.jp.m@gmail.com');
  } catch (err) {
    console.error('❌ Failed to send email:', err.message);
  }
});

client.on('ready', () => {
  console.log('✅ JP is online');
});

client.on('message', msg => jpBrain(msg, client));

module.exports = client;
