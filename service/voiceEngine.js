const say = require('say');
const isRender = process.env.RENDER === 'true';

exports.speak = (text) => {
  if (isRender) {
    console.log('🗣️ [VOICE DISABLED on Render]:', text);
  } else {
    say.speak(text);
  }
};
