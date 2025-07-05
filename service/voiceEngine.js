const say = require('say');
const readline = require('readline');

exports.speak = (text) => {
  say.speak(text, 'Microsoft Zira Desktop' || null); // Use default TTS voice
};

exports.listen = (callback) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('🎤 You: ', (answer) => {
    rl.close();
    callback(answer);
  });
};
