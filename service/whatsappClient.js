const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const jpBrain = require('./jpBrain');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'jp' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

client.on('qr', async qr => {
  qrcodeTerminal.generate(qr, { small: true });

  const qrPath = path.join(__dirname, '../qr.png');

  // ✅ Save QR to image file
  try {
    await QRCode.toFile(qrPath, qr);
    console.log('🖼️ QR Code saved locally');
  } catch (err) {
    console.error('❌ Failed to save QR:', err.message);
    return;
  }

  // ✅ Send QR to Gmail
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
    subject: '📲 Scan JP Bot WhatsApp QR',
    html: `<p>Hey Jaya, scan this QR to activate your JP Bot 🤖</p><img src="cid:jpqr"/>`,
    attachments: [
      {
        filename: 'qr.png',
        path: qrPath,
        cid: 'jpqr'
      }
    ]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 QR email sent to jayaprasad.jp.m@gmail.com');
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
  }
});

client.on('ready', () => console.log('✅ JP is online'));
client.on('message', msg => jpBrain(msg, client));

module.exports = client;
