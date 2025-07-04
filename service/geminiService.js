// services/geminiService.js

const axios = require('axios');

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

async function askGemini(prompt) {
  try {
    const response = await axios.post(GEMINI_URL, {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    });

    const result = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return result || "🤖 Gemini couldn't respond.";
  } catch (err) {
    console.error('Gemini Error:', err.message);
    return '❌ Gemini API error.';
  }
}

module.exports = askGemini;
