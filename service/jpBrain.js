const Note = require('../model/Note');
const Expense = require('../model/Expense');

let isAway = true; // Toggle this based on your presence (future: use DB or a command)

module.exports = async (msg, client) => {
  const text = msg.body?.trim();
  if (!text) return;

  const lowerText = text.toLowerCase();

  // Management mode when away
  if (isAway && !['note ', 'track ', 'show notes', 'spent this month', 'help', 'who are you'].some(cmd => lowerText.startsWith(cmd))) {
    // Auto-reply with smart responses
    if (lowerText.includes('where are you')) {
      return msg.reply('📍 Jaya is currently away. I ll let him know you asked.');
    }
    if (lowerText.includes('call me')) {
      return msg.reply('📞 Jaya will call you back as soon as possible.');
    }
    if (lowerText.includes('urgent')) {
      return msg.reply('🚨 Message marked as urgent. I ll ensure Jaya sees it.');
    }

    return msg.reply('👋 Hey! JP here, Jaya Prasad is currently unavailable. I can note this or help with simple tasks.');
  }

  // 📝 Add a Note
  if (lowerText.startsWith('note ')) {
    const content = text.slice(5).trim();
    if (!content) return msg.reply("❌ Please enter some text for the note.");
    await Note.create({ text: content });
    return msg.reply(`📝 Noted: "${content}"`);
  }

  // 📓 Show Notes
  if (lowerText === 'show notes') {
    const notes = await Note.find().sort({ createdAt: -1 }).limit(5);
    if (!notes.length) return msg.reply('🗒️ No notes saved yet.');
    const reply = notes.map((n, i) => `#${i + 1}: ${n.text}`).join('\n');
    return msg.reply(`🧾 Your Latest Notes:\n\n${reply}`);
  }

  // 💰 Track an Expense
  if (lowerText.startsWith('track ')) {
    const parts = text.split(' ');
    const amount = parseFloat(parts[1]);
    const category = parts.slice(2).join(' ').trim();

    if (isNaN(amount) || !category)
      return msg.reply('❌ Format: track <amount> <category>\nE.g. track 200 food');

    await Expense.create({ amount, category });
    return msg.reply(`💸 Tracked ₹${amount} under "${category}"`);
  }

  // 📊 Total spent this month
  if (lowerText.includes('spent this month')) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const result = await Expense.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const total = result[0]?.total || 0;
    return msg.reply(`📊 Total spent this month: ₹${total}`);
  }

  // 👋 Welcome / Help
  if (['who are you', 'hi', 'help', 'hello'].includes(lowerText)) {
    return msg.reply(`👋 Hey! I'm *JP*, your personal WhatsApp assistant.\n\nTry commands like:\n• note buy groceries\n• show notes\n• track 200 food\n• spent this month`);
  }
};
