const Note = require('../model/Note');
const Expense = require('../model/Expense');
const askGemini = require('./geminiService'); // 👈 Add this

module.exports = async (msg, client) => {
  const text = msg.body.trim();

  if (text.toLowerCase().startsWith('note ')) {
    const content = text.slice(5);
    await Note.create({ text: content });
    return msg.reply(`📝 Noted: "${content}"`);
  }

  if (text.toLowerCase() === 'show notes') {
    const notes = await Note.find().sort({ createdAt: -1 }).limit(5);
    const reply = notes.map(n => `• ${n.text}`).join('\n') || 'No notes yet.';
    return msg.reply(`🗒️ Your Notes:\n${reply}`);
  }

  if (text.toLowerCase().startsWith('track ')) {
    const [, amount, ...catArr] = text.split(' ');
    const category = catArr.join(' ');
    await Expense.create({ amount: parseFloat(amount), category });
    return msg.reply(`💸 Tracked ₹${amount} for ${category}`);
  }

  if (text.toLowerCase().includes('spent this month')) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const data = await Expense.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const total = data[0]?.total || 0;
    return msg.reply(`📊 You spent ₹${total} this month.`);
  }

  if (text.toLowerCase() === 'who are you' || text.toLowerCase() === 'hi'||text.toLowerCase() === 'hello') {
    
    return msg.reply(`🧠 I am JP, Jaya Prasad's personal WhatsApp assistant.Jaya is away at the moment. Drop a message and I’ll pass it along.`);
  }

  // 🤖 Gemini fallback
  const geminiReply = await askGemini(text);
  return msg.reply(geminiReply);
};
