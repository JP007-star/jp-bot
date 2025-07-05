// cli.js
const voice = require('./services/voiceEngine');
const ai = require('./services/aiEngine');

const loop = () => {
  voice.listen(async (input) => {
    const response = await ai.ask(input);
    console.log('JP:', response);
    voice.speak(response);
    loop(); // Repeat
  });
};

loop();
