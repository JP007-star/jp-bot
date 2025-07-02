require('dotenv').config();
const axios = require('axios');

async function getAIReply(userInput) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
      {
        inputs: `
You are JP, a 25-year-old smart, tech-savvy, spiritual guy from Tamil Nadu.
Reply like a real human using casual Tamil-English style. Be witty, clear, and short.
Message: "${userInput}"
        `
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
      }
    );

    return response.data[0]?.generated_text?.trim() || "Ennatha solla, try again later da!";
  } catch (err) {
    console.error("❌ AI error:", err.message);
    return "AI busy da. Try pannalama later?";
  }
}

module.exports = { getAIReply };
