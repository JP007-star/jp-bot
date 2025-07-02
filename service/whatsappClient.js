// services/whatsappClient.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const jpBrain = require('./jpBrain');

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'jp' }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

client.on('qr', qr => qrcode.generate(qr, { small: true }));
client.on('ready', () => console.log('✅ JP is online'));
client.on('message', msg => jpBrain(msg, client));

module.exports = client;
