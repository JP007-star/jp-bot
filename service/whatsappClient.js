// services/whatsappClient.js

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode'); // For image generation
const fs = require('fs');
const jpBrain = require('./jpBrain');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'jp' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

// Generate QR code in terminal + save as image
client.on('qr', async qr => {
  qrcode.generate(qr, { small: true });

  try {
    const imgPath = './qr.png';
    await QRCode.toFile(imgPath, qr);
    console.log(`🖼️ QR Code saved to ${imgPath}`);
  } catch (err) {
    console.error('❌ Failed to save QR image:', err);
  }

  // Optional: Convert to Data URL (base64) and use elsewhere (e.g., send to Telegram or email)
  QRCode.toDataURL(qr, (err, url) => {
    if (!err) {
      console.log('🖼️ QR Code as Data URL (for email/Telegram):', url.slice(0, 100) + '...');
    }
  });
});

client.on('ready', () => console.log('✅ JP is online'));

client.on('message', msg => jpBrain(msg, client));

module.exports = client;
