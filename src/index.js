// src/index.js
const bot = require('./bot');
const { NODE_ENV } = require('./config/env');

// Start bot
if (NODE_ENV === 'production') {
  // Production mode: use webhook
  const PORT = process.env.PORT || 3000;
  const URL = process.env.URL || 'https://your-app.herokuapp.com';
  
  bot.launch({
    webhook: {
      domain: URL,
      port: PORT
    }
  })
  .then(() => {
    console.log(`Bot started in production mode on port ${PORT}`);
    console.log(`Webhook set to ${URL}`);
  })
  .catch(err => {
    console.error('Error starting bot:', err);
  });
} else {
  // Development mode: use polling
  bot.launch()
    .then(() => {
      console.log('Bot started in development mode');
    })
    .catch(err => {
      console.error('Error starting bot:', err);
    });
}
 
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

