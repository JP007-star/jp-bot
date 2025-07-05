const Note = require('../model/Note');
const Expense = require('../model/Expense');
const aiEngine = require('./aiEngine');
const voice = require('./voiceEngine');

module.exports = async (msg, client) => {
  const text = msg.body?.trim();
  const lower = text.toLowerCase();
  const sender = msg.from;

  if (!text) return;

  if (lower.startsWith('note ')) {
    const content = text.slice(5);
    await Note.create({ text: content });
    const reply = `📝 Noted: "${content}"`;
    voice.speak(reply); // 🗣️ Speak response
    return msg.reply(reply);
  }

  if (lower === 'show notes') {
    const notes = await Note.find().sort({ createdAt: -1 }).limit(5);
    const reply = notes.map(n => `• ${n.text}`).join('\n') || 'No notes yet.';
    voice.speak('Here are your notes.'); // Optional summary voice
    return msg.reply(`🗒️ Your Notes:\n${reply}`);
  }

  if (lower.startsWith('track ')) {
    const [, amount, ...catArr] = text.split(' ');
    const category = catArr.join(' ');
    await Expense.create({ amount: parseFloat(amount), category });
    const reply = `💸 Tracked ₹${amount} for ${category}`;
    voice.speak(reply);
    return msg.reply(reply);
  }

  if (lower.includes('spent this month')) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const data = await Expense.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const total = data[0]?.total || 0;
    const reply = `📊 You spent ₹${total} this month.`;
    voice.speak(reply);
    return msg.reply(reply);
  }

  if (['who are you', 'hi', 'hello'].includes(lower)) {
    const reply = `🧠 I am JP, Jaya Prasad's personal WhatsApp assistant. Jaya is away at the moment. Drop a message and I’ll pass it along.`;
    voice.speak('Hi, I am JP. Jaya is not available right now.');
    return msg.reply(reply);
  }

  // Fallback to Gemini AI
  const geminiReply = await aiEngine.ask(text);
  voice.speak(geminiReply);
  return msg.reply(geminiReply);
};
