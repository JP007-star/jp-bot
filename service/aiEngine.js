const axios = require('axios');
const apiKey = process.env.GEMINI_API_KEY;

exports.ask = async (text) => {
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data.candidates[0]?.content?.parts[0]?.text || '🤖 Could not process that.';
  } catch (e) {
    return '❌ Error reaching AI service';
  }
};